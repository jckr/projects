var h=450,w=430,bw=75,ch=400;
var svg=d3.select("#questio").append("svg").attr("height",h).attr("width",w);



var questions=d3.range(1,11).map(function(d) {return "Q"+d;})
var cats=d3.range(1,6).map(function(d) {return "C"+d;})
var question=0
var cat=0;

dict["Q10"]="10. Pour faire face aux difficultés économiques, faut-il <strong>moins contrôler</strong> les entreprises?"

var y=d3.scale.linear().range([ch,10])
//.domain([0,100])
;
var x=d3.scale.ordinal().domain(d3.range(2)).rangeRoundBands([50,w],.1);


//var colors=d3.range(1,21).map(function(d,i) {return {key:"V"+d,color:d3.scale.category20c().range()[i]};});
//var cMap=d3.nest().key(function(d) {return d.key;}).rollup(function(d) {return d[0].color;}).map(colors);

var cats={"V2":0,"V12":0,"V3":1,"V13":1,"V5":2,"V14":2,"V6":3,"V15":3,"V7":4,"V16":4,"V8":5,"V17":5};
var candidats=["Besancenot/Mélenchon","Royal/Hollande","Bayrou","Sarkozy","J.M. Le Pen/M. Le Pen","Abstention/Blanc/Nul"];
var colors=[cMap["V2"],cMap["V3"],cMap["V5"],cMap["V6"],cMap["V7"],"#888"];


var data=odata.filter(function(d) {return d.vote in cats;});
var data=d3.nest()
	.key(function(d) {return d.question;})
	.key(function(d) {return cats[d.vote];})
	.key(function(d) {return d.categorie;})
	.rollup(function(l) {
		var ok=l[1].valeur+l[2].valeur,base=l[0].valeur;
		if(l[0].question=="Q10"){ok=l[1].valeur;}
		return {valeur:ok,base:base,pourcentage:ok/base};
	}).entries(data);

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

svg.selectAll("line").data(d3.range(11)).enter().append("line")
	.attr("x1",50)
	.attr("x2",330)
	.attr("y1",function(d){return y(d/10);})
	.attr("y2",function(d){return y(d/10);})
	.style("stroke","#ccc");
svg.selectAll("text").data(d3.range(11)).enter().append("text")
	.attr("x",50)
	.attr("y",function(d){return y(d/10);})
	.attr("text-anchor","end")
	.text(function(d) {return d3.format("%")(d/10);})
	.attr("dy",5)
	.style("stroke","#ccc")
	
var chart=svg
	.append("g")
	.attr("id","chart");
	


var lines=chart.selectAll(".line").data(data[question].values).enter()
		.append("g").classed("voteg",1) //and within that one group per vote ie series of 2 circles
		.style("stroke",function(d,i) {return colors[i];}) 
		.style("fill",function(d,i) {return colors[i];}) 
		.style("stroke-width",2)
		.attr("class",function(d,i) {return "voteg l"+i;})
		.on("mouseover",mouseover)
		.on("mouseout",mouseout)

// now we will append 2 circles and one line per line group.

lines			.selectAll("circle").data(function(d) {return d.values;}).enter()
				.append("circle") // now 2 circles
				
				.attr("cx",function(d,i) {return x(1-i)+bw/2;})
				.attr("r",10)
				.attr("cy",function(d) {return y(d.values.pourcentage);})
				
				
				//.style("opacity",0)
				//.append("title")
				//.text(function(d) {return dict[d.vote]+": "+d3.format("%")(d.pourcentage);})
				;
lines.append("line").attr("x1",x(1)+bw/2).attr("x2",x(0)+bw/2)
	.attr("y1",function(d) {return y(d.values[0].values.pourcentage);})
	.attr("y2",function(d) {return y(d.values[1].values.pourcentage);})
				
lines.selectAll("text").data(function(d) {return d.values;}).enter()
	.append("text")
	.attr("x",function(d,i) {return x(1-i)+bw/2+30-60*i;})
	.attr("y",function(d) {return y(d.values.pourcentage);})
	.attr("text-anchor",function(d,i) {return i?"end":"start";})
	.attr("dy",5)
	.style("stroke-width",1)
	.text(function(d) {return d3.format("%")(d.values.pourcentage);})
	.style("visibility","hidden")



var labels=svg.selectAll("#nothingyet").data(["2007","2012"]).enter()
	.append("text").classed("line1",1)
	.attr("x",function(d) {return x(d)+bw/2;})
	.attr("y",420)
	.text(String)
	.attr("text-anchor","middle");



d3.select("#votes").select("ul").html("").append("li").classed("nav-header",1).html("Votes:")
	.selectAll(".options").data(candidats).enter()
		.append("li")
			.append("a")
			.attr("href","#")
				.html(String)
				.attr("class",function(d,i) {return "l"+i;})
				.style("color",function(d,i) {return colors[i];})
				.on("mouseover",mouseover)
				.on("mouseout",mouseout)
				;
	
	



function updateQuestion() {
mouseout();
lines.data(data[question].values);
lines.selectAll("circle").data(function(d) {return d.values;})
.transition()
	.attr("cy",function(d) {return y(d.values.pourcentage);})
	.style("opacity",1)
	;
lines.select("line")
	.transition()
	.attr("y1",function(d) {return y(d.values[0].values.pourcentage);})
	.attr("y2",function(d) {return y(d.values[1].values.pourcentage);})
lines.selectAll("text").data(function(d) {return d.values;})
	.transition()
	.attr("y",function(d) {return y(d.values.pourcentage);})
	.text(function(d) {return d3.format("%")(d.values.pourcentage);})
	.style("visibility","hidden")
}
	

function mouseover(d,i) {
	chart.selectAll(".voteg").transition().style("opacity",function(c,j) {return (j==i)?1:.2;});
	d3.select("#votes").selectAll("a").transition().style("opacity",function(c,j) {return (j==i)?1:.2;});//.style("opacity",.2);
	//d3.select("#votes").selectAll(".l"+i).style("opacity",1);
	chart.selectAll(".l"+i).selectAll("text").style("visibility","visible");
}

function mouseout() {
	chart.selectAll(".voteg").transition().style("opacity",1);
	d3.select("#votes").selectAll("a").style("opacity",1);
	chart.selectAll("text").style("visibility","hidden");
}
		
