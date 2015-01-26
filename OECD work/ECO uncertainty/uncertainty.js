
var w=600,h=400,m=20;
var svg=d3.select("#chart").append("svg:svg").attr("height",h).attr("width",w);
var country=0;

var countries={"USA":0,"Japan":1,"France":3,"Germany":2,"UK":4,"Italy":5}

d3.select("#select01").on("change", function() {country=countries[d3.select("#select01").property("value")];reDraw();})


var y=d3.scale.linear().domain([-70,70]).range([h,0]);
var x=d3.scale.linear().domain([0,46]).range([m,w-m]);

avg=d3.range(47).map(function(i) {var val={a1:0,a2:0,b1:0,b2:0};
val.a1=d3.mean(data,function(d) {return d.series[i].a1;})
val.a2=d3.mean(data,function(d) {return d.series[i].a2;})
val.b1=d3.mean(data,function(d) {return d.series[i].b1;})
val.b2=d3.mean(data,function(d) {return d.series[i].b2;})
return val;})
	
var closure="L"+(w-m)+","+y(0)+"L"+m+","+y(0)+"Z";

linea1=d3.svg.line().x(function(d,i) {return x(i);}).y(function(d) {return y(d.a1);}).interpolate("basis")
lineb1=d3.svg.line().x(function(d,i) {return x(i);}).y(function(d) {return y(d.b1);}).interpolate("basis")
linea2=d3.svg.line().x(function(d,i) {return x(i);}).y(function(d) {return y(d.a2);}).interpolate("basis")
lineb2=d3.svg.line().x(function(d,i) {return x(i);}).y(function(d) {return y(d.b2);}).interpolate("basis")

svg.append("svg:path").classed("a1",1).attr("d",function() {return linea1(data[country].series)+closure;})
svg.append("svg:path").classed("b1",1).attr("d",function() {return lineb1(data[country].series)+closure;})
svg.append("svg:path").classed("a2",1).attr("d",function() {return linea2(data[country].series)+closure;})
svg.append("svg:path").classed("b2",1).attr("d",function() {return lineb2(data[country].series)+closure;})

svg.append("svg:path").classed("avg",1).attr("d",linea1(avg))
svg.append("svg:path").classed("avg",1).attr("d",linea2(avg))
svg.append("svg:path").classed("avg",1).attr("d",lineb1(avg))
svg.append("svg:path").classed("avg",1).attr("d",lineb2(avg))

svg.append("svg:path").classed("axis",1).attr("d","M"+m+","+y(0)+"L"+(w-m)+","+y(0)).style("stroke","black")
svg.selectAll(".ticks").data(data[0].series).enter().append("svg:line").classed("ticks",1)
	.attr("x1",function(d,i) {return x(i);}).attr("x2",function(d,i) {return x(i);})
	.attr("y1",y(0))
	.attr("y2",function(d) {return y(0)+((d.key[5]==1)?5:1);})
	
svg.selectAll(".labels").data(data[0].series).enter().append("svg:text").classed("labels",1)
	.style("visibility",function(d) {return (d.key[5]==1)?"visible":"hidden";})
	.text(function(d) {return d.key.substring(0,4);})
	.attr("x",function(d,i) {return x(i)+10;})
	.attr("y",y(0)+18);
	

function reDraw() {
	svg.select(".a1").transition().duration(1000).attr("d",function() {return linea1(data[country].series)+closure;})
	svg.select(".a2").transition().duration(1000).attr("d",function() {return linea2(data[country].series)+closure;})
	svg.select(".b1").transition().duration(1000).attr("d",function() {return lineb1(data[country].series)+closure;})
	svg.select(".b2").transition().duration(1000).attr("d",function() {return lineb2(data[country].series)+closure;})
}
