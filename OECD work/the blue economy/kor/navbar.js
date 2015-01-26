/*function doNavBar(i){

var menudata=[
	{html:"Importance of Fishing",href:"fishingmap.html"},
	{html:"Aquaculture",href:"aqua.html"},
	{html:"Trade of fish",href:"tradeChord.html"},
	{html:"Shipbuilding",href:"shipbuilding.html"},
	{html:"Harbor activity",href:"harborsmap.html"}];
	

var navbar=d3.select("#navbar").classed("navbar navbar-fixed-top",1);
var container=navbar
	.append("div").classed("navbar-inner",1)
		.append("div").classed("container",1);
var a=container		.append("a").classed("btn btn-navbar",1).attr("data-toggle","collapse").attr("data-target",".nav-collapse")
a				.append("span").classed("icon-bar",1);
a				.append("span").classed("icon-bar",1);
a				.append("span").classed("icon-bar",1);

container		.append("a").classed("brand",1).attr("href","index.html").html("The blue economy");
var navc=container	.append("div").classed("nav-collapse",1);
navc				.append("ul").classed("nav",1).selectAll("li").data(menudata).enter()
					.append("li")
						.classed("active",function(d,idx){return idx==i;})
						.append("a")
							.attr("href",function(d) {return d.href;})
							.html(function(d) {return d.html;});
navc			.append("ul").classed("nav pull-right",1)
				.append("li")
					.append("a").on("click",function() {changeLang();})
					.html(function() {if(window.location.search=="?lang=kor") {return "Switch to English";} else {return "Switch to Korean";}})
					.attr("id","alang")
					
					
}*/

function doNavBar(i) {
var menudata=[
	{html:"Importance of Fishing",href:"fishingmap.html"},
	{html:"Aquaculture",href:"aqua.html"},
	{html:"Trade of fish",href:"tradeChord.html"},
	{html:"Shipbuilding",href:"shipbuilding.html"},
	{html:"Harbor activity",href:"harborsmap.html"}];
var navbar=d3.select("#navbar").classed("navbar navbar-fixed-top",1);
var menu=navbar.append("div").classed("navbar-inner",1).append("div").classed("container",1);
var menuul=menu.append("ul").classed("nav",1);
var Mfishing=menuul.append("li").classed("dropdown",1).attr("id","menu1").append("a").classed("dropdown-toggle",1).attr("data-toggle","dropdown").attr("href","#menu1").html("Fishing<b class=\"caret\"></b>")
	.append("ul").attr("id","fishing").classed("dropdown-menu",1);
Mfishing	.append("li").append("a").attr("href","./fishingmap.html").html("Importance of fishing");
Mfishing	.append("li").append("a").attr("href","./tradeChord.html").html("Trade of fish");
Mfishing	.append("li").append("a").attr("href","./aqua.html").html("Aquaculture");
Mfishing	.append("li").append("a").attr("href","./speciesmap.html").html("Species of fish");

var Mharbors=menuul.append("li").classed("dropdown",1).attr("id","menu2").append("a").classed("dropdown-toggle",1).attr("data-toggle","dropdown").attr("href","#menu2").html("Harbors<b class=\"caret\"></b>")
	.append("ul").attr("id","harbors").classed("dropdown-menu",1);
Mharbors	.append("li").append("a").attr("href","./harborsmap.html").html("Harbors activity");
Mharbors	.append("li").append("a").attr("href","./shipbuilding.html").html("Shipbuilding capacity");
}