var h=450,w=380,bw=75,ch=400;
var svg=d3.select("#questio").append("svg").attr("height",h).attr("width",w);



var questions=d3.range(1,11).map(function(d) {return "Q"+d;})
var cats=d3.range(1,6).map(function(d) {return "C"+d;})
var reponses=["R2","R3","R4","R5"];
var question=0
var cat=0;

var y=d3.scale.linear().range([ch,0])
//.domain([0,100])
;
var x=d3.scale.ordinal().domain(reponses).rangeRoundBands([0,w],.1);


//var colors=d3.range(1,21).map(function(d,i) {return {key:"V"+d,color:d3.scale.category20c().range()[i]};});
//var cMap=d3.nest().key(function(d) {return d.key;}).rollup(function(d) {return d[0].color;}).map(colors);

var data=d3.nest()
	.key(function(d) {return d.question;})
	.key(function(d) {return d.categorie;})
	.key(function(d) {return d.vote;})
	.rollup(function(l) {
		return l.map(function(d) {
			return {"reponse":d.reponse,"valeur":d.valeur,"pourcentage":d.valeur/l[0].valeur,"vote":d.vote};
			//return {"question":d.question,"reponse":d.reponse,"valeur":d.valeur,"pourcentage":d.pourcentage,"vote":d.vote};
		}).slice(1,5);
	}).entries(odata);
data.forEach(function(q) {q.values.forEach(function(c) {c.values.forEach(function(vo) {vo.values.forEach(function(va,i) {va.original=q.values[0].values[0].values[i].pourcentage;});});});})


d3.select("#questions")
	.select("ul")
	.selectAll("li")
	.data(d3.range(10))
	.enter()
	.append("li")
		.classed("active",function(d,i) {return d==question;})
		.append("a")
			.attr("href","#")
			.html(function(d) {return dict[questions[d]];})
			.on("click",function(d,i) {question=d;d3.select("#questions").selectAll("li").classed("active",function(d,i) {return d==question;});updateQuestion(question);})
d3.select("#cats")
	.select("ul")
	.selectAll("#nothingyet")
	.data(d3.range(5))
	.enter()
	.append("li")
		.classed("active",function(d,i) {return !i;})
		.append("a")
			.attr("href","#")
			.html(function(d) {return dict[cats[d]];})
			.on("click",function(d,i) {cat=d;d3.select("#cats").selectAll("li").classed("active",function(d,i) {return d==cat;});updateCats(cat);})
			

var chart=svg
	.append("g")
	.attr("id","chart");
chart	.selectAll("rect").data(data[question].values[0].values[0].values).enter()
		.append("rect")
		.attr("x",function(d) {return x(d.reponse);})
		.attr("y",function(d) {return y(d.pourcentage);})
		.attr("width",bw)
		.attr("height",function(d) {return ch-y(d.pourcentage);})
		.style("fill","steelblue");
chart	.selectAll("text").data(data[question].values[0].values[0].values).enter()
		.append("text").classed("barlabel",1)
		.attr("x",function(d) {return x(d.reponse)+bw/2;})
		.attr("y",function(d) {return y(d.pourcentage);})
		.attr("text-anchor","middle")
		.attr("dy",20)
		.style("stroke-width",1)
		.style("stroke","white")
		.style("visibility",function(d) {return y(d.pourcentage)<(ch-20)?"visible":"hidden";})
		.text(function(d) {return d3.format("%")(d.pourcentage);})
var labels=chart.selectAll("#nothingyet").data(reponses).enter()
	.append("text").classed("line1",1)
	.attr("x",function(d) {return x(d)+bw/2;})
	.attr("y",420)
	.text(function(d,i) {
		if (question<9) {return ["Tout à fait","D'accord","Pas d'accord","Pas du tout"][i];};
		return ["Moins contrôler","Plus contrôler","",""][i];
	})
	.attr("text-anchor","middle");
var labels=chart.selectAll("#nothingyet").data(reponses).enter()
	.append("text").classed("line2",1)
	.attr("x",function(d) {return x(d)+bw/2;})
	.attr("y",437)
	.text(function(d,i) {
		if (question<9) {return ["d'accord","","","d'accord"][i];};
		return ["les entreprises","les entreprises","",""][i];
	})
	.attr("text-anchor","middle");

	

var catG=chart.selectAll(".catg").data([1,2,3,4]).enter()
	.append("g")
	.classed("catg",1) // one group per breakdown
	.attr("id",function(d) {return "C"+d;});
catG	.selectAll(".voteg").data(function(d) {return data[question].values[d].values;}).enter()
		.append("g").classed("voteg",1) // and within that one group per vote ie series of 4 circles
			.selectAll("circle").data(function(d) {return d.values;}).enter()
				.append("circle") // now 4 circles
				.attr("cx",function(d) {return x(d.reponse)+bw/2;})
				.attr("r",10)
				.attr("cy",function(d) {return y(d.original);})
				.style("stroke",function(d) {return cMap[d.vote];})
				.style("stroke-width",2)
				.style("fill","none")
				.style("opacity",0)
				.append("title")
				.text(function(d) {return dict[d.vote];})
				;
catG			.selectAll(".voteg").selectAll("text").data(function(d) {return d.values;}).enter()
				.append("text")
				.attr("x",function(d) {return x(d.reponse)+bw/2+15;})
				.attr("y",function(d) {return y(d.pourcentage);})
				.attr("dy",6)
				.style("opacity",0)
				.text(function(d) {return d3.format("%")(d.pourcentage);})
	
	
	



function updateQuestion() {
cat=0;
d3.select("#cats").selectAll("li").classed("active",function(d,i) {return d==cats;})

chart.selectAll("rect").data(data[question].values[cat].values[0].values)
.transition()
	.attr("y",function(d) {return y(d.pourcentage);})
	.attr("height",function(d) {return 400-y(d.pourcentage);})
	.style("fill","steelblue")
	.style("opacity",1)
	.style("visibility",function(d,i) {return (question<9||i<2)?"visible":"hidden";})
	;

chart.selectAll(".barlabel").data(data[question].values[cat].values[0].values)
	.transition()
	.attr("y",function(d) {return y(d.pourcentage);})
	.style("visibility",function(d) {return y(d.pourcentage)<(ch-20)?"visible":"hidden";})
	.style("opacity",1)
	.text(function(d) {return d3.format("%")(d.pourcentage);})

chart.selectAll(".catg").selectAll(".voteg").data(function(d) {return data[question].values[d].values;})
	.selectAll("circle").data(function(d) {return d.values;})
		.transition()
		.attr("cy",function(d) {return y(d.original);})
		.style("opacity",0)
		.style("visibility",function(d,i) {return (question<9||i<2)?"visible":"hidden";})
		;
catG.selectAll(".voteg").selectAll("text").data(function(d) {return d.values;})
	.attr("y",function(d) {return y(d.pourcentage);})
	.text(function(d) {return d3.format("%")(d.pourcentage);})
	
d3.select("#votes").select("ul").html("");
d3.selectAll(".line1").text(function(d,i) {
		if (question<9) {return ["Tout à fait","D'accord","Pas d'accord","Pas du tout"][i];};
		return ["Moins contrôler","Plus contrôler","",""][i];
	})
d3.selectAll(".line2").text(function(d,i) {
		if (question<9) {return ["d'accord","","","d'accord"][i];};
		return ["les entreprises","les entreprises","",""][i];
	})

}

function updateCats() {
if (cat) { //opening
	chart.selectAll("rect")
		.transition()
		.duration(300)
		.attr("height",1)
		.style("fill","black")
		.style("opacity",0.5)
		;
	chart.selectAll(".barlabel")
		.transition()
		.style("opacity",0)
	chart.selectAll(".catg").selectAll("circle").style("opacity",0).attr("cy",function(d) {return y(d.original);}) // all circles in original position
	chart.select("#C"+(cat)).selectAll("circle") // except for selected category
		.style("opacity",1)
		/*.on("mouseover",function(d,i) {
					chart.selectAll(".voteg").selectAll("text")
					.transition()
					.style("opacity",function(c) {return (c.vote==d.vote)?1:0;})
				;})
		.on("mouseout",function() {chart.selectAll(".voteg").selectAll("text").transition().style("opacity",0);})*/
		.transition()
		.duration(1000)
		.attr("cy",function(d) {return y(d.pourcentage);})
		.ease("elastic")
		
	d3.select("#votes").select("ul").html("").append("li").classed("nav-header",1).html(dict["C"+(cat+1)])
	.selectAll(".options").data(data[question].values[cat].values).enter()
		.append("li")
			.append("a")
			.attr("href","#")
				.html(function(d) {return dict[d.key];})
				.style("color",function(d) {return cMap[d.key];})
				.on("mouseover",function(d) {
					chart.select("#C"+(cat)).selectAll("circle")
						.transition()
						.style("opacity",function(c) {return (c.vote==d.key)?1:.2;});
					chart.select("#C"+(cat)).selectAll("text")
						.transition()
						.style("opacity",function(c) {return (c.vote==d.key)?1:0;});				
				})
				.on("mouseout",function() {
					chart.select("#C"+(cat)).selectAll("circle").transition().style("opacity",1);
					chart.selectAll(".voteg").selectAll("text").transition().style("opacity",0);
					;})
	}
else { // closing
	chart.selectAll(".catg").selectAll("circle")
	.transition()
	.duration(500)
	.attr("cy",y(0))
	.style("opacity",0)
	.ease("linear") // all back to normal
	.each("end",function(){d3.select(this).attr("cy",function(d) {return y(d.original);})})
	chart.selectAll("rect")
	.transition()
	.duration(500)
	.attr("height",function(d) {return ch-y(d.pourcentage);})
	.style("fill","steelblue")
	.style("opacity",1)
	;
	chart.selectAll(".barlabel")
	.transition()
	.style("opacity",1)
	/*chart.selectAll("line")
	.transition()
	.duration(500)
	.style("opacity",0);*/
	d3.select("#votes").select("ul").html("");
	;}
	
}
	
		
$('circle').tipsy({html: true, gravity: 'w'});