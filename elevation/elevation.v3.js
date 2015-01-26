(function() {
	vis={};
	var width,height;
	var chart,svg;
	var defs, style;
	var slider, step, maxStep, running;
	var button;
	var voronoi;

	var noShow = []//10665, 10671, 6570, 11050, 6534, 10673, 10669, 5216,
	//5800, 10675, 10674, 10667, 10676, 4019, 13819, 13825, 13822, 13828, 399]

	vis.init=function(params) {
		if (!params) {params = {}}
		chart = d3.select(params.chart||"#chart"); // placeholder div for svg
		width = params.width || 960;
		height = params.height || 500;
		svg = chart.selectAll("svg")
			.data([{width:width,height:height}]).enter()
			.append("svg").attr({width:width,height:height})
		//svg.append("g").classed("background", 1).append("rect").attr({width:width,height:height})
		//	.style("fill", "#B3D1FF")
		svg = svg
			.append("g").classed("main", 1)
				.attr("transform", "scale(.5)")


		vis.zoom = .5;
		
		vis.projection = d3.geo.mercator()
			.center([-122.435, 37.7589]) // box is: [-122.52, -122.35], [37.707, 37.8108]
			.scale(631900)
			.translate([937.44, 724.26]);


		vis.path = d3.geo.path().projection(vis.projection);
		vis.voronoi = d3.geom.voronoi()
			.x(function(d) {return d.x})
			.y(function(d) {return d.y})
    		.clipExtent([[0, 0], [width*2, height*2]]);

    	vis.debug = false;
    	vis.source = 0;

		queue()
			.defer(d3.csv, params.coastNodes || 'nodes.csv') // labels of countries
			.defer(d3.csv, params.coastPath || 'coastline.csv') // labels of countries
			
			.defer(d3.csv, params.nodes || 'nodes.csv') // labels of countries
			.defer(d3.csv, params.paths || 'paths.csv') // labels of cities
			.defer(d3.csv, params.streets || 'streets.csv') // labels of cities
    		
    		.await(vis.loaddata);
	}
		
	vis.loaddata = function(error, coastNodes, coastPath, nodes, paths, streets) {
		console.log("data loaded.");

		vis.edges = {};
		vis.nodeList = {};
		vis.coastNodes = {};
		coastNodes.forEach(function(n) {
			var xy = vis.projection([+n.lon, +n.lat]);
			var p =  {lon:+n.lon, lat:+n.lat, x: d3.round(xy[0]), y: d3.round(xy[1])};
			p.id = 	n.id;
			vis.coastNodes[n.id] = p;	

		});
		vis.rawcn = coastNodes;
		vis.rawcp = coastPath;
		vis.coastPath = d3.nest().key(function(d) {return d.pathId;}).entries(coastPath);

		if(!params) {params = {}}
		vis.nodes = {}; vis.points = [];
		nodes.forEach(function(n, i) {
			var xy = vis.projection([+n.lon, +n.lat]);
			var p =  {lon:+n.lon, lat:+n.lat,  x: d3.round(xy[0]), y: d3.round(xy[1]), alt: +n.alt, name: n.streets};
			p.id = n.id;
			//p.color = d3.scale.linear().domain([-30,0,100,300]).range(["red", "red", "yellow", "green"])(p.alt);
			vis.nodes[n.id] = p
		})
		vis.streets = streets;
		vis.rawPaths = paths;
		var prevNodeId = -1;
		var prevStreet = -1;
		var dupes = 0;
		



		paths.forEach(function(d, i) {
			if (i && d.nodeId == prevNodeId && d.streetId == prevStreet) {
				d.donotkeep = 1; dupes++;
			} // removing duplicates
			
			var p = vis.nodes[d.nodeId];
				d.lon = p.lon, d.lat = p.lat, d.x = p.x, d.y = p.y, d.alt = p.alt; 
			d.prevNodeId = prevNodeId;
			
			prevNodeId = d.nodeId;
			prevStreet = d.streetId;

		})
	// ok whatever

		paths = paths.filter(function(d) {return !d.donotkeep;})
		console.log(dupes, "segments removed.")

		paths.forEach(function(d) {
			if (!vis.nodeList[d.nodeId]) {vis.nodeList[d.nodeId] = {};}
		})
		vis.nodeList = d3.keys(vis.nodeList);
		vis.nodeHash = {};
		vis.nodeList.forEach(function(d, i) {
			vis.nodeHash[d] = i;
			vis.points[i] = vis.nodes[d];
		})



		
		
		vis.paths = d3.nest()
			.key(function(d) {return d.streetId})
			.entries(paths)
			.filter(function(d) {
			//	if (d.values.length == 2) {
			//		if (d.values[0].nodeId == d.values[1].nodeId) {
			//			return false;
			//		}
			//	}
				return true; 
			})

		vis.edgesArray = [];

		vis.paths.forEach(function(d) {
			var lat0, lon0, alt0, prevNodeId;
			d.osmid = +vis.streets[d.key].osmid;
			
			d.lanes = +vis.streets[d.key].lanes;
			d.name = vis.streets[d.key].name;
			d.values.forEach(function(v, i) {
				if (i) {
					lat1 = v.lat;
					lon1 = v.lon;
					alt1 = v.alt;
					v.x0 = x0;
					v.y0 = y0;
					if (lat1 == lat0 && lon1 == lon0) {v.dist = 0; v.grade = 0;}
					else {
						v.dist = distance(lat0,lon0,lat1,lon1); v.slope = (alt0 - alt1) / v.dist; v.grade = Math.abs(v.slope);
						v.nodeRank = vis.nodeHash[v.nodeId];
						v.prevNodeRank = vis.nodeHash[v.prevNodeId];

						
						if (!vis.edges[v.prevNodeRank]) {vis.edges[v.prevNodeRank] = [];}
						if (!vis.edges[v.nodeRank]) {vis.edges[v.nodeRank] = [];}

						
						var e1 = {lanes: d.lanes, start: v.prevNodeRank, end: v.nodeRank, dist: v.dist, slope: v.slope};
						var e2 = {lanes: d.lanes, start: v.nodeRank, end: v.prevNodeRank, dist: v.dist, slope: -v.slope}
						e1.grade = Math.abs(v.slope);
						e2.grade = e1.grade;
						
						vis.edges[v.prevNodeRank].push(e1);
						vis.edges[v.nodeRank].push(e2);
						vis.edgesArray.push(e1);
					}
				} 
				lat0 = v.lat;
				lon0 = v.lon;
				alt0 = v.alt;
				x0 = v.x;
				y0 = v.y;
			})
			d.dist = d3.sum(d.values, function(v) {return v.dist});
			d.maxgrade = d3.max(d.values, function(v) {return v.grade});
		})

		vis.v = vis.voronoi(vis.points);
		vis.drawCoast();

	}
	vis.drawCoast = function() { /*
		svg.selectAll("path").data(vis.coastPath).enter().append("path")
			.attr("d", function(d) {
				myPath = ""
				d.values.forEach(function(v, i) {
					var n = vis.coastNodes[v.nodeId]
					if (i) {myPath = myPath + "L"} else {myPath = myPath + "M"}
					myPath = myPath + n.x + "," + n.y;
				})
				myPath = myPath + "Z";
				return myPath
			})
			.style({stroke: "none", fill: "#DFE5DC"}) */
			vis.draw();
	}
	vis.draw = function() {
		/*svg.selectAll("path").data(vis.paths).enter().append("path")
			.attr("d", function(d) {
				return d3.svg.line()
					.x(function(d) {return d.x})
					.y(function(d) {return d.y})
					(d.values)
				})
			.style({fill: "none", 
				stroke: function(d) {if (noShow.indexOf(+d.key) > -1) {return "none";} else {return "steelblue";}}, "stroke-width": 1, opacity: .8})
			.on("click", function(d) {console.log(d);})

		svg.selectAll("circle").data(vis.points).enter().append("circle").attr({cx: function(d) {return d.x}, cy: function(d) {return d.y}, r:2})
		.style({fill: function(d) {return d.color;}, "fill-opacity": .992, "stroke": function(d) {return d.color;}}).on("click", function(d) {console.log(d)})
		*/
		svg.selectAll("g.back").data([{}]).enter().append("g").classed("back", 1);
		svg.selectAll("g.front").data([{}]).enter().append("g").classed("front", 1);
		svg.selectAll("g.edges").data([{}]).enter().append("g").classed("edges", 1);
		svg.selectAll("g.click").data([{}]).enter().append("g").classed("click", 1);


		svg.select("g.back").selectAll("line.street").remove();
		svg.select("g.front").selectAll("line.street").remove();
		

		svg.select("g.back").selectAll("line.street").data(vis.source ? vis.shortestPath : vis.edgesArray).enter()
			.append("line").classed("street", 1)
				.attr({
					x1: function(d) {return vis.points[d.start].x},
					x2: function(d) {return vis.points[d.end].x},
					y1: function(d) {return vis.points[d.start].y},
					y2: function(d) {return vis.points[d.end].y},
				})
				.style("stroke-width", function(d) {return d3.min([8, 3 * d.lanes]) || 6;})
				.style("stroke", function(d) {return scale(d.grade);})
				.style("stroke", "#222")
				.style("stroke-opacity", 1)
				.style("stroke-linecap", "round")

		svg.select("g.front").selectAll("line.street").data(vis.source ? vis.shortestPath : vis.edgesArray).enter()
			.append("line").classed("street", 1)
				.attr({
					x1: function(d) {return vis.points[d.start].x},
					x2: function(d) {return vis.points[d.end].x},
					y1: function(d) {return vis.points[d.start].y},
					y2: function(d) {return vis.points[d.end].y},
				})
				.style("stroke-width", function(d) {return 2 * d.lanes || 4;})
				.style("stroke", function(d) {return scale(d.grade);})
				.style("stroke-opacity", 1)
				.style("stroke-linecap", "round")
	
		

		var polys = svg.select("g.click").selectAll("path").data(vis.v).enter().append("path")
			.attr("d", vis.polygon)
			.style({
				"stroke": "#222",
				"fill": "#fff",
				"opacity": .5,
				//visibility: "hidden", 
				"pointer-events": "all"});
		


		polys.on("click", function(d, i) {
				if (vis.source) {
					vis.source = 0;
					d3.select("#from #sourceNode, #from #and, #from #destNode").html("");
					svg.select("g.edges").selectAll("*").remove();
					d3.select("#subtitle").html("Click anywhere on the map to show the streets you should take from there.")
				} else {
					d3.select("#subtitle").html("Mouseover anywhere on the map to see how to get there with least effort.")
					
					vis.source = i; 
					vis.recalc(i);
				/*	svg.select("g.edges").selectAll("circle.source")
					.data([
						{r: 10, fill: "#fff", stroke: "#222"},
						{r: 5, fill: "#222", stroke: "#none"}
					]).enter().append("circle").classed("source", 1)
					.attr({cx: vis.points[i].x, cy: vis.points[i].y, r: function(d) {return d.r;}})
					.style({fill: function(d) {return d.fill}, stroke: function(d) {return d.stroke;}})*/


				}
				vis.draw();
			})
		/*polys.on("mouseover", function(d, i) {
			if (vis.source && vis.distances[i] != Infinity) {
					d3.select("#from #and").html(" to ");
					d3.select("#from #destNode").html(vis.points[i].name);
				var myPath = vis.myPath = [];
				var node = i;
				while (node != vis.source) {
					var e = vis.backtrack[node];
					myPath.push(e);
					node = e.start;
				}
				svg.select("g.edges").selectAll("line").remove();
				svg.select("g.edges").selectAll("line").data(myPath).enter().append("line")
				.attr({
					x1: function(d) {return vis.points[d.start].x},
					x2: function(d) {return vis.points[d.end].x},
					y1: function(d) {return vis.points[d.start].y},
					y2: function(d) {return vis.points[d.end].y},
				})
				.style("stroke", "#B2FBFF")
				.style("stroke-width", 6)
				.style("stroke-linecap", "round");

				svg.select("g.edges").selectAll("circle.dest")
					.data([
						{r: 10, fill: "#fff", stroke: "#222"},
						{r: 5, fill: "#222", stroke: "#none"}
					]).enter().append("circle").classed("dest", 1)
					.style({fill: function(d) {return d.fill}, stroke: function(d) {return d.stroke;}});
				svg.select("g.edges").selectAll("circle.dest")
					.attr({cx: vis.points[i].x, cy: vis.points[i].y, r: function(d) {return d.r;}})


			} else {
				d3.select("#from #sourceNode").html(vis.points[i].name);
			}
		})
		polys.on("mouseout", function(d, i) {
				svg.select("g.edges").selectAll("line").remove();

		})*/


	}

	vis.recalc = function(source) {
		var r1 = vis.dijkstra(vis.points, vis.edges, source, 20);
		vis.distances = r1.distances;
		vis.shortestPath = r1.edges;
		vis.backtrack  = r1.backtrack;
		vis.draw();

	}

	function scale(grade) {
		if (grade > .1) return /*"#FF003C"*/"#762a83";
		//if (grade > .15) return "#fc8d59";
		if (grade > .03) return /*"#FABE28"*/"#af8dc3";
		return /*"#88C100";*/"#d9f0d3";

	}
	function distance(lat1, lon1, lat2, lon2) {
	    var radlat1 = Math.PI * lat1/180
	    var radlat2 = Math.PI * lat2/180
	    var radlon1 = Math.PI * lon1/180
	    var radlon2 = Math.PI * lon2/180
	    var theta = lon1-lon2
	    var radtheta = Math.PI * theta/180
	    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	    dist = Math.acos(dist)
	    dist = dist * 180/Math.PI
	    dist = dist * 60 * 1.1515 * 1.609344 * 1000;
	    return dist
	}

	vis.dijkstra = function(n, e, s, coeff) {
		var nodes = n || [{"node":0},{"node":1},{"node":2},{"node":3}];
		var edges = e || {0: [{end: 1, dist: 10}, {end: 2, dist: 20}], 1: [{end: 2, dist: 5}, {end: 0, dist: 10}], 2: [{end: 0, dist: 20}, {end: 1, dist: 5}]};
		
		var c = coeff || 0;
		var dist = d3.range(nodes.length).map(function() {return Infinity;})
	 	var usedEdges = [];
	 	var backtrack = {};
	 	dist[s] = 0;
	 	var Q = new BinaryHeap(function(v) {return dist[v];})

	 	nodes.forEach(function(v, i) {Q.push(i);})
	 	var breakloop = false;
	 	while (Q.size && !breakloop) {
	 		var u = Q.pop(), du = dist[u];
	 		if (du === Infinity || !Q.size()) {
	 			breakloop = true;
	 		} else {
	 			if(!edges[u]) {console.log(u)} else {
	 				edges[u].forEach(function(e) {
		 				var alt = du + e.dist * (1 + c * (e.slope > 0 ? e.slope : 0)); 
						var v = e.end;
						if(alt < dist[v]) {
		 					Q.remove(v);
		 					dist[v] = alt;
		 					usedEdges.push(e);
		 					backtrack[v] = e;
		 					Q.push(v);
		 				}
		 			})	
	 			}
	 			
	 		}
	 	}
	 	return {distances:dist, edges:usedEdges, backtrack: backtrack};
	}
	vis.polygon = function(d) {
		if (d) {
	  		return "M" + d.join("L") + "Z";
		} else {
			return null;
		}
	}
	function debug(d) {
		if (vis.debug) {console.log(d);}
	}
	
})();