var svg=d3.select("#chart").append("svg");
var A=220,H=671,S=420,ind=202,tot=1513;

var cScale=d3.scale.linear().range(["#C03","#005384"]).domain([0.4,0.6]);
var x1=d3.scale.linear().domain([0,202]).range([450,850]);
var x2=d3.scale.linear().domain([0,202]).range([0,-400]);
var y1=d3.scale.linear().domain([0,202]).range([0,500]);
var y2=d3.scale.linear().domain([0,202]).range([0,500]);
function quad(d) {
	var i=d[0],j=d[1];
	var coords=[[i,j],[i,j+10],[i+10,j+10],[i+10,j]];
	var p=d3.svg.line()
	    .x(function(d) { return x1(d[0])+x2(d[1]); })
    	    .y(function(d) { return y1(d[0])+y2(d[1]); })(coords)
    	return p+" Z";
}

var data=d3.range(20).map(function(i) {return d3.range(20).map(function(j) {return [i*10,j*10];});});

svg.selectAll("g").data(data).enter()
	.append("g")
	.selectAll("path").data(function(d) {return d;}).enter()
		.append("path")
		.style("visible",function(d) {if(d[0]+d[1]>202) {d3.select(this).remove()};})
		.attr("d",quad)
		.style("stroke",function(d) {return cScale((S+d[0])/(tot-d[1]));})
		.style("stroke-opacity",.5)
		.style("fill",function(d) {return cScale((S+d[0])/(tot-d[1]));})
	