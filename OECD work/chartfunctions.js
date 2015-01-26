var stdFont="'Helvetica Neue', Arial, Helvetica, sans-serif"
var chevron=[{x:0.0167, y:0.0167},{x:0.4667, y:0.3833},{x:0.4667, y:0.6167},{x:0.0167, y:0.9833},{x:0.0167, y:0.75},{x:0.3333, y:0.5},{x:0.0167, y:0.25}]

String.prototype.visualLength = function(myClass)
{
	if(!d3.select("#ruler")[0][0]) {var ruler=d3.select("body").append("span").attr("id","ruler").style("visibility","hidden").style("white-space","nowrap");} else {var ruler=d3.select("#ruler");}
	ruler.classed(myClass,1);
	ruler.html(this);
	return ruler[0][0].offsetWidth;
}


String.prototype.visualFLength = function(font)
{
	if(!d3.select("#ruler")[0][0]) {var ruler=d3.select("body").append("span").attr("id","ruler").style("visibility","hidden").style("white-space","nowrap");} else {var ruler=d3.select("#ruler");}
	ruler.style("font",font);
	ruler.html(this);
	return ruler[0][0].offsetWidth;
}

function chart(attr) {
	var h=function(d) {return attr.hasOwnProperty(d);}
	if(h("chartType")){
		if (attr["chartType"]==0) {clusteredChart(attr);}
		if (attr["chartType"]==1) {stackedChart(attr);}
		if (attr["chartType"]==2) {
			lineChart(attr)
			//lineChartAnimate(attr)
			;}
		if (attr["chartType"]==3) {
			lineChart(attr)
			//lineChartAnimate(attr)
			;}
	}
}

function complete(attr) {
	var sizes=d3.range(5);
	var heights=[533,400,220,195,200];
	var widths=[800,600,330,260,250];
	var fontSizes=[[32,24,16,16],[24,24,12,12],[14,12,10,10],[12,12,9,9],[12,12,9,9]];
	var headerSizes=[87,65,40,40,35];
	var footerSizes=[80,65,50,50,50];
	
	var size;
	var myMin,myMax;
	
	attr["mode"]=0;
	
	var h=function(d) {return attr.hasOwnProperty(d);}
	
	if (h("data")){
		if (sizes.indexOf(parseFloat(attr["size"]))===-1){size=2}else{size=attr["size"];}
		
		if (!h("height")) {attr["height"]=heights[size];}
		if (!h("width"))  {attr["width"] =widths [size];}
		if (!h("fontTitle")) {attr["fontTitle"]="bold "+fontSizes[size][0]+"px "+stdFont;}
		if (!h("fontSubtitle")) {attr["fontSubtitle"]=fontSizes[size][1]+"px "+stdFont;}
		if (!h("fontLabel")) {attr["fontLabel"]=fontSizes[size][2]+"px "+stdFont;}
		if (!h("fontUnit")) {attr["fontUnit"]=fontSizes[size][3]+"px "+stdFont;}
		if (!h("ch")) {attr["ch"]=1.2*(fontSizes[size][0]+fontSizes[size][1]);}
		if (!h("cw")) {attr["cw"]=.5*attr["ch"];}
		if (!h("hTitle")) {attr["hTitle"]=attr["ch"]+5;}
		if (!h("lMargin")) {attr["lMargin"]=attr["cw"]+5;}

		if (!h("title")) {attr["title"]="";}
		if (!h("subtitle")) {attr["subtitle"]="";}
		
		if (!h("logo")) {attr["logo"]=false;}
		if (!h("blue")) {attr["blue"]=false;}
		
		if (h("stacked")) {myMin=d3.min(attr["data"],function(d) {return d3.sum(d.values);});myMin=d3.min([0,myMin]);
				 myMax=d3.max(attr["data"],function(d) {return d3.sum(d.values);});}
			else	{myMin=d3.min(attr["data"],function(d) {return d3.min(d.values);});myMin=d3.min([0,myMin]);
				 myMax=d3.max(attr["data"],function(d) {return d3.max(d.values);});}
		
		if (!h("min")) {attr["min"]=myMin;} else if(isNaN(attr["min"])) {attr["min"]=myMin;}
		if (!h("max")) {attr["max"]=myMax;} else if(isNaN(attr["max"])) {attr["max"]=myMax;}
		
		if (!h("digits")) {attr["digits"]=0;}
	
		if (!h("lAngle")) {attr["lAngle"]=0;}
			
		if (!h("header")) {attr["header"]=headerSizes[size];}
		if (!h("margin")) {attr["margin"]=headerSizes[size];}
		if (!h("axis")) {attr["axis"]=attr["max"].toFixed(attr["digits"]).visualLength(attr["fontLabel"])+5;}
		if (!h("footer")) {attr["footer"]=footerSizes[size];
				 if (attr["lAngle"]) {
				 	attr["footer"]+=d3.max(attr["data"],function(d) {return (12*Math.cos(attr["lAngle"])-d.category.visualLength(attr["fontLabel"])*Math.sin(attr["lAngle"]));})-12
				 }
				}
	}
	return attr;	
}


function stackedChart(attr)
{
// version 2.0
// this is the code for a horizontal, stacked bar chart.

	if (attr["data"]&&attr["div"]) { // that we really need. the rest, we can manage
		attr["stacked"]=true;
		attr=complete(attr);

		var data=attr["data"];
		var div=attr["div"];
		var height=attr["height"];
		var width=attr["width"];
		var min=attr["min"];
		var max=attr["max"];
		var axis=attr["axis"];
		var ticks=attr["ticks"];
		var lAngle=attr["lAngle"];

		var margin=attr["margin"];
		var axis=attr["axis"];
		var header=attr["header"];
		var footer=attr["footer"];

		var chartAreaWidth=width-margin-axis; 
		var chartAreaHeight=height-footer-header; 

		// end of temp variables



		var x=d3.scale.ordinal()
		  .domain(d3.range(data.length))
		  .rangeBands([0,chartAreaWidth],.1);
		var y,y2;
		y=d3.scale.linear().domain([min,max]).range([chartAreaHeight,0]);
		y2=d3.scale.linear().domain([0,max-min]).range([0,chartAreaHeight]);
		d3.select(div).selectAll("svg").remove();
		var svg=d3.select(div).append("svg:svg");
		svg.attr("width",width).attr("height",height)
		svg.append("svg:rect").attr("width",width).attr("height",height).style("fill","white");
		var chart=svg.append("svg:g");
		var chartarea=svg.append("svg:g").attr("transform","translate("+axis+","+header+")").classed("chartarea",1);
		chartarea.append("svg:rect").attr("width",chartAreaWidth).attr("height",chartAreaHeight).style("fill","white").style("stroke","#0078ba").classed("chartBkg",1);;
		var columns=chartarea
			.selectAll(".column")
			.data(data)
			.enter()
			.append("svg:g")
			.attr("class","column");

		columns.attr("transform", function(d,i) {return "translate("+x(i)+",0)";})
		columns.selectAll("a").data(
				function(d) {
					return d.values.map(function(v,i) {return [d.category,parseFloat(v),d3.sum(d.values.slice(0,i)),((attr["sColor"]+i)%10)];})}
			).enter()
			.append("svg:a").attr("title",function(d) {return d[0]+": "+d[1];})
			.append("svg:rect")
				.attr("class",function(d) {return "stackedRect v"+d[3];})
				.attr("y",y(0))
				.attr("height",0)
				.attr("width",function() {return x.rangeBand();});
		columns.selectAll(".stackedRect").transition()
			.delay(100).duration(1000)
			.attr("y",function(d) {return y(d3.max([d[2]+d[1],0]));})
			.attr("height",function(d) {return y2(Math.abs(d[1]));})

		columns.selectAll("rect")
			.on("mouseover",function() {d3.select(this).classed("highlighted",1);})
			.on("mouseout",function()  {d3.select(this).classed("highlighted",0);});
		if ($) {$('a').tipsy({html: true, gravity: 's'});}


		writeHLabels(attr);
		drawGridlines(attr);
		writeVLabels(attr);
		writeTitle(attr);
		writeLegends(attr);
		writeSource(attr);
	}
}

function clusteredChart(attr)
{
// version 2.0
// this is the code for a horizontal, clustered bar chart.

	if (attr["data"]&&attr["div"]) { // that we really need. the rest, we can manage
		attr["stacked"]=false;
		attr=complete(attr);

		var data=attr["data"];
		var div=attr["div"];
		var height=attr["height"];
		var width=attr["width"];
		var min=attr["min"];
		var max=attr["max"];
		var axis=attr["axis"];
		var ticks=attr["ticks"];
		var lAngle=attr["lAngle"];

		var margin=attr["margin"];
		var axis=attr["axis"];
		var header=attr["header"];
		var footer=attr["footer"];

		var nbSeries=attr["nbSeries"];

		var chartAreaWidth=width-margin-axis; 
		var chartAreaHeight=height-footer-header; 

		// end of temp variables

		var x=d3.scale.ordinal()
		  .domain(d3.range(data.length))
		  .rangeBands([0,chartAreaWidth],.1);
		var y,y2;
		y=d3.scale.linear().domain([min,max]).range([chartAreaHeight,0]);
		y2=d3.scale.linear().domain([0,max-min]).range([0,chartAreaHeight]);
		d3.select(div).selectAll("svg").remove();
		var svg=d3.select(div).append("svg:svg");
		svg.attr("width",width).attr("height",height)
		svg.append("svg:rect").attr("width",width).attr("height",height).style("fill","white").style("stroke","#0078ba").classed("chartBkg",1);;
		var chart=svg.append("svg:g");
		var chartarea=svg.append("svg:g").attr("transform","translate("+axis+","+header+")").classed("chartarea",1);
		chartarea.append("svg:rect").attr("width",chartAreaWidth).attr("height",chartAreaHeight).style("fill","white");
		var columns=chartarea
			.selectAll(".column")
			.data(data)
			.enter()
			.append("svg:g")
			.attr("class","column");

		columns.attr("transform", function(d,i) {return "translate("+x(i)+",0)";})
		columns.selectAll("a").data(
				function(d) {
					return d.values.map(function(v,i) {return [d.category,parseFloat(v),d3.sum(d.values.slice(0,i)),((attr["sColor"]+i)%10)];})}
			).enter()
			.append("svg:a").attr("title",function(d) {return d[0]+": "+d[1];})
			.append("svg:rect")
				.attr("class",function(d) {return "clusteredRect v"+d[3];})
				.attr("y",y(0))
				.attr("height",0)
				.attr("x",function(d,i) {return i*x.rangeBand()/nbSeries;})
				.attr("width",function() {return x.rangeBand()/nbSeries;});
		columns.selectAll(".clusteredRect").transition()
			.delay(100).duration(1000)
			.attr("y",function(d) {return y(d3.max([d[1],0]));})
			.attr("height",function(d) {return y2(Math.abs(d[1]));})

		columns.selectAll("rect")
			.on("mouseover",function() {d3.select(this).classed("highlighted",1);})
			.on("mouseout",function()  {d3.select(this).classed("highlighted",0);});
		if ($) {$('a').tipsy({html: true, gravity: 's'});}


		writeHLabels(attr);
		drawGridlines(attr);
		writeVLabels(attr);
		writeTitle(attr);
		writeLegends(attr);
		writeSource(attr);
	}
}


function lineChart(attr)
{
// version 2.0
// works, but soon to be deprecated
// this is the code for a horizontal, clustered bar chart.

	if (attr["data"]&&attr["div"]) { // that we really need. the rest, we can manage
		attr["stacked"]=false;
		attr=complete(attr);

		var data=attr["data"];
		var div=attr["div"];
		var height=attr["height"];
		var width=attr["width"];
		var min=attr["min"];
		var max=attr["max"];
		var axis=attr["axis"];
		var ticks=attr["ticks"];
		var lAngle=attr["lAngle"];

		var margin=attr["margin"];
		var axis=attr["axis"];
		var header=attr["header"];
		var footer=attr["footer"];

		var nbSeries=attr["nbSeries"];

		var chartAreaWidth=width-margin-axis; 
		var chartAreaHeight=height-footer-header; 

		// end of temp variables
		
		var domain=data.map(function(d) {return d.category;})
		
		var x=d3.scale.ordinal()
		  .domain(domain)
		  .rangePoints([0,chartAreaWidth]);
		var y;
		y=d3.scale.linear().domain([min,max]).range([chartAreaHeight,0]);
		
		var line=d3.svg.line().x(function(d) {return x(d[0]);}).y(function(d) {return y(d[1]);});
		
		
		d3.select(div).selectAll("svg").remove();
		var svg=d3.select(div).append("svg:svg");
		svg.attr("width",width).attr("height",height)
		svg.append("svg:rect").attr("width",width).attr("height",height).style("fill","white").style("stroke","#0078ba").classed("chartBkg",1);;
		var chart=svg.append("svg:g");
		var chartarea=svg.append("svg:g").attr("transform","translate("+axis+","+header+")").classed("chartarea",1);
		chartarea.append("svg:rect").attr("width",chartAreaWidth).attr("height",chartAreaHeight).style("fill","white");
		
		writeVLabels(attr);
		drawLGridlines(attr);
		
		
		domain.forEach(function(s,i) {
			var lineData=[];
			data.forEach(function(d) {
				if(d.values.length>i) {
					if(d.values[i]!="") {
						lineData.push([d.category, parseFloat(d.values[i])]);
					}
				}
			});
			if (lineData.length>1) {
				chartarea.append("svg:path").attr("class","linechart l"+((attr["sColor"]+i)%10))
				.attr("d",line(lineData))
				.style("fill","none");
			}
				
		;})
		
		
		/*columns.selectAll("rect")
			.on("mouseover",function() {d3.select(this).classed("highlighted",1);})
			.on("mouseout",function()  {d3.select(this).classed("highlighted",0);});
		if ($) {$('a').tipsy({html: true, gravity: 's'});}*/


		writeLHLabels(attr);
		
		
		writeTitle(attr);
		writeLegends(attr);
		writeSource(attr);
	}
}
var myLines,myData;

function lineChartAnimate(attr)
{
// version 2.5
// this is the code for a horizontal, clustered bar chart.

	if (attr["data"]&&attr["div"]) { // that we really need. the rest, we can manage
		attr["stacked"]=false;
		attr=complete(attr);

		var data=attr["data"];
		var div=attr["div"];
		var height=attr["height"];
		var width=attr["width"];
		var min=attr["min"];
		var max=attr["max"];
		var axis=attr["axis"];
		var ticks=attr["ticks"];
		var lAngle=attr["lAngle"];

		var margin=attr["margin"];
		var axis=attr["axis"];
		var header=attr["header"];
		var footer=attr["footer"];

		var nbSeries=attr["nbSeries"];

		var chartAreaWidth=width-margin-axis; 
		var chartAreaHeight=height-footer-header; 

		// end of temp variables
		
		var domain=data.map(function(d) {return d.category;})
		
		myData={};
		d3.range(nbSeries).forEach(function(d) {myData[d]=[];})
		data.forEach(function(x) {x.values.forEach(function(d,i) {if(d!=""){myData[i].push([x.category,parseFloat(d)]);}})})
		d3.keys(myData).forEach(function(k) {if (myData[k].length<2) {delete myData[k];}})
		
		var x=d3.scale.ordinal()
		  .domain(domain)
		  .rangePoints([0,chartAreaWidth]);
		var y;
		y=d3.scale.linear().domain([min,max]).range([chartAreaHeight,0]);
		
		var liner=d3.svg.line().x(function(d) {return x(d[0]);}).y(function(d) {return y(d[1]);});
		
		
		
		
		d3.select(div).selectAll("svg").remove();
		var svg=d3.select(div).append("svg:svg");
		svg.attr("width",width).attr("height",height)
		svg.append("svg:rect").attr("width",width).attr("height",height).style("fill","white").style("stroke","#0078ba").classed("chartBkg",1);
		var chart=svg.append("svg:g");
		var chartarea=svg.append("svg:g").attr("transform","translate("+axis+","+header+")").classed("chartarea",1);
		chartarea.append("svg:rect").attr("width",chartAreaWidth).attr("height",chartAreaHeight).style("fill","white");
		
		chartarea.selectAll(".lineChart").data(d3.keys(myData)).enter().append("g").classed("lineChart",1);
		
		
		myLines=chartarea.selectAll(".lineChart")
		var lineData;		
		domain.forEach(function(s,i) {
//			var lineData=[];
			lineData=[];
			data.forEach(function(d) {
				if(d.values.length>i) {
					if(d.values[i]!="") {
						lineData.push([d.category, parseFloat(d.values[i])]);
					}
				}
			});
			
			
			
			
			
			
			
			
			
			if (lineData.length>1) {
				chartarea.append("svg:path").attr("class","linechart l"+((attr["sColor"]+i)%10))
				.style("fill","none")
				.attr("d",liner(lineData));
			}
				
		;})
		
		
		//columns.selectAll("rect")
		//	.on("mouseover",function() {d3.select(this).classed("highlighted",1);})
		//	.on("mouseout",function()  {d3.select(this).classed("highlighted",0);});
		//if ($) {$('a').tipsy({html: true, gravity: 's'});}


	//	writeLHLabels(attr);
	//	drawLGridlines(attr);
		writeVLabels(attr);
		writeTitle(attr);
		writeLegends(attr);
		writeSource(attr);
		
		
		
		function draw(k) {
			svg.selectAll("path.lineChart").each(function(d,i) {
				var myLine=d3.select(this);
				myLine.transition().attr("d",function(d) {return liner(myData[i].slice(0,k));});
			})
		}
	}
}


function writeHLabels(attr) {
	var chartarea=d3.select(attr["div"]).select(".chartarea");
	var chartAreaWidth=attr["width"]-attr["margin"]-attr["axis"];
	var chartAreaHeight=attr["height"]-attr["footer"]-attr["header"]
	var data=attr["data"];
	
	var x=d3.scale.ordinal()
	  .domain(d3.range(data.length))
  	  .rangeBands([0,chartAreaWidth],.1);

	var labels=chartarea
		.selectAll(".hLabel")
		.data(attr["data"])
		.enter()
		.append("svg:g")
		.attr("class","hLabel");
	labels.attr("transform", function(d,i) {return "translate("+x(i)+","+(chartAreaHeight)+")";})
		.append("svg:text")
		.attr("x",-1)
		.attr("dy",".35em")
		.text(function(d) {return d.category;})
		.style("font",attr["fontLabel"])
	if (attr["lAngle"]) {
		//labels.selectAll("text").attr("transform","rotate("+(-attr["lAngle"])+","+(x.rangeBand()/2)+",0),translate("+(x.rangeBand()/2)+",5)")
		labels.selectAll("text").attr("transform","rotate("+(attr["lAngle"])+"),translate(-5,"+(x.rangeBand()/2)+")")
		.attr("text-anchor","end");}
	else {labels.selectAll("text").attr("transform","translate("+(x.rangeBand()/2)+",5)")
		//.style("dominant-baseline","hanging")
		.attr("dy",".71em")
		.attr("text-anchor","middle");}
}

function writeLHLabels(attr) {
	var chartarea=d3.select(attr["div"]).select(".chartarea");
	var chartAreaWidth=attr["width"]-attr["margin"]-attr["axis"];
	var chartAreaHeight=attr["height"]-attr["footer"]-attr["header"]
	var data=attr["data"];
	var domain=data.map(function(d) {return d.category;})
	var x=d3.scale.ordinal().domain(domain).rangePoints([0,chartAreaWidth]);

	var labels=chartarea
		.selectAll(".hLabel")
		.data(attr["data"])
		.enter()
		.append("svg:g")
		.attr("class","hLabel");
	labels.attr("transform", function(d,i) {return "translate("+x(i)+","+(chartAreaHeight)+")";})
		.append("svg:text")
		.attr("x",-1)
		.attr("dy",".35em")
		.text(function(d) {return d.category;})
		.style("font",attr["fontLabel"])
	if (attr["lAngle"]) {
		//labels.selectAll("text").attr("transform","rotate("+(-attr["lAngle"])+","+(x.rangeBand()/2)+",0),translate("+(x.rangeBand()/2)+",5)")
		labels.selectAll("text").attr("transform","rotate("+(attr["lAngle"])+"),translate(-5,"+(x.rangeBand()/2)+")")
		.attr("text-anchor","end");}
	else {labels.selectAll("text").attr("transform","translate("+(x.rangeBand()/2)+",5)")
		//.style("dominant-baseline","hanging")
		.attr("dy",".71em")
		.attr("text-anchor","middle");}
}


function drawGridlines(attr) {
	var chartarea=d3.select(attr["div"]).select(".chartarea");
	var chartAreaWidth=attr["width"]-attr["margin"]-attr["axis"];
	var chartAreaHeight=attr["height"]-attr["footer"]-attr["header"];
	var data=attr["data"];var min=attr["min"];var max=attr["max"];
	var y=d3.scale.linear().domain([min,max]).range([chartAreaHeight,0]);
	var gridlines=chartarea
		.selectAll(".gridline")
		.data(y.ticks(attr["vTicks"]))
		.enter()
		.append("svg:line").attr("class","gridline");
	gridlines
		.attr("shape-rendering","crispEdges")
		.attr("x1",0).attr("x2",chartAreaWidth)
		.attr("y1",function(d) {return y(d)+.5;})
		.attr("y2",function(d) {return y(d)+.5;})
}

function drawLGridlines(attr) {
	var chartarea=d3.select(attr["div"]).select(".chartarea");
	var chartAreaWidth=attr["width"]-attr["margin"]-attr["axis"];
	var chartAreaHeight=attr["height"]-attr["footer"]-attr["header"];
	var data=attr["data"];var min=attr["min"];var max=attr["max"];
	var y=d3.scale.linear().domain([min,max]).range([chartAreaHeight,0]);
	var domain=data.map(function(d) {return d.category;})
	var x=d3.scale.ordinal().domain(domain).rangePoints([0,chartAreaWidth]);
	chartarea
		.selectAll(".gridline.h")
		.data(y.ticks(attr["vTicks"]))
		.enter()
		.append("svg:line").attr("class","gridline h")
		.attr("shape-rendering","crispEdges")
		.attr("x1",0).attr("x2",chartAreaWidth)
		.attr("y1",function(d) {return y(d)+.5;})
		.attr("y2",function(d) {return y(d)+.5;});
	chartarea
		.selectAll(".gridline.v")
		.data(domain)
		.enter()
		.append("svg:line").attr("class","gridline v")
		.attr("shape-rendering","crispEdges")
		.attr("x1",function(d) {return d3.min([x(d),chartAreaWidth-1]);})
		.attr("x2",function(d) {return d3.min([x(d),chartAreaWidth-1]);})
		.attr("y1",0)
		.attr("y2",chartAreaHeight);
	
	
}




function writeVLabels(attr) {
	var chartarea=d3.select(attr["div"]).select(".chartarea");
	var chartAreaWidth=attr["width"]-attr["margin"]-attr["axis"];
	var chartAreaHeight=attr["height"]-attr["footer"]-attr["header"];
	var data=attr["data"];var min=attr["min"];var max=attr["max"];
	var y=d3.scale.linear().domain([min,max]).range([chartAreaHeight,0]);
	var ylabels=chartarea
		.selectAll(".ylabel")
		.data(y.ticks(attr["vTicks"]))
		.enter()
		.append("svg:text").attr("class","ylabel").style("font",attr["fontLabel"]);
	ylabels
		.attr("x",-3).attr("dy",".35em").attr("text-anchor","end")
		.attr("transform",function(d) {return "translate(0,"+(y(d)+.5)+")";})
		.text(String)
}

function writeLegends(attr) {
	seriesNames=attr["legends"].slice(1,10);
	var svg=d3.select(attr["div"]).select("svg");
	var nbLines=1;
	var width=attr["width"],height=attr["height"];
	var cursor=10;
	seriesNames.forEach(function(d,i) {
		if((cursor+=20+d.visualFLength(attr["fontUnit"]))>(width-10)){
			nbLines++;cursor=30+d.visualFLength(attr["fontUnit"]);}
		});
	var legends=svg.append("svg:g").attr("transform","translate(10,"+(height-nbLines*20)+")").classed("legends",1);
	cursor=10;var currentLine=0;
	seriesNames.forEach(function(d,i) {
		legends.append("svg:rect")
			.attr("x",cursor)
			.attr("y",3+currentLine*20)
			.attr("width",15)
			.attr("height",11)
			.classed("v"+(i+attr["sColor"])%10,1);
		cursor+=20;
		legends.append("svg:text")
			.text(d)
			.attr("x",cursor)
			.attr("dy",".25em")
			.attr("y",10+currentLine*20)
			.style("font",attr["fontUnit"]);
		cursor+=d.visualFLength(attr["fontUnit"])+5;
		if(i<(seriesNames.length-1)) {if(cursor+35+seriesNames[i+1].visualFLength(attr["fontUnit"])>width) {cursor=10;currentLine++;}}
	;})
}

function addImportant(attr) {
	var svg=d3.select(attr["div"]).select("svg");
	var data=attr["data"];
	var width=attr["width"],height=attr["height"];
	var chartAreaHeight=attr["height"]-attr["footer"]-attr["header"];
	var chartAreaWidth=attr["width"]-attr["margin"]-attr["axis"];
	var x=d3.scale.ordinal()
	  .domain(d3.range(data.length))
	  .rangeBands([0,chartAreaWidth],.1);
	  
	var nbSeries=attr["nbSeries"];
	var chartType=attr["chartType"];
	var widthDivider=chartType?1:nbSeries;
	var startingX=chartType?0:(1/nbSeries);
	
	
	var dataI=attr["data"].filter(function(d) {return d.important;})
	var x1=d3.scale.ordinal()
		.domain(d3.range(dataI.length))
		.rangeBands([0,chartAreaWidth],.1);
	
	d3.select(attr["div"]).selectAll(".button").remove();
	
	
	var importantCols=function() {return svg.selectAll(".column").filter(function(d) {return  d.important;});}
	var othercols=    function() {return svg.selectAll(".column").filter(function(d) {return !d.important;});}
	
	// on init: show few countries.
		
	othercols().selectAll("rect").attr("width",0);
	importantCols().attr("transform",function(d,i) {return "translate("+x1(i)+",0)";})
	importantCols().selectAll("rect")
		.attr("width",function() {return x1.rangeBand()/widthDivider;})
		.attr("x",function(d,i) {return i*x1.rangeBand()*startingX;});
	svg.selectAll(".hLabel").filter(function(d) {return !d.important;}).attr("visibility","hidden");
	svg.selectAll(".hLabel").filter(function(d) {return d.important;})
				.attr("transform",function(d,i) {return "translate("+x1(i)+","+chartAreaHeight+")";})
	attr["mode"]=0;
	var myButton=d3.select(attr["div"]).append("a")
		.style("top",attr["hTitle"]+10)
		.style("left",attr["width"]-80)
		.style("position","absolute")
		.classed("button",1).classed("btn",1).classed("small",1).attr("href","#nogo");
	myButton.html(function() {return attr["mode"]?"show less":"show more";})
	myButton.on("click",function() {
		if(attr["mode"]) { // we go from full view to restricted view
			othercols().selectAll("rect").transition().attr("width",0);
			importantCols().transition()
				.attr("transform",function(d,i) {return "translate("+x1(i)+",0)";});
			importantCols().selectAll("rect").transition()
				.attr("width",function() {return x1.rangeBand()/widthDivider;})
				.attr("x",function(d,i) {return i*x1.rangeBand()*startingX;});
			svg.selectAll(".hLabel").filter(function(d) {return !d.important;}).attr("visibility","hidden");
			svg.selectAll(".hLabel").filter(function(d) {return d.important;}).transition()
				.attr("transform",function(d,i) {return "translate("+x1(i)+","+chartAreaHeight+")";})
			attr["mode"]=0;
			myButton.html("show more");
		} else { // we go from restricted view to full view
			svg.selectAll(".column").transition()
				.attr("transform",function(d,i) {return "translate("+x(i)+",0)";});
			svg.selectAll(".column").selectAll("rect").transition()
				.attr("width",function() {return x.rangeBand()/widthDivider;})
				.attr("x",function(d,i) {return i*x.rangeBand()*startingX;})
			svg.selectAll(".hLabel").filter(function(d) {return !d.important;}).attr("visibility","visible");
			svg.selectAll(".hLabel").transition()
				.attr("transform",function(d,i) {console.log("translate("+x(i)+","+chartAreaHeight+")");return "translate("+x(i)+","+chartAreaHeight+")";})
			attr["mode"]=1;
			myButton.html("show less");
		}
	})
}



function writeTitle(attr) {
	var svg=d3.select(attr["div"]).select("svg");
	svg.selectAll(".titleBox").remove();
	line=d3.svg.line().x(function(d) {return d.x*attr["cw"];}).y(function(d) {return d.y*attr["ch"];})

	var titleBox=svg.append("svg:g").classed("titleBox",1).classed("blue",attr["blue"]);
	titleBox
		.append("svg:rect").attr("x",0).attr("y",0).attr("width",attr["width"]).attr("height",attr["hTitle"])
	titleBox.append("svg:text")
		.attr("x",(attr["logo"]?attr["cw"]:0)+5)
		.attr("y",(attr["hTitle"]/2-5))
		.text(attr["title"]).style("font",attr["fontTitle"]);
	titleBox.append("svg:text")
		.attr("x",(attr["logo"]?attr["cw"]:0)+5)
		.attr("y",attr["hTitle"]/2+2)
		//.style("dominant-baseline","hanging")
		.attr("dy",".71em")
		.text(attr["subtitle"])
		.style("font",attr["fontSubtitle"]);
	if (attr["logo"]) {titleBox.append("svg:path").attr("d",line(chevron)+"Z").attr("transform","translate(1,"+(attr["hTitle"]-attr["ch"])/2+")");
			   titleBox.append("svg:path").attr("d",line(chevron)+"Z").attr("transform","translate("+(1+.5*attr["cw"])+","+(attr["hTitle"]-attr["ch"])/2+")");};
}

function writeSource(attr) {
	var svg=d3.select(attr["div"]).select("svg");
	var width=attr["width"],height=attr["height"];
	var chartAreaHeight=attr["height"]-attr["footer"]-attr["header"];
	var chartAreaWidth=attr["width"]-attr["margin"]-attr["axis"];
	
	svg.selectAll(".sources").remove();
	var sources=svg.append("svg:g").classed("sources",1);
	sources.attr("transform","translate("+(width-10)+","+(height-10)+")")
	sources.append("svg:text").attr("text-anchor","end").text(attr["source"]).style("font",attr["fontUnit"]);

}




function makeSlideShow(div){
	var slideShow=d3.select(div);
	var slides=slideShow.selectAll(".slide");
	var nbSlides=slides[0].length;
	var buttons=slideShow.append("ul").attr("class","buttons");
	var current=1;
	buttons.selectAll("li").data(d3.range(nbSlides)).enter().append("li")
		.html(function(d) {return d+1;})
		.on("click", function(d) {isCurrent(d+1);});
	buttons.append("li").attr("class","next")
		.html("NEXT")
		.on(
			"click", 
			function(d) {
				isCurrent(
					Math.min(nbSlides,current+1)
				);
			}
		);
	
	
	slideShow.selectAll(".slide").filter(function(d,i) {return i==current-1;}).classed("current",1);

	
	function isCurrent(slideID) {
		eval(slideShow.selectAll(".current").attr("exit"));
		slideShow.selectAll(".current").classed("current",0);
		slideShow.selectAll(".slide").filter(function(d,i) {return (i+1)==slideID;}).classed("current",1);
		eval(slideShow.selectAll(".current").attr("entry"));
	}
	

}

function test()
{d3.selectAll(".span7").selectAll("#chart2").remove();
 d3.selectAll(".span7").append("div").attr("id","chart2");
 attr["div"]="#chart2"
 chart(attr);
 //clusteredChart(attr);
 //lineChart(attr);
 }
 
 