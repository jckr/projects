var n=d3.keys(nodes).length; // number of nodes
d3.keys(nodes).forEach(function(key,i) {nodes[key].id=i;nodes[key].angle=2*Math.PI*i/n;})

var w=710,h=600;

var cx=320,cy=250,r=200,dist=35;

var svg=d3.select("#chart").append("svg").attr("width",w).attr("height",h);

var defs=svg.append("defs");
defs.append("linearGradient").attr("id","strokeG").selectAll("stop").data(["#ffcc00","#0099cc"]).enter()
	.append("stop")
	.attr("offset",function(d,i) {return i?"100%":"0%";})
	.style("stop-color",String)
//defs.append("marker").attr("id","triangle").attr("markerWidth",2).attr("markerHeight",2).attr("refX",1).attr("refY",1).attr("orient","auto")
//	.append("path").attr("d","M 0 0 1 1 0 2 Z");

var rScale=d3.scale.linear().domain([0,32000000000]).range([0,30]);
var lScale=d3.scale.linear().domain([0,3200000000]).range([0,40]);
var cScale=d3.scale.linear().domain([0,1000000000,2000000000]).range(["#fff","#f00","#800"]);

//var largeCircle=svg.append("circle").attr("cx",cx).attr("cy",cy).attr("r",r).style("stroke","black").style("opacity",.5).style("fill","none")


var lang="eng";
if(window.location.search=="?lang=kor") {lang="kor";}
			
var selection={};
var lastSelected=-1;

var mode=0;
svg.append("text").text(interface[0][lang]).attr("id","text0").attr("x",602).attr("y",10).style("font-size",13).on("click",transMode);
var img=svg.append("image").attr("xlink:href","matrix.png").on("click",transMode).attr("x",602).attr("y",20).attr("width",100).attr("height",100);

svg
	.append("g").classed("links",1).selectAll(".links").data(d3.keys(links)).enter()
		.append("g").classed("gradient",1)
		.selectAll(".links").data(
			function(key) {
				return d3.keys(links[key]).map(function(d) {return [key,d];})
			}).enter()
				.append("path")
				.attr("d",myPath)
				.attr("class",function(d) {return "link "+d[0]+" "+d[1];})
				.style("stroke-opacity",.3).style("stroke","url(#strokeG)")
				.style("marker-end","url(#triangle)")
				.style("fill","none")
				.style("stroke-width",function(d) {return lScale(links[d[0]][d[1]]);})
					.append("title")
					.text(linkTitle);

svg
	.append("g").classed("links",1).selectAll(".links").data(d3.keys(links)).enter()
		.append("g").classed("solid",1)
		.selectAll(".links").data(
			function(key) {
				return d3.keys(links[key]).map(function(d) {return [key,d];})
			}).enter()
				.append("path")
				.attr("d",myPath)
				.attr("class",function(d) {return "link "+d[0]+" "+d[1];})
				.style("stroke",function(d) {return cScale(links[d[0]][d[1]]);})
				.style("marker-end",null)
				.style("fill","none")
				.style("stroke-opacity",0).style("visibility","hidden")
				.style("stroke-width",function(d) {return lScale(links[d[0]][d[1]]);})
					.append("title")
					.text(squareTitle);

circlesX=svg
	.append("g")
	.classed("circlesX",1)
;
circlesY=svg
	.append("g")
	.classed("circlesY",1)
;

squaresX=svg.selectAll(".squaresX").data(d3.keys(nodes)).enter()
	.append("g")
	.classed("squaresX",1).style("visibility","hidden")
	.on("click",clickMe)
	.attr("transform",function(d,i) {return "translate("+(22+i*15)+",0)";})
	.style("opacity",0)
	;

squaresY=svg.selectAll(".squaresY").data(d3.keys(nodes)).enter()
	.append("g")
	.classed("squaresY",1).style("visibility","hidden")
	.on("click",clickMe)
	.attr("transform",function(d,i) {return "translate(0,"+(25+i*15)+")";})
	.style("opacity",0)
	
	;



circles=svg.selectAll(".nodes").data(d3.keys(nodes)).enter()
	.append("g").classed("circles",1)
	.attr("transform", translate)
	.on("click",clickMe);

circles
		.append("circle")
		.attr("r",rNode)
		.style("opacity",.8)
		.attr("class",function(d) {return "n"+d;})
		.style("fill",function(d) {return ((d in selection)?"#888":"#eee");})
	

circlesX
	.selectAll("circle").data(d3.keys(nodes)).enter()
		.append("circle")
		.attr("cx",xNode)
		.attr("cy",yNode)
		.attr("r",function(d) {return rScale(nodes[d].exports);})
		.style("fill","#ffcc00")
		.style("visibility","hidden")
		.style("opacity",0)
;


circlesY
	.selectAll("circle").data(d3.keys(nodes)).enter()
		.append("circle")
		.attr("cx",xNode)
		.attr("cy",yNode)
		.attr("r",function(d) {return rScale(nodes[d].imports);})
		.style("fill","#0099cc")
		.style("visibility","hidden")
		.style("opacity",0)
;

circles.append("title").text(function(key) {return nodes[key].name[lang];})
circles.append("text")
	.attr("class",function(d) {return "t"+d;})
	.text(function(key) {return nodes[key].name[lang];})
	.attr("dx",function(d) {return dist*Math.cos(Math.PI/2-nodes[d].angle);})
	.attr("dy",function(d) {return -dist*Math.sin(Math.PI/2-nodes[d].angle);})
	.attr("text-anchor",function(key) {return (nodes[key].id>n/2)?"end":"start"})



squaresX
		.append("rect")
		.attr("class",function(d) {return "s"+d;})
		.attr("width",15)
		.attr("height",25)
		.style("fill",function(d) {return ((d in selection)?"#888":"#fff");});
		
squaresX
		.append("text")
		.text(String)
		.attr("text-anchor","end")
		.attr("transform","rotate(-90)")
		.attr("dy",10).attr("dx",0)
;			


squaresY
		.append("rect")
		.attr("class",function(d) {return "s"+d;})
		.attr("width",22).attr("height",15)
		.style("fill",function(d) {return ((d in selection)?"#888":"#fff");});
squaresY
		.append("text")
		.text(String)
		.attr("dy",10).attr("dx",1)
		;

var legend=svg.append("g").attr("transform","translate(10,510)");
legend.append("path")
	.style("stroke","url(#strokeG)")
	.style("stroke-width",10)
	.style("opacity",.5)
	.attr("d","M0,35 L 280,36")
legend.append("text")
	.text(interface[1][lang])
	.attr("x",0).attr("y",60)
	.attr("id","text1")
legend.append("text")
	.text(interface[2][lang])
	.attr("x",280).attr("y",60)
	.attr("id","text2")
	.attr("text-anchor","end")
legend.append("text")
	.text(interface[3][lang])
	.attr("id","text3")
	.attr("x",0).attr("y",20)
	//.attr("text-anchor","end")
	

function xNode(key) {return cx+(r)*Math.cos((Math.PI/2)-nodes[key].angle);}
function yNode(key) {return cy-(r)*Math.sin((Math.PI/2)-nodes[key].angle);}
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
	return "M "+xNode(source)+" "+yNode(source)+" Q "+(h/2)+" "+(h/2)+", "+xNode(target)+" "+yNode(target)+" L "+xNode(target)+" "+yNode(target);
}

function squarePath(pair) {
	if(typeof(pair) !== 'undefined'){
		var source=pair[0], i = d3.keys(nodes).indexOf(source);
		var target=pair[1], j = d3.keys(nodes).indexOf(target);
		function x(i) {return 22+i*15;}
		function y(j) {return 25+j*15;}
	//	var path="M "+x(i)+" "+y(j)+" h 15 v 15 h -15 v -15";return path;
		return "M "+x(i)+" "+(y(j)+7)+" Q "+(x(i)+7)+" "+(y(j)+7)+" "+(x(i)+15)+" "+(y(j)+7);
	}
	else {return "M0 0";}
}
	
function linkTitle(pair) {
	var source=pair[0];
	var target=pair[1];
	var title=nodes[source].name[lang]+"/"+nodes[target].name[lang]+"</br>"
	if(source in links){if (target in links[source]){title+=target+" > "+source+": USD "+~~(links[source][target]/1000000)+"m</br>";}}
	if(target in links){if (source in links[target]){title+=source+" > "+target+": USD "+~~(links[target][source]/1000000)+"m";}}
	return title;
}

function squareTitle(pair) {
	var source=pair[0];
	var target=pair[1];
	var title=nodes[source].name[lang]+"/"+nodes[target].name[lang]+"</br>"
	if(source in links){if (target in links[source]){title+=target+" > "+source+": USD "+~~(links[source][target]/1000000)+"m</br>";}}
	return title;
}

function transMode() {var duration=2000;
	var delay=0;
	if(mode) {
		img.attr("xlink:href","matrix.png");
		squaresX.transition().duration(duration).style("opacity",0).each("end",function() {d3.select(this).style("visibility","hidden");});
		squaresY.transition().duration(duration).style("opacity",0).each("end",function() {d3.select(this).style("visibility","hidden");});
		circlesX.selectAll("circle").style("opacity",.5).style("visibility","visible")
			.transition()
			.duration(duration)
			.attr("cx",xNode)
			.attr("cy",yNode)
			.each("end",function() {d3.select(this).style("visibility","hidden").style("opacity",0);});
		circlesY.selectAll("circle").style("opacity",.5).style("visibility","visible")
			.transition()
			.duration(duration)
			.attr("cx",xNode)
			.attr("cy",yNode)
			.each("end",function() {d3.select(this).style("visibility","hidden").style("opacity",0);});
		circles.selectAll("circle").style("visibility","visible").transition()
			.delay(duration)
			.style("opacity",.8);
		circles.selectAll("text").style("visibility","visible").transition()
			.delay(duration)
			.style("opacity",1);

		svg.selectAll(".solid").selectAll("path")
			.transition()
			.duration(duration)
			.attr("d",myPath)
			.style("stroke-width",function(d) {return lScale(links[d[0]][d[1]]);})
			.style("opacity",0)
			.each("end",function() {d3.select(this).style("visibility","hidden");});
		svg.selectAll(".gradient").selectAll("path").style("visibility","visible")
			.transition()
			.duration(duration)
			.attr("d",myPath)
			.style("stroke-width",function(d) {return lScale(links[d[0]][d[1]]);})
			.style("opacity",1);
		legend.style("visibility","visible");
		clickMe();
	} else {
		img.attr("xlink:href","chord.png");
		circles.selectAll("circle").transition().duration(duration).style("opacity",0).each("end",function() {d3.select(this).style("visibility","hidden");});
		circles.selectAll("text").transition().duration(duration).style("opacity",0).each("end",function() {d3.select(this).style("visibility","hidden");});
		circlesX.selectAll("circle").style("opacity",.5).style("visibility","visible")
			.transition()
			.duration(duration)
			.attr("cx",function(d,i) {return 22+i*15;})
			.attr("cy",11)
			.each("end",function() {d3.select(this).style("visibility","hidden").style("opacity",0);});
		circlesY.selectAll("circle").style("opacity",.5).style("visibility","visible")
			.transition()
			.duration(duration)
			.attr("cx",11)
			.attr("cy",function(d,i) {return 25+i*15;})
			.each("end",function() {d3.select(this).style("visibility","hidden").style("opacity",0);});
		squaresX.style("visibility","visible").transition()
			.delay(duration)
			.style("opacity",1);
		squaresY.style("visibility","visible").transition()
			.delay(duration)
			.style("opacity",1);
		svg.selectAll(".gradient").selectAll("path")
			.transition()
			.duration(duration)
			.attr("d",squarePath)
			.style("stroke-width",15)
			.style("opacity",0)
			.each("end",function() {d3.select(this).style("visibility","hidden");});
		svg.selectAll(".solid").selectAll("path").style("visibility","visible")
			.transition()
			.duration(duration)
			.attr("d",squarePath)
			.style("stroke-width",15)
			.style("stroke-opacity",1)
			.style("opacity",1)
			;
		legend.style("visibility","hidden");
		clickMe();
	};
	mode=1-mode;
}
			
		
function initPanel(lastSelected){
	panel=d3.select("#panel");
	panel.html("");
	if (lastSelected==-1){return true;}
	
	panel=panel.append("div")
	.classed("infopanel",1)
	.style("font-size","80%");
	panel.append("h2").html(nodes[lastSelected].name[lang]);
	panel.append("p")
		.append("span").attr("id","text4").html(interface[4][lang])
		.append("span").html(d3.format(",")(""+nodes[lastSelected].exports)+"</br>")
		.append("span").attr("id","text5").html(interface[5][lang])
		.append("span").html(d3.format(",")(""+nodes[lastSelected].imports));
	
	var exports=[];
	d3.keys(nodes).forEach(function(exporter) {if(exporter in links){if (lastSelected in links[exporter]) {exports.push([nodes[exporter].name[lang],links[exporter][lastSelected]])}}})
	var imports=[]
	if(lastSelected in links){d3.keys(links[lastSelected]).forEach(function(importer){imports.push([nodes[importer].name[lang],links[lastSelected][importer]]);})}
	
	var navtabs=[];
	if (exports.length){navtabs.push(interface[6][lang]);}
	if (imports.length){navtabs.push(interface[7][lang]);}
	
	panel
		.append("ul")
		.classed("nav nav-tabs",1)
		.selectAll("li").data(navtabs).enter()
			.append("li")
			.classed("active",function(d,i) {return !i;}) // first tab
				.append("a")
				.attr("href",function(d) {return "#"+d.toLowerCase();})
				.attr("data-toggle","tab")
				.html(String);
				
	var tabcontent=panel.append("div").classed("tab-content",1);
	if (exports.length){
		exports.sort(function(a,b) {return b[1]-a[1];});
		tabcontent.append("div").classed("tab-pane active",1).attr("id","exports")
		.append("ul").selectAll("li").data(exports).enter().append("li")
		.html(function(d) {return d[0]+": $"+d3.format(",")(""+d[1]);})
	}
	
	if (imports.length){
		imports.sort(function(a,b) {return b[1]-a[1];});
		tabcontent.append("div").classed("tab-pane",1).classed("active",!exports.length).attr("id","imports")
		.append("ul").selectAll("li").data(imports).enter().append("li")
		.html(function(d) {return d[0]+": $"+d3.format(",")(""+d[1]);})
	}
	
}

function clickMe(d) {
	if(typeof(d)!=='undefined'){
	
		if (lastSelected==d) {lastSelected=-1;}
		if (d in selection) {
			delete selection[d];
			d3.select(".n"+d).style("fill","#eee").style("stroke","none");
			d3.selectAll(".s"+d).style("fill","#fff").style("stroke","none");
			d3.select(".t"+d).style("fill","black");
		} else {
			selection[d]=true;lastSelected=d;
			d3.select(".n"+d).style("fill","#ccc").style("stroke","#888");
			d3.selectAll(".s"+d).style("fill","#ccc").style("stroke","none");
			d3.select(".t"+d).style("fill","#008");
		}
		//console.log(selection);
	initPanel(lastSelected);
	}
	if (!d3.keys(selection).length) {d3.selectAll(".link").style("visibility","visible");}
	else {
		d3.selectAll(".link").style("visibility","hidden");
		d3.keys(selection).forEach(function(key) {d3.selectAll("."+key).style("visibility","visible");})
		
	}
}

function changeLang() {
	lang=(lang=='eng')?'kor':'eng';
	d3.selectAll("#text0").text(interface[0][lang]);
	d3.selectAll("#text1").text(interface[1][lang]);
	d3.selectAll("#text2").text(interface[2][lang]);
	d3.selectAll("#text3").text(interface[3][lang]);
	d3.selectAll("#text4").html(interface[4][lang]);
	d3.selectAll("#text5").html(interface[5][lang]);
	initPanel(lastSelected);
	d3.selectAll(".solid").selectAll("title").text(squareTitle);
	d3.selectAll(".gradient").selectAll("title").text(linkTitle);
	circles.selectAll("title").text(function(key) {return nodes[key].name[lang];})
	circles.selectAll("text").text(function(key) {return nodes[key].name[lang];})
	window.location.search="?lang="+lang;
}

$('path').tipsy({html: true, gravity: 's'});
