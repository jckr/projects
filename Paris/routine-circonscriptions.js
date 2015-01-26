var width=960,height=500;
var svgMap=d3.select("#chart")
	.append("svg")
	.attr("width",480)
	.attr("height",400);

var svgBarchart=d3.select("#divBarChart")
	.append("svg")
	.attr("width",430)
	.attr("height",270);

var svgInfoPanel=d3.select("#divInfoPanel")
	.append("svg")
	.attr("width",430)
	.attr("height",170);

var cScale=d3.scale.linear().domain([0,0.5,1]).range(["blue","#eee","red"]);
var brush;
var circScale=d3.scale.category20b();
var arrScale=d3.scale.category20b().domain([d3.range(1,21)]);
var cirScale=d3.scale.category20b().domain([d3.range(1,21)]);
var oScale=d3.scale.linear().domain([0,2000]).range([0.5,0.8]);
var rScale=d3.scale.linear().domain([0,2000]).range([0,3]);


var x=d3.scale.ordinal().rangeBands([25,430],0.15).domain(d3.range(18));
var y=d3.scale.linear().domain([0,100000]).range([265,5]).clamp([true]);
var yforAxis=d3.scale.linear().domain([0,100]).range([265,5]).clamp([true]);
var projection=d3.geo.mercator()
	.translate([-5500, 139300])
	.scale(891443.7768152277);

var defs=svgMap.append("defs");

// reading data to create clipping path

d3.csv("parisLimits.csv",function(coordinates) {
	var perimeter=[];
	coordinates.forEach(function(c) {
		perimeter.push(projection([+c.lon,+c.lat]));
	});
	perimeterPath="M" + perimeter.join("L") + "Z";
	defs.append("clipPath").attr("id","Paris")
		.append("path").attr("d",perimeterPath);

});



svgMap.append("rect").style("fill","white").style("stroke","none").attr("width",width).attr("height",height).attr("class","bkgd");
svgBarchart.append("rect").style("fill","white").style("stroke","none").attr("width",width).attr("height",height).attr("class","bkgd");

// these variables store the selected district and polling station

var selected=null;
var selectedBV=null;

// let the voronoi magic begin. 

var cells = svgMap.append("svg:g").attr("width",530).attr("height",400)
    .attr("id", "cells").style("clip-path", "url(#Paris)"); // clipped;


	var positions;
	var data,bv;
	var myBC=[0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var BCcolors=myBC.map(function(d) {return "steelblue";});
	var series=["Abs./blancs/nuls T1","Hollande T1","Sarkozy T1","Le Pen T1","Mélenchon T1", "Bayrou T1","Joly T1","Arthaud T1","Poutou T1","Dupont-Aignan T1","Cheminade T1","Abs./blancs/nuls T2","Hollande T2","Sarkozy T2"];

	// step1: preparing data

	var tally=[];
// reading data for polling station
var myScale=0;
d3.csv("parisBV.csv", function(bv){
	
	positions = [];
	data=bv;


	bv.forEach(function(d) {d.ocir=d.cir;d.tcir=d.cir;});
	recompute();

	
	bv.forEach(function(b) {
		positions.push(projection([+b.clon, +b.clat])); // position of the centroid of the addresses of this polling station.
	});
	

	var xb=d3.scale.linear().domain([0,480]).range([0,480]);
	var yb=d3.scale.linear().domain([0,400]).range([0,400]);
	brush = d3.svg.brush().x(xb).y(yb)	
	    .on("brushstart", brushstart)
	    .on("brush", brush)
	    .on("brushend", brushend);

	// Compute the Voronoi diagram of polling stations projected positions.
	var polygons = d3.geom.voronoi(positions);

	
	
	var g = cells.selectAll("g").data(bv).enter()
		.append("svg:g")
		.attr("class",function(d) {return "C"+d.cir;});  // class corresponds to circonscription number.
	
	// this is background...
	g
		.append("svg:path")
		.attr("class","bkg")
		.style("fill","#eee")
		.style("stroke","#ccc")//.style("stroke-width",1)
		.attr("d", function(d, i) { return "M" + polygons[i].join("L") + "Z"; });

	// next, circles... 

	
	g
		.append("svg:path")
		.attr("class", "cell")
		.attr("id",function(d) {return "b"+d.code;})
		.style("fill",function(d) {return cScale(d,myScale);})
		.style("stroke",function(d) {return cScale(d,myScale);})
		.style("stroke-width",1)
		.attr("d", function(d, i) { return "M" + polygons[i].join("L") + "Z"; })
		//.append("title").text(function(d,i) {return i+" "+d.code+" "+d.arr+" "+d.cir;}) // - used only for debug
		;
	
	g
		.append("svg:circle")
		.style("fill","black").style("visibility","hidden")
		.attr("cx", function(d, i) { return positions[i][0]; })
		.attr("cy", function(d, i) { return positions[i][1]; })
		.attr("r",1);

	

	// handling interaction: mouseover + clicks

	g
		.on("mouseover", highlightBV)
		.on("mouseout", un_highlightBV)
		.on("click", selectBV);
	
	var instrSelect=svgMap.append("text").attr("x",0).attr("y",30).text("Rajoutez des bureaux de votes à la circonscription en sélectionnant les points").style("visibility","hidden");

	d3.select("#chooseColor").selectAll("li").on("click",chooseColor);
	d3.select("#reset").on("click",reset);
	var barchart=svgBarchart.attr("id","barChart").append("g");
	barchart.selectAll("rect").data(tally).enter()
		.append("rect")
		.attr("x",function(d,i) {return x(i);})
		.attr("y",function(d) {return y(d.values.insT2);})
		.attr("width",x.rangeBand())
		.attr("height",function(d) {return 265-y(d.values.insT2);})
		.style("fill",function(d) {return cScale(d.values,0);})
		.on("mouseover",highlightCir)
		.on("mouseout",un_highlightCir)
		.on("click",function(d,i) {
			cells.selectAll(".cell").style("visibility","visible");
			//cells.selectAll("circle").style("visibility","hidden");
			d3.select("#barChart").selectAll("rect").style("stroke","none");
			cells.selectAll(":not(.C"+d.key+")").select(".cell").style("visibility","hidden");
			//cells.selectAll(":not(.C"+d.key+")").select("circle").style("visibility","visible");
			d3.select(this).style("stroke","black");selectCir(i);})
		;

	var yAxis = d3.svg.axis()
                  .scale(yforAxis)
                  .orient("left")
                  .ticks(10);
    barchart.append("g")
    	.attr("class", "axis")
    	.attr("transform", "translate(25,0)")
    	.call(yAxis);

	svgInfoPanel.attr("id","infoPanel");
	svgInfoPanel.append("rect").attr("width",430).attr("height",170).style("fill","#eee").attr("rx",5).attr("ry",5).attr("class","bkgd");
	svgInfoPanel.append("text").attr("id","infoTitle").attr("x",10).attr("y",23).text("Explorez la carte pour avoir le détail sur une circonscription");
	svgInfoPanel.append("text").attr("id","infoDetails").attr("x",10).attr("y",38).text("");
	svgInfoPanel.append("g").attr("id","infoBC").attr("transform","translate(10,60)").style("visibility","hidden")
		.append("rect").attr("width",410).attr("height",100).style("fill","#fff");
	svgInfoPanel.select("#infoBC").selectAll("line").data(d3.range(10)).enter().append("line")
			.attr("x1",15)
			.attr("x2",16*25)
			.attr("y1",function(d){return 10+d*10;})
			.attr("y2",function(d){return 10+d*10;})
			.style("stroke","#ccc").style("stroke-width",1).style("opacity",0.5);

	var infoBars=svgInfoPanel.select("#infoBC").selectAll("g").data(myBC).enter().append("g")
		.attr("transform",function(d,i) {return "translate("+(27*i+30)+",0)";});
		infoBars.append("rect").attr("width",27).attr("height",100).style("fill","white").style("opacity",0.001);
		infoBars.append("rect").classed("bar",1)
			.attr("width",25)
			.attr("y",function(d) {return 100*(1-d);})
			.attr("height", function(d) {return 100*d;})
			.style("fill",function(d,i) {return BCcolors[i];});
		infoBars.append("title").text(function(d) {return d3.format("%")(d);});
		infoBars.append("text").attr("transform","rotate(-90)")
			.text(function(d,i) {return series[i];}).attr("y","15").attr("x",-95)
			.style("font-size",10).style("fill","#222").style("opacity",0.8);
	
	var ySmallAxis=d3.svg.axis()
		.scale(yforAxis.domain([10,90]).range([90,10]))
		.orient("left")
		.ticks(8);
	svgInfoPanel.select("#infoBC").append("g").attr("class","axis").attr("transform","translate(25,0)").call(ySmallAxis);


	//$('#infoPanel g').tipsy({html: true, gravity: 's'});

	d3.selectAll(".bkgd").on("click", function() {selectCir();}); // clicking background unselects anything selected.

	
				
	function highlightCir (d,i){
		if(selected===null){
			selectedBV=null;un_highlightBV();
			cells.selectAll(":not(.C"+d.key+")").select(".cell").style("visibility","hidden");
			//cells.selectAll(":not(.C"+d.key+")").select("circle").style("visibility","visible");
			cells.selectAll("circle").style("visibility","visible");
			if(d.values.insT1===0){myBC=[0,0,0,0,0,0,0,0,0,0,0,0,0,0];} else {
				myBC=[
					(+d.values.insT1-((+d.values.artT1)+(+d.values.jolT1)+(+d.values.lepT1)+(+d.values.holT1)+(+d.values.pouT1)+(+d.values.sarT1)+(+d.values.cheT1)+(+d.values.dupT1)+(+d.values.melT1)+(+d.values.bayT1)))/(+d.values.insT1),
					(+d.values.holT1)/((+d.values.artT1)+(+d.values.jolT1)+(+d.values.lepT1)+(+d.values.holT1)+(+d.values.pouT1)+(+d.values.sarT1)+(+d.values.cheT1)+(+d.values.dupT1)+(+d.values.melT1)+(+d.values.bayT1)),
					(+d.values.sarT1)/((+d.values.artT1)+(+d.values.jolT1)+(+d.values.lepT1)+(+d.values.holT1)+(+d.values.pouT1)+(+d.values.sarT1)+(+d.values.cheT1)+(+d.values.dupT1)+(+d.values.melT1)+(+d.values.bayT1)),
					(+d.values.lepT1)/((+d.values.artT1)+(+d.values.jolT1)+(+d.values.lepT1)+(+d.values.holT1)+(+d.values.pouT1)+(+d.values.sarT1)+(+d.values.cheT1)+(+d.values.dupT1)+(+d.values.melT1)+(+d.values.bayT1)),
					(+d.values.melT1)/((+d.values.artT1)+(+d.values.jolT1)+(+d.values.lepT1)+(+d.values.holT1)+(+d.values.pouT1)+(+d.values.sarT1)+(+d.values.cheT1)+(+d.values.dupT1)+(+d.values.melT1)+(+d.values.bayT1)),
					(+d.values.bayT1)/((+d.values.artT1)+(+d.values.jolT1)+(+d.values.lepT1)+(+d.values.holT1)+(+d.values.pouT1)+(+d.values.sarT1)+(+d.values.cheT1)+(+d.values.dupT1)+(+d.values.melT1)+(+d.values.bayT1)),
					(+d.values.jolT1)/((+d.values.artT1)+(+d.values.jolT1)+(+d.values.lepT1)+(+d.values.holT1)+(+d.values.pouT1)+(+d.values.sarT1)+(+d.values.cheT1)+(+d.values.dupT1)+(+d.values.melT1)+(+d.values.bayT1)),
					(+d.values.artT1)/((+d.values.artT1)+(+d.values.jolT1)+(+d.values.lepT1)+(+d.values.holT1)+(+d.values.pouT1)+(+d.values.sarT1)+(+d.values.cheT1)+(+d.values.dupT1)+(+d.values.melT1)+(+d.values.bayT1)),
					(+d.values.pouT1)/((+d.values.artT1)+(+d.values.jolT1)+(+d.values.lepT1)+(+d.values.holT1)+(+d.values.pouT1)+(+d.values.sarT1)+(+d.values.cheT1)+(+d.values.dupT1)+(+d.values.melT1)+(+d.values.bayT1)),
					(+d.values.dupT1)/((+d.values.artT1)+(+d.values.jolT1)+(+d.values.lepT1)+(+d.values.holT1)+(+d.values.pouT1)+(+d.values.sarT1)+(+d.values.cheT1)+(+d.values.dupT1)+(+d.values.melT1)+(+d.values.bayT1)),
					(+d.values.cheT1)/((+d.values.artT1)+(+d.values.jolT1)+(+d.values.lepT1)+(+d.values.holT1)+(+d.values.pouT1)+(+d.values.sarT1)+(+d.values.cheT1)+(+d.values.dupT1)+(+d.values.melT1)+(+d.values.bayT1)),
					(+d.values.insT2-((+d.values.holT2)+(+d.values.sarT2)))/(+d.values.insT2),
					(+d.values.holT2)/((+d.values.holT2)+(+d.values.sarT2)),
					(+d.values.sarT2)/((+d.values.holT2)+(+d.values.sarT2))
				];

				BCcolors=myBC.map(function(c,i) {
					if(i<11 && c==d3.max(myBC.slice(0,11)) || c==d3.max(myBC.slice(11,14))) {return "darkorange";} else {return "steelblue";}
				});
			}

			svgInfoPanel.select("#infoBC").style("visibility","visible");
			infoBars.data(myBC).select(".bar")
				.transition()
				.attr("y",function(d) {return 100*(1-d);})
				.attr("height",function(d) {return 100*d;})
				.style("fill",function(d,i) {return BCcolors[i];});
			infoBars.select("title").text(function(d) {return d3.format(".3p")(d);});
			svgInfoPanel.select("#infoTitle").text(d.key+(+d.key==1?"ère":"ème")+" circonscription");
			svgInfoPanel.select("#infoDetails").text(d.values.insT2+" électeurs inscrits");
			//$('#infoPanel g').tipsy({html: true, gravity: 's'});
		}
	}

	function un_highlightCir(d,i) {
		if (selected===null){
			cells.selectAll(":not(.C"+d.key+")").select(".cell").style("visibility","hidden");
			cells.selectAll("circle").style("visibility","hidden");
		}
	}

	function highlightBV(d, i) {if(selectedBV===null){
			d3.select(this).select(".cell").style("opacity",1).style("fill","darkorange");
			d3.selectAll(":not(.C"+d.cir+")").select(".cell").style("opacity",0.2);
			myBC=[
				(+d.insT1-((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)))/(+d.insT1),
				(d.holT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(d.sarT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(d.lepT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(d.melT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(d.bayT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(d.jolT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(d.artT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(d.pouT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(d.dupT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(d.cheT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(+d.insT2-((+d.holT2)+(+d.sarT2)))/(+d.insT2),
				(+d.holT2)/((+d.holT2)+(+d.sarT2)),
				(+d.sarT2)/((+d.holT2)+(+d.sarT2))
			];

			BCcolors=myBC.map(function(c,i) {
				if(i<11 && c==d3.max(myBC.slice(0,11)) || c==d3.max(myBC.slice(11,14))) {return "darkorange";} else {return "steelblue";}
			});
			svgInfoPanel.select("#infoBC").style("visibility","visible");
			infoBars.data(myBC).select(".bar")
				.transition()
				.attr("y",function(d) {return 100*(1-d);})
				.attr("height",function(d) {return 100*d;})
				.style("fill",function(d,i) {return BCcolors[i];})
			infoBars.select("title").text(function(d) {return d3.format(".3p")(d);});
			svgInfoPanel.select("#infoTitle").text(d.bda+(+d.bda==1?"er":"ème")+" bureau du "+d.arr+(+d.arr==1?"er":"ème")+" arrondissement");
			svgInfoPanel.select("#infoDetails").text(d.insT2+" électeurs inscrits");
			//$('#infoPanel g').tipsy({html: true, gravity: 's'});
		}
	}
	function un_highlightBV(d,i) {if(selectedBV==null){
			d3.selectAll(".cell").style("opacity",1).style("visibility","visible")//function(c) {return oScale(+c.insT2);})
			.style("fill",function(d) {return cScale(d,myScale);})
		}	
	}
	function selectBV(d,i) {
		selectedBV=i;
		d3.selectAll(".cell").style("opacity",1)
		.style("fill",function(d) {return cScale(d,myScale);})
		d3.select(this).select(".cell").style("opacity",1).style("fill","darkorange");
		d3.selectAll(":not(.C"+d.cir+")").select(".cell").style("visibility","hidden");
		myBC=[
				(+d.insT1-((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)))/(+d.insT1),
				(d.holT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(d.sarT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(d.lepT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(d.melT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(d.bayT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(d.jolT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(d.artT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(d.pouT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(d.dupT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(d.cheT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(+d.insT2-((+d.holT2)+(+d.sarT2)))/(+d.insT2),
				(+d.holT2)/((+d.holT2)+(+d.sarT2)),
				(+d.sarT2)/((+d.holT2)+(+d.sarT2))
			];
		BCcolors=myBC.map(function(c,i) {
				if(i<11 && c==d3.max(myBC.slice(0,11)) || c==d3.max(myBC.slice(11,14))) {return "darkorange"} else {return "steelblue";}
			})
			svgInfoPanel.select("#infoBC").style("visibility","visible");
			infoBars.data(myBC).select(".bar")
				.transition()
				.attr("y",function(d) {return 100*(1-d);})
				.attr("height",function(d) {return 100*d;})
				.style("fill",function(d,i) {return BCcolors[i];})
			infoBars.select("title").text(function(d) {return d3.format(".3p")(d);});
			svgInfoPanel.select("#infoTitle").text(d.bda+(+d.bda==1?"er":"ème")+" bureau du "+d.arr+(+d.arr==1?"er":"ème")+" arrondissement");
			sv18gInfoPanel.select("#infoDetails").text(d.insT2+" électeurs inscrits");
			//$('#infoPanel g').tipsy({html: true, gravity: 's'});

	}

	function selectCir(myCir) {
		if (typeof(myCir)!=="undefined") {
				selected=myCir;
				instrSelect.style("visibility","visible");
				d=tally[selected];
				selectedBV=null;un_highlightBV();
				cells.selectAll(":not(.C"+d.key+")").select(".cell").style("visibility","hidden");
				if(d.values.insT1===0){myBC=[0,0,0,0,0,0,0,0,0,0,0,0,0,0];} else {
				myBC=[
					(+d.values.insT1-((+d.values.artT1)+(+d.values.jolT1)+(+d.values.lepT1)+(+d.values.holT1)+(+d.values.pouT1)+(+d.values.sarT1)+(+d.values.cheT1)+(+d.values.dupT1)+(+d.values.melT1)+(+d.values.bayT1)))/(+d.values.insT1),
					(+d.values.holT1)/((+d.values.artT1)+(+d.values.jolT1)+(+d.values.lepT1)+(+d.values.holT1)+(+d.values.pouT1)+(+d.values.sarT1)+(+d.values.cheT1)+(+d.values.dupT1)+(+d.values.melT1)+(+d.values.bayT1)),
					(+d.values.sarT1)/((+d.values.artT1)+(+d.values.jolT1)+(+d.values.lepT1)+(+d.values.holT1)+(+d.values.pouT1)+(+d.values.sarT1)+(+d.values.cheT1)+(+d.values.dupT1)+(+d.values.melT1)+(+d.values.bayT1)),
					(+d.values.lepT1)/((+d.values.artT1)+(+d.values.jolT1)+(+d.values.lepT1)+(+d.values.holT1)+(+d.values.pouT1)+(+d.values.sarT1)+(+d.values.cheT1)+(+d.values.dupT1)+(+d.values.melT1)+(+d.values.bayT1)),
					(+d.values.melT1)/((+d.values.artT1)+(+d.values.jolT1)+(+d.values.lepT1)+(+d.values.holT1)+(+d.values.pouT1)+(+d.values.sarT1)+(+d.values.cheT1)+(+d.values.dupT1)+(+d.values.melT1)+(+d.values.bayT1)),
					(+d.values.bayT1)/((+d.values.artT1)+(+d.values.jolT1)+(+d.values.lepT1)+(+d.values.holT1)+(+d.values.pouT1)+(+d.values.sarT1)+(+d.values.cheT1)+(+d.values.dupT1)+(+d.values.melT1)+(+d.values.bayT1)),
					(+d.values.jolT1)/((+d.values.artT1)+(+d.values.jolT1)+(+d.values.lepT1)+(+d.values.holT1)+(+d.values.pouT1)+(+d.values.sarT1)+(+d.values.cheT1)+(+d.values.dupT1)+(+d.values.melT1)+(+d.values.bayT1)),
					(+d.values.artT1)/((+d.values.artT1)+(+d.values.jolT1)+(+d.values.lepT1)+(+d.values.holT1)+(+d.values.pouT1)+(+d.values.sarT1)+(+d.values.cheT1)+(+d.values.dupT1)+(+d.values.melT1)+(+d.values.bayT1)),
					(+d.values.pouT1)/((+d.values.artT1)+(+d.values.jolT1)+(+d.values.lepT1)+(+d.values.holT1)+(+d.values.pouT1)+(+d.values.sarT1)+(+d.values.cheT1)+(+d.values.dupT1)+(+d.values.melT1)+(+d.values.bayT1)),
					(+d.values.dupT1)/((+d.values.artT1)+(+d.values.jolT1)+(+d.values.lepT1)+(+d.values.holT1)+(+d.values.pouT1)+(+d.values.sarT1)+(+d.values.cheT1)+(+d.values.dupT1)+(+d.values.melT1)+(+d.values.bayT1)),
					(+d.values.cheT1)/((+d.values.artT1)+(+d.values.jolT1)+(+d.values.lepT1)+(+d.values.holT1)+(+d.values.pouT1)+(+d.values.sarT1)+(+d.values.cheT1)+(+d.values.dupT1)+(+d.values.melT1)+(+d.values.bayT1)),
					(+d.values.insT2-((+d.values.holT2)+(+d.values.sarT2)))/(+d.values.insT2),
					(+d.values.holT2)/((+d.values.holT2)+(+d.values.sarT2)),
					(+d.values.sarT2)/((+d.values.holT2)+(+d.values.sarT2))
				];

				BCcolors=myBC.map(function(c,i) {
					if(i<11 && c==d3.max(myBC.slice(0,11)) || c==d3.max(myBC.slice(11,14))) {return "darkorange";} else {return "steelblue";}
				});
			}

			svgInfoPanel.select("#infoBC").style("visibility","visible");
			infoBars.data(myBC).select(".bar")
				.transition()
				.attr("y",function(d) {return 100*(1-d);})
				.attr("height",function(d) {return 100*d;})
				.style("fill",function(d,i) {return BCcolors[i];});
			infoBars.select("title").text(function(d) {return d3.format(".3p")(d);});
			svgInfoPanel.select("#infoTitle").text(d.key+(+d.key==1?"ère":"ème")+" circonscription");
			svgInfoPanel.select("#infoDetails").text(d.values.insT2+" électeurs inscrits");
			
				cells.call(brush);
			}else{
				d3.selectAll("#cells").style("pointer-events",null)
				selected=null;
				instrSelect.style("visibility","hidden");
				cells.selectAll(".cell").style("visibility","visible").style("opacity",1);;
				cells.selectAll("circle").style("visibility","hidden");
							
				d3.select("#barChart").selectAll("rect").style("stroke","none");
				selectedBV=null;

			}
	}

	function cScale(d,scaleType){
			if (scaleType===1) {return d3.scale.linear().domain([0,2000]).range(["white","black"])(d.insT2);}
			if (scaleType===2) {return cirScale(d.cir);}
			if (scaleType===3) {return arrScale(d.arr);}
			return d3.scale.linear().domain([0,.5,1]).range(["blue","#eee","red"])(+d.holT2/(+d.holT2+(+d.sarT2)));
	}

	function chooseColor(d) {
		myScale=+d3.select(this).attr("value");
		selectedBV=null;
		d3.selectAll(".cell").transition().style("opacity",1)
		.style("fill",function(d) {return cScale(d,myScale);})
		.style("stroke",function(d) {return cScale(d,myScale);})

		d3.select("#chooseColor").selectAll("li").classed("active",0);
		d3.select(this).classed("active",1);

	}

	function brushstart(p) {
	    cells.call(brush.clear());
	}

	// Highlight the selected circles.
	function brush(p) {
		if(selected!==null){
			var e = brush.extent();
			max=e;flipped=[];
			positions.forEach(function(d,i) {
				if(d[0]>=e[0][0] && d[0]<=e[1][0] && d[1]>=e[0][1] && d[1]<=e[1][1]||bv[i].cir==(selected+1)) {
					bv[i].tcir=(selected+1);
					flipped.push(i);
					cells.selectAll("#b"+bv[i].code).style("visibility","visible");
					//console.log("#b"+bv[i].code);
				} else {
					bv[i].tcir=bv[i].cir;
					cells.selectAll("#b"+bv[i].code).style("visibility","hidden");
				}
			});
		}
	}

	function brushend() { 
		
		bv.forEach(function(d,i) {d.cir=d.tcir;})
		recompute("cir");
		cells.selectAll("g").attr("class",function(d) {return "C"+d.cir;})
		
		barchart.selectAll("rect").data(tally)
			.transition()
			.attr("height",function(d) {return 265-y(d.values.insT2);})
			.style("fill",function(d) {return cScale(d.values,0);})
			.attr("y",function(d) {return y(d.values.insT2);})

		d=tally[selected].values;console.log(selected)
		if (!+d.insT1) {myBC=[0,0,0,0,0,0,0,0,0,0,0,0,0,0]} else {
		myBC=[
				(+d.insT1-((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)))/(+d.insT1),
				(d.holT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(d.sarT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(d.lepT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(d.melT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(d.bayT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(d.jolT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(d.artT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(d.pouT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(d.dupT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(d.cheT1)/((+d.artT1)+(+d.jolT1)+(+d.lepT1)+(+d.holT1)+(+d.pouT1)+(+d.sarT1)+(+d.cheT1)+(+d.dupT1)+(+d.melT1)+(+d.bayT1)),
				(+d.insT2-((+d.holT2)+(+d.sarT2)))/(+d.insT2),
				(+d.holT2)/((+d.holT2)+(+d.sarT2)),
				(+d.sarT2)/((+d.holT2)+(+d.sarT2))
			];
		BCcolors=myBC.map(function(c,i) {
				if(i<11 && c==d3.max(myBC.slice(0,11)) || c==d3.max(myBC.slice(11,14))) {return "darkorange"} else {return "steelblue";}
		})}
		svgInfoPanel.select("#infoBC").style("visibility","visible");
		infoBars.data(myBC).select(".bar")
			.transition()
			.attr("y",function(d) {return 100*(1-d);})
			.attr("height",function(d) {return 100*d;})
			.style("fill",function(d,i) {return BCcolors[i];})
		infoBars.select("title").text(function(d) {return d3.format(".3p")(d);});
		svgInfoPanel.select("#infoDetails").text(d.insT2+" électeurs inscrits");



		d3.select("#reset").transition().style("opacity",function() {return bv.some(function(d) {return d.cir!=d.ocir})?1:0});
		cells.call(brush.clear());
		d3.selectAll(".resize").remove();
		d3.selectAll(".Cundefined").remove();
	}

	function reset() {
		d3.select("#reset").transition().style("opacity",0);
		selected=null;
		selectedBV=null;
		svgInfoPanel.select("#infoTitle").text("Explorez la carte pour avoir le détail sur une circonscription");
		svgInfoPanel.select("#infoDetails").text("");
		svgInfoPanel.select("#infoBC").style("visibility","hidden");
		bv.forEach(function(d,i) {d.cir=d.ocir;})
		recompute();
		cells.selectAll("g").attr("class",function(d) {return "C"+d.cir;})
		selectCir();
		barchart.selectAll("rect").data(tally)
			.transition()
			.attr("height",function(d) {return 265-y(d.values.insT2);})
			.style("fill",function(d) {return cScale(d.values,0);})
			.attr("y",function(d) {return y(d.values.insT2);})
	}

	function recompute() {
		if(typeof(key)==="undefined"){key="cir";}
		
		tally=d3.range(1,19).map(function(d) {return {
				key:d,
				values: {
					insT1:0,	blaT1:0,	jolT1:0,
					lepT1:0,	sarT1:0,	melT1:0,
					pouT1:0,	artT1:0,	cheT1:0,
					bayT1:0,	dupT1:0,	holT1:0,
					insT2:0,	blaT2:0,	sarT2:0,
					holT2:0
				}
			}
		});

		bv.forEach(function(d) {
			["insT1","blaT1","jolT1","lepT1","sarT1","melT1","pouT1","artT1","cheT1","bayT1","dupT1","holT1","insT2","blaT2","sarT2","holT2"].forEach(function(key) {
				tally[d.cir-1].values[key]+=(+d[key]);
			})
		})
	}	
});