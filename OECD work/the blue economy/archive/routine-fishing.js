// fish kg per capita
var data=[5.3,5.2,16.4,52.1,6.4,2.1,24.2,13.4,1.7,30.3,14.9,43.4,15.6,24.5,12.5,7.8,38.1,1.7,6.8,3,6.9,34.4,4.2,1.8,1.8,25,13.9,23.8,11.6,3.6,5.9,20.1,26.5,5.5,19.7,22.7,7.5,13.9,15.3,8.7,22.6,10.4,11.6,5.5,24.5,1,27.1,10.8,4.4,16.7,6.9,0.8,16.4,0.2,35.8,31.7,34.8,47.6,34.9,28,8.4,14.8,29.6,21.1,37,2.2,10.4,1.6,33.3,4,3,87.4,5.1,24.3,7.1,21.4,20.6,24.4,30.6,60.8,5.7,2.9,3.5,74.6,12.4,2.3,18.5,12.6,9.4,0,5,9.9,37.6,27.8,7.4,5,50.1,176.5,8.5,30.2,17.2,20.6,10.8,0.2,9.6,2.2,25.5,14.7,1.5,19,20.7,20.3,26.4,4.7,3.3,9,51.4,0.7,1.9,12.2,4,21.4,32.4,9.5,54.8,52.7,12.1,5.3,18.9,2.1,31.4,40.5,16.2,46.3,22.8,9,24.3,64.3,26.1,8,9.4,30.1,7.6,40,21.7,1.7,15.1,6.5,28.5,15,2.1,0.3,30.9,4.8,0.3,7,14.4,13,6.9,3.3,15.6,16.9,22.6,20.3,5.1,24.1,9.3,0.3,30.3,16.6,26.1,4.6,6.2,1.3];

var texts=[
{text:
	{eng:"Iceland's remote position in the mid-North Atlantic has long made it a global fishing power. Dwindling stocks of cod have jeopardized the fishing and processing industries, whose exports top $3 billion annually.",
	 kor:"Iceland's remote position in the mid-North Atlantic has long made it a global fishing power. Dwindling stocks of cod have jeopardized the fishing and processing industries, whose exports top $3 billion annually."},
	 countrylabel:{eng:"Iceland",kor:"Iceland"}
	, countries:[71]},
{text:
	{eng:"Koreans eat 52 kilogrammes of fish annually, which is among the highest rates seen in industrialised nations. Given this high level of consumption, Korea is also one of the leading global markets for fish, with imports topping $5.5 billion annually.",
	kor:"Koreans eat 52 kilogrammes of fish annually, which is among the highest rates seen in industrialised nations. Given this high level of consumption, Korea is also one of the leading global markets for fish, with imports topping $5.5 billion annually."},
	countrylabel:{eng:"Korea",kor:"Korea"}
	, countries:[125]},
{text:
	{eng:"Peru and Chile are the dominant fisheries powers of South America, thanks to Pacific Ocean fishing grounds that are home to world-leading stocks of anchoveta, mackerel and sardine. Peruvian and Chilean fishing industries process their catch into fish meal, used as livestock feed, and fish oil, both of which boost exports.",
	kor:"Peru and Chile are the dominant fisheries powers of South America, thanks to Pacific Ocean fishing grounds that are home to world-leading stocks of anchoveta, mackerel and sardine. Peruvian and Chilean fishing industries process their catch into fish meal, used as livestock feed, and fish oil, both of which boost exports."},
	countrylabel:{eng:"Peru and Chile",kor:"Peru and Chile"}
	, countries:[121,31]},	
{text:
	{eng:"When Namibia became independent in 1990, it decided to allow locals to bid for fishing rights instead of selling them to foreign firms. It now exports over half a million tons of fish and fish products a year and landings are increasing.",
	 kor:"When Namibia became independent in 1990, it decided to allow locals to bid for fishing rights instead of selling them to foreign firms. It now exports over half a million tons of fish and fish products a year and landings are increasing."},
	 countrylabel:{eng:"Namibia",kor:"Namibia"}
	, countries:[107]},
{text:
	{eng:"China accounts for over 60% of global aquaculture production, as well as being the world's most important capture fisheries country. It is also is the world's main producer and exporter of fish products.",
	 kor:"China accounts for over 60% of global aquaculture production, as well as being the world's most important capture fisheries country. It is also is the world's main producer and exporter of fish products."},
	countrylabel:{eng:"China",kor:"China"}
	,countries:[32]},
{text:
	{eng:"Demand  for fish and fish products is declining in Japan, partly due changing lifestyles and consumer preferences, particularly among younger generations, but the country is still the world's biggest importer of fish products.",
	kor:"Demand  for fish and fish products is declining in Japan, partly due changing lifestyles and consumer preferences, particularly among younger generations, but the country is still the world's biggest importer of fish products."},
	countrylabel:{eng:"Japan",kor:"Japan"}
	,countries:[79]}];


var centered=null;
var color = d3.scale.linear()
	.domain([-1,0, 50])//d3.max(data)])
	.range(["#eee","#ECFAFE", "#066E88"]); 
	//.range(["#eee","#eee", "#B84C49"]); 
var width=960,height=500;
var svg = d3.select("#chart").append("svg")
	.attr("width", width + 100)
	.attr("height", height + 100)
	.append("g")
	
	.attr("transform", "translate(50,50)");
var lang="eng";
if(window.location.search=="?lang=kor") {lang="kor";}
d3.select("#alang").html(function() {return (lang=='eng')?'Switch to Korean':'Switch to English';})

svg.append("rect")
    .attr("class", "frame").style("fill","none").style("stroke","none")
    .attr("width", width)
    .attr("height", height)
    .on("click",function() {click();})
    .on("dblclick",reset)

//svg.append("rect").attr("x",-50).attr("y",-50).attr("width",1060).attr("height",500).style("fill","#C5F1FC");



var project = d3.geo.mercator().scale(1000),//albers(),
idToNode = {},
links = [],
nodes = countries.features.map(function(d,i) {
	var xy = project(d.geometry.coordinates);
	return idToNode[d.id] = {
		index:i,
		x: xy[0],
		y: xy[1],
		gravity: {x: xy[0], y: xy[1]},
		r: Math.sqrt(d.properties.population/400),
		data:[d.properties.population,d.properties.production,d.properties.consumption,d.properties.area],
		value: data[+d.id],
		name:d.properties.name
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
    //.append("svg:title")
    //	  .text(function(d) { return d.properties.name; });



d3.select("#area").on("click",function() {
	
	d3.selectAll("button").classed("active",0);
	d3.select("#area").classed("active",1);
	nodes.forEach(function(node) {node.r=Math.sqrt(node.data[3]/3000);});
	svg.selectAll("circle").data(nodes).transition().duration(1000).attr("r",function(d){return d.r;});

	d3.select("#legend").html("Area in km&sup2;");
	
	
});
d3.select("#population").on("click",function() {
	
	d3.selectAll("button").classed("active",0);
	d3.select("#population").classed("active",1);
	nodes.forEach(function(node) {node.r=Math.sqrt(node.data[0]/400);});
	svg.selectAll(".circle0").data(nodes).transition().duration(1000).attr("r",function(d){return d.r;});

	d3.select("#legend").html("Population in thousands");
	
	
});

d3.select("#production").on("click",function() {
	d3.selectAll("button").classed("active",0);
	d3.select("#production").classed("active",1);
	nodes.forEach(function(node) {node.r=Math.sqrt(node.data[1]/10);});
	svg.selectAll(".circle0").data(nodes).transition().duration(1000).attr("r",function(d){return d.r;});
	
	d3.select("#legend").html("Fish production (thousands of tonnes)");
	
	
});

d3.select("#consumption").on("click",function() {
	d3.selectAll("button").classed("active",0);
	d3.select("#consumption").classed("active",1);
	nodes.forEach(function(node) {node.r=Math.sqrt(node.data[2]/10);});
	svg.selectAll(".circle0").data(nodes).transition().duration(1000).attr("r",function(d){return d.r;});
	
	d3.select("#legend").html("Fish consumption (thousands of tonnes)");
	
	
});

var circle0=svg.selectAll(".circle0")
	.data(nodes)
	.enter().append("circle")
	.classed("circle0",1)
	//.attr("class",function(d) {return "C"+d.index+" circle0";})
	.style("fill", function(d) { return color(data[d.index]); })
	.attr("cx", function(d) { return d.x; })
	.attr("cy", function(d) { return d.y; })
	.attr("r",0)
	//.attr("r", function(d, i) { return d.r; })
	.style("opacity",.5)	
.append("title")
	.text(function(d) {
		//console.log(d);
		var title="<table><thead><tr><th style='text-align:left;font-size:12px;'>"+d.name+"</th></tr></thead><tbody>";
		title+="<tr><th style='text-align:left'>Population: </th><td style='text-align:right'>"+d3.format(",")(d.data[0]*1000)+"</td></tr>";
		title+="<tr><th style='text-align:left'>Fish production: </th><td style='text-align:right'>"+d3.format(",")(d.data[1])+" kt</td></tr>";
		title+="<tr><th style='text-align:left'>Fish consumption: </th><td style='text-align:right'>"+d3.format(",")(d.data[2])+" kt</td></tr>";
		title+="<tr><th style='text-align:left'>(per capita): </th><td style='text-align:right'>"+data[d.index]+" kg/year</td></tr></tbody></table>";
		return title;
	});
svg.selectAll(".circle0").transition().duration(1000).attr("r", function(d, i) { return d.r; });
svg.selectAll(".circle0").on("mouseover",function(d) {d3.selectAll(".C"+d.index).style("visibility","visible");})
svg.selectAll(".circle0").on("mouseout",function(d) {d3.selectAll(".C"+d.index+":not(.highlighted)").style("visibility","hidden");})

svg.selectAll(".circle1")
	.data(nodes)
	.enter().append("circle")
	.attr("class",function(d) {return "C"+d.index+" circle1";})
	.style("fill", "none")
	.attr("cx", function(d) { return d.x; })
	.attr("cy", function(d) { return d.y; })
	.attr("r", function(d, i) { return Math.sqrt(d.data[0]/400); })
	.style("stroke","red")
	.style("visibility","hidden");


svg.selectAll(".circle2")
	
	.data(nodes)
	.enter().append("circle")
	.attr("class",function(d) {return "C"+d.index+" circle2";})
	.style("fill", "none")
	.attr("cx", function(d) { return d.x; })
	.attr("cy", function(d) { return d.y; })
	.attr("r", function(d, i) { return Math.sqrt(d.data[1]/10); })
	.style("stroke","blue")
	.style("visibility","hidden");
	


svg.selectAll(".circle3")
	
	.data(nodes)
	.enter().append("circle")
	.attr("class",function(d) {return "C"+d.index+" circle3";})
	
	.style("fill", "none")
	.attr("cx", function(d) { return d.x; })
	.attr("cy", function(d) { return d.y; })
	.attr("r", function(d, i) { return Math.sqrt(d.data[2]/10); })
	.style("stroke","green")
	.style("visibility","hidden");
	




function init(selection) {
	nodes = countries.features.map(function(d) {
		var xy = project(d.geometry.coordinates);
		return idToNode[d.id] = {
			x: xy[0],
			y: xy[1],
			gravity: {x: xy[0], y: xy[1]},
			r: Math.sqrt(d.properties.area/4000),
			data:[d.properties.population,d.properties.production,d.properties.consumption,d.properties.area],
			value: data[+d.id],
			name:d.properties.name
		};
});}

function initText() {
	d3.select("#stories").selectAll("button").remove();
	d3.select("#stories").selectAll("button").data(texts).enter()
		.append("button")
		.classed("btn",1)
		.attr("id",function(d) {return d.countrylabel["eng"];})
		.html(function(d) {return d.countrylabel[lang];})
		.on("click",function(d) {
			d3.select("#stories").selectAll("button").classed("active",0);
			d3.select(this).classed("active",1);
			d3.selectAll(".circle1, .circle2, .circle3").classed("highlighted",0).style("visibility","hidden");
			d.countries.forEach(function(c) {d3.selectAll(".C"+c).classed("highlighted",1).style("visibility","visible");});
			d3.select("#cPanel").select("p").html(d.text[lang]);
		})
}

function changeLang() {
	lang=(lang=='eng')?'kor':'eng';
	window.location.search="?lang="+lang;
	d3.select("#alang").html(function() {return (lang=='eng')?'Switch to Korean':'Switch to English';})
	//d3.select("#cPanel").selectAll("a").html(function(d) {return d.countrylabel[lang];})
}
initText();

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


$('circle').tipsy({html: true, gravity: 's'});