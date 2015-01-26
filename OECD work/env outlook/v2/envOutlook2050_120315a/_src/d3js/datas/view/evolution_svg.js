d3.select("h2").html(data.series);
d3.select("title").html(data.series);

var w=650,h=400;
var svg=d3.select("#chart").append("svg:svg").attr("width",w).attr("height",h);

//var px=w*h/data.values[1].population;

var r1={width:Math.sqrt(data.values[0].value/data.values[1].population)*w, height:Math.sqrt(data.values[0].value/data.values[1].population)*h};
var r2={width:Math.sqrt(data.values[0].population/data.values[1].population)*w, height:Math.sqrt(data.values[0].population/data.values[1].population)*h};
var r3={width:Math.sqrt(data.values[1].value/data.values[1].population)*w, height:Math.sqrt(data.values[1].value/data.values[1].population)*h};
var r4={width:w, height:h};

var rect1,rect2,rect3,rect4,text1,text2;


var colour1 = "#ECF7FD";
var colour2 = "#2973bd";

var sLabel = data.label.split(",");
var yOffset = 10;

d3.select("button").on("click",draw);	

init()

function init() {
	rect2=svg.append("svg:rect").classed("pop",1).style("fill",colour1)
	.attr("x",0)
	.attr("y",h-r2.height)
	.attr("width",r2.width)
	.attr("height",r2.height);
	
	rect4=svg.append("svg:rect").classed("pop",1).style("fill",colour1)
	.attr("x",0)
	.attr("y",h-r2.height)
	.attr("width",r2.width)
	.attr("height",r2.height);
	
	text1=svg.append("svg:text").style("fill","black").style("opacity",.2)
	.attr("x",r2.width/2)
	.attr("y",h-(r1.height+r2.height)/2)
	.attr("text-anchor","middle")
	.style("font-size","36px")
	.text("Population in "+data.values[0].key+": "+(data.values[0].population/1000).toFixed(1)+"b");
	
	
	
	rect1=svg.append("svg:rect").classed("value",1).style("fill",colour2)
	.attr("x",0)
	.attr("y",h-r1.height)
	.attr("width",r1.width)
	.attr("height",r1.height);
	rect3=svg.append("svg:rect").classed("value",1).style("fill",colour2)
	.attr("x",0)
	.attr("y",h-r1.height)
	.attr("width",r1.width)
	.attr("height",r1.height);
	
	text2a=svg.append("svg:text").style("fill","white").style("opacity",.6)
		.attr("x",r1.width/2)
		.attr("y",h-(r1.height/2)-yOffset)
		.attr("text-anchor","middle")
		.style("font-size",data.label_size+"px")
		.text(sLabel[0]);
	
	text2b=svg.append("svg:text").style("fill","white").style("opacity",.6)
		.attr("x",r1.width/2)
		.attr("y",h-(r1.height/2)+yOffset)
		.attr("text-anchor","middle")
		.style("font-size",data.label_size+"px")
		.text(sLabel[1]+": "+(data.values[0].value/1000).toFixed(1)+"b");
	
	

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
	
	
	text1.text("Population in "+data.values[1].key+": "+(data.values[1].population/1000).toFixed(1)+"b")
		.transition().duration(1000)
		.attr("x",w/2)
		.attr("y",h-(r3.height+r4.height)/2)
		
	text2a.text(sLabel[0])
		.transition().duration(1000)
		.attr("x",r3.width/2)
		.attr("y",h-(r3.height/2)-yOffset)
		
	text2b.text(sLabel[1]+": "+(data.values[1].value/1000).toFixed(1)+"b")
		.transition().duration(1000)
		.attr("x",r3.width/2)
		.attr("y",h-(r3.height/2)+yOffset)
	
	
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
	
	text1.text("Population in "+data.values[0].key+": "+(data.values[0].population/1000).toFixed(1)+"b")
		.transition().duration(1000)
		.attr("x",r2.width/2)
		.attr("y",h-(r1.height+r2.height)/2)
		
	text2a.text(sLabel[0])
		.transition().duration(1000)
		.attr("x",r1.width/2)
		.attr("y",h-(r1.height/2)-yOffset)
		
	text2b.text(sLabel[1]+": "+(data.values[0].value/1000).toFixed(1)+"b")
		.transition().duration(1000)
		.attr("x",r1.width/2)
		.attr("y",h-(r1.height/2)+yOffset)
		
	d3.select("#text").transition().duration(500).style("opacity",0).each("end",function() {
		d3.select(this).html(data.values[0].legend).transition().duration(500).style("opacity",1)
		;})
}



