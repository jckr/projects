var width=960,height=450,
svg=d3.select("#chart").append("svg").attr("width",width).attr("height",height)
	.attr("transform","translate(50,50)");

var lang="eng";
if(window.location.search=="?lang=kor") {lang="kor";}
//d3.select("#alang").html(function() {return (lang=='eng')?'Switch to Korean':'Switch to English';})

function changeLang() {
	lang=(lang=='eng')?'kor':'eng';
	window.location.search="?lang="+lang;
	d3.select("#alang").html(function() {return (lang=='eng')?'Switch to Korean':'Switch to English';})
	//d3.select("#cPanel").selectAll("a").html(function(d) {return d.countrylabel[lang];})
}


svg
	.append("defs")
		.append("clipPath")
		.attr("id","barChart")
			.append("rect").attr("x",0).attr("y",0).attr("width",600).attr("height",450).style("stroke","none").style("fill","none")

data=d3.nest().key(function(d) {return d.year;}).entries(data);



var bandWidth=50;

//var x=d3.scale.ordinal().domain(d3.range(10)).rangeBands([0,600],.1);
var x=d3.scale.linear().domain([1,11]).range([0,580]);
var y=d3.scale.linear().domain([0,20000000]).range([300,0]);


var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");
	


var bar=svg.append("g").style("clip-path","url(#barChart)").attr("transform","translate(80,20)");

var countries=bar.selectAll("g").data(data[0].values).enter()
	.append("g");
countries.attr("transform",function(d) {return "translate("+x(d.rank)+",0)";})
	.append("rect")
		.attr("x",20).attr("width",bandWidth)
		.attr("y",function(d) {return y(d.cgt);})
		.attr("height",function(d) {return 300-y(d.cgt);})
		.style("fill","steelblue")
			.append("title")
			.text(function(d) {return "Total tonnage: "+d3.format(",")(d.cgt);});
countries.append("text").attr("transform","rotate(-90) translate(-310,50)")
	.attr("text-anchor","end")
	.text(function(d) {return d.country;})

svg.append("g").classed("axis",1)
    .call(yAxis)
    .attr("transform", "translate(" + 80+ ",20)");
    
var currentView=0;

var pages=d3.select("#pages");
var tabs=data.tabs;
var li=pages.append("ul").selectAll("li").data(["prev"].concat(d3.range(2000,2012),["next"])).enter().append("li");
li.append("a").attr("href","#").html(function(d) {
	if (d=="prev") {return "&larr; 이전으로";};
	if (d=="next") {return "다음으로 &rarr;";};
	return d;})
li.filter(function(d) {return d=="prev";}).classed("prev",1).classed("disabled",1);
li.filter(function(d) {return d=="next";}).classed("next",1);
li.filter(function(d,i) {return i==1;}).classed("active",1);

li.on("click", function(d,i) {
	if (d3.select(this).classed("disabled")==0) {
		if(d=="prev"&&currentView>0) {
			currentView--;	
			
		} else if (d=="next"&&currentView<13+2) {
			currentView++;
		} else {
			currentView=i-1;
		}
		li.filter(function(d) {return d=="prev";}).classed("disabled",(currentView==0));
		li.filter(function(d) {return d=="next";}).classed("disabled",(currentView==11));
	
		li.classed("active",0);
		li.filter(function(d) {return d==(2000+currentView);}).classed("active",1);
		transitionTo(currentView);
	}
})	

function transitionTo(view) {
countries.data(data[view].values)
	.transition()
	.attr("transform",function(d) {return "translate("+x(d.rank)+",0)";});
countries.select("rect").transition().attr("y",function(d) {return y(d.cgt);})
		.attr("height",function(d) {return 300-y(d.cgt);})
countries.select("title").text(function(d) {return "Total tonnage: "+d3.format(",")(d.cgt);});
}

$('rect').tipsy({html: true, gravity: 's'});