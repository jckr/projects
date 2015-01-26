var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var windPower={GB:2093.7,DK:857.3,NL:246.8,DE:200.3,BE:195,SE:163.7,FI:26.3,IE:25.2,NO:2.3,PT:2};
var cScale=d3.scale.linear().domain([0,1,2000]).range(["white","#dee","cyan"])

var projection = d3.geo.mercator()
//    .scale(width)
//    .translate([width / 2, height / 2]);
    .scale(4000)
    .translate([380.00529841028884, 868.6641037453691]);
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

/*svg.append("rect")
    .attr("class", "frame")
    .attr("width", width)
    .attr("height", height);*/


feature = feature.data(collection.features)
    .enter().append("path")
      .attr("class", "feature")
      .style("fill",function(d) {if(windPower[d.id]){return cScale(windPower[d.id]);} else {return "#888";}})
      .attr("d", path);
feature.append("title").text(function(d) {console.log(d.id,windPower[d.id]);if (windPower[d.id]) {return d.properties.name+" 의 총 용량: "+windPower[d.id]+"MW"}});

var rScale=d3.scale.linear().domain([0,50]).range([0,30]);


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
nodes = data.filter(function(d) {return d.type==="wind";}).map(function(d,i) {
  var xy = projection([d.lon,d.lat]);
  return idToNode[d.id] = {
    index:i,
    lat:d.lat,
    lon:d.lon,
    x: xy[0],
    y: xy[1],
    value:d.capacity,
    name:d.name,
    country:d.country,
    type:d.type
  };
});

var circles=svg.selectAll("circle")
	.data(nodes)
	.enter().append("circle")
	.style("fill","white")// function(d) {return {wind:"cyan",tidal:"blue",wave:"green"}[d.type];}).style("stroke","none")
  .style("stroke","black")
	.attr("cx", function(d) { return d.x; })
	.attr("cy", function(d) { return d.y; })
	.attr("r", function(d, i) { return d3.max([3,rScale(Math.sqrt(d.value))]);})
	.style("opacity",.5);	
circles.append("title")
	.text(function(d) {return d.name+": ("+d.country+") "+d3.format(",")(d.value)+"MW";})
	