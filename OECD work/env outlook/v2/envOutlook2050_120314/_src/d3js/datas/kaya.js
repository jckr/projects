
var w=660,h=350;	

var currentView=0;
var currentScenario=0;

var chart=d3.select("#chart");
chart.append("div").classed("h1",1);
chart.append("div").classed("h2",1);
var svg=chart.append("svg:svg").attr("width",w).attr("height",h).attr("version","1.1").attr("xmlns","http://www.w3.org/2000/svg");

var x=d3.scale.linear().domain([2010,2050]).range([50,w-15]);
var y=d3.scale.linear().domain(scales[0].domain).range([h-20,50]);
var d=d3.scale.linear().domain([0,5]).range([0,50]);

// my first color scale attempt… to be improved :)
var colourRange = ["#9ecae1", "#2973bd", "#7b4173"];
var mycolor = d3.scale.linear().domain(expDomain (scales[0].domain)).range(colourRange);

// values for circles radius & stroke: B: base, X: expand  
var rB = 4, rX = 10,
	sB = 0, sX = 0;




var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(5)
    .tickSize(6, 3, 0)
    .tickFormat(d3.format(""));
    
var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(5)
    .orient("left")
    .tickSize(6, 3, 0)
    .tickFormat(d3.format(""));

svg.selectAll(".gridlines").data(y.ticks(5)).enter().append("svg:line")
	.classed("gridlines",1)
	.attr("y1",y).attr("y2",y)
	.attr("x1",50).attr("x2",w-15)
	.style("stroke","#ccc")

var myxAxis=svg.append("svg:g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (h-20)+ ")")
      .call(xAxis);

var myyAxis=svg.append("svg:g")
      .attr("class", "y axis")
      .attr("transform", "translate(50,0)")
      .call(yAxis);

// d3.selectAll(".axis").selectAll("path, line").style("stroke","black");

      
d3.selectAll(".axis path").style("stroke","#333");
d3.selectAll(".axis line").style("stroke",mycolor(0));
d3.selectAll(".x.axis text").style("fill",mycolor(0));
d3.selectAll(".y.axis text").each(function(d,i) {
	d3.select(this).style("fill", mycolor(d3.select(this).text()));
});


chart.select(".h1").html(labels[currentView].title)
		.style("left","00px")	
      		.style("top","30px")
      		.style("position","relative")
      		.style("font-size","24px").style("font-weight","bold");
chart.select(".h2").html(labels[currentView].subtitle)
		.style("left","00px")	
      		.style("top","35px")
      		.style("position","relative")
      		.style("font-size","18px")



// prepare data
var mySeries=[];
data.forEach(function(d) {mySeries.push({key:d.key,value:d.values[0].values[0].value});})


var duration=250,ease="linear";

var myG=svg.append("svg:g").classed("series",1);
	myG.append("svg:g").classed("lines",1);

var circles=myG.append("svg:g").classed("circles",1);

var currentColor = mycolor(mySeries[0].value);

// start dataLine
drawStart();

/**
* 
*/

var pages = d3.select("#pages");

var tabs=views;


var li=pages.append("ul").selectAll("li").data(["prev",tabs[0],tabs[1],tabs[2],tabs[3],tabs[4],"next"]).enter().append("li");
li.append("a").attr("href","#").html(function(d) {
	if (d=="prev") {return "&larr; Previous";};
	if (d=="next") {return "Next &rarr;";};
	return d;})
li.filter(function(d) {return d=="prev";}).classed("prev",1).classed("disabled",1);
li.filter(function(d) {return d=="next";}).classed("next",1);
li.filter(function(d) {return d=="Population";}).classed("active",1);

li.on("click", function(d,i) {
	if (d3.select(this).classed("disabled")==0) {
		if(d=="prev"&&currentView>0) {
			currentView--;	
			
		} else if (d=="next"&&currentView<7) {
			currentView++;
		} else {
			currentView=i-1;
		}
		li.filter(function(d) {return d=="prev";}).classed("disabled",(currentView==0));
		li.filter(function(d) {return d=="next";}).classed("disabled",(currentView==4));
	
		li.classed("active",0);
		li.filter(function(d) {return d==tabs[currentView];}).classed("active",1);
		transitionTo(currentView,currentScenario);
	}
})

var button=d3.select("#button")
var scenarios=["baseline","alternative"];

button.on("change",function() {
	currentScenario=parseFloat(button.property("value"))
	transitionTo(currentView,currentScenario);
})



function drawStart() {
	defCircle(circles.append("svg:circle"), 0, currentColor, x(mySeries[0].key), y(mySeries[0].value), mySeries[0].key+": "+mySeries[0].value.toFixed(1));
	drawSegment(mySeries,0);
}

function drawSegment(mySeries,s) {
	if(s>=mySeries.length-1) {$('circle').tipsy({html: true, gravity: 's'});return;} // when the last segment is reached, drop it
	else {
		var myG=svg.select("g.series");
		var lines=myG.select(".lines");
		var circles=myG.select(".circles");
		
		currentColor = mycolor(mySeries[s].value);
		
		lines.append("svg:line")
			.attr("x1",x(mySeries[s].key))
			.attr("x2",x(mySeries[s].key))
			.attr("y1",y(mySeries[s].value))
			.attr("y2",y(mySeries[s].value))
			.style("stroke",currentColor)
			.style("stroke-width",1)
			.transition().ease("linear")
			.duration(d(mySeries[s+1].key-mySeries[s].key))
			.attr("x2",x(mySeries[s+1].key))
			.attr("y2",y(mySeries[s+1].value))
			.each("end",function() {
				// draw me a circle
				defCircle(circles.append("svg:circle"), 
					s+1, 
					currentColor, 
					x(mySeries[s+1].key), 
					y(mySeries[s+1].value), 
					mySeries[s+1].key+": "+mySeries[s+1].value.toFixed(1));
				// after transition, we try to draw the next segment
				drawSegment(mySeries,s+1);
			;})
	}
}


function transitionTo(view,scenario) {
	
	var myG=svg.select("g.series")
	var lines=myG.select(".lines");
	var circles=myG.select(".circles");
	
	mycolor.domain(expDomain (scales[view].domain));
	
	y.domain(scales[view].domain);
	yAxis = d3.svg.axis()
	    .scale(y)
	    .ticks(5)
	    .orient("left")
	    .tickSize(6, 3, 0)
    	    .tickFormat(d3.format(".2r"));
    	
    	var myyAxis=svg.select("g.y.axis")	      
      	      .call(yAxis);
      	      
      	svg.selectAll(".gridlines").data(y.ticks(5))
      		.enter().append("svg:line")
			.classed("gridlines",1)
			.attr("y1",y).attr("y2",y)
			.attr("x1",50).attr("x2",w-15)
			.style("stroke","#ccc");
			
      	svg.selectAll(".gridlines").data(y.ticks(5)).exit().remove();
      	
      	svg.selectAll(".gridlines").transition()
		.attr("y1",y).attr("y2",y).style("opacity",function(d) {return d?1:0;});
		
      	      
      	/// d3.selectAll(".axis").selectAll("path, line").style("stroke","black");
      	
      	
      
		d3.selectAll(".axis path").style("stroke","#333");
		d3.selectAll(".axis line").style("stroke",mycolor(0));
		d3.selectAll(".x.axis text").style("fill",mycolor(0));
		d3.selectAll(".y.axis text").each(function(d,i) {
			d3.select(this).style("fill", mycolor(d3.select(this).text()));
		});
      
      	chart.select(".h1").html(labels[currentView].title);
      	chart.select(".h2").html(labels[currentView].subtitle);
	
	
	mySeries=[];
	
	
	data.forEach(function(d) {mySeries.push({key:d.key,value:d.values[scenario].values[view].value});})
	
	lines.selectAll("line").transition()
		.attr("x1",function(d,i) {return x(mySeries[i].key);})
		.attr("x2",function(d,i) {return x(mySeries[i+1].key);})
		.attr("y1",function(d,i) {return y(mySeries[i].value);})
		.attr("y2",function(d,i) {return y(mySeries[i+1].value);})

	updateCircle(circles, mySeries);

}




function defCircle(circle, index, color, cx, cy, tips) {

	circle.attr("cx", cx)
		.attr("cy",cy)
		.style("stroke","white").style("stroke-width",sB).style("fill",color)
		.attr("r",0)
		.attr("class","circle c"+index)
		
	    .on("mouseover", function () {
	    	animCircle(d3.select(this), rX, sX)
	    })
	    .on("mouseout",  function () {
	    	animCircle(d3.select(this), rB, sB)
	    });
	
	circle.append("svg:title").text(tips);
	circle.transition().duration(250).attr("r",rB);
}

function animCircle(c, r, s) {
	c.transition()
		.attr("r",r)
		.style("stroke-width",s)
		.delay(0)
		.duration(110)
		.ease("cubic");
}

// not sure about this one, it may probably improved…
function updateCircle (parent, mySerie) {
	parent.selectAll("title").remove();
	parent.selectAll("original-title").remove();
	parent.selectAll("circle").transition()
		.attr("cx",function(d,i) {return x(mySeries[i].key);})
		.attr("cy",function(d,i) {return y(mySeries[i].value);})
		.style("fill",function(d,i) {return mycolor(mySeries[i].value)})
		.attr("r",rB) // (in case sb clicks before the line is all grown)
	
	parent.selectAll("circle").append("svg:title").text(function(d,i) {return mySeries[i].year+": "+mySeries[i].value.toFixed(1);});
	
	$('circle').tipsy({html: true, gravity: 's'});
}

function expDomain (domain) {
	return [d3.first(domain), d3.median(domain), d3.last(domain)];
}

