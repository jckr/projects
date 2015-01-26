
var data=[
{key:"Irrigation", values:[{key:"2000", x:0, y:294.723688554549, width:532.778459567763, height:430.449792390401, value:2384.21393096673},{key:"diff", x:0, y:294.723688554549, width:74.8989345398399, height:430.449792390401, value:335.176995123502},{key:"2050", x:74.8989345398399, y:294.723688554549, width:457.879525027923, height:430.449792390401, value:335.176995123502}]},
{key:"Electricity", values:[{key:"x", x:0, y:139.604973304999, width:352.314285673158, height:155.11871524955, value:568.1598144997},{key:"x", x:0, y:0, width:0, height:0, value:0},{key:"x", x:74.8989345398399, y:0, width:452.525163238578, height:294.723688554549, value:0}]},
{key:"Domestic use", values:[{key:"0", x:369.377757476436, y:139.604973304999, width:216.190750163515, height:155.11871524955, value:348.640124753284},{key:"0", x:0, y:0, width:0, height:0, value:0},{key:"74.8989345398399", x:542.102064604552, y:0, width:257.897935395448, height:294.723688554549, value:0}]},
{key:"Livestock", values:[{key:"0", x:352.314285673158, y:139.604973304999, width:17.063471803278, height:155.11871524955, value:27.517416604177},{key:"0", x:0, y:0, width:0, height:0, value:0},{key:"74.8989345398399", x:527.424097778418, y:0, width:14.6779668261344, height:294.723688554549, value:0}]},
{key:"Manufacturing", values:[{key:"369.377757476436", x:532.778459567763, y:294.723688554549, width:52.7900480721877, height:430.449792390401, value:236.238469798918},{key:"0", x:0, y:0, width:0, height:0, value:0},{key:"542.102064604552", x:532.778459567763, y:294.723688554549, width:267.221540432237, height:430.449792390401, value:0}]}];

var data=[
{key:"Irrigation", values:[{key:"2000", x:0, y:294.723688554549, width:532.778459567763, height:430.449792390401, value:2384.21393096673},{key:"diff", x:0, y:294.723688554549, width:74.8989345398399, height:430.449792390401, value:335.176995123502},{key:"2050", x:0, y:294.723688554549, width:457.879525027923, height:430.449792390401, value:335.176995123502}]},
{key:"Electricity", values:[{key:"x", x:0, y:139.604973304999, width:352.314285673158, height:155.11871524955, value:568.1598144997},{key:"x", x:0, y:0, width:0, height:0, value:0},{key:"x", x:0, y:0, width:452.525163238578, height:294.723688554549, value:0}]},
{key:"Domestic use", values:[{key:"0", x:369.377757476436, y:139.604973304999, width:216.190750163515, height:155.11871524955, value:348.640124753284},{key:"0", x:0, y:0, width:0, height:0, value:0},{key:"0", x:467.203130064712, y:0, width:257.897935395448, height:294.723688554549, value:0}]},
{key:"Livestock", values:[{key:"0", x:352.314285673158, y:139.604973304999, width:17.063471803278, height:155.11871524955, value:27.517416604177},{key:"0", x:0, y:0, width:0, height:0, value:0},{key:"0", x:452.525163238578, y:0, width:14.6779668261344, height:294.723688554549, value:0}]},
{key:"Manufacturing", values:[{key:"369.377757476436", x:532.778459567763, y:294.723688554549, width:52.7900480721877, height:430.449792390401, value:236.238469798918},{key:"0", x:0, y:0, width:0, height:0, value:0},{key:"467.203130064712", x:457.879525027923, y:294.723688554549, width:267.221540432237, height:430.449792390401, value:0}]}];


var remnants=[
{key:"total",values:{x:0,y:139.604973304999, width:585.568507639951, height:585.568507639951}},
{key:"irrigation",values:{x:0,y:294.723688554549, width:532.778459567763, height:430.449792390401}}

];

var texts=["In 2000, irrigation was by far the largest use of water, representing over 2 thirds of the water demand.",
"But by 2050, the amount of water used for irrigation will decrease slightly. Irrigation will only account for less than 40% of demand, while manufacturing water demand will be multiplied by 5."];

var x=d3.scale.linear().domain([0,800]).range([50,600]);
var y=d3.scale.linear().domain([0,600]).range([50,400]);
var w=d3.scale.linear().domain([0,800]).range([0,550]);
var h=d3.scale.linear().domain([0,600]).range([0,350]);
var k=2;
d3.select("#chart").attr("height","500px").attr("width","800px");
var svg=d3.select("#chart").append("svg:svg").attr("height","500px").attr("width","800px");
var g=svg.append("svg:g");
var colors=["#8deb88","#E8EB88","#87ceeb","#eb9488","#e688eb"];

d3.select("#text").html(texts[0]);

d3.select("button").on("click",function() {draw();})

g.selectAll("rect").data(data).enter().append("svg:rect").classed("r2000",1)
	.attr("x",function(d) {return x(d.values[0].x)+k;})
	.attr("y",function(d) {return y(d.values[0].y)+k;})
	.attr("rx",2*k).attr("ry",2*k)
	.attr("width",function(d) {return w(d.values[0].width)-2*k;})
	.attr("height",function(d) {return h(d.values[0].height)-2*k;})
	.style("fill",function(d,i) {return i?"dodgerblue":"lawngreen";
		//return colors[i];
	}).append("svg:title").text(function(d) {return d.key+" in 2000: "+d.values[0].value.toFixed(0)+"b m³/year"})

$('rect').tipsy({html: true, gravity: 's'});	

g.append("svg:text")
	.attr("x",(x(data[0].values[0].x)+x(data[0].values[0].width))/2)
	.attr("y",(y(data[0].values[0].y)+y(data[0].values[0].height))/2+30)
	.attr("text-anchor","middle")
	.style("font-size","16px")
	.text("Irrigation: 67% of demand in 2000")
	.style("fill","white")
	

svg.selectAll(".remnants").data(remnants).enter().append("svg:rect").classed("remnants",1)
	.style("opacity",0)
	.attr("rx",2*k).attr("ry",2*k)
	.attr("x",function(d) {return x(d.values.x);})
	.attr("y",function(d) {return y(d.values.y);})
	.attr("width",function(d) {return w(d.values.width);})
	.attr("height",function(d) {return h(d.values.height);})
	.style("stroke","black")
	.style("fill","none")
	.style("stroke-dasharray","2 4");

svg.append("svg:text").attr("x",x(0)).attr("y",y(remnants[0].values.height+remnants[0].values.y)+15).text("Irrigation in 2000").style("opacity",0).classed("remnants",1);
svg.append("svg:text").attr("x",x(remnants[0].values.width)).attr("text-anchor","end").attr("y",y(remnants[0].values.height+remnants[0].values.y)+15).text("Total water use in 2000").style("opacity",0).classed("remnants",1);
	
function draw() {
d3.select("button").classed("disabled",1);


g.selectAll(".r2000").transition().duration(1000)
	.attr("x",function(d) {return x(d.values[2].x)+k;})
	.attr("y",function(d) {return y(d.values[2].y)+k;})
	.attr("width",function(d) {return w(d.values[2].width)-2*k;})
	.attr("height",function(d) {return h(d.values[2].height)-2*k;})
	.style("fill",function(d,i) {
		return i?"paleturquoise":"lawngreen";
		//return colors[i];
	})
	.each("end",function() {
		d3.select("#text").html(texts[1]); 
		d3.select("button")
			.classed("disabled",0)
			.html("Reset")
			.on("click", function() {reset();})
;
g.selectAll(".r2000").selectAll("title").text(function(d) {return d.key+" in 2050: "+d.values[2].value.toFixed(0)+"b m³/year"})
svg.selectAll(".remnants").transition().duration(1000).style("opacity",1)
g.select("text")
	.transition().duration(1000)
	.text("Irrigation: 37% of demand in 2050")
	.attr("x",(x(data[0].values[2].x)+x(data[0].values[2].width))/2+30)
	.attr("y",(y(data[0].values[2].y)+y(data[0].values[2].height))/2+80)

	;})
	
	
	
}

function reset() {
	d3.select("button").classed("disabled",1);
	
	d3.selectAll(".remnants").transition().duration(1000).style("opacity",0);
	d3.selectAll(".r2000").transition().duration(1000)
	.attr("x",function(d) {return x(d.values[0].x)+k;})
	.attr("y",function(d) {return y(d.values[0].y)+k;})
	.attr("width",function(d) {return w(d.values[0].width)-2*k;})
	.attr("height",function(d) {return h(d.values[0].height)-2*k;})
	.style("fill",function(d,i) {return i?"dodgerblue":"lawngreen";
		//return colors[i];
	})
	.each("end",function() {
		d3.select("#text").html(texts[0]); 
		d3.select("button")
			.classed("disabled",0)
			.html("See evolution")
			.on("click", function() {draw();})
	;})
	
	g.select("text")
	.transition().duration(1000)
	.text("Irrigation: 67% of demand in 2000")
	.attr("x",(x(data[0].values[0].x)+x(data[0].values[0].width))/2)
	.attr("y",(y(data[0].values[0].y)+y(data[0].values[0].height))/2+30)

}	
	


