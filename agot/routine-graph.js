var json={nodes:nodes,links:links};
var width = 960,
    height = 500;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(15)  
    .gravity(.2)
    .size([width, height]);

var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);

var cScale=d3.scale.linear().domain([0,343]).range([0,940]);
svg2=d3.select("#legend").append("svg:svg").attr("width",940).attr("height",200);
svg2.selectAll(".paths").data(books).enter().append("path")
	.attr("d",function(d) {var f=cScale(d.first),l=cScale(d.last),w=l-f;return "M"+(f+2)+",0v5h"+(w-4)+"v-5";}) 
	.style("stroke","#ccc")
	.style("fill","none")
;
svg2.selectAll("text").data(books).enter().append("svg:text")
	.attr("x",function(d) {return cScale((d.first+d.last)/2);})
	.attr("y",25)
	.style("font-style","italic")
	.attr("text-anchor","middle")
	.text(function(d) {return d.title;})
;
var r=[3*Math.sqrt(100),3*Math.sqrt(50),3*Math.sqrt(10)];

svg2.append("text").attr({x:75,y:70,"text-anchor":"middle"}).text("Number of mentions").style("font-weight","bold")

svg2.append("circle").attr({cx:50,cy:120,r:r[0]}).style({stroke:"black",fill:"none"});
svg2.append("circle").attr({cx:50,cy:120+r[0]-r[1],r:r[1]}).style({stroke:"black",fill:"none"});
svg2.append("circle").attr({cx:50,cy:120+r[0]-r[2],r:r[2]}).style({stroke:"black",fill:"none"});

svg2.append("text").attr({x:125,y:120-r[0],"baseline-shift":"-50%","text-anchor":"end"}).text(100);
svg2.append("text").attr({x:125,y:120+r[0]-2*r[1],"baseline-shift":"-50%","text-anchor":"end"}).text(50);
svg2.append("text").attr({x:125,y:120+r[0]-2*r[2],"baseline-shift":"-50%","text-anchor":"end"}).text(10);

svg2.append("text").attr({x:220,y:70,"text-anchor":"middle"}).text("Travel mode").style("font-weight","bold")
svg2.append("path").attr("d","M180,90h30").style("stroke","brown");
svg2.append("path").attr("d","M180,110h30").style("stroke","orange");
svg2.append("path").attr("d","M180,130h30").style("stroke","blue");
svg2.selectAll(".modes").data(["Foot","Horse","Boat"]).enter().append("text")
	.text(String)
	.attr("x",230)
	.attr("y",function(d,i){return 90+20*i+6;})

svg2.append("text").attr({x:320,y:70}).text("Region").style("font-weight","bold")
regions=[	"Crownlands", "Dorne", "Essos", 
			"Iron Islands", "Riverlands", "Slaver's Bay", 
			"Stormlands", "Westerlands", "beyond the wall", 
			"the North", "the Reach", "the Vale", 
			"the Wall"]

lBlocks=svg2.selectAll(".llines").data(d3.range(5)).enter().append("g").attr("transform",function(d,i) {return "translate("+(320+130*i)+",80)";})
.selectAll(".lblocks").data(function(d) {return ((d<4)?d3.range(3):[0]).map(function(j) {return {x:d,y:j,r:regions[d*3+j]};})}).enter().append("g").attr("transform",function(d) {return "translate(0,"+(20*d.y)+")";})
lBlocks.append("rect").attr({x:0,y:2,height:16,width:20}).style("fill",function(d) {return color(d.r);});
lBlocks.append("text").attr({x:25,y:16}).text(function(d) {return d.r;})	
var i=0;
var slider=d3.select("#slider");
init();


var timer=setInterval("play()", 50);
var ticked=0;

d3.select("#slider").on("change",function() {clearInterval(timer);i=this.value;start(i);})
d3.select("#free").on("change",function() {ticked=!ticked;force.start();})
svg.append("text").attr({x:20,y:20,id:"chapter"}).style("font-weight","bold");
svg.append("text").attr({x:20,y:40,id:"POV"}).style("font-style","italic");


function init() {
	force
		.nodes(json.nodes)
		.links(json.links)
		.start();
	
	var link = svg.selectAll("line.link")
		.data(json.links)
		.enter().append("line")
		.attr("class", "link")
		.style("stroke",function(d) {return (d.mode?(d.mode==1?"blue":"orange"):"brown");})
		.style("stroke-width", function(d) { return Math.sqrt(d.value); })
		.style("visibility", "hidden")
		//.style("stroke-opacity",.1)
		;
	link.append("title")
		.text(function(d) {return d.source.name+"->"+d.target.name+" ("+d.chapterId+")";});
			
	var node = svg.selectAll("circle.node")
		.data(json.nodes)
		.enter().append("circle")
		.attr("class", "node")
		.attr("r", 0)
		.style("fill", function(d) { return color(d.region); })
		.style("visibility", "hidden")
		.call(force.drag);
	
	node.append("title")
		.text(function(d) { return d.name; });
	
	force.on("tick", function() {
		if(ticked)	{
			var mxScale=d3.scale.linear().domain([0,3780]).range([0,width]),
				myScale=d3.scale.linear().domain([0,2400]).range([0,height]);
			link.attr("x1", function(d) { return mxScale(d.source.coords[0]); })
		    .attr("y1", function(d) { return myScale(d.source.coords[1]); })
		    .attr("x2", function(d) { return mxScale(d.target.coords[0]); })
	  	    .attr("y2", function(d) { return myScale(d.target.coords[1]); });
		
		node.attr("cx", function(d) { return mxScale(d.coords[0]); })
		    .attr("cy", function(d) { return myScale(d.coords[1]); });
	
		} else {
		link.attr("x1", function(d) { return d.source.x; })
		    .attr("y1", function(d) { return d.source.y; })
		    .attr("x2", function(d) { return d.target.x; })
	  	    .attr("y2", function(d) { return d.target.y; });
		
		node.attr("cx", function(d) { return d.x; })
		    .attr("cy", function(d) { return d.y; });
		}
	  });

	
	start(0);
}
function start() {	
	svg.select("#chapter").text(chapters[i].title);
	svg.select("#POV").text(chapters[i].povName);
	
	var link = svg.selectAll("line.link")
 	     .style("visibility", function(d) {return d.chapterId<=i?"visible":"hidden";})
 	var node = svg.selectAll("circle.node")
 	     .attr("r", function(d) {return 3*Math.sqrt(d.visits.filter(function(v) {return v<=i;}).length);})
 	     .style("opacity", function(d) {return d3.max([.25,1-.02*(i-d.lastSeen)]);})
 	     .style("stroke",function(d) {return d.lastSeen==i?"black":"white";})
 	     .style("visibility", function(d) {return d.firstSeen<=i?"visible":"hidden";})
}


function play() {
	if(i<343){i++;
	slider.property("value",i);
	start(i);}	
}
