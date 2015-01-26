// ship built
var data=[
{name:"Australia",value:20915,lat:-25,lon:135},
{name:"Canada",value:14280,lat:60,lon:-96},
{name:"Croatia",value:258258,lat:45.166667,lon:15.5},
{name:"Denmark",value:65874,lat:56,lon:10},
{name:"Finland",value:41887,lat:64,lon:26},
{name:"France",value:9444,lat:46,lon:2},
{name:"Germany",value:406730,lat:51.5,lon:10.5},
{name:"Greece",value:16364,lat:39,lon:22},
{name:"Italy",value:443334,lat:42.833333,lon:12.833333},
{name:"Japan",value:9162472,lat:36,lon:138},
{name:"Korea",value:15953574,lat:37,lon:127.5},
{name:"Netherlands",value:214318,lat:52.5,lon:5.75},
{name:"Norway",value:29829,lat:62,lon:10},
{name:"Poland",value:154558,lat:52,lon:20},
{name:"Portugal",value:3932,lat:39.5,lon:-8},
{name:"Romania",value:432547,lat:46,lon:25},
{name:"Spain",value:289381,lat:40,lon:-4},
{name:"Turkey",value:451441,lat:39.059012,lon:34.911546},
{name:"Chile",value:16818,lat:-30,lon:-71},
{name:"Czech Republic",value:7040,lat:49.75,lon:15},
{name:"Slovakia",value:4128,lat:48.666667,lon:19.5},
{name:"United Kingdom",value:1133,lat:54,lon:-4},
{name:"United States",value:215873,lat:39.828175,lon:-98.5795},
{name:"Brazil",value:132314,lat:-10,lon:-55},
{name:"China",value:19736659,lat:35,lon:105},
{name:"Chinese Taipei",value:395313,lat:24,lon:121},
{name:"India",value:224422,lat:20,lon:77},
{name:"Indonesia",value:239804,lat:-5,lon:120},
{name:"Malaysia",value:357900,lat:2.5,lon:112.5},
{name:"Philippines",value:639337,lat:13,lon:122},
{name:"Russia",value:127944,lat:60,lon:100},
{name:"Singapore",value:179667,lat:1.366667,lon:103.8},
{name:"Ukraine",value:106622,lat:49,lon:32},
{name:"Vietnam",value:530190,lat:16.166667,lon:107.833333}];
var centered=null,width=960,height=500;

var color = d3.scale.linear()
	.domain([-1,0, 50])//d3.max(data)])
	.range(["#eee","#ECFAFE", "#066E88"]); 
	//.range(["#eee","#eee", "#B84C49"]); 

var svg = d3.select("#chart").append("svg")
	.attr("width", width + 100)
	.attr("height", height + 100)
	.append("g")
	.attr("transform", "translate(50,50)");
//svg.append("rect").attr("x",-50).attr("y",-50).attr("width",1060).attr("height",500).style("fill","#C5F1FC");

var lang="eng";
if(window.location.search=="?lang=kor") {lang="kor";}


svg.append("rect")
    .attr("class", "frame")
    .attr("width", width)
    .attr("height", height)
    .on("click",function() {click();})
    .on("dblclick",reset)


var project = d3.geo.mercator().scale(1000),//albers(),
idToNode = {},
links = [],
nodes = data.map(function(d,i) {
	var xy = project([d.lon,d.lat]);
	return idToNode[d.id] = {
		index:i,
		x: xy[0],
		y: xy[1],
		gravity: {x: xy[0], y: xy[1]},
		r: Math.sqrt(d.value/8000),
		value: d.value,
		name:d.name
	};
});

var path = d3.geo.path().projection(project);

var states=svg.append("g").attr("id", "states");

  states
    .selectAll("path")
      .data(collection.features)
    .enter().append("svg:path")
      .attr("d", path)
      .attr("stroke", "none")
      .attr("fill", "#eee")
      .attr("fill-opacity", .7)
      .on("click",click);

var circles=svg.selectAll("circle")
	.data(nodes)
	.enter().append("circle")
	.style("fill", "steelblue")
	.attr("cx", function(d) { return d.x; })
	.attr("cy", function(d) { return d.y; })
	.attr("r", function(d, i) { return d.r; })
	.style("opacity",.5)	
	.append("title")
		.text(function(d) {return d.name+": "+d3.format(",")(d.value);})
function click(d) {
  var x = 0,
      y = 0,
      k = 1;

  var e=d3.event;
  d3.selectAll(".selected").classed("selected",0);
  if(d) {d3.select(this).classed("selected",1);}
  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = -centroid[0];
    y = -centroid[1];
    k = 3;
    
    centered = d;
  } else {
    centered = null;
    if(d){d3.select(this).classed("selected",0)}
  }

  svg.transition()
      .duration(1000)
      .attr("transform", "scale(" + k + ")translate(" + (x+80) + "," + (y+20) + ")")
}

function reset() {
projection = d3.geo.mercator()
    .scale(width)
    .translate([width / 2, height / 2]);
svg.transition().duration(1000).attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}
function changeLang() {
	lang=(lang=='eng')?'kor':'eng';
	window.location.search="?lang="+lang;
	
	//d3.select("#cPanel").selectAll("a").html(function(d) {return d.countrylabel[lang];})
}

$('circle').tipsy({html: true, gravity: 's'});