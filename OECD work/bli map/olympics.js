var w=360,h=480;
var indicators=[
{color:"#33A594",name:"Housing",ind:"housing"},
{color:"#1EA2E2",name:"Income",ind:"income"},
{color:"#197EBF",name:"Jobs",ind:"jobs"},
{color:"#DB4C60",name:"Community",ind:"community"},
{color:"#7FAD3E",name:"Education",ind:"education"},
{color:"#21A554",name:"Environment",ind:"environment"},
{color:"#DEAA00",name:"Civic Engagement",ind:"governance"},
{color:"#7E3874",name:"Health",ind:"health"},
{color:"#E5632F",name:"Life Satisfaction",ind:"satisfaction"},
{color:"#606060",name:"Safety",ind:"safety"},
{color:"#992825",name:"Work-Life Balance",ind:"balance"}
];
var indicatorText={};
indicators.forEach(function(i) {indicatorText[i.ind]=i.name;});

var names={
FRA:"France",
USA:"United States",
DEU:"Germany",
ITA:"Italy",
CAN:"Canada",
GBR:"United Kingdom",
AUT:"Austria",
AUS:"Australia",
MEX:"Mexico",
CHE:"Switzerland",
ESP:"Spain",
BEL:"Belgium",
PRT:"Portugal",
TUR:"Turkey",
JPN:"Japan",
HUN:"Hungary",
RUS:"Russian Federation",
BRA:"Brazil",
CHL:"Chile",
NZL:"New Zealand",
SWE:"Sweden",
DNK:"Denmark",
NLD:"Netherlands",
KOR:"Korea",
POL:"Poland",
THA:"Thailand",
IND:"Indonesia",
CHN:"China",
FIN:"Finland",
ISR:"Israel",
SVK:"Slovak Republic",
ROU:"Romania",
NOR:"Norway",
CZE:"Czech Republic",
GRC:"Greece",
ISL:"Iceland",
IRL:"Ireland"

}
	/*.on("mouseover",function(d,i) {
		d3.selectAll("path").transition().style("opacity",.1);
		d3.select("#c"+i).transition.style("opacity",1).style("stroke-width",7);
	})
	.on("mouseout",function() {d3.selectAll("path").transition().style("opacity",.5).style("stroke-width",3)})*/

var popup,bardata;
var svg=d3.select("#chart").append("svg").attr("width",w).attr("height",h);
//svg.append("rect").attr("width",w).attr("height",475).style("fill","#811815");

var data;
var countryPop;
d3.csv("ranks.csv",function(csv){
	data=csv;
	console.log(data.map(function(d) {return d.country;}))
	indicator="housing";	
	d3.select("#legend")
		.append("ul").classed("nav nav-pills nav-stacked",1)
	 	.selectAll("li").data(indicators).enter()
		.append("li")
			.append("a")
			.attr("id",function(d,i){return "s"+i;})
			.html(function(d) {return d.name;})
			.style("background-color",function(d){if (d.ind===indicator) {return d.color;}else{return "white";}})
			.style("color",function(d){if (d.ind===indicator) {return "white";}else{return null;}})
			.attr("href","#")
			.on("hover",function() {console.log(d3.select(this));d3.select(this).style("background-color",function(d) {return d.color;}).style("text-decoration","none");})
			.on("click",function(d) {
				indicator=d.ind;
				d3.select("#legend").selectAll("a").transition().style("background-color","white").style("color",null);
				d3.select(this).transition().style("background-color",d.color).style("color","white");
				move();
			})
	
	var svg2=d3.select("#legend").append("svg").attr("width",160).attr("height",102);
	


	svg.append("text").attr("x",10).attr("y",30).style("fill","#fff").text("Click any country for details").attr("id","click");

	countries=svg.selectAll(".country").data(data).enter()
		.append("text")
		.text(function(d) {return d.country;})
		
		.attr("y",function(d,i) {return 17+i*12.5;})
		.style("font","13px arial bold")//.style("fill","white")
		.on("click",popup);
	lineg=svg.append("g").style("opacity",0);
	lineg.append("path").attr("d","M0,0v480").style("stroke","black").style("fill","none");
	lineg.append("text").attr("text-anchor","middle").text("(Average choice)").attr("y",495);

	move();

	//var
	 popup=svg2
		.append("g")//.attr("transform","translate(40,350)")
		popup.style("visibility","hidden");

		popup.append("rect").attr("width",150).attr("height",100).style("fill","white").style("opacity",.5).style("stroke","white").attr("rx",2).attr("ry",2);
		popup.append("text").attr("x",135).attr("y",15).text("✕").on("click",function() {popup.style("visibility","hidden");}).style("cursor","pointer")
		popup.append("text").attr("id","countryText").text(function(d) {return names["RUS"];}).attr("text-anchor","middle").style("font","12px arial bold").style("fill","black").style("opacity",1).attr("x",75).attr("y",15);
		popup.append("text").attr("id","indicatorText").text(function(d) {return indicatorText[indicator]}).attr("text-anchor","middle").style("font","italic 12px serif").style("fill","black").style("opacity",1).attr("x",75).attr("y",27);
		popup.selectAll(".bars").data([0,0,0,0,0,0]).enter()
			.append("rect").classed("bars",1)
			.attr("x",function(d,i){return 25+20*i;}).attr("width",15).attr("fill","black").style("opacity",.2).attr("y",90)
				.append("title").text(d3.format("%"));
		popup.selectAll(".barLbl").data([0,0,0,0,0,0]).enter()
			.append("text").classed("barLbl",1)
			.attr("x",function(d,i){return 32+20*i;}).text(function(d,i){return i;}).attr("fill","black").attr("opacity",1).attr("text-anchor","middle").attr("y",80);
		popup.append("text").attr("x",5).attr("y",85).text("0%").style("font-size",10);
		popup.append("text").attr("x",5).attr("y",30).text("50%").style("font-size",10);
		popup.append("text").attr("x",12).attr("y",98).text("share of votes for each score").style("font-size",10);
		popup.append("path").attr("d","M25,85h120").style("stroke","black");
		var yBar=d3.scale.linear().domain([0,.5]).range([0,60]);
	
	function move() {
		
		update();
		
	data.sort(function(a,b) {return b[indicator]-a[indicator]});
	data.forEach(function(d,i) {d.rank=i;})
	data.sort(function(a,b) {return b.country>a.country?1:-1;})
	domain=[0/*d3.min(data,function(d){return d[indicator];})*/,d3.max([1.01,d3.max(data,function(d){return d[indicator];})])];
	var x=d3.scale.linear().domain(domain).range([20,w-50]);
	lineg.transition().attr("transform","translate("+x(1)+",0)").style("opacity",1)

	
	countries
		.attr("class",function(d) {return (d.rank<3)?("r"+d.rank):"rx";})
		.transition().ease("linear")
		.style("fill","black")
		.style("opacity",1).style("font-size","12px").style("stroke","none")
		.attr("x",function(d,i) {return x(0);})
		

		.each("end",function() {
			d3.select(".r0").transition().duration(2000).attr("x",function(d) {return x(d[indicator]);}).each("end",function() {d3.select(".r0").transition().style("fill","gold").style("font-size","20px");})
			d3.select(".r1").transition().duration(2000).attr("x",function(d) {return x(d[indicator]);}).each("end",function() {d3.select(".r1").transition().style("fill","silver").style("font-size","18px");})
			d3.select(".r2").transition().duration(2000).attr("x",function(d) {return x(d[indicator]);}).each("end",function() {
				d3.select(".r2").transition().style("fill","#665D1E").style("font-size","16px");
				d3.select("#click").transition().style("fill","#ccc");
			})

			d3.selectAll(".rx").transition().duration(2000).attr("x",function(d) {return x(d[indicator]);})//.each("end",function() {d3.selectAll(".rx").transition().style("opacity",.5);});

			})
		
		
	}

	function popup(d) {
		countryPop=d;
		popup.style("visibility","visible");
		d3.select("#click").style("visibility","hidden");
		popup.select("#countryText").text(names[d.country])
		update();
	}

	function update() {
		d3.selectAll(".indSpan").html(indicatorText[indicator]);
		if(countryPop){
			popup.select("#indicatorText").text(indicatorText[indicator])
			var d=countryPop;
			//var 
			barData=[];
			d3.range(6).forEach(function(i) {barData.push(+d[indicator+i]);});
			popup.selectAll(".bars").data(barData).transition().attr("y",function(d) {return 85-yBar(d);}).attr("height",yBar);
			popup.selectAll("title").text(function(d,i) {return d3.format("%")(barData[i])});
		}
	}

})