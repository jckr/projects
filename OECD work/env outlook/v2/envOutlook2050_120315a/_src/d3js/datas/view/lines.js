String.prototype.visualLength = function(myClass)
{
	if(!d3.select("#ruler")[0][0]) {var ruler=d3.select("body").append("span").attr("id","ruler").style("visibility","hidden").style("white-space","nowrap");} else {var ruler=d3.select("#ruler");}
	ruler.classed(myClass,1);
	ruler.html(this);
	return ruler[0][0].offsetWidth;
}

d3.select("h2").html(data.title);
d3.select("h3").html(data.subtitle);
d3.select("#footnote").html(data.footnote);
d3.select("#tagline").html(data.tagline);

if (!palette) var palette=d3.scale.category20c();

data.series.forEach(function(d,i) {d.color=palette(i);if(d.selected){d.color="black";}})

var myBtnGrp =  d3.selectAll('#linesBtn');
					
var myButtons = myBtnGrp.append("div")
					.classed('btn-group',1)
					.attr("data-toggle",'buttons-checkbox')
					.selectAll("button")
					.data(data.series.filter(function(d) {return !d.selected;})).enter()
					.append("button")
					.classed("btn",1)
					// .style("color",function(d,i) {return d.color;})
					.attr("name",function(d,i) {return "checkbox"+i;})
					.attr("value",function(d,i) {return i;})
					.html(function(d) {return d.name;});
					
myButtons.on("mousedown",function(d,i) {toggleBtn(d,i); drawStart(i);})


function toggleBtn(d,i) {
/*
	var curBtn = d3.select(myButtons[0][i]);
	var lineCoul = palette(i)
	var curCoul =  curBtn.style("color").toString()
	var curstate = ( lineCoul == curCoul);
	
	console.log("pCol", lineCoul);
	console.log("bcol", curCoul);
	console.log("bool", curstate);
*/
}
var checkedBtn=d3.range(data.series.length).map(function(d) {return 0;})

var svg=d3.selectAll("#chart").append("svg:svg").attr("height",h).attr("width",w);

var x=d3.scale.linear().domain(data.domain.x).range(data.range.x);
var y=d3.scale.linear().domain(data.domain.y).range(data.range.y);
var d=d3.scale.linear().domain(data.domain.d).range(data.range.d);

var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(5)
    .tickSize(6, 3, 0)
    .tickFormat(d3.format(""));
    
var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(5)
    .orient("left")
    .tickSize(6, 3, 0)
    .tickFormat(d3.format(""));

var myxAxis=svg.append("svg:g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (h-20)+ ")")
      .call(xAxis);

var myyAxis=svg.append("svg:g")
      .attr("class", "y axis")
      .attr("transform", "translate(50,0)")
      .call(yAxis);
      
svg.append("svg:text").attr("transform","rotate(-90) translate(-100,20)").text(data.yAxisLabel).attr("x",20).attr("y",0);

d3.selectAll(".axis").selectAll("path, line").style("stroke","black");
		

var drawSegment=function(i,s) {
	var mySeries=data.series[i];
	if(s>=mySeries.values.length-1) {$('circle').tipsy({html: true, gravity: 's'});return;} // when the last segment is reached, drop it
	else {
		var myG=svg.select("#g"+i);
		var lines=myG.select(".lines");var circles=myG.select(".circles");
		var label=myG.select(".labelText");var labelR=myG.select(".labelR")
		lines.append("svg:line")
			.attr("x1",x(mySeries.values[s].year))
			.attr("x2",x(mySeries.values[s].year))
			.attr("y1",y(mySeries.values[s].value))
			.attr("y2",y(mySeries.values[s].value))
			.style("stroke",mySeries.color)
			.style("stroke-width",2)
			.transition().ease("linear")
			.duration(d(mySeries.values[s+1].year-mySeries.values[s].year))
			.attr("x2",x(mySeries.values[s+1].year))
			.attr("y2",y(mySeries.values[s+1].value))
			.each("end",function() {
				var circle=circles.append("svg:circle")
					.attr("cx",x(mySeries.values[s+1].year))
					.attr("cy",y(mySeries.values[s+1].value))
					.style("fill",mySeries.color)
					.attr("r",0)
					.attr("class","circle c"+i+"-"+s);
				circle.append("svg:title").text(function(d) {return mySeries.values[s+1].value.toFixed(1);})
				circle.transition().duration(500).attr("r",5);
				drawSegment(i,s+1);	// after transition, we try to draw the next segment
			;})
		labelR.transition()
			.attr("x",x(mySeries.values[s+1].year)+10)
			.attr("y",y(mySeries.values[s+1].value)-15)
			.ease("linear")
			.duration(d(mySeries.values[s+1].year-mySeries.values[s].year));	
		label.transition()
			.attr("x",x(mySeries.values[s+1].year)+15)
			.attr("y",y(mySeries.values[s+1].value))
			.ease("linear")
			.duration(d(mySeries.values[s+1].year-mySeries.values[s].year));	
	}
}

var drawStart=function(i) {
	// if (checked[i]) {
	if (checkedBtn[i]) {
		svg.selectAll("#g"+i).remove();
		checkedBtn[i]=0;
	} else {
		var duration=250,ease="linear";
		checkedBtn[i]=1;
		
		mySeries=data.series[i];
		var myG=svg.append("svg:g").classed("series",1).attr("id","g"+i);
		
		myG.on("mouseover",function() {
			svg.selectAll(".series").filter(function() {return d3.select(this).attr("id")!="g"+i;})
			.style("opacity",.2);})
			
		myG.on("mouseout",function() {svg.selectAll("g").style("opacity",1);})
		
		
		myG.append("svg:g").classed("lines",1);
		var circles=myG.append("svg:g").classed("circles",1);
		var circle=circles.append("svg:circle")
			.attr("cx",x(mySeries.values[0].year)) // probably on the y axis, but hey
			.attr("cy",y(mySeries.values[0].value))
			// .style("stroke",mySeries.color).style("stroke-width",3)
			.style("fill",mySeries.color)
			.attr("r",0)
			.attr("class","circle c"+i+"0");
		circle.append("svg:title").text(function(d) {return mySeries.values[0].value.toFixed(1);})
		circle.transition().duration(250).attr("r",3);
		var labelR=myG.append("svg:rect").classed("labelR",1)
			.attr("x",x(mySeries.values[0].year)+10)
			.attr("y",y(mySeries.values[0].value)-15)
			.attr("width",mySeries.name.visualLength("serieslabel") +10)
			.attr("height",20);
		labelR.style("fill","white").style("stroke",mySeries.color);
		var label=myG.append("svg:text").classed("labelText",1).text(mySeries.name).attr("x",x(mySeries.values[0].year)+15).attr("y",y(mySeries.values[0].value));
		drawSegment(i,0);
	}
}
		

data.series.forEach(function(d,i) {if(d.selected) {drawStart(i);}})






