d3.select("h1").html(data.series);


var w=820,h=600;
//var svg=d3.select("#chart").append("svg:svg").attr("width",w).attr("height",h);
var chart=d3.select("#chart");
chart.style("width",w+"px").style("height",h+"px").style("position","absolute").style("top","80px").style("left","100px");

//var px=w*h/data.values[1].population;

var r1={width:Math.sqrt(data.values[0].value/data.values[1].population)*w, height:Math.sqrt(data.values[0].value/data.values[1].population)*h};
var r2={width:Math.sqrt(data.values[0].population/data.values[1].population)*w, height:Math.sqrt(data.values[0].population/data.values[1].population)*h};
var r3={width:Math.sqrt(data.values[1].value/data.values[1].population)*w, height:Math.sqrt(data.values[1].value/data.values[1].population)*h};
var r4={width:w, height:h};

var rect1,rect2,rect3,rect4,text1,text2;

d3.select("button").on("click",draw);
	
	

init()



function init() {
	rect2=chart.append("div").classed("pop",1).style("background-color","aliceblue")
	.style("position","absolute")
	.style("left","0px")
	.style("top",(h-r2.height)+"px")
	.style("width",(r2.width)+"px")
	.style("height",(r2.height)+"px");
	
	rect4=chart.append("div").classed("pop",1).style("background-color","aliceblue")
	.style("position","absolute")
	.style("left","0px")
	.style("top",(h-r2.height)+"px")
	.style("width",(r2.width)+"px")
	.style("height",(r2.height)+"px")
	.append("div").style("text-align","center").style("vertical-align","middle").html("Population in "+data.values[0].key+": "+(data.values[0].population/1000).toFixed(1)+"b");
	
	rect1=chart.append("div").classed("value",1).style("background-color","steelblue")
	.style("position","absolute")
	.style("left","0px")
	.style("top",(h-r1.height)+"px")
	.style("width",(r1.width)+"px")
	.style("height",(r1.height)+"px");
	
	rect3=chart.append("div").classed("value",1).style("background-color","steelblue")
	.style("position","absolute")
	.style("left","0px")
	.style("top",(h-r1.height)+"px")
	.style("width",(r1.width)+"px")
	.style("height",(r1.height)+"px")
	.append("div").style("text-align","center").style("vertical-align","middle").html(data.label+": "+(data.values[0].value/1000).toFixed(1)+"b");

}
	
function draw() {
	d3.select("button").classed("disabled",1);
	rect3.transition().duration(300).style("background-color","none").style("stroke","black").style("stroke-dasharray","4 4").style("opacity",.5)
	rect4.transition().duration(300).style("background-color","none").style("stroke","black").style("stroke-dasharray","4 4").style("opacity",.5)
	rect2.transition().duration(1000)
	.style("top","0px")
	.style("width",w+"px")
	.style("height",h+"px")
	rect1.transition().duration(1000)
	.style("y",(h-r3.height)+"px")
	.style("width",(r3.width)+"px")
	.style("height",(r3.height)+"px")
	.each("end",function() {d3.select("button").classed("disabled",0).html("Reset").on("click",redraw);})
	
	
	rect4.select("div").html("Population in "+data.values[1].key+": "+(data.values[1].population/1000).toFixed(1)+"b")
		//.transition().duration(1000)
		//.attr("x",w/2)
		//.attr("y",h-(r3.height+r4.height)/2)
		
	rect3.select("div").html(data.label+": "+(data.values[1].value/1000).toFixed(1)+"b")
		//.transition().duration(1000)
		//.attr("x",r3.width/2)
		//.attr("y",h-(r3.height/2))
	
	
	d3.select("#text").transition().duration(500).style("opacity",0).each("end",function() {
			d3.select(this).html(data.values[1].legend).transition().duration(500).style("opacity",1)
		;})
	
}


function redraw() {
	d3.select("button").classed("disabled",1);
	rect3.transition().duration(500).style("stroke","none").style("stroke-dasharray","1").style("opacity",1)
	rect4.transition().duration(500).style("stroke","none").style("stroke-dasharray","1").style("opacity",1)
	rect2.transition().duration(500)
	.style("top",(h-r2.height)+"px")
	.style("width",(r2.width)+"px")
	.style("height",(r2.height)+"px")
	rect1.transition().duration(500)
	.style("top",(h-r1.height)+"px")
	.style("width",(r1.width)+"px")
	.style("height",(r1.height)+"px")
	
	.each("end",function() {d3.select("button").classed("disabled",0).html("See evolution").on("click",draw);})
	
	rect4.select("div").html("Population in "+data.values[0].key+": "+(data.values[0].population/1000).toFixed(1)+"b")
	//	.transition().duration(1000)
	//	.attr("x",r2.width/2)
	//	.attr("y",h-(r1.height+r2.height)/2)
		
	rect4.select("div").html(data.label+": "+(data.values[0].value/1000).toFixed(1)+"b")
	//	.transition().duration(1000)
	//	.attr("x",r1.width/2)
	//	.attr("y",h-(r1.height/2))
		
	d3.select("#text").transition().duration(500).style("opacity",0).each("end",function() {
		d3.select(this).html(data.values[0].legend).transition().duration(500).style("opacity",1)
		;})
}



