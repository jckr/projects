var navbar=d3.select("#navbar");

	
var menudata=[
	{key:"수산업",values:[
		{name:"세계 경제에서 어업은 얼마나 중요합니까?",url:"fishingmap.html"},
		{name:"양식업의 성장",url:"aqua.html"},
		{name:"어느 국가가 어떤 어류를 잡는가?",url:"speciesmap.html"},
		{name:"수산 제품의 무역은",url:"tradeChord.html"}
	]},
	{key:"운송업",values:[
		{name:"조선업계의 선두주자",url:"shipbuilding.html"},
		{name:"주요 항구",url:"harborsmap.html"}
	]},
	{key:"에너지",values:[
		{name:"해상풍력산업",url:"windmap.html"},
		{name:"해양에서 에너지를 추출함",url:"oil.html"}
	]},
	{key:"도시",values:[
		{name:"해안 도시들",url:"citiesmap.html"}
	]}];




var container=navbar.classed("navbar navbar-fixed-top",1)
	.append("div").classed("navbar-inner",1)
		.append("div").classed("container",1);

var a=container		.append("a").classed("btn btn-navbar",1).attr("data-toggle","collapse").attr("data-target",".nav-collapse")
a				.append("span").classed("icon-bar",1);
a				.append("span").classed("icon-bar",1);
a				.append("span").classed("icon-bar",1);

container		.append("a").classed("brand",1).attr("href","index.html").html("블루 이코노미");

		
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
				return s.slice(0,s.length-2).join("/")+"/"+s[s.length-1];
			})
			.append("img")
				.attr("src","flag.png")
	.append("img").attr("src","flag.png")




