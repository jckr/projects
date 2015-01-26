var indicators=[
{color:"#33A594",name:"Housing"},
{color:"#1EA2E2",name:"Income"},
{color:"#197EBF",name:"Jobs"},
{color:"#DB4C60",name:"Community"},
{color:"#7FAD3E",name:"Education"},
{color:"#21A554",name:"Environment"},
{color:"#DEAA00",name:"Governance"},
{color:"#7E3874",name:"Health"},
{color:"#E5632F",name:"Life Satisfaction"},
{color:"#606060",name:"Safety"},
{color:"#992825",name:"Work-Life Balance"}
];
indicators.forEach(function(d,i) {d.ind="ind"+(i+1);});
var data;
var width= d3.select("#chart").style("width"),height=500;
var svg=d3.select("#chart").append("svg").attr("width",width).attr("height",height);
var x=d3.scale.linear().domain([0,50]).range([0,960]);
var y=d3.scale.linear().domain([0,3000]).range([450,0]);

var line = d3.svg.line()
	.interpolate("basis")
    .x(function(d,i) { return x(i); })
    .y(function(d) { return y(d); });


d3.csv("curves.csv",function(csv){
	data=csv;
	indicators.forEach(function(d) {
		d.values=[];
		csv.forEach(function(c) {
			d.values.push(+c[d.ind]);
		})
	})

	svg.selectAll("path").data(indicators).enter().append("path")
		.style("stroke",function(d) {return d.color;})
		.style("stroke-width",3)
		.style("stroke-opacity",.5)
		.style("fill","none")
		.attr("id",function(d,i) {return "c"+i;})
		.attr("d",function(d) {return line(d3.range(51).map(function(r) {return 0;}));})
		.transition()
		.delay(1000)
		.duration(1000)
		.attr("d",function(d) {return line(d.values);})

	svg.append("line").classed("grey",1)
		.attr("x1",x(11))
		.attr("x2",x(11))
		.attr("y1",0)
		.attr("y2",450)
		.style("stroke","grey")
		.style("opacity",0)
	

	svg.append("text").classed("grey",1)
		.attr("x",x(11))
		.attr("y",465)
		.attr("text-anchor","middle")
		.style("fill","grey")
		.style("opacity",0)
		.text("Average")

	svg.append("text").classed("grey",1)
		.attr("x",0)
		.attr("y",15)
		.style("fill","grey")
		.style("opacity",0)
		.text("Scored less than average")

	svg.append("text").classed("grey",1)
		.attr("x",width)
		.attr("text-anchor","end")
		.attr("y",15)
		.style("fill","grey")
		.style("opacity",0)
		.text("Scored more than average")


	svg.selectAll(".grey")
		.transition()
		.delay(1000)
		.duration(1000)
		.style("opacity",.5)

})

d3.select("#legend").selectAll("span").data(indicators).enter()
	.append("span").classed("label",1)
	.html(function(d) {return d.name;})
	.style("background-color",function(d) {return d.color;})
	.style("margin-right","20px")
	.attr("id",function(d,i){return "s"+i;})
	.on("mouseover",function(d,i) {
		d3.selectAll("path").transition().style("opacity",.1);
		d3.select("#c"+i).transition().style("opacity",1).style("stroke-width",7);
	})
	.on("mouseout",function() {d3.selectAll("path").transition().style("opacity",.5).style("stroke-width",3)})
