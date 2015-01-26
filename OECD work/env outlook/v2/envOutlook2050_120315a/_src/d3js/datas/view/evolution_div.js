d3.select("h1").html(data.series);


var w=650,h=400;
d3.select("#chart").attr("width",w).attr("height",h+20);
var svg=d3.select("#chart").append("svg:svg").attr("width",w).attr("height",h+20);

//var px=w*h/data.values[1].population;

var currentView=0;
var currentScenario=0;
var l=d3.selectAll(".pagination")[0].length?data.values.length-1:1;

var r1={width:Math.sqrt(data.values[0].value/data.values[l].population)*w, height:Math.sqrt(data.values[0].value/data.values[l].population)*h};
var r2={width:Math.sqrt(data.values[0].population/data.values[l].population)*w, height:Math.sqrt(data.values[0].population/data.values[l].population)*h};
var r3={width:Math.sqrt(data.values[1].value/data.values[l].population)*w, height:Math.sqrt(data.values[1].value/data.values[l].population)*h};
var r4={width:w, height:h};

var rect1,rect2,rect3,rect4,text1,text2,text3,text4;

d3.select("button").on("click",draw);

var pages=d3.select("#pages");
var tabs=data.tabs;
var li=pages.append("ul").selectAll("li").data(["prev"].concat(data.tabs,["next"])).enter().append("li");
li.append("a").attr("href","#").html(function(d) {
	if (d=="prev") {return "&larr; Previous";};
	if (d=="next") {return "Next &rarr;";};
	return d;})
li.filter(function(d) {return d=="prev";}).classed("prev",1).classed("disabled",1);
li.filter(function(d) {return d=="next";}).classed("next",1);
li.filter(function(d,i) {return i==1;}).classed("active",1);

li.on("click", function(d,i) {
	if (d3.select(this).classed("disabled")==0) {
		if(d=="prev"&&currentView>0) {
			currentView--;	
			
		} else if (d=="next"&&currentView<data.tabs.length+2) {
			currentView++;
		} else {
			currentView=i-1;
		}
		li.filter(function(d) {return d=="prev";}).classed("disabled",(currentView==0));
		li.filter(function(d) {return d=="next";}).classed("disabled",(currentView==data.tabs.length-1));
	
		li.classed("active",0);
		li.filter(function(d) {return d==tabs[currentView];}).classed("active",1);
		transitionTo(currentView,currentScenario);
	}
})	
	

init()



function init() {
	rect2=svg.append("svg:rect").classed("pop",1).style("fill","aliceblue")
	.attr("x",0)
	.attr("y",h-r2.height)
	.attr("width",r2.width)
	.attr("height",r2.height);
	
	rect4=svg.append("svg:rect").classed("pop",1).style("fill","aliceblue")
	.attr("x",0)
	.attr("y",h-r2.height)
	.attr("width",r2.width)
	.attr("height",r2.height);
	
	text1=svg.append("svg:text").style("fill","black").style("opacity",.2)
	.attr("x",r2.width/2)
	.attr("y",h-(r1.height+r2.height)/2)
	.attr("text-anchor","middle")
	.style("font-size","36px")
	.text("Population in "+data.values[0].key+": "+(data.values[0].population/1000).toFixed(1)+" billion");
	
	
	
	rect1=svg.append("svg:rect").classed("value",1).style("fill","steelblue")
	.attr("x",0)
	.attr("y",h-r1.height)
	.attr("width",r1.width)
	.attr("height",r1.height);
	rect3=svg.append("svg:rect").classed("value",1).style("fill","steelblue")
	.attr("x",0)
	.attr("y",h-r1.height)
	.attr("width",r1.width)
	.attr("height",r1.height);
	
	text2=svg.append("svg:text").style("fill","white").style("opacity",.6)
		.attr("x",r1.width/2)
		.attr("y",h-(r1.height/2))
		.attr("text-anchor","middle")
		.style("font-size",data.label_size+"px");
	text2.append("svg:tspan").text(data.label+": ").classed("l1",1);
	text2.append("svg:tspan").text((data.values[0].value/1000).toFixed(1)+" billion").attr("dy","1em").attr("x",r1.width/2).classed("l2",1);
	
	text3=svg.append("svg:text").attr("x",r1.width).attr("y",h+20).attr("text-anchor","end").text(data.label+" in "+data.values[0].key).style("opacity",0);
	text4=svg.append("svg:text").attr("x",r2.width).attr("y",h+20).attr("text-anchor","end").text("Population in "+data.values[0].key).style("opacity",0);
	

}
	
function draw() {
	d3.select("button").classed("disabled",1);
	rect3.transition().duration(300).style("fill","none").style("stroke","black").style("stroke-dasharray","4 4").style("opacity",.5)
	rect4.transition().duration(300).style("fill","none").style("stroke","black").style("stroke-dasharray","4 4").style("opacity",.5)
	rect2.transition().duration(1000)
	.attr("y",0)
	.attr("width",w)
	.attr("height",h)
	rect1.transition().duration(1000)
	.attr("y",h-r3.height)
	.attr("width",r3.width)
	.attr("height",r3.height)
	.each("end",function() {d3.select("button").classed("disabled",0).html("Reset").on("click",redraw);})
	
	
	text1.text("Population in "+data.values[1].key+": "+(data.values[1].population/1000).toFixed(1)+" billion")
		.transition().duration(1000)
		.attr("x",w/2)
		.attr("y",h-(r3.height+r4.height)/2)
		
		
	text2
		.transition().duration(1000)
		.attr("x",r3.width/2)
		.attr("y",h-(r3.height/2))

	text3.transition().duration(1000).style("opacity",1);
	text4.transition().duration(1000).style("opacity",1);
	
	d3.select("#text").transition().duration(500).style("opacity",0).each("end",function() {
			d3.select(this).html(data.values[1].legend).transition().duration(500).style("opacity",1)
		;})
	
}


function redraw() {
	d3.select("button").classed("disabled",1);
	rect3.transition().duration(500).style("stroke","none").style("stroke-dasharray","1").style("opacity",1)
	rect4.transition().duration(500).style("stroke","none").style("stroke-dasharray","1").style("opacity",1)
	rect2.transition().duration(500)
	.attr("y",h-r2.height)
	.attr("width",r2.width)
	.attr("height",r2.height)
	rect1.transition().duration(500)
	.attr("y",h-r1.height)
	.attr("width",r1.width)
	.attr("height",r1.height)
	
	.each("end",function() {d3.select("button").classed("disabled",0).html("See evolution").on("click",draw);})
	
	text1.text("Population in "+data.values[0].key+": "+(data.values[0].population/1000).toFixed(1)+"billion")
		.transition().duration(1000)
		.attr("x",r2.width/2)
		.attr("y",h-(r1.height+r2.height)/2)
		
	text2.text(data.label+": "+(data.values[0].value/1000).toFixed(1)+" billion")
		.transition().duration(1000)
		.attr("x",r1.width/2)
		.attr("y",h-(r1.height/2))
	
	text3.transition().duration(1000).style("opacity",0);
	text4.transition().duration(1000).style("opacity",0	);
	
	d3.select("#text").transition().duration(500).style("opacity",0).each("end",function() {
		d3.select(this).html(data.values[0].legend).transition().duration(500).style("opacity",1)
		;})
}

function transitionTo(view) {
	var l=data.values.length-1; // last element of values, 
	rect3.transition().duration(300).style("fill","none").style("stroke","black").style("stroke-dasharray","4 4").style("opacity",view?.5:0)
	rect4.transition().duration(300).style("fill","none").style("stroke","black").style("stroke-dasharray","4 4").style("opacity",view?.5:0)
	text3.transition().duration(300).style("opacity",view?1:0);
	text4.transition().duration(300).style("opacity",view?1:0);
	
	rect2.transition().duration(1000)
	.attr("y",h-Math.sqrt(data.values[view].population/data.values[l].population)*h)
	.attr("width",Math.sqrt(data.values[view].population/data.values[l].population)*w)
	.attr("height",Math.sqrt(data.values[view].population/data.values[l].population)*h)
	rect1.transition().duration(1000)
	.attr("y",h-Math.sqrt(data.values[view].value/data.values[l].population)*h)
	.attr("width",Math.sqrt(data.values[view].value/data.values[l].population)*w)
	.attr("height",Math.sqrt(data.values[view].value/data.values[l].population)*h)

	text1.text("Population in "+data.values[view].key+": "+(data.values[view].population/1000).toFixed(1)+" billion")
		.transition().duration(1000)
		.attr("x",Math.sqrt(data.values[view].population/data.values[l].population)*w/2)
		.attr("y",h-(Math.sqrt(data.values[view].population/data.values[l].population)*h+Math.sqrt(data.values[view].value/data.values[l].population)*h)/2)
		
	text2//.text(data.label+": "+(data.values[view].value/1000).toFixed(1)+" billion")
		.transition().duration(1000)
		.attr("x",Math.sqrt(data.values[view].value/data.values[l].population)*w/2)
		.attr("y",h-(Math.sqrt(data.values[view].value/data.values[l].population)*h/2))
	text2.selectAll("tspan").transition().duration(1000)
		.attr("x",Math.sqrt(data.values[view].value/data.values[l].population)*w/2)
		.attr("y",h-(Math.sqrt(data.values[view].value/data.values[l].population)*h/2))
	text2.select(".l2").text((data.values[view].value/1000).toFixed(1)+" billion");
		
	
	d3.select("#text").transition().duration(500).style("opacity",0).each("end",function() {
			d3.select(this).html(data.values[view].legend).transition().duration(500).style("opacity",1)
		;})

}


