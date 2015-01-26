data.sort(function(a,b) {return (b.pop-a.pop);});
var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var projection = d3.geo.mercator()
    .scale(width)
    .translate([width / 2, height / 2]);

var cScale=d3.scale.linear().range(["#ddd","turquoise"]);

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
      .attr("d", path)
      .style("fill",function(d) {
          if (typeof(lcez[d.id])==="undefined") {
              return "#ccc";
          } else {
              return cScale(lcez[d.id]);
          }
      })
      .style("stroke","none")
      ;

var rScale=d3.scale.linear().domain([0,10000]).range([0,30]);



function move() {
  var t = d3.event.translate,
      s = d3.event.scale;
  t[0] = Math.max(-s / 2, Math.min(width + s / 2, t[0]));
  t[1] = Math.max(-s / 2, Math.min(height + s / 2, t[1]));
  zoom.translate(t);
  projection.translate(t).scale(s);
  feature.attr("d", path);
  rScale.range([0,30*s/width]);
  nodes.forEach(function(node) {
  	var xy = projection([node.lon,node.lat]);
  	//console.log(xy);
  	node.x=xy[0];
  	node.y=xy[1];
  	
  })
  
  circles
  	.attr("cx",function(d){return d.x;})
  	.attr("cy",function(d){return d.y;})
  	.attr("r",function(d) {return d3.max([1,rScale(Math.sqrt(d.value))]);})
  	
  
}
var legend=svg.append("g").attr("transform","translate(50,450)").attr("id","legend");
legend.selectAll("path").data(d3.range(200)).enter()
  .append("path").attr("d",function(d) {return "m "+d+",0v10";})
  .style("stroke",function(d) {return cScale(d/200);})
legend.append("text").attr("x",0).attr("y",-10).text("% living in low-elevation coastal zone").style("font-size",10)
legend.append("text").attr("x",0).attr("y",25).text("0");legend.append("text").attr("x",200).attr("y",25).text("100").attr("text-anchor","end")




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
    value:d.pop,
    name:d.name,
    country:d.country
  };
});

var circles=svg.selectAll("circle")
	.data(nodes)
	.enter().append("circle")
	.style("fill", "blue").style("stroke","black")
	.attr("cx", function(d) { return d.x; })
	.attr("cy", function(d) { return d.y; })
	.attr("r", function(d, i) { return d3.max([1,rScale(Math.sqrt(d.value))]);})
	.style("fill-opacity",.01).style("stroke-opacity",1);	
circles.append("title")
	
	
  .text(function(d) {
      var text=d.name+": "+d3.format(",0")(d.value);
      console.log(d.country,lcez[d.country]);
      if (typeof(lcez[d.country])!=="undefined"){
        text=text+" "+countries[d.country]+": "+d3.format("%")(lcez[d.country]);
      }
      return text;
  })
