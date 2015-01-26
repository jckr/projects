var width=960,height=800;
var svgMap=d3.select("#chart")
	.append("svg")
	.attr("width",width)
	.attr("height",height);
var myScale=1;
var dist,avg;
var timeScale=d3.scale.linear().domain([1000,1500,2500]).range(["white","yellow","red"]);
var traScale=d3.scale.sqrt().domain([0,50000000]).range([0,15]);
var edgeScale=d3.scale.linear().domain([0,.01]).clamp([true]).range([1,5]);
var projection=d3.geo.mercator()
	//.translate([-5500, 139300])
	.translate([524	,450])
	//center([480,500])
	.center([2.348785,48.853402])
	.scale(1100000)
	//.scale(891443.7768152277);
var geoCheck=false;

var ratpColors={"Acacia":"#CDC83F","Azur":"#216EB4","Bouton d'Or":"#F2C931","Cobalt":"#4E90CC","Coquelicot":"#D35E3C","Iris":"#67328E","Lilas":"#C5A3CA","Marron":"#8E6538","Menthe":"#79BB92","Ocre":"#DFB039","Olive":"#9A9940","Orange":"#DE8A53","Parme":"#BB4D98","Pervenche":"#89C7D6","Rose":"#DF9AB1","Sapin":"#328E5B"};
var lineColors={1:"Bouton d'Or",2:"Azur",3:"Olive","3bis":"Pervenche",4:"Parme",5:"Orange",6:"Menthe",7:"Rose","7bis":"Menthe",8:"Lilas",9:"Acacia",10:"Ocre",11:"Marron",12:"Sapin",13:"Pervenche",14:"Iris"}

var defs=svgMap.append("defs");

// reading data to create clipping path

d3.csv("parisLimits.csv",function(error,coordinates) {
	var perimeter=[];
	coordinates.forEach(function(c) {
		perimeter.push(projection([+c.lon,+c.lat]));
	});
	perimeterPath="M" + perimeter.join("L") + "Z";
	defs.append("clipPath").attr("id","Paris")
		.append("path").attr("d",perimeterPath);
});

svgMap.append("rect").style("fill","#fafafa").style("stroke","none").attr("width",width).attr("height",height).attr("class","bkgd")
/*.on("click",function() {
	d3.selectAll(".station").transition().style({
		fill:function(d,i) {return timeScale(avg[i]);}
	})
})*/

// these variables store the selected district and polling station
var polyBV,polyS;
var selected=null;
var selectedBV=null;

// let the voronoi magic begin. 
var backCircles=svgMap.append("g");
var cellSta = svgMap.append("g").attr({width:width,height:height})
    .attr("id", "Sta")
    //.style("clip-path", "url(#Paris)"); // clipped;


var cells = svgMap.append("g").attr({width:width,height:height})
    .attr("id", "cells").style("clip-path", "url(#Paris)"); // clipped;

var staCircleLayer=svgMap.append("g").attr("id","staCircleLayer")
var frame=svgMap.append("g");
frame.append("rect").attr({width:width,height:height}).style({fill:"none",stroke:"#bbb"});
frame.append("rect").attr({width:width-2,height:height-2,x:1,y:1}).style({fill:"none",stroke:"white"});


var positions,pos2;
var data,stations,edges,nodes,edgeArr,bv;

queue()
    .defer(d3.csv, "parisBV.csv")
    .defer(d3.csv, "stations.csv")
    .defer(d3.csv, "edges.csv")
    .defer(d3.csv, "nodes.csv")
    .await(ready);
// reading data for polling station

function ready(error, bv,s,e,n) {
	d3.select(".bkgd").on("click",function() {repos(s,e);});
	d3.select("#geo").on("change",function() {
		geoCheck=!geoCheck;
		reinit(geoCheck,s,e)
	})
	pos2=[]
	s.forEach(function(d) {
		//pos2.push(projection([+s.lon,+s.lat]));
		var geo=projection([+d.lon,+d.lat]);
		d.projx=d3.scale.linear().domain([0,7500]).range([0,800])(d.ratpx);
		d.projy=d3.scale.linear().domain([0,7500]).range([0,800])(d.ratpy);
		d.ratpx=d.projx;d.ratpy=d.projy;
		d.geox=geo[0],d.geoy=geo[1];
		
		d.ox=d.projx,d.oy=d.projy;
		pos2.push([
			d.projx+Math.random()-.5,
			d.projy+Math.random()-.5])
	})
	var totalT=d3.sum(s,function(d) {return d.trafic;})

	edgesStart=d3.nest().key(function(d) {return d.start;}).map(e);
	
	e.forEach(function(e,i) {
		e.id=i;
		e.start=+e.start;
		e.end=+e.end;
		e.length=+e.length;
		e.s1=n[e.start].station;
		e.s2=n[e.end].station;
		var t1=+s[e.s1].trafic/edgesStart[s[e.s1].main].length;
		var t2=+s[e.s2].trafic/edgesStart[s[e.s2].main].length;
		//console.log(s[e.s1].main,edgesStart[s[e.s1].main].length)
		e.share=(t1+t2)/totalT;
	})

	reticulate(e,s);

	stations=s;	
	nodes=n;	
	edges=e;

	edgesStart=d3.nest().key(function(d) {return d.start;}).map(e);
	edgesEnd=d3.nest().key(function(d) {return d.end;}).map(e);

	edgesC=e.filter(function(d) {if(["entrance","exit","correspondance"].indexOf(d.type)===-1) {
		d.color=ratpColors[lineColors[d.type]];return true}})
	
	dist=calcDist(n,edgesStart,s);

	/*positions = [];
	bv.forEach(function(d) {d.ocir=d.cir;d.tcir=d.cir;});
	
	
	bv.forEach(function(b) {
		positions.push(projection([+b.clon, +b.clat])); // position of the centroid of the addresses of this polling station.
	});
	

	// Compute the Voronoi diagram of polling stations projected positions.
	//var 
	polyBV = d3.geom.voronoi(positions);*/
	//var 
	polyS  = d3.geom.voronoi(pos2);
	//areaS = polyS.map(areaPoly);
	/*var g1 = cells.selectAll("g").data(bv).enter()
		.append("g")
		.attr("class",function(d) {return "C"+d.cir;});  // class corresponds to circonscription number.
	*/
	//var g2 = cellSta.selectAll("g").data(stations).enter().append("g").attr("class","stations")
	var g3 = staCircleLayer.selectAll("circle").data(stations).enter()
	/*g2
		.append("path")
		.attr("class","station")
		.attr("id",function(d,i) {return "s"+i})
		.style({fill:function(d,i) {return d3.scale.linear().domain([0,1500,20000]).range(["white","#CCC","blue"])(d.trafic/areaS[i]);}})
		.attr("d", function(d, i) { return "M" + polyS[i].join("L") + "Z"; });
	*/
	g3
		.append("circle").attr("class","staCircles")
		.style({fill:function(d,i) {return timeScale(dist[i].avg);},stroke:"black"})
		.attr("cx", function(d, i) { return d.projx; })
		.attr("cy", function(d, i) { return d.projy; })
		.attr("r",function(d,i) {return d.corr*2+3;/*traScale(stations[i].trafic)*/} )
		.append("title").text(function(d) {return d.name;});


	d3.selectAll(".staCircles")
		/*.on("click",function(d,i) {
			d3.selectAll(".station").transition().style("fill",function(e,j) {
				//console.log(i,j);
				return timeScale(dist[i].distances[j]);
			})
		})*/
		.on("click",function(d) {repos(s,e,d,dist);})
		
	cellSta.selectAll("path").data(edgesC).enter().append("path").classed("lignes",1)
		.attr("d",function(d) {return d.path;})
		.style({"stroke-width":function(d) {return edgeScale(d.share);}, "stroke":function(d) {return d.color;}})
		//.on("click",function(d) {var t=d.type;d3.selectAll(".lignes").transition().style("opacity",function(x) {return (x.type===t)?1:.2;})})	

	// this is background...
/*	g1
		.append("path")
		.attr("class","bkg")
		.style("fill","#eee")
		.style("stroke","#ccc")//.style("stroke-width",1)
		.attr("d", function(d, i) { return "M" + polyBV[i].join("L") + "Z"; });

	// next, circles... 
/
	
	g1
		.append("path")
		.attr("class", "cell")
		.attr("id",function(d) {return "b"+d.code;})
		.style({fill:"#222",opacity:function(d) {return d3.scale.linear().domain([0,2000]).range([0,.5])(d.insT2);}})
		//.style("fill",function(d) {return cScale(d,myScale);})
		//.style("stroke",function(d) {return cScale(d,myScale);})
		//.style("stroke-width",1)
		.attr("d", function(d, i) { return "M" + polyBV[i].join("L") + "Z"; })
		//.append("title").text(function(d,i) {return i+" "+d.code+" "+d.arr+" "+d.cir;}) // - used only for debug
		;
*/	
	

//	initDijkstra();
	
	function cScale(d,scaleType){
			if (scaleType===1) {return d3.scale.linear().domain([0,2000]).range(["white","black"])(d.insT2);}
			if (scaleType===2) {return cirScale(d.cir);}
			if (scaleType===3) {return arrScale(d.arr);}
			return d3.scale.linear().domain([0,.5,1]).range(["blue","#eee","red"])(+d.holT2/(+d.holT2+(+d.sarT2)));
	}	
}

function insert(v,heap,f) {
	var n=heap.length;
	var fn;
	if(typeof(f)==="undefined") {fn=function(d) {return d;}} else {fn=f};
	
	var r,l;
	l=n;
	h=heap.slice(0);
	r=findrank(v,heap,fn,0,n);
	//console.log(r);
	return heap.slice(0,r).concat(v).concat(heap.slice(r,n));


	function findrank(v,h,f,min,max) {
		//console.log(min,max);
	if(min==max) {
		return min;
	}
	if(min==max-1) {
		if(f(v)>f(h[min])) {return max;} else {return min;}
	}
	i=Math.floor((min+max)/2);
	if(f(v)>f(h[i])) {return findrank(v,h,f,i,max);}
	else {return findrank(v,h,f,0,i);}
	}
}

function remove(v,heap) {
	var n=heap.length;
	
	var r,l;
	l=n;
	h=heap.slice(0);
	r=findrank(v,heap,0,n);
	//console.log(r);
	return heap.slice(0,r).concat(heap.slice(r+1,n));


	function findrank(v,h,f,min,max) {
		//console.log(min,max);
	if(min==max) {
		return min;
	}
	if(min==max-1) {
		if(f(v)>f(h[min])) {return max;} else {return min;}
	}
	i=Math.floor((min+max)/2);
	if(f(v)>f(h[i])) {return findrank(v,h,f,i,max);}
	else {return findrank(v,h,f,0,i);}
	}
}


function getmin(heap) {
	return heap.splice(0,1)[0];
}

function reticulate(edges,stations) {
	// splines love reticulating
	edges.forEach(function(e) {
		e.p1=[stations[e.s1].projx,stations[e.s1].projy];
		e.p2=[stations[e.s2].projx,stations[e.s2].projy];
		if(!e.o1) {e.o1=e.p1;e.o2=e.p2; // original positions
		}
		e.path="M"+e.p1.join(",")+"L"+e.p2.join(",");
	})
}
function reinit(geoCheck,stations,edges) {
	stations.forEach(function(d) {
		if (geoCheck) {d.ox=d.geox;d.oy=d.geoy} else {d.ox=d.ratpx;d.oy=d.ratpy;} 
	})
	repos(stations,edges);
}
function present(seconds) {
	var s=Math.floor(seconds%60);
	var t=Math.floor(seconds/60)+" minutes "+(s?s+(s>1?" secondes":" seconde"):"")
	return t; 
}

function repos(stations, edges, s, dist) {
	// reposition all the things
	if(!s) {
		d3.select("h1").html("Plan interactif du métro").style("font-size",null)
		d3.select("em").html("Cliquez sur une station pour voir les temps de trajet")
		stations.forEach(function(d) {
			d.projx=d.ox;
			d.projy=d.oy;
		})
		reticulate(edges,stations);
		d3.selectAll(".staCircles").on("mouseover",null);
		d3.selectAll(".staCircles").on("mouseout",null);
		backCircles.selectAll("*").transition().duration(1000).style("opacity",0).remove();
		d3.selectAll(".staCircles").transition().duration(1000).attr({cx:function(d) {return d.projx},cy:function(d) {return d.projy}});
		d3.selectAll(".lignes").transition().duration(1000).attr("d",function(d) {return d.path;}).style("opacity",1)
	} else {
		d3.select("h1").html(s.name).style("font-size",function() {if(s.name.length>25) {return "30px"} else {return "36px"}})
		d3.select("em").html("Temps de trajet moyen: "+present(dist[s.station].avg))
		var x0=s.ox,
			y0=s.oy,
			maxDist=d3.max(dist[s.station].distances);

		var distScale=d3.scale.linear().domain([0,maxDist]).range([0,400]);

		var solution=dist[s.station].edges.map(function(d) {return d.id;})

		stations.forEach(function(d) {
			if (d===s) {
				d.projx=(width/2);	// selected station will move to center
				d.projy=(height/2);
			} else {
				var x1=d.ox,	//	position of the other station
					y1=d.oy,	//
					mapDist=Math.sqrt((x0-x1)*(x0-x1)+(y0-y1)*(y0-y1)), // original distance as drawn on the map
					angle=((y1>y0)?1:-1)*Math.acos((x1-x0)/mapDist);
					time=distScale(dist[s.station].distances[d.station]); // time necessary for travel, scaled
					d.projx=(width/2)+Math.cos(angle)*time;
					d.projy=(height/2)+Math.sin(angle)*time;
			}
		})
		reticulate(edges,stations);

		d3.selectAll(".staCircles").transition().duration(1000).attr({cx:function(d) {return d.projx},cy:function(d) {return d.projy}});
		d3.selectAll(".lignes").transition().duration(1000).attr("d",function(d) {return d.path;})
			.style("opacity",function(d) {if (solution.indexOf(d.id)>-1) {return 1;} else {return 0;}})
		radii=d3.range(Math.ceil(maxDist/300)+1).reverse();
		backCircles.selectAll("circle").data(radii).enter().append("circle").attr({cx:width/2,cy:height/2}).style("fill","white");
		backCircles.selectAll("circle").data(radii).exit().remove();
		backCircles.selectAll("circle").transition().duration(1000).attr("r",function(d) {return distScale(d*300);})
		.style({
			stroke:function(d,i) {
			//	return d3.scale.linear().domain([0,5,15]).range(["white","yellow","red"])(d+3);
			//	return (i%2)?"#ccc":"#fff";
			return "#bbb"
			},
			fill:function(d,i) {
			//	return d3.scale.linear().domain([0,5,15]).range(["white","yellow","red"])(d);
				return (i%2)?"#ccc":"#fff";
			}
		})
		backCircles.on("click",function() {repos(stations,edges)})

		d3.selectAll(".staCircles").on("mouseover", function(d) {

			// we reconstruct the path 

			var dest=d.main;
			var path=[];
			var myEdges=dist[s.station].edges;
			var edge=myEdges[dest];
			if(d.main!=s.main) {
			while(edge.start!=s.main) {
				path.push(edge.id);
				edge=myEdges[edge.start];
			}
			console.log(path);


			d3.selectAll(".lignes").transition()
			//.duration(1000)
			.attr("d",function(d) {return d.path;}) // this is necessary to repeat b/c in case of accidental mouseover during transformation, the edges would stop moving
			.style("opacity",function(l) {
				if (solution.indexOf(l.id)>-1) { // edge to be displayed
					if(path.indexOf(l.id)>-1) {	// edge to be displayed AND in shortest path
						return 1;
					} else {
						return .1;	// edge not in shortest path from center to highlighted point
					}
				} else {return 0;}	// edge not to be displayed
			})}
			d3.select("em").html("Temps vers "+d.name+" : "+present(dist[s.station].distances[d.station]))

		})
		d3.selectAll(".staCircles").on("mouseout", function() {
			d3.select("em").html("Temps de trajet moyen: "+present(dist[s.station].avg))
			d3.selectAll(".lignes").transition()
			//.duration(1000)
			.attr("d",function(d) {return d.path;}) // ditto 
			.style("opacity",function(d) {if (solution.indexOf(d.id)>-1) {return 1;} else {return 0;}})
		})
	}	
}

function calcDist(nodes,edges,stations) {
	var dist=[];
	
	// running n dijkstras is much much faster than 1 floyd warhsall in that case.

	//dist=floydWarshall(nodes,edges,edgeArr); // o(n^3), exactly 314 896 769 cycles.
	//dist=dist.slice(381,680);
	//dist.forEach(function(d) {d=d.slice(381,680)})

	stations.forEach(function(s) {
		myDist=dijkstra(nodes,edges,s.main); // m log n, bitches. That's about 3 293 728 cycles. 100 x faster
		dist.push({distances:myDist.distances.slice(381,680),edges:myDist.edges,avg:d3.mean(myDist.distances)});	
	})

	return dist;
}

function floydWarshall(nodes,edges,edgeArr) {
	var a=[],b=[];

	n=nodes.map(function(v) {return v.node;})
	
	// initializing the array
	n.forEach(function(i) {
		a.push(n.map(function(j) {return (i==j)?0:Infinity;}));
	})

	edgeArr.forEach(function(e) {
		a[e.start][e.end]=e.length
	})
	//console.log("array initialized.")
	n.slice(1,n.length).forEach(function(k) {
		b=a.slice(0);
		console.log(k);
		n.forEach(function(i) {
			n.forEach(function(j) {
				a[i][j]=d3.min([
					b[i][j], 
					b[i][k]+b[k][j]
				])
			})
		})
	})
	//console.log("done")
	return a;
}

function johnson(nodes,edges) {
	// untested.
/*
	var n=nodes.length;
	var dist=[];
	var GprimeV=nodes.slice(0).push({node:n});
	var GprimeE=edges.slice(0);
	nodes.forEach(function(d) {GprimeE.push({start:n,end:d.node,length:0})})
	var GprimeEend=d3.nest().key(function(d) {return d.end;}).map(GprimeE);
	var p=bellmanFord(GprimeV,GprimeEend,n);
	Eprime=edges.map(function(e) {
		start:e.start,
		end:e.end,
		length:e.length+p[e.start]-p[e.end];
	})
	var EprimeStart=d3.nest().key(function(d) {return d.start;}).map(Eprime);
	nodes.forEach(function(u) {
		myDist=dijkstra(nodes,EprimeStart,u.node);
		myDist.distances.forEach(function(d,v) { // note: supposes nodes are 0,1,2,3,...,n
			d=d-p[u.node]+p[v];
		})
	 })`*/
}

function bellmanFord(nodes,edges,s) {
	var n=nodes.length;
	var a=d3.range(n).map(function() {return Infinity;});
	a[s]=0;
	b=a.slice(0);
	d3.range(1,n).forEach(function(i) {
		d3.range(0,n).forEach(function(v) {
			a[v]=b[v];
			edges[v].forEach(function(e) {
				if(b[e.start]+e.length<a[v]) {a[v]=b[e.start]+e.length}
			})
		})
		b=a.slice(0)
	})
	return a;
}

function dijkstra(nodes,edges,s) {
	var dist=d3.range(nodes.length).map(function() {return Infinity;})
 	var backtrack=[];

 	dist[s]=0;
 	var Q=new BinaryHeap(function(v) {return dist[v];})

 	nodes.forEach(function(v) {Q.push(+v.node);})
 	var breakloop=false;
 	while (Q.size&&!breakloop) {
 		var u=Q.pop(),du=dist[u];
 		if(du===Infinity||!Q.size()) {
 			breakloop=true;
 		} else {
 			edges[u].forEach(function(e) {
 				var alt=du+e.length;
 				var v=+e.end;
 				if(alt<dist[v]) {
 					Q.remove(v);
 					dist[v]=alt;
 					backtrack[v]=e;
 					Q.push(v);
 				}
 			})
 			//console.log(Q.size());
 		}
 	}
 	return {distances:dist,edges:backtrack};
}

function areaPoly(arr) {
	var area=0;
	var n=arr.length;
	var j=n-1;
	arr.forEach(function(p,i) {
		var x0=p[0],y0=p[1],q=arr[j],x1=q[0],y1=q[1];
		area=area+(x0+x1)*(y1-y0);j=i;
	})
	return area/2;
}


