var nav=[{
		key:"Water", values:[
			{label:"Irrigation", url:"irrigation.html"},
			{label:"Water stress", url:"stress.html"},
			{label:"Water supply", url:"supply.html"},
			{label:"Sanitation", url:"sanitation.html"}
		]
	},{
		key:"Biodiversity", values:[
			{label:"By region", url:"species.html"},
			{label:"By biome", url:"biome.html"},
			{label:"Drivers", url:"MSAdrivers.html"}
		]
	},{
		key:"Climate", values:[
			{label:"Emissions and temperatures",url:"emissionstemperatures.html"},
			{label:"CO<sub>2</sub> emissions by sources",url:"co2BySources.html"},
			{label:"Drivers of emissions",url:"kaya.html"}
		]
	},{
		key:"Health", values:[
			{label:"Air pollution in cities",url:"PM10.html"}
		]
	},{
		key:"Socio-economic factors", values:[
			{label:"Drivers of GDP",url:"GDP.html"}
		]
	}];

d3.select(".subnav").html("")
	.append("ul").attr("class","nav nav-pills")
	.append("li").append("a").attr("href","home.html").html("Introduction");
d3.select(".subnav ul")
	.selectAll(".dropdown").data(nav).enter().append("li")
		.classed("dropdown",1)
		.append("a").attr("href","#").attr("data-toggle","dropdown").classed("dropdown-toggle",1).html(function(d) {return d.key;})
		.append("b").classed("caret",1);
d3.select(".subnav").selectAll(".dropdown").append("ul").classed("dropdown-menu",1)
		.selectAll("li").data(function(d) {return d.values;}).enter().append("li")
			.append("a").attr("href",function(d) {return d.url;}).html(function(d) {return d.label;})