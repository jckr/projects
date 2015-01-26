var n=d3.keys(nodes).length; // number of nodes
d3.keys(nodes).forEach(function(key,i) {nodes[key].id=i;nodes[key].angle=2*Math.PI*i/n;})

var w=700,h=600;

var svg=d3.select("#chart").append("svg").attr("width",w).attr("height",h).append("g").attr("transform","translate(25,25)");

svg.append("defs").append("linearGradient").attr("id","strokeG").selectAll("stop").data(["#ffcc00","#0099cc"]).enter()
	.append("stop")
	.attr("offset",function(d,i) {return i?"100%":"0%";})
	.style("stop-color",String)

var rScale=d3.scale.linear().domain([0,32000000000]).range([0,30]);
var lScale=d3.scale.linear().domain([0,3200000000]).range([0,40]);
//var largeCircle=svg.append("circle").attr("cx",h/2).attr("cy",h/2).attr("r",h/3).style("stroke","black").style("opacity",.5).style("fill","none")

svg.selectAll(".links").data(d3.keys(links)).enter().append("g")
	.selectAll(".links").data(
		function(key) {
			return d3.keys(links[key]).map(function(d) {return [key,d];})
		}).enter().append("path")
		.attr("d",myPath)
		.attr("class",function(d) {return "link "+d[0]+" "+d[1];})
		.style("stroke","url(#strokeG)")
		.style("opacity",.2).style("fill","none")	
		.style("stroke-width",function(d) {return lScale(links[d[0]][d[1]]);})
		.append("title").text(linkTitle);
			
var selection={};
var lastSelected=-1;

circles=svg.selectAll(".nodes").data(d3.keys(nodes)).enter().append("g")
	.attr("transform", translate)
	.on("click",function(d) {
		if (lastSelected==d) {lastSelected=-1;}
		if (d in selection) {
			delete selection[d];
			d3.select(".n"+d).style("fill","#eee").style("stroke","none");
			d3.select(".t"+d).style("fill","black");
			} else {
			selection[d]=true;lastSelected==d;
			d3.select(".n"+d).style("fill","#ccc").style("stroke","#888");
			d3.select(".t"+d).style("fill","#008");
		}
		initPanel(lastSelected);
		if (!d3.keys(selection).length) {d3.selectAll(".link").style("visibility","visible");}
		else {
			d3.selectAll(".link").style("visibility","hidden");
			d3.keys(selection).forEach(function(key) {d3.selectAll("."+key).style("visibility","visible");})
		}
	});
circles.append("circle")
	.attr("r",rNode)
	.style("opacity",.8)
	.attr("class",function(d) {return "n"+d;})
	.style("fill",function(d) {return ((d in selection)?"#888":"#eee");})
	
	
	
	//.on("mouseover",function(key) {d3.selectAll(".link").style("visibility","hidden");d3.selectAll("."+key).style("visibility","visible");})
	//.on("mouseout",function(key) {d3.selectAll(".link").style("visibility","visible");})
	;
circles.append("title").text(function(key) {return nodes[key].name;})
circles.append("text")
	.attr("class",function(d) {return "t"+d;})
	.attr("transform",rotateLabel)
	.text(function(key) {return nodes[key].name;})
	.attr("dy",5)
	.attr("dx",function(key) {return (nodes[key].id<n/2)?10:-10;})
	.attr("text-anchor",function(key) {return (nodes[key].id>n/2)?"end":"start"})



function xNode(key) {return h/2+(h/3)*Math.cos((Math.PI/2)-nodes[key].angle);}
function yNode(key) {return h/2-(h/3)*Math.sin((Math.PI/2)-nodes[key].angle);}
function rNode(key) {return rScale(nodes[key].trade);}
function translate(key) {return "translate("+xNode(key)+","+yNode(key)+")";}
function rotateLabel(key) {
	if (nodes[key].id<n/2) {return "rotate("+(360-(180*((Math.PI/2)-nodes[key].angle)/Math.PI))+")";}
	else {return "rotate("+((180*((Math.PI/2)+nodes[key].angle)/Math.PI))+")";}
}

function myPath(pair) {
	var source=pair[0];
	var target=pair[1];
//	console.log(source+" "+target);
	return "M "+xNode(source)+" "+yNode(source)+" Q "+(h/2)+" "+(h/2)+", "+xNode(target)+" "+yNode(target);
}
	
function linkTitle(pair) {
	var source=pair[0];
	var target=pair[1];
	var title=nodes[source].name+"/"+nodes[target].name+"</br>"
	if(source in links){if (target in links[source]){title+=target+" to "+source+": USD "+~~(links[source][target]/1000000)+"m</br>";}}
	if(target in links){if (source in links[target]){title+=source+" to "+target+": USD "+~~(links[target][source]/1000000)+"m";}}
	return title;
}

function initPanel(lastSelected){
	panel=d3.select("#panel");
	panel.html("");
	if (lastSelected==-1){return true;}
	
	panel=panel.append("div").classed("well",1);
	panel.append("h2").html(nodes[lastSelected].name);
	panel.append("p").html("Total exports: $"+d3.format(",")(""+nodes[lastSelected].exports)+"</br>Total imports: $"+d3.format(",")(""+nodes[lastSelected].imports));
	
	var exports=[];
	d3.keys(nodes).forEach(function(exporter) {if(exporter in links){if (lastSelected in links[exporter]) {exports.push([nodes[exporter].name,links[exporter][lastSelected]])}}})
	if (exports.length){
		panel.append("h3").html("Exports")
		exports.sort(function(a,b) {return b[1]-a[1];})
		panel.append("ul").selectAll("li").data(exports).enter().append("li")
		.html(function(d) {return d[0]+": $"+d3.format(",")(""+d[1]);})
	}
	
	var imports=[]
	if(lastSelected in links){d3.keys(links[lastSelected]).forEach(function(importer){imports.push([nodes[importer].name,links[lastSelected][importer]]);})}
	if (imports.length){
		panel.append("h3").html("Imports")
		imports.sort(function(a,b) {return b[1]-a[1];})
		panel.append("ul").selectAll("li").data(imports).enter().append("li")
		.html(function(d) {return d[0]+": $"+d3.format(",")(""+d[1]);})
	}
	
	
}

$('path').tipsy({html: true, gravity: 's'});
