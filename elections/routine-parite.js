var data;
var xScale=d3.scale.linear().range([0,400]);
var yScale=d3.scale.linear().domain([0,6]).range([40,360]);
var expl=["Moins de 40% des voix","40-45%","45-50%","50-55%","55-60%","Plus de 60% des voix"];
var svg=d3.select("#chart").append("svg").attr("width",600).attr("height",430);
var colors=["#005384","#c03"];
var margin=120;
d3.csv("parite.csv",function(csv) {
	var conditions=svg.selectAll(".conditions").data(csv).enter()
		.append("g")
		.classed("conditions",1)
		.attr("transform",function(d,i) {return "translate(0,"+yScale(i)+")";});
	conditions
		.append("rect")
		.attr("y",-21)
		.attr("x",margin)
		.attr("height",20)
		.style("fill",colors[0])
		.attr("width",function(d) {return xScale(d.UMP)})
			.append("title")
			.text(function(d) {return d.fUMP + " femmes, "+d.mUMP+" hommes"});
	conditions
		.append("rect")
		.attr("height",20)
		.attr("y",1)
		.attr("x",margin)
		.style("fill",colors[1])
		.attr("width",function(d) {return xScale(d.PS)})
			.append("title")
			.text(function(d) {return d.fPS + " femmes, "+d.mPS+" hommes"});

	svg.selectAll("line").data(d3.range(8)).enter()
		.append("line")
		.style("stroke-opacity",.2)
		.style("stroke","white")
		.attr("x1",function(d) {return margin+xScale(d/10);})
		.attr("x2",function(d) {return margin+xScale(d/10);})
		.attr("y1",0)
		.attr("y2",360);

	svg.selectAll(".labels").data(d3.range(8)).enter()
		.append("text")
		.attr("x",function(d) {return margin+xScale(d/10);})
		.attr("text-anchor","middle")
		.attr("y",360)
		.text(function(d) {return d*10+"%";})

	svg
		.append("line")
		.attr("x1",margin)
		.attr("x2",margin)
		.attr("y1",10)
		.attr("y2",340)
		.style("stroke","black")
		.style("stroke-width",1);

	conditions
		.append("text")
		.attr("dy",-5)
		.text(function(d) {return d.statut;});

	conditions
		.append("text")
		.attr("dy",15).style("font-size","80%")
		.text(function(d,i) {return expl[i];})

	svg.append("rect")
		.attr("x",350).attr("y",250).attr("width",30).attr("height",15)
		.style("fill",colors[0]);
	svg.append("text").attr("x",385).attr("y",262).text("UMP");

	svg.append("rect")
		.attr("x",350).attr("y",270).attr("width",30).attr("height",15)
		.style("fill",colors[1])
	svg.append("text").attr("x",385).attr("y",282).text("PS");
})

