var navbar=d3.select("#navbar");

	
var menudata=[
	{key:"Fishing",values:[
		{name:"Importance of fishing",url:"fishingmap.html"},
		{name:"Aquaculture",url:"aqua.html"},
		{name:"Species of fish",url:"speciesmap.html"},
		{name:"Trade of fish",url:"tradeChord.html"}
	]},
	{key:"Transport",values:[
		{name:"Shipbuilding",url:"shipbuilding.html"},
		{name:"Harbor activity",url:"harborsmap.html"}
	]},
	{key:"Energy",values:[
		{name:"Wind energy",url:"windmap.html"},
		{name:"Offshore oil",url:"oil.html"}
	]},
	{key:"Cities",values:[
		{name:"Coastal cities",url:"citiesmap.html"}
	]}];




var container=navbar.classed("navbar navbar-fixed-top",1)
	.append("div").classed("navbar-inner",1)
		.append("div").classed("container",1);

var a=container		.append("a").classed("btn btn-navbar",1).attr("data-toggle","collapse").attr("data-target",".nav-collapse")
a				.append("span").classed("icon-bar",1);
a				.append("span").classed("icon-bar",1);
a				.append("span").classed("icon-bar",1);

container		.append("a").classed("brand",1).attr("href","index.html").html("The blue economy");

		
var menu=container	.append("ul").classed("nav nav-pills",1)
				

menu.selectAll("li").data(menudata).enter()
				.append("li")
				.classed("dropdown",1)
					.append("a")
					.classed("dropdown-toggle",1)
					.attr("data-toggle","dropdown")
					.attr("href","#")
					.html(function(d) {return d.key+" <b class=\"caret\"></b>";})
						.append("ul")
						.classed("dropdown-menu",1)
						.selectAll("li").data(function(d) {return d.values;}).enter()
							.append("li")
								.append("a")
								.html(function(d) {return d.name;})
								.attr("href",function(d) {return "./"+d.url;})
								.on("click",function(d) {window.location.href = d.url;});
						


var l=container
	.append("div").classed("pull-right",1).style("margin-top","10px")
		.append("a")
			.attr("href",function() {
				var d=document.URL;
				var s=d.split("/");
				return s.slice(0,s.length-1).join("/")+"/kor/"+s[s.length-1];
			})
			.append("img")
				.attr("src","flag.png")
	.append("img").attr("src","flag.png")


