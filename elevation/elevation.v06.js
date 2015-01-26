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

			.append("svg").attr({width:width,height:height});
		

		// vis.init can be re-ran to pass different height/width values 
		// to the svg. this doesn't create new svg elements. 

		
		
		vis.projection = d3.geo.mercator()
			.scale(476033)
			.translate([162296.83978055554, 54321.43959990702]);

		vis.path = d3.geo.path().projection(vis.projection);
		vis.voronoi = d3.geom.voronoi()
			.x(function(d) {return d.x})
			.y(function(d) {return d.y})
    		.clipExtent([[0, 0], [width, height]]);

    	vis.source = -1;

		queue()
			.defer(d3.csv, params.nodes || 'nodes.csv') // labels of countries
			.defer(d3.csv, params.paths || 'paths.csv') // labels of cities
			.defer(d3.csv, params.streets || 'streets.csv') // labels of cities
    		
    		.await(vis.loaddata);
	}
		
	vis.loaddata = function(error, nodes, paths, streets) {
		console.log("data loaded.");

		vis.edges = {};
		vis.nodeList = {};

		if(!params) {params = {}}
		vis.nodes = {}; vis.points = [];
		nodes.forEach(function(n, i) {
			var xy = vis.projection([+n.lon, +n.lat]);
			var p =  {lon:+n.lon, lat:+n.lat, x: 2 * (855736 + +d3.round(xy[0])) / 1.5, y: 2 * (285589 + +d3.round(xy[1])) / 1.5, alt: +n.alt};
			p.id = n.id;
			p.color = d3.scale.linear().domain([-30,0,100,300]).range(["red", "red", "yellow", "green"])(p.alt);
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

						vis.edges[v.prevNodeRank].push({end: v.nodeRank, dist: v.dist, slope: v.slope, effort: v.dist * d3.max([1, 1 + 5 * v.slope])})
						vis.edges[v.nodeRank].push({end: v.prevNodeRank, dist: v.dist, slope: -v.slope, effort: v.dist * d3.max([1, 1 - 5 * v.slope])})


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
		.style({fill: function(d) {return d.color;}, "fill-opacity": .992, "stroke": function(d) {return d.color;}}).on("click", function(d) {console.log(d)})*/
		
		svg.selectAll("g.back").data([{}]).enter().append("g").classed("back", 1);
		svg.selectAll("g.front").data([{}]).enter().append("g").classed("front", 1);
		svg.selectAll("g.click").data([{}]).enter().append("g").classed("click", 1);


		svg.select("g.back").selectAll("g.street").data(vis.paths).enter().append("g").classed("street", 1)
			.style("stroke-width", function(d) {return 3 * d.lanes || 6;})
			.selectAll("line").data(function(d) {return d.values.slice(1)}).enter().append("line")
				.attr({
					x1: function(d) {return d.x0},
					x2: function(d) {return d.x},
					y1: function(d) {return d.y0},
					y2: function(d) {return d.y},
				})
			//	.style("stroke-width", function(d) {return d3.max([1, 30 * (d.grade)]);})
				.style("stroke", "#222")
				.style("stroke-opacity", .5)
				.style("stroke-linecap", "round")

				//.style("stroke", function(d) {return d3.scale.linear().domain([.3,.1,.01,0]).range(["red", "red", "yellow", "green"])(Math.abs(d.slope))})
	//			.on("click", function(d) {console.log(d)})
		svg.select("g.front").selectAll("g.street").data(vis.paths).enter().append("g").classed("street", 1)
			.style("stroke-width", function(d) {return 2 * d.lanes || 4;})
			.selectAll("line").data(function(d) {return d.values.slice(1)}).enter().append("line")
				.attr({
					x1: function(d) {return d.x0},
					x2: function(d) {return d.x},
					y1: function(d) {return d.y0},
					y2: function(d) {return d.y},
				})
				.style("stroke", function(d) {return scale(d.grade);})
				.style("stroke-opacity", 1)
				.style("stroke-linecap", "round")
	//	svg.selectAll("g").on("click", function(d) {console.log(d)})
		
		if (vis.mode == "to") {
			svg.selectAll("g.back line, g.front line")
			.attr({
					x1: function(d) {return vis.points[d.prevNodeRank].tox},
					x2: function(d) {return vis.points[d.nodeRank].tox},
					y1: function(d) {return vis.points[d.prevNodeRank].toy},
					y2: function(d) {return vis.points[d.nodeRank].toy},
				})
			.style("visibility", function(d) {
				return (vis.points[d.prevNodeRank].visible && vis.points[d.nodeRank].visible) ? null : "hidden";
			})
		}

		if (vis.mode == "from") {
			svg.selectAll("g.back line, g.front line")
			.attr({
					x1: function(d) {return vis.points[d.prevNodeRank].fromx},
					x2: function(d) {return vis.points[d.nodeRank].fromx},
					y1: function(d) {return vis.points[d.prevNodeRank].fromy},
					y2: function(d) {return vis.points[d.nodeRank].fromy},
				})
			.style("visibility", function(d) {
				return (vis.points[d.prevNodeRank].visible && vis.points[d.nodeRank].visible) ? null : "hidden";
			})
		}

		if (!vis.mode) {
			svg.selectAll("g.back line, g.front line")
			.attr({
					x1: function(d) {return vis.points[d.prevNodeRank].x},
					x2: function(d) {return vis.points[d.nodeRank].x},
					y1: function(d) {return vis.points[d.prevNodeRank].y},
					y2: function(d) {return vis.points[d.nodeRank].y},
				})
			.style("visibility", null)
		}

		svg.select("g.click").selectAll("path").data(vis.v).enter().append("path")
			.attr("d", vis.polygon)
			.style({visibility: "hidden", "pointer-events": "all"})
			.on("click", function(d, i) {vis.source = i; vis.recalc(i);})
	}

	vis.recalc = function(source) {
		var r0 = vis.dijkstra(vis.points, vis.edges, source, 0);
		var r1 = vis.dijkstra(vis.points, vis.edges, source, 5);
		var r2 = vis.dijkstra(vis.points, vis.edges, source, -1);

		var x0 = vis.points[vis.source].x, y0 = vis.points[vis.source].y;

		vis.points.forEach(function(d, i) {
			if (i == vis.source) {
				d.tox = x0;
				d.fromx = x0;
				d.toy = y0;
				d.fromy = y0;
				d.visible = true;
				return;
			} 
			if (r0.distances[i] === Infinity) {
				d.visible = false;
				return;
			}
			d.visible = true;
			var x1 = d.x, y1 = d.y;
			var mapDist = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
			var d0 = r0.distances[i], d1 = r1.distances[i], d2 = r2.distances[i];	
			var angle = ((y1 > y0)? 1 : -1) * Math.acos((x1 - x0) / mapDist);
			d.tox = x0 + Math.cos(angle) * mapDist * d1 / d0;
			d.fromx = x0 + Math.cos(angle) * mapDist * d2 / d0;

			d.toy = x0 + Math.sin(angle) * mapDist * d1 / d0;
			d.fromy = x0 + Math.sin(angle) * mapDist * d2 / d0;	
		})
	}

	function scale(grade) {
		if (grade > .1) return "#762a83";
		//if (grade > .15) return "#fc8d59";
		if (grade > .03) return "#af8dc3";
		return "#d9f0d3";

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
	 	var backtrack = [];
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
		 					backtrack[v] = e;
		 					Q.push(v);
		 				}
		 			})	
	 			}
	 			
	 		}
	 	}
	 	return {distances:dist, edges:backtrack};
	}
	vis.polygon = function(d) {
		if (d) {
	  		return "M" + d.join("L") + "Z";
		} else {
			return null;
		}
	}
	
})();