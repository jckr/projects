
svg.append("svg:line").style("stroke","red").style("stroke-dasharray","4 4")
	.attr("x1",x(2010))
	.attr("x2",x(2050))
	.attr("y1",y(20))
	.attr("y2",y(20));
svg.append("svg:text").attr("x",x(2050)+10).attr("y",y(20)).text("WHO air quality");
svg.append("svg:text").attr("x",x(2050)+10).attr("y",y(20)).attr("dy","1em").text("guideline (20µg/m³)");