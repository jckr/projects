// fish kg per capita
var data=[5.3,5.2,16.4,52.1,6.4,2.1,24.2,13.4,1.7,30.3,14.9,43.4,15.6,24.5,12.5,7.8,38.1,1.7,6.8,3,6.9,34.4,4.2,1.8,1.8,25,13.9,23.8,11.6,3.6,5.9,20.1,26.5,5.5,19.7,22.7,7.5,13.9,15.3,8.7,22.6,10.4,11.6,5.5,24.5,1,27.1,10.8,4.4,16.7,6.9,0.8,16.4,0.2,35.8,31.7,34.8,47.6,34.9,28,8.4,14.8,29.6,21.1,37,2.2,10.4,1.6,33.3,4,3,87.4,5.1,24.3,7.1,21.4,20.6,24.4,30.6,60.8,5.7,2.9,3.5,74.6,12.4,2.3,18.5,12.6,9.4,0,5,9.9,37.6,27.8,7.4,5,50.1,176.5,8.5,30.2,17.2,20.6,10.8,0.2,9.6,2.2,25.5,14.7,1.5,19,20.7,20.3,26.4,4.7,3.3,9,51.4,0.7,1.9,12.2,4,21.4,32.4,9.5,54.8,52.7,12.1,5.3,18.9,2.1,31.4,40.5,16.2,46.3,22.8,9,24.3,64.3,26.1,8,9.4,30.1,7.6,40,21.7,1.7,15.1,6.5,28.5,15,2.1,0.3,30.9,4.8,0.3,7,14.4,13,6.9,3.3,15.6,16.9,22.6,20.3,5.1,24.1,9.3,0.3,30.3,16.6,26.1,4.6,6.2,1.3];

var color = d3.scale.linear()
	.domain([-1,0, 50])//d3.max(data)])
	//.range(["#eee","#ECFAFE", "#066E88"]); 
	.range(["#eee","#eee", "#B84C49"]); 

var force = d3.layout.force()
	.charge(0)
	.gravity(0)
	.size([960, 500]);

var svg = d3.select("#chart").append("svg")
	.attr("width", 960 + 100)
	.attr("height", 500 + 100)
	.append("g")
	.attr("transform", "translate(50,50)");
svg.append("rect").attr("x",-50).attr("y",-50).attr("width",1060).attr("height",500).style("fill","#C5F1FC");



var project = d3.geo.mercator().scale(1000),//albers(),
idToNode = {},
links = [],
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
});
d3.select("#area").on("click",function() {
	
	d3.selectAll("button").classed("active",0);
	d3.select("#area").classed("active",1);
	nodes.forEach(function(node) {node.r=Math.sqrt(node.data[3]/3000);});
	svg.selectAll("circle").data(nodes).transition().duration(1000).attr("r",function(d){return d.r;});

	d3.select("#legend").html("Area in km&sup2;");
	
	force.start();
});
d3.select("#population").on("click",function() {
	
	d3.selectAll("button").classed("active",0);
	d3.select("#population").classed("active",1);
	nodes.forEach(function(node) {node.r=Math.sqrt(node.data[0]/400);});
	svg.selectAll("circle").data(nodes).transition().duration(1000).attr("r",function(d){return d.r;});

	d3.select("#legend").html("Population in thousands");
	
	force.start();
});

d3.select("#production").on("click",function() {
	d3.selectAll("button").classed("active",0);
	d3.select("#production").classed("active",1);
	nodes.forEach(function(node) {node.r=Math.sqrt(node.data[1]/10);});
	svg.selectAll("circle").data(nodes).transition().duration(1000).attr("r",function(d){return d.r;});
	
	d3.select("#legend").html("Fish production (thousands of tonnes)");
	
	force.start();
});

d3.select("#consumption").on("click",function() {
	d3.selectAll("button").classed("active",0);
	d3.select("#consumption").classed("active",1);
	nodes.forEach(function(node) {node.r=Math.sqrt(node.data[2]/10);});
	svg.selectAll("circle").data(nodes).transition().duration(1000).attr("r",function(d){return d.r;});
	
	d3.select("#legend").html("Fish consumption (thousands of tonnes)");
	
	force.start();
});

force
	.nodes(nodes)
	.links(links)
	.start()
	.on("tick", function(e) {
		var k = e.alpha,
		kg = k * 0.02;
		nodes.forEach(function(a, i) {
			// Apply gravity forces.
			a.x += (a.gravity.x - a.x) * kg;
			a.y += (a.gravity.y - a.y) * kg;
			nodes.slice(i + 1).forEach(function(b) {
				// Check for collisions.
				var dx = a.x - b.x,
				dy = a.y - b.y,
				l = Math.sqrt(dx * dx + dy * dy),
				d = a.r + b.r;
				if (l < d) {
					l = (l - d) / l * k;
					dx *= l;
					dy *= l;
					a.x -= dx;
					a.y -= dy;
					b.x += dx;
					b.y += dy;
				}
			});
		});
		svg.selectAll("circle")
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; });
});

svg.selectAll("circle")
	.data(nodes)
	.enter().append("circle")
	.style("fill", function(d) { return color(data[d.index]/*d.value*/); })
	.attr("cx", function(d) { return d.x; })
	.attr("cy", function(d) { return d.y; })
	.attr("r", function(d, i) { return d.r; })
	.append("title")
	.text(function(d) {
		//console.log(d);
		var title='<div style="text-align:left;"><b>'+d.name+"</b>: <br>";
		title+="Population: "+d.data[0]+"000<br>";
		title+="Fish production: "+d.data[1]+" thousand tonnes<br>";
		title+="Fish consumption: "+d.data[2]+" thousand tonnes<br>";
		title+="Fish consumption/capita: "+data[d.index]+" kg/year</div>";
		return title;
	});


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

$('circle').tipsy({html: true, gravity: 's'});