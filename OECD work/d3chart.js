var data=[{"category":"China","value0":4.7,"value1":0,"value2":0},{"category":"Hungary","value0":0,"value1":4.7,"value2":0},{"category":"Portugal","value0":0,"value1":4.9,"value2":0},{"category":"India","value0":5,"value1":0,"value2":0},{"category":"Estonia","value0":0,"value1":5.1,"value2":0},{"category":"South Africa","value0":5.2,"value1":0,"value2":0},{"category":"Russia","value0":5.3,"value1":0,"value2":0},{"category":"Indonesia","value0":5.5,"value1":0,"value2":0},{"category":"Turkey","value0":0,"value1":5.5,"value2":0},{"category":"Greece","value0":0,"value1":5.8,"value2":0},{"category":"Poland","value0":0,"value1":5.8,"value2":0},{"category":"Japan","value0":0,"value1":6.1,"value2":0},{"category":"Slovak Republic","value0":0,"value1":6.1,"value2":0},{"category":"Slovenia","value0":0,"value1":6.1,"value2":0},{"category":"Korea","value0":0,"value1":6.1,"value2":0},{"category":"Czech Republic","value0":0,"value1":6.2,"value2":0},{"category":"Spain","value0":0,"value1":6.2,"value2":0},{"category":"Italy","value0":0,"value1":6.4,"value2":0},{"category":"Chile","value0":0,"value1":6.6,"value2":0},{"category":"Germany","value0":0,"value1":6.7,"value2":0},{"category":"OECD","value0":0,"value1":0,"value2":6.7},{"category":"Brazil","value0":0,"value1":6.8,"value2":0},{"category":"France","value0":0,"value1":6.8,"value2":0},{"category":"Mexico","value0":0,"value1":6.8,"value2":0},{"category":"Belgium","value0":0,"value1":6.9,"value2":0},{"category":"Iceland","value0":0,"value1":6.9,"value2":0},{"category":"UK","value0":0,"value1":7,"value2":0},{"category":"Luxembourg","value0":0,"value1":7.1,"value2":0},{"category":"New Zealand","value0":0,"value1":7.2,"value2":0},{"category":"USA","value0":0,"value1":7.2,"value2":0},{"category":"Austria","value0":0,"value1":7.3,"value2":0},{"category":"Ireland","value0":0,"value1":7.3,"value2":0},{"category":"Finland","value0":0,"value1":7.4,"value2":0},{"category":"Israel","value0":0,"value1":7.4,"value2":0},{"category":"Australia","value0":0,"value1":7.5,"value2":0},{"category":"Netherlands","value0":0,"value1":7.5,"value2":0},{"category":"Sweden","value0":0,"value1":7.5,"value2":0},{"category":"Switzerland","value0":0,"value1":7.5,"value2":0},{"category":"Niorway","value0":0,"value1":7.6,"value2":0},{"category":"Canada","value0":0,"value1":7.7,"value2":0},{"category":"Denmark","value0":0,"value1":7.8,"value2":0}];
var myColors=["#e15c12", "#009ee0", "#0078ba", "#b2b2b2"];

var x=d3.scale.ordinal()
  .domain(d3.range(data.length))
  .rangeBands([0,551],.1);

var y=d3.scale.linear().domain([0,10]).range([164,0]);

var svg=d3.select("#chart").append("svg:svg");
svg.attr("width","600").attr("height","400")
svg.append("svg:rect").attr("width",600).attr("height",400).style("fill","white");
var chart=svg.append("svg:g");
var chartarea=svg.append("svg:g").attr("transform","translate(19,95)");
chartarea.append("svg:rect").attr("width",551).attr("height",164).style("fill","#eee");
var columns=chartarea
	.selectAll(".column")
	.data(data)
	.enter()
	.append("svg:g")
	.attr("class","column");

columns.attr("transform", function(d,i) {return "translate("+x(i)+",0)";})
columns
	.append("svg:a").attr("title",function(d) {return d.category+": "+d.value0;})
	.append("svg:rect")
		.attr("class","v0")
		.attr("y",y(0))
		.attr("height",0) 
		.attr("width",function() {return x.rangeBand();});
columns
	.append("svg:a").attr("title",function(d) {return d.category+": "+d.value1;})
	.append("svg:rect")
		.attr("class","v1")
		.attr("y",y(0))
		.attr("height",0) 
		
		.attr("width",function() {return x.rangeBand();});
columns
	.append("svg:a").attr("title",function(d) {return d.category+": "+d.value2;})
	.append("svg:rect")
		.attr("class","v2")
		.attr("y",y(0))
		.attr("height",0) 
		.attr("width",function() {return x.rangeBand();});

columns.selectAll(".v0").transition().delay(100).duration(1000).attr("y",function(d) {return y(d.value0);}).attr("height",function(d) {return y(0)-y(d.value0);});
columns.selectAll(".v1").transition().delay(100).duration(1000).attr("y",function(d) {return y(d.value0+d.value1);}).attr("height",function(d) {return y(0)-y(d.value1);});
columns.selectAll(".v2").transition().delay(100).duration(1000).attr("y",function(d) {return y(d.value0+d.value1+d.value2);}).attr("height",function(d) {return y(0)-y(d.value2);});

columns.selectAll("rect")
	.on("mouseover",function() {d3.select(this).style("fill",myColors[3]);})
	.on("mouseout",function()  {d3.select(this).style("fill",null);});
 $('a').tipsy({html: true, gravity: 's'}); 



var labels=chartarea
	.selectAll(".label")
	.data(data)
	.enter()
	.append("svg:g")
	.attr("class","label");
labels.attr("transform", function(d,i) {return "translate("+x(i)+",164)";})
	.append("svg:text")
	.attr("x",-1)
	.attr("dy",".35em")
	.attr("transform","rotate(-90,"+(x.rangeBand()/2)+",0)")
	.attr("text-anchor","end")
	.text(function(d) {return d.category;})

var gridlines=chartarea
	.selectAll(".gridline")
	.data(y.ticks(5))
	.enter()
	.append("svg:line").attr("class","gridline");
gridlines
	.attr("shape-rendering","crispEdges")
	.attr("x1",0).attr("x2",551)
	.attr("y1",function(d) {return y(d)+.5;})
	.attr("y2",function(d) {return y(d)+.5;})
var ylabels=chartarea
	.selectAll(".ylabel")
	.data(y.ticks(5))
	.enter()
	.append("svg:text").attr("class","ylabel");
ylabels
	.attr("x",-3).attr("dy",".35em").attr("text-anchor","end")
	.attr("transform",function(d) {return "translate(0,"+(y(d)+.5)+")";})
	.text(String)

