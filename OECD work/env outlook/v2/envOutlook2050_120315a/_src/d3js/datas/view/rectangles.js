d3.select("h2").html(series.title);
d3.select("#text").html("The <strong>areas</strong> of the rectangles show the size of GDP. The <strong>heights</strong> represent the contribution of GDP/capita, and the <strong>widths</strong> that of population.")

var w=615,h=450;


var chart=d3.select("#chart");
chart.append("div").classed("h1",1);



var svg=d3.select("#chart").append("svg:svg").attr("width",w).attr("height",h);

var x=d3.scale.linear().domain(series.x).range([100,w-50]);
var y=d3.scale.linear().domain(series.y).range([h-50,50]);

var year=0;	
var duration=50;

d3.select("button").on("click",function() {draw('asc')});
	

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
      .attr("transform", "translate(0," + (h-50)+ ")")
      .call(xAxis);

var myyAxis=svg.append("svg:g")
      .attr("class", "y axis")
      .attr("transform", "translate(100,0)")
      .call(yAxis);
      
svg.append("svg:text").attr("transform","rotate(-90) translate(-180,60)").text("GDP / capita, '000$").attr("x",20).attr("y",0);
svg.append("svg:text").attr("text-anchor","end").text("Population, millions").attr("x",w-50).attr("y",h-20);



d3.selectAll(".axis").selectAll("path, line").style("stroke","black");

var lilCursorUp=function(k) {
	var sketch=[[0,0],[-k,k],[-k,1.5*k],[k,1.5*k],[k,k]];
	return d3.svg.line().x(function(d) {return d[0];}).y(function(d) {return d[1];})(sketch)+"Z";
}

var lilCursorLeft=function(k) {
	var sketch=[[0,0],[-k,-k],[-1.5*k,-k],[-1.5*k,k],[-k,k]];
	return d3.svg.line().x(function(d) {return d[0];}).y(function(d) {return d[1];})(sketch)+"Z";
}
init()


function init() {
	
	
	d3.select("#yearView").html("Year: "+data[year].key);
	
	svg.selectAll("rect").data(data[year].values).enter().append("svg:rect")
		.attr("x",x(0))
		.attr("y",function(d) {return y(d.values[2].value);})
		.attr("height",function(d) {return y(0)-y(d.values[2].value);})
		.attr("width",function(d)  {return x(d.values[0].value)-x(0);})
		.style("fill",function(d,i) {return variables[i].color;})
		//.style("stroke-width",2)
		//.style("fill","none")
		//.style("fill","palegreen")
		.style("opacity",.5)

	svg.selectAll(".lcL").data(variables).enter().append("svg:path")
		.classed("lcL",1)
		.attr("d",lilCursorLeft(5))
		.attr("transform",function(d,i){return "translate(98,"+y(data[0].values[i].values[2].value)+")";})
		.style("fill",function(d) {return d.color;})
	svg.selectAll(".lcLt").data(variables).enter().append("svg:text")
		.classed("lcLt",1)
		.attr("x",90)
		.attr("y",function(d,i) {return y(data[0].values[i].values[2].value)+5;})
		.attr("text-anchor","end")
		.text(function(d) {return d.key+" (2010)";}).style("fill","#aaa")
		
	svg.selectAll(".lcU").data(variables).enter().append("svg:path")
		.classed("lcU",1)
		.attr("d",lilCursorUp(5))
		.attr("transform",function(d,i){return "translate("+x(data[0].values[i].values[0].value)+","+(h-50)+")";})
		.style("fill",function(d) {return d.color;})
	svg.selectAll(".lcUt").data(variables).enter().append("svg:text")
		.classed("lcLt",1)
		.attr("x",function(d,i) {return x(data[0].values[i].values[0].value)+5;})
		.attr("y",h-10)
		.attr("text-anchor","middle")
		.text(function(d) {return d.key;}).style("fill","#aaa")
		
}
	
function draw(order) {
	//console.log(year);
	d3.select("#yearView").html("Year: "+data[year].key);
      		
	d3.select("button").classed("disabled",1);
	svg.selectAll("rect")
		.transition()
		.duration(duration)
		.attr("y",function(d,i) {return y(data[year].values[i].values[2].value);})
		.attr("height",function(d,i) {return y(0)-y(data[year].values[i].values[2].value);})
		.attr("width",function(d,i)  {return x(data[year].values[i].values[0].value)-x(0);})
		.each("end",function(d,i) {//console.log(i);
			if(i==0) { // no need to fire that 4 times
				if (order=="asc") {
					if((year+1)<data.length) {year++;draw(order);} 
					else {
						d3.select("button").classed("disabled",0).html("Reset").on("click",function() {draw('desc');});
						duration=10;
					}
				} else {
					if(year>0) {year--;draw(order);} 
					else {
						d3.select("button").classed("disabled",0).html("Show evolution").on("click",function() {draw('asc')});
						duration=50;
					}
				}
			}
		})
}


