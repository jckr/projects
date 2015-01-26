var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var projection = d3.geo.mercator()
    .scale(width)
    .translate([width / 2, height / 2]);

var mode=0;

var path = d3.geo.path()
    .projection(projection);

var zoom = d3.behavior.zoom()
    .translate(projection.translate())
    .scale(projection.scale())
    .scaleExtent([height, 8 * height])
    .on("zoom", move);

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);

var g = svg.append("g"),
    feature = g.selectAll(".feature");

svg.append("rect")
    .attr("class", "frame")
    .attr("width", width)
    .attr("height", height);


feature = feature.data(collection.features)
    .enter().append("path")
      .attr("class", "feature")
      .attr("d", path);

var species=["anchovies","cod","mackerel","salmon","sardines","tuna"];
var color=d3.scale.category10().domain(species);
var rScale={};
rScale["anchovies"]=d3.scale.linear().domain([0,1000]).range([0,20]);
rScale["cod"]=d3.scale.linear().domain([0,1000]).range([0,20]);
rScale["mackerel"]=d3.scale.linear().domain([0,1000]).range([0,20]);
rScale["salmon"]=d3.scale.linear().domain([0,1000]).range([0,20]);
rScale["sardines"]=d3.scale.linear().domain([0,1000]).range([0,20]);
rScale["tuna"]=d3.scale.linear().domain([0,1000]).range([0,20]);
var selected="tuna";

d3.selectAll(".btn").on("click",function() {
  d3.selectAll(".btn").classed("active",0);
  d3.select(this).classed("active",1);
  selected=d3.select(this).attr("id");
  circles.transition()
    .attr("r",function(d) {return rScale[selected](Math.sqrt(d.value[selected]));})
    .style("fill",color(selected));
  circles.select("title")
  .text(function(d) {return d.name+" - "+selected+": "+d3.format(",0")(d.value[selected]);})
})

function move() {
  var t = d3.event.translate,
      s = d3.event.scale;
  t[0] = Math.max(-s / 2, Math.min(width + s / 2, t[0]));
  t[1] = Math.max(-s / 2, Math.min(height + s / 2, t[1]));
  zoom.translate(t);
  projection.translate(t).scale(s);
  feature.attr("d", path);
  
  nodes.forEach(function(node) {
  	var xy = projection([node.lon,node.lat]);
  	//console.log(xy);
  	node.x=xy[0];
  	node.y=xy[1];
  	
  })
  
  circles
  	.attr("cx",function(d){return d.x;})
  	.attr("cy",function(d){return d.y;})
  	
  	
  
}





var 
idToNode = {},
links = [],
nodes = data.map(function(d,i) {
  var xy = projection([d.lon,d.lat]);
  return idToNode[d.id] = {
    index:i,
    lat:d.lat,
    lon:d.lon,
    x: xy[0],
    y: xy[1],
    value:d,
    name:d.name
  };
});

var circles=svg.selectAll("circle")
	.data(nodes)
	.enter().append("circle")
	.style("fill", color(selected))
	.attr("cx", function(d) { return d.x; })
	.attr("cy", function(d) { return d.y; })
	.attr("r", function(d, i) { return rScale[selected](Math.sqrt(d.value[selected]));})
	.style("opacity",.5);	
circles.append("title")
	.text(function(d) {return d.name+" - "+selected+": "+d3.format(",")(d.value[selected]);})
	