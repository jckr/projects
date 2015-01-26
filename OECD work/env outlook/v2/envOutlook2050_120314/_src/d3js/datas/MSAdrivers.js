var data=[
{key:2010, values:[{key:"Infrastructure", values:{y:0.0956185788634016,y0:0.904381421136655}},{key:"Climate change", values:{y:0.0252769940681204,y0:0.879104427068534}},{key:"Nitrogen", values:{y:0.0064339607863547,y0:0.872670466282179}},{key:"Former land use", values:{y:0.00546055811419108,y0:0.867209908167988}},{key:"Forestry", values:{y:0.0284575739631012,y0:0.838752334204887}},{key:"Agriculture", values:{y:0.163506355896578,y0:0.675245978308309}},{key:"Remaining MSA", values:{y:0.675245978308309,y0:0}}]},
{key:2030, values:[{key:"Infrastructure", values:{y:0.104083819192395,y0:0.895916180807645}},{key:"Climate change", values:{y:0.039967909488901,y0:0.855948271318745}},{key:"Nitrogen", values:{y:0.00710915815576988,y0:0.848839113162975}},{key:"Former land use", values:{y:0.0105883855718832,y0:0.838250727591091}},{key:"Forestry", values:{y:0.0350659019383531,y0:0.803184825652738}},{key:"Agriculture", values:{y:0.172859794876212,y0:0.630325030776526}},{key:"Remaining MSA", values:{y:0.630325030776526,y0:0}}]},
{key:2050, values:[{key:"Infrastructure", values:{y:0.108498520501233,y0:0.891501479498815}},{key:"Climate change", values:{y:0.0549150985073031,y0:0.836586380991512}},{key:"Nitrogen", values:{y:0.00768913410191349,y0:0.828897246889599}},{key:"Former land use", values:{y:0.014705397279629,y0:0.81419184960997}},{key:"Forestry", values:{y:0.0451139645154925,y0:0.769077885094477}},{key:"Agriculture", values:{y:0.164693297014362,y0:0.604384588080115}},{key:"Remaining MSA", values:{y:0.604384588080115,y0:0}}]}];

var variables=[
{key:"total", text: "A 100% MSA implies an undisturbed state. A decreasing MSA value reflects increasing human pressure on ecosystems and a decline in intactness or naturalness. <strong>Click on the numbers below</strong> to see the contribution of different pressures on biodiversity."},
{key:"infrastructure", text:"<strong>Infrastructure, encroachment and fragmentation</strong>: this represents the impact of urbanisation, roads, small-scale exploitation and the encroachment of human activities into, and fragmentation of natural habitats."},
{key:"Climate change", text:"<strong>Climate change</strong> is projected to drive further biodiversity loss."},
{key:"Nitrogen", text:"This represents the impact of deposition of atmospheric <strong>nitrogen</strong> (e.g. eutrophication and acidification)"},
{key:"Former land use", text:"The impact of <strong>former land use</strong> refers to the negative effects on biodiversity that remain after land is abandoned from agriculture."},
{key:"Forestry", text:"This represents the consequences of commercial <strong>forestry</strong> for wood production."},
{key:"Agriculture", text:"Impacts of land use change due to <strong>agriculture</strong> (i.e. livestock, food crop, bioenergy). <br/>What remains is the measure of the <strong>resulting biodiversity</strong>, once all pressures have been taken into account."},
{key:"Remaining MSA", text:"measure of the <strong>resulting biodiversity</strong>, once all pressures have been taken into account."}];


// handling pagination

var w=600,h=400;
var currentView=0;
var chart=d3.select("#chart");
var svg=chart.append("svg:svg").attr("width",w).attr("height",h).attr("version","1.1").attr("xmlns","http://www.w3.org/2000/svg");


var pages=d3.select("#pages");
var li=pages.append("ul").selectAll("li").data(["prev",1,2,3,4,5,6,7,"next"]).enter().append("li");
li.append("a").attr("href","#").html(function(d) {
	if (d=="prev") {return "&larr; Previous";};
	if (d=="next") {return "Next &rarr;";};
	return d;})
li.filter(function(d) {return d=="prev";}).classed("prev",1).classed("disabled",1);
li.filter(function(d) {return d=="next";}).classed("next",1);
li.filter(function(d) {return d==1;}).classed("active",1);

li.on("click", function(d) {
	if (d3.select(this).classed("disabled")==0) {
		if(d=="prev"&&currentView>0) {
			currentView--;	
			
		} else if (d=="next"&&currentView<6) {
			currentView++;
		} else {
			currentView=d-1;
		}
		li.filter(function(d) {return d=="prev";}).classed("disabled",(currentView==0));
		li.filter(function(d) {return d=="next";}).classed("disabled",(currentView==6));
	
		li.classed("active",0);
		li.filter(function(d) {return d==currentView+1;}).classed("active",1);
		transitionTo(currentView);
	}
})
		
// draw initial state

d3.select("#text").html(variables[currentView].text);


svg.append("svg:text").text("Terrestrial MSA, %").attr("x","-250").attr("y","50").attr("transform","rotate(-90)");
var x=d3.scale.linear().domain([0,2]).range([100,w-100]);
var y=d3.scale.linear().domain([0,1]).range([h-50,50]);
var hS=d3.scale.linear().domain([0,1]).range([0,h-100]);

svg.selectAll("g").data(data).enter().append("svg:g").classed("bar",1)
	.attr("transform",function(d,i) {return "translate("+x(i)+",0)";})
	.selectAll("rect").data(function(d) {return d.values;}).enter().append("svg:rect")	
		.attr("y",function(d) {return y(d.values.y+d.values.y0);})
		.attr("height",function(d) {return hS(d.values.y);})
		//.attr("x",function(d,i) {return i*10;})
		.attr("width",100)
		.style("fill",function(d,i) {return i<6?"tan":"forestgreen";})
		.style("stroke","white")
		.attr("class",function(d,i) {return "c"+i;})

// infotips removed, uncomment to get them back

//		.append("svg:title").text(function(d,i) {return d.key+" "+(100*d.values.y).toFixed(1)+"%";})
// $('rect').tipsy({html: true, gravity: 'w'});


svg.selectAll("g").append("svg:text").classed("year",1).attr("y",h-30).attr("x",50).attr("text-anchor","middle").text(function(d) {return d.key;})
svg.selectAll("g").append("svg:text").classed("percentage",1).attr("y",y(1)-10).attr("x",50).attr("text-anchor","middle").text("100%")
		
function transitionTo(view) {
	d3.select("#text").html(variables[currentView].text);
	d3.range(7).forEach(function(i) {d3.selectAll(".c"+i).transition().attr("height",function(d) {return (i>=view)?hS(d.values.y):0;})})
	svg.selectAll(".percentage").transition()
		.attr("y",function(d) {return y(d3.sum(d.values, function(v,i) {return i>=view?v.values.y:0;}))-10;})
		.text(function(d) {return (d3.sum(d.values, function(v,i) {return i>=view?v.values.y:0;})*100).toFixed(0)+"%";})
		
}
