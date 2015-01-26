var data=[
{key:"Irrigation", values:[{key:"2000", x:0, y:140.204872100081, width:421.577842277004, height:459.795127899919, value:2384.21393096673},{key:"diff", x:59.2661558385249, y:243.850909857187, width:362.31168643848, height:356.149090142813, value:2049.03693584322},{key:"2050", x:59.2661558385249, y:243.850909857187, width:467.751154829049, height:356.149090142813, value:2049.03693584322}]},
{key:"Electricity", values:[{key:"x", x:421.577842277004, y:378.716847693073, width:208.746443095329, height:221.283152306927, value:568.1598144997},{key:"x", x:59.2661558385249, y:0, width:474.56024389232, height:140.204872100081, value:1386.54458249443},{key:"x", x:59.2661558385249, y:0, width:445.671363426781, height:243.850909857187, value:1386.54458249443}]},
{key:"Domestic use", values:[{key:"0", x:421.577842277004, y:278.254558821132, width:208.746443095329, height:100.462288871942, value:348.640124753284},{key:"59.2661558385249", x:543.948751956657, y:0, width:256.051248043343, height:140.204872100081, value:790.203538295905},{key:"59.2661558385249", x:526.522510429746, y:0, width:273.477489570254, height:243.850909857187, value:790.203538295905}]},
{key:"Livestock", values:[{key:"421.577842277004", x:421.577842277004, y:140.204872100081, width:21.7783304009965, height:138.049686721051, value:27.517416604177},{key:"59.2661558385249", x:533.826399730845, y:0, width:10.1223522258125, height:140.204872100081, value:44.9735330498734},{key:"59.2661558385249", x:504.937519265306, y:0, width:21.5849911644407, height:243.850909857187, value:44.9735330498734}]},
{key:"Manufacturing", values:[{key:"421.577842277004", x:443.356172678001, y:140.204872100081, width:186.968112694333, height:138.049686721051, value:236.238469798918},{key:"543.948751956657", x:630.324285372334, y:140.204872100081, width:169.675714627666, height:459.795127899919, value:1195.83160300777},{key:"526.522510429746", x:527.017310667574, y:243.850909857187, width:272.982689332426, height:356.149090142813, value:1195.83160300777}]}];

var remnants=[
{key:"total",values:{x:0,y:140.204872100081, width:630, height:459.795127899919}},
{key:"irrigation",values:{x:0,y:140.204872100081, width:421.577842277004, height:459.795127899919}}];


var texts=["In 2000, irrigation was by far the largest use of water, representing over 2 thirds of the water demand","But by 2050, the amount of water used for irrigation will actually decrease. Irrigation will only account for less than 40% of demand, while manufacturing water use will be multiplied by 5"];



var x=d3.scale.linear().domain([0,800]).range([50,600]);
var y=d3.scale.linear().domain([0,600]).range([50,400]);
var w=d3.scale.linear().domain([0,800]).range([0,550]);
var h=d3.scale.linear().domain([0,600]).range([0,350]);
var k=2;
var svg=d3.select("#chart").append("svg:svg");
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
	.style("fill",function(d,i) {return i?"#2973BD":"#98C10F";
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
svg.append("svg:text").attr("x",x(remnants[1].values.width)).attr("y",y(remnants[0].values.height+remnants[0].values.y)+15).text("Total water use in 2000").style("opacity",0).classed("remnants",1);
	
function draw() {
d3.select("button").classed("disabled",1);
g.select("text").remove();

var rdiff=g.selectAll(".rdiff").data(data).enter().append("svg:rect").classed("rdiff",1)
	.style("opacity",0)
	.attr("x",function(d) {return x(d.values[1].x)+k;})
	.attr("y",function(d) {return y(d.values[1].y)+k;})
	.attr("rx",2*k).attr("ry",2*k)
	.attr("width",function(d) {return w(d.values[1].width)-2*k;})
	.attr("height",function(d) {return h(d.values[1].height)-2*k;})
	.style("fill",function(d,i) {
		return i?"#2973BD":"#98C10F";
		//return colors[i];
	});
rdiff.append("svg:title").text(function(d) {return d.key+" in 2050: "+d.values[2].value.toFixed(0)+"b m³/year"})
$('rect').tipsy({html: true, gravity: 's'});	

rdiff.transition().duration(1000).style("opacity",1).each("end",function() {
		svg.selectAll(".remnants").transition().duration(1000).style("opacity",1);
	});
g.append("svg:text")
	.attr("x",(x(data[0].values[0].x)+x(data[0].values[0].width))/2)
	.attr("y",(y(data[0].values[0].y)+y(data[0].values[0].height))/2+30)
	.attr("text-anchor","middle")
	.style("font-size","16px")
	.text("Irrigation: 67% of demand in 2000")
	.style("fill","white")
	
	
g.selectAll(".rdiff").transition()
	.attr("x",function(d) {return x(d.values[2].x)+k;})
	.attr("y",function(d) {return y(d.values[2].y)+k;})
	.attr("rx",2*k).attr("ry",2*k)
	.attr("width",function(d) {return w(d.values[2].width)-2*k;})
	.attr("height",function(d) {return h(d.values[2].height)-2*k;})
	.duration(1000).delay(1050)

g.select("text")
	
	.transition().duration(1000).delay(1050)
	.text("Irrigation: 37% of demand in 2050")
	.attr("x",(x(data[0].values[2].x)+x(data[0].values[2].width))/2+30)
	.attr("y",(y(data[0].values[2].y)+y(data[0].values[2].height))/2+80)

g.selectAll(".r2000").transition()
	.style("opacity",0)	
	.duration(1000).delay(1050).each("end",function() {
		d3.select("#text").html(texts[1]); 
		d3.select("button")
			.classed("disabled",0)
			.html("Reset")
			.on("click", function() {reset();})
	;})
	
	
	
}

function reset() {
	d3.select("button").classed("disabled",1);
	g.selectAll(".rdiff").transition()
		.duration(1000)
		.attr("x",function(d) {return x(d.values[1].x)+k;})
		.attr("y",function(d) {return y(d.values[1].y)+k;})
		.attr("width",function(d) {return w(d.values[1].width)-2*k;})
		.attr("height",function(d) {return h(d.values[1].height)-2*k;})
		.each("end",function() {
			d3.select(this).transition()
				.duration(1000)
				.style("opacity",0)
				.each("end",function() {d3.select(this).remove();})
			svg.selectAll(".remnants").transition().duration(1000).style("opacity",0);
		;})
	g.select("text")
	
	.transition().duration(1000)
	.text("Irrigation: 67% of demand in 2000")
	.attr("x",(x(data[0].values[0].x)+x(data[0].values[0].width))/2)
	.attr("y",(y(data[0].values[0].y)+y(data[0].values[0].height))/2+30)
		
	g.selectAll(".r2000").transition()
		.style("opacity",1)
		.duration(2000).each("end",function() {
			d3.select("#text").html(texts[0]); 
			d3.select("button")
				.classed("disabled",0)
				.html("See evolution")
				.on("click", function() {draw();})
		;})

}	
	


