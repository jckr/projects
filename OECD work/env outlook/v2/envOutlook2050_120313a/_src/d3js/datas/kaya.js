
var w=600,h=350;
var oecdMainBlue = "#2973BD";	

var currentView=0;
var currentScenario=0;

var chart=d3.select("#chart");
chart.append("div").classed("h1",1);
chart.append("div").classed("h2",1);
var svg=chart.append("svg:svg").attr("width",w).attr("height",h);

var x=d3.scale.linear().domain([2010,2050]).range([50,w-15]);
var y=d3.scale.linear().domain(scales[0].domain).range([h-20,50]);
var d=d3.scale.linear().domain([0,5]).range([0,50]);

// prepare data
var mySeries=[];
data.forEach(function(d) {mySeries.push({key:d.key,value:d.values[0].values[0].value});})


var duration=250,ease="linear";

var myG=svg.append("svg:g").classed("series",1);


myG.append("svg:g").classed("lines",1);
var circles=myG.append("svg:g").classed("circles",1);
var circle=circles.append("svg:circle")
	.attr("cx",x(mySeries[0].key)) // probably on the y axis, but hey
	.attr("cy",y(mySeries[0].value))
	.style("fill",oecdMainBlue)
	.attr("fill-opacity", 0.1)
	.attr("r",0)
	.attr("class","circle c0");
circle.append("svg:title").text(function(d) {return mySeries[0].value.toFixed(1);})
circle.transition().duration(250).attr("r",5);
drawSegment(mySeries,0);

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

var myxAxis=svg.append("svg:g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (h-20)+ ")")
      .call(xAxis);

var myyAxis=svg.append("svg:g")
      .attr("class", "y axis")
      .attr("transform", "translate(50,0)")
      .call(yAxis);

d3.selectAll(".axis").selectAll("path, line").style("stroke","black");
		

svg.selectAll(".gridlines").data(y.ticks(5)).enter().append("svg:line")
	.classed("gridlines",1)
	.attr("y1",y).attr("y2",y)
	.attr("x1",50).attr("x2",w-15)
	.style("stroke","#ccc")

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


function drawSegment(mySeries,s) {
	if(s>=mySeries.length-1) {$('circle').tipsy({html: true, gravity: 's'});return;} // when the last segment is reached, drop it
	else {
		var myG=svg.select("g.series");
		var lines=myG.select(".lines");var circles=myG.select(".circles");
		lines.append("svg:line")
			.attr("x1",x(mySeries[s].key))
			.attr("x2",x(mySeries[s].key))
			.attr("y1",y(mySeries[s].value))
			.attr("y2",y(mySeries[s].value))
			.style("stroke",oecdMainBlue)
			.style("stroke-width",1)
			.transition().ease("linear")
			.duration(d(mySeries[s+1].key-mySeries[s].key))
			.attr("x2",x(mySeries[s+1].key))
			.attr("y2",y(mySeries[s+1].value))
			.each("end",function() {
				var circle=circles.append("svg:circle")
					.attr("cx",x(mySeries[s+1].key))
					.attr("cy",y(mySeries[s+1].value))
					//.style("stroke","black").style("stroke-width",3).style("fill","white")
					.style("fill",oecdMainBlue)
					.attr("fill-opacity", 0.1)
					.attr("r",5)
					.attr("class","circle c"+s);
				circle.append("svg:title").text(function(d) {return mySeries[s+1].key+": "+mySeries[s+1].value.toFixed(1);})
				// circle.transition().duration(500).attr("r",5);
				drawSegment(mySeries,s+1);	// after transition, we try to draw the next segment
			;})
	}
}



function transitionTo(view,scenario) {
	
	var myG=svg.select("g.series")
	var lines=myG.select(".lines");var circles=myG.select(".circles");
	
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
		
      	      
      	d3.selectAll(".axis").selectAll("path, line").style("stroke","black");
      
      	chart.select(".h1").html(labels[currentView].title);
      	chart.select(".h2").html(labels[currentView].subtitle);
	
	
	mySeries=[];
	
	
	data.forEach(function(d) {mySeries.push({key:d.key,value:d.values[scenario].values[view].value});})
	
	lines.selectAll("line").transition()
		.attr("x1",function(d,i) {return x(mySeries[i].key);})
		.attr("x2",function(d,i) {return x(mySeries[i+1].key);})
		.attr("y1",function(d,i) {return y(mySeries[i].value);})
		.attr("y2",function(d,i) {return y(mySeries[i+1].value);})
	circles.selectAll("title").remove();circles.selectAll("original-title").remove();
	circles.selectAll("circle").transition()
		.attr("cx",function(d,i) {return x(mySeries[i].key);})
		.attr("cy",function(d,i) {return y(mySeries[i].value);})
		.attr("r",5) // (in case sb clicks before the line is all grown)
	
	circles.selectAll("circle").append("svg:title").text(function(d,i) {return mySeries[i].key+": "+d3.format(".2r")(mySeries[i].value);});
	
	$('circle').tipsy({html: true, gravity: 's'});

}