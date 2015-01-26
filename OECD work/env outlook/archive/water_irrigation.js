var data=[
{key:"irrigation", values:[{key:"2000", x:0, y:140.204872100081, width:421.577842277004, height:459.795127899919},{key:"diff", x:59.2661558385249, y:243.850909857187, width:362.31168643848, height:356.149090142813},{key:"2050", x:59.2661558385249, y:243.850909857187, width:467.751154829049, height:356.149090142813}]},
{key:"electricity", values:[{key:"x", x:421.577842277004, y:378.716847693073, width:208.746443095329, height:221.283152306927},{key:"x", x:59.2661558385249, y:0, width:474.56024389232, height:140.204872100081},{key:"x", x:59.2661558385249, y:0, width:445.671363426781, height:243.850909857187}]},
{key:"domestic use", values:[{key:"0", x:421.577842277004, y:278.254558821132, width:208.746443095329, height:100.462288871942},{key:"59.2661558385249", x:543.948751956657, y:0, width:256.051248043343, height:140.204872100081},{key:"59.2661558385249", x:526.522510429746, y:0, width:273.477489570254, height:243.850909857187}]},
{key:"livestock", values:[{key:"421.577842277004", x:421.577842277004, y:140.204872100081, width:21.7783304009965, height:138.049686721051},{key:"59.2661558385249", x:533.826399730845, y:0, width:10.1223522258125, height:140.204872100081},{key:"59.2661558385249", x:504.937519265306, y:0, width:21.5849911644407, height:243.850909857187}]},
{key:"manufacturing", values:[{key:"421.577842277004", x:443.356172678001, y:140.204872100081, width:186.968112694333, height:138.049686721051},{key:"543.948751956657", x:630.324285372334, y:140.204872100081, width:169.675714627666, height:459.795127899919},{key:"526.522510429746", x:527.017310667574, y:243.850909857187, width:272.982689332426, height:356.149090142813}]}];


var x=d3.scale.linear().domain([0,800]).range([50,600]);
var y=d3.scale.linear().domain([0,600]).range([50,400]);
var w=d3.scale.linear().domain([0,800]).range([0,550]);
var h=d3.scale.linear().domain([0,600]).range([0,350]);
var k=2;
var svg=d3.select("#chart").append("svg:svg");

var colors=["#8deb88","#E8EB88","#87ceeb","#eb9488","#e688eb"];

svg.selectAll("rect").data(data).enter().append("svg:rect").classed("r2000",1)
	.attr("x",function(d) {return x(d.values[0].x)+k;})
	.attr("y",function(d) {return y(d.values[0].y)+k;})
	.attr("rx",2*k).attr("ry",2*k)
	.attr("width",function(d) {return w(d.values[0].width)-2*k;})
	.attr("height",function(d) {return h(d.values[0].height)-2*k;})
	.style("fill",function(d,i) {return "steelblue";
		//return colors[i];
	})
	
	
svg.selectAll(".rdiff").data(data).enter().append("svg:rect").classed("rdiff",1)
	.style("opacity",0)
	.attr("x",function(d) {return x(d.values[1].x)+k;})
	.attr("y",function(d) {return y(d.values[1].y)+k;})
	.attr("rx",2*k).attr("ry",2*k)
	.attr("width",function(d) {return w(d.values[1].width)-2*k;})
	.attr("height",function(d) {return h(d.values[1].height)-2*k;})
	.style("fill",function(d,i) {
		return i?"aliceblue":"steelblue";
		//return colors[i];
	})
	.transition().duration(1000).style("opacity",1);
	
svg.selectAll(".rdiff").transition()
	.attr("x",function(d) {return x(d.values[2].x)+k;})
	.attr("y",function(d) {return y(d.values[2].y)+k;})
	.attr("rx",2*k).attr("ry",2*k)
	.attr("width",function(d) {return w(d.values[2].width)-2*k;})
	.attr("height",function(d) {return h(d.values[2].height)-2*k;})
	.duration(1000).delay(1050)

svg.selectAll(".r2000").transition()
	.style("opacity",0)	
	.duration(1000).delay(1050)
	