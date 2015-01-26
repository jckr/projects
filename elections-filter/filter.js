
var myCSV;
var sets;
var dict;
var groups;
var tabbable;
var filterdata;
var keys;
var data;
var inserted;
var deleted;
var total;
var hCand;
var pos;

d3.csv("filter.csv",function(csv) {
	data=csv;
	data.sort(function(a,b) {return (a.jdv4p>b.jdv4p)?1:(a.jdv4p==b.jdv4p)?0:-1;});
	
	keys=d3.keys(csv[0]);
	

	//dict=d3.nest().key(String).rollup(function(d) {return d[0];}).map(keys); // we could do better though
	dict={age_int_reg: {tab:"Âge",long:"Âge de l'interviewé"},
	     agglo: {tab:"Agglomération",long:"Taille de l'agglomération"},
	     diplome: {tab:"Diplôme",long:"Diplôme"},
	     jdv4p: {tab:"Vote",long:"Vote du premier tour"},
	     pcschef_r: {tab:"Prof. chef de famille", long:"Profession du chef de famille"},
	     pcsint_r: {tab:"Prof. interviewé", long:"Professoin de l'interviewé"},
	     pratiquerel: {tab:"Pratique religieuse", long:"Pratique religieuse"},
	     q23: {tab:"Télé", long: "Chaîne de télévision préférée pour les informations"},
	     region: {tab:"Région",long:"Région"},
	     religion: {tab:"Religion",long:"Religion"},
	     sexe: {tab:"Sexe",long:"Sexe"}
	}
	sets=keys.map(function(d) {return [];})
	//var h=sets[0].map(function(d) {return d.value;}).map(function(d,i) {return {id:i,value:d};});
	//hCand=d3.nest().key(function(d) {return d.value;}).rollup(function(d) {return d[0].id;}).map(h);
	hCand={"Abstention": 0,"Eva Joly": 1,"François Bayrou": 2,"François Hollande": 3,"Jean-Luc Mélenchon": 4,"Marine Le Pen": 5,"NA": 6,"Nathalie Arthaud": 7,"Nicolas Dupont-Aignan": 8,"Nicolas Sarkozy": 9,"Philippe Poutou": 10};	
	csv.forEach(function(line) {
		keys.forEach(function(key,i) {
			if(sets[i].indexOf(line[key])==-1) {
				sets[i].push(line[key]);
			}
		})
	})
	data.forEach(function(l,i) {l.pos=i})
	
	sets=sets.map(function(d,i) {return d.map(function(e) {return {key:i,value:e};});})
	filters=keys.map(function(d) {return [];})
	tabbable=d3.select("#categories").append("div").classed("tabbable tabs-left",1);
	tabbable.append("ul").classed("nav nav-tabs",1).selectAll("li").data(keys).enter()
		.append("li").classed("active",function(d,i) {return !i;})
			.append("a").attr("href",function(d,i) {return "#tab"+i;})
			.attr("data-toggle","tab")
			.html(function(d,i) {return dict[d].tab;});
	tabs=tabbable
		.append("div").classed("tab-content",1).style("display","block").selectAll(".tab-pane").data(keys).enter()
			.append("div")
			.classed("control-group tab-pane",1)
			.classed("active",function(d,i) {return !i;})
			.attr("id",function(d,i) {return "tab"+i;})
				.append("form").classed("form-vertical",1)
				.append("fieldset");
	
	tabs.append("h3").html(function(d) {return dict[d].long;})
	tabs.append("controls").selectAll("label").data(function(d,i) {return sets[i];}).enter()
		.append("label").classed("checkbox",1)
			.html(function(d) {return d.value;})
			.append("input")
			.attr("type","checkbox")
			.attr("name",function(d,i) {return "option"+i;})
			.attr("value",function(d,i) {return i;})
			.attr("checked",true)
			.on("change",function(d,i) {updateSelection(d.key,i,d3.select(this).property("checked"));})

var w=800,h=500;
var svg=d3.select("#main").append("svg").attr("width",w).attr("height",h);

var x=function(i) {return d3.scale.linear().domain([0,40]).range([0,400])(i%40);}
var y=function(i) {return d3.scale.linear().domain([0,40]).range([0,400])(~~(i/40));}

var xBar=d3.scale.linear().range([0,180]).domain([0,0.6]).clamp([true]);
var yBar=d3.scale.linear().range([30,430]).domain([0,11]);	
var cMap={
"François Hollande":"#C03",
"Nicolas Sarkozy":"#005384",
"Abstention, blanc, nul, sans réponse":"#CCC",
"Abstention":"#CCC",
"Marine Le Pen":"#1F2F53",
"Eva Joly":"#41B375",
"François Bayrou":"#EB802E",
"Jean-Luc Mélenchon":"#ED2027"}

rects=svg.append("g").classed("rects",1).selectAll("rect").data(data).enter().append("rect")
	.classed("unit",1)
	.attr("width",8).attr("height",8)
	.attr("x",function(d,i) {return x(i);})
	.attr("y",function(d,i) {return y(i);})
	.style("fill",function(d) {return cMap[d.jdv4p];})
		.append("title")
		.text(function(d) {var title="";keys.forEach(function(k) {title+=(dict[k].tab+":"+d[k]+"</br>");});return title;})
		
updateSelection(0,0,true);

rep=svg.append("text").attr("id","rep").text(pos+" répondants").attr("x",450).attr("y",15)

bars=svg.selectAll(".bars").data(total).enter().append("rect").classed("bars",1)
	.attr("x",450)
	.attr("y",function(d) {return yBar(d.order);})
	.attr("height",30)
	.attr("width",function(d) {return xBar(d.pourcentage);})
	.style("fill",function(d) {return cMap[d.candidat];});
labels=svg.selectAll(".legend").data(total).enter().append("text").classed("legend",1)
	.attr("x",453)
	.attr("y",function(d) {return yBar(d.order);})
	.attr("dy",20)
	.text(function(d) {return d.candidat+" : "+d3.format("%")(d.pourcentage);})
	.style("text-shadow","white 1px 1px");



function updateSelection(key,value,checked) {
	
	if (!checked) {filters[key].push(sets[key][value].value);}
	if (checked) {
		var idx=filters[key].indexOf(sets[key][value].value);
		if(idx>-1){filters[key].splice(idx,1);}}
	total=sets[0].map(function(d,i) {return {id:i,candidat:sets[0][i].value,value:0};})
	
	pos=0;	
	data.forEach(function(d,j) {//filterdata=data.slice(0).filter(function(d) {
		if (!(filters.some(function(f,i) {
			return (f.indexOf(d[keys[i]])>-1)
		;}))) {
			d.pos=pos++;
			d.visible=true;
			total[hCand[d.jdv4p]].value++;
		} else {d.visible=false;//d.pos=j
			}
	;})
	total.sort(function(a,b) {return b.value-a.value;})
	total.forEach(function(d,i) {
		d.pourcentage=d.value/d3.sum(total,function(e) {return e.value;})
		d.order=i;
	})
	total.sort(function(a,b) {return b.id-a.id;})
	
	
	updateDisplay();

}

function updateDisplay() {
	svg.selectAll(".unit").transition()
		.duration(500)
		.style("opacity",function(d) {return d.visible?1:0;})
		.each("end",function() {
			d3.select(this).transition().duration(500)
				.attr("x",function(d) {return x(d.pos);})
				.attr("y",function(d) {return y(d.pos);})
			})
	svg.selectAll(".bars").data(total).transition()
		.duration(500)
		.attr("width",function(d) {return xBar(d.pourcentage);})
		.attr("y",function(d) {return yBar(d.order);})
	svg.selectAll(".legend").data(total)
		.text(function(d) {if(d.pourcentage>0){return d.candidat+" : "+d3.format("%")(d.pourcentage);} else {return "";}})
		.transition()
		.duration(500)
		.attr("y",function(d) {return yBar(d.order);})
	svg.select("#rep").text(pos+" répondants");
		
};
$('rect').tipsy({html: true, gravity: 'w'});
})

