
// sliders

$('#slider1').slider({
		handle: '#slider-handle',
		min: 0,
		max: 100,
		change: function(e,ui) {drawCh(ui.value);}
});
$('#slider2').slider({
		handle: '#slider-handle',
		min: 0,
		max: 100,
		change: function(e,ui) {drawNet(ui.value);}
});




var countries=[
{key: "France", values:[
{brut:80000,net:63392.2716, total:115014.3984},
{brut:30000,net:23772, total:42849}]},
{key: "Allemagne", values:[
{brut:80000,net:69326.5125, total:91473.4375},
{brut:30000,net:23812.5, total:36367.5}]}];



var data=[	
{country:"France",cat1:"Charges salarié", cat2:"Sécurité Sociale",cat3:"Maladie, Maternité, Inv, Décès",value:[600,225], crans:[4,4], dots:[893,893], visible:[true,true]}	,
{country:"France",cat1:"Charges salarié", cat2:"Sécurité Sociale",cat3:"Vieillesse plafonnée",value:[2418.738,1995], crans:[18,36], dots:[866,833], visible:[true,true]}	,
{country:"France",cat1:"Charges salarié", cat2:"Sécurité Sociale",cat3:"Vieillesse déplafonnée",value:[80,30], crans:[19,36], dots:[865,833], visible:[true,true]}	,
{country:"France",cat1:"Charges salarié", cat2:"Chômage",cat3:"Chômage TA/TB",value:[1920,720], crans:[30,48], dots:[844,811], visible:[true,true]}	,
{country:"France",cat1:"Charges salarié", cat2:"Retraite complémentaire",cat3:"Retraite ARRCO TA ",value:[1091.16,900], crans:[37,62], dots:[831,784], visible:[true,true]}	,
{country:"France",cat1:"Charges salarié", cat2:"Retraite complémentaire",cat3:"Retraite AGIRC TB ",value:[3359.356,0], crans:[57,62], dots:[793,784], visible:[true,false]}	,
{country:"France",cat1:"Charges salarié", cat2:"Retraite complémentaire",cat3:"AGFF TA",value:[290.976,0], crans:[59,62], dots:[790,784], visible:[true,false]}	,
{country:"France",cat1:"Charges salarié", cat2:"Retraite complémentaire",cat3:"AGFF TB",value:[392.652,0], crans:[61,62], dots:[786,784], visible:[true,false]}	,
{country:"France",cat1:"Charges salarié", cat2:"Retraite complémentaire",cat3:"APEC TA",value:[8.72928,0], crans:[61,62], dots:[786,784], visible:[true,false]}	,
{country:"France",cat1:"Charges salarié", cat2:"Retraite complémentaire",cat3:"APEC TB",value:[10.47072,0], crans:[61,62], dots:[786,784], visible:[true,false]}	,
{country:"France",cat1:"Charges salarié", cat2:"Retraite complémentaire",cat3:"CET",value:[104,0], crans:[62,62], dots:[784,784], visible:[true,false]}	,
{country:"France",cat1:"Charges salarié", cat2:"Autres ",cat3:"CSGS imposable base (98,25%)",value:[2279.4,854.775], crans:[76,76], dots:[759,758], visible:[true,true]}	,
{country:"France",cat1:"Charges salarié", cat2:"Autres ",cat3:"CSG déductible (base 98,25%)",value:[4008.6,1503.225], crans:[100,100], dots:[714,713], visible:[true,true]}	,
{country:"France",cat1:"Charges salarié", cat2:"Autres ",cat3:"CSGS imposable (sans abat)",value:[15.82182,0], crans:[100,100], dots:[713,713], visible:[true,false]}	,
{country:"France",cat1:"Charges salarié", cat2:"Autres ",cat3:"CSG déductible (sans abat)",value:[27.82458,0], crans:[100,100], dots:[713,713], visible:[true,false]}	,
{country:"France",cat1:"Charges employeur", cat2:"Sécurité Sociale",cat3:"Maladie, Maternité, Inv, Décès",value:[10240,3840], crans:[29,30], dots:[1015,1015], visible:[true,true]}	,
{country:"France",cat1:"Charges employeur", cat2:"Sécurité Sociale",cat3:"Contribution solidarité",value:[240,90], crans:[30,31], dots:[1018,1018], visible:[true,true]}	,
{country:"France",cat1:"Charges employeur", cat2:"Sécurité Sociale",cat3:"AT",value:[960,360], crans:[33,33], dots:[1029,1029], visible:[true,true]}	,
{country:"France",cat1:"Charges employeur", cat2:"Sécurité Sociale",cat3:"Vieillesse plafonnée",value:[3018.876,2490], crans:[41,53], dots:[1063,1103], visible:[true,true]}	,
{country:"France",cat1:"Charges employeur", cat2:"Sécurité Sociale",cat3:"Vieillesse déplafonnée",value:[1280,480], crans:[45,57], dots:[1077,1118], visible:[true,true]}	,
{country:"France",cat1:"Charges employeur", cat2:"Sécurité Sociale",cat3:"Allocations Familiales",value:[4320,1620], crans:[57,69], dots:[1126,1166], visible:[true,true]}	,
{country:"France",cat1:"Charges employeur", cat2:"Sécurité Sociale",cat3:"FNAL 0,1%",value:[36.372,30], crans:[57,69], dots:[1126,1167], visible:[true,true]}	,
{country:"France",cat1:"Charges employeur", cat2:"Sécurité Sociale",cat3:"FNAL 0,4%",value:[145.488,120], crans:[58,70], dots:[1128,1171], visible:[true,true]}	,
{country:"France",cat1:"Charges employeur", cat2:"Sécurité Sociale",cat3:"FNAL 0,5%",value:[218.14,0], crans:[58,70], dots:[1130,1171], visible:[true,false]}	,
{country:"France",cat1:"Charges employeur", cat2:"Chômage",cat3:"Chômage TA/TB",value:[3200,1200], crans:[68,80], dots:[1166,1207], visible:[true,true]}	,
{country:"France",cat1:"Charges employeur", cat2:"Chômage",cat3:"AGS",value:[240,90], crans:[68,80], dots:[1169,1210], visible:[true,true]}	,
{country:"France",cat1:"Charges employeur", cat2:"Retraite complémentaire",cat3:"Retraite ARRCO TA ",value:[1636.74,1350], crans:[73,91], dots:[1187,1250], visible:[true,true]}	,
{country:"France",cat1:"Charges employeur", cat2:"Retraite complémentaire",cat3:"Retraite AGIRC TB ",value:[5497.128,0], crans:[89,91], dots:[1249,1250], visible:[true,false]}	,
{country:"France",cat1:"Charges employeur", cat2:"Retraite complémentaire",cat3:"AGFF TA",value:[436.464,360], crans:[90,94], dots:[1254,1261], visible:[true,true]}	,
{country:"France",cat1:"Charges employeur", cat2:"Retraite complémentaire",cat3:"AGFF TB",value:[567.164,0], crans:[91,94], dots:[1260,1261], visible:[true,false]}	,
{country:"France",cat1:"Charges employeur", cat2:"Retraite complémentaire",cat3:"APEC TA",value:[13.09392,0], crans:[92,94], dots:[1261,1261], visible:[true,false]}	,
{country:"France",cat1:"Charges employeur", cat2:"Retraite complémentaire",cat3:"APEC TB",value:[15.70608,0], crans:[92,94], dots:[1261,1261], visible:[true,false]}	,
{country:"France",cat1:"Charges employeur", cat2:"Retraite complémentaire",cat3:"CET",value:[176,0], crans:[92,94], dots:[1263,1261], visible:[true,false]}	,
{country:"France",cat1:"Charges employeur", cat2:"Prévoyance décès, inv., incapacité",cat3:"Prévoyance TA cadres obligatoire",value:[545.58,0], crans:[94,94], dots:[1269,1261], visible:[true,false]}	,
{country:"France",cat1:"Charges employeur", cat2:"Autres ",cat3:"Taxe apprentissage",value:[544,204], crans:[95,95], dots:[1275,1267], visible:[true,true]}	,
{country:"France",cat1:"Charges employeur", cat2:"Autres ",cat3:"Formation continue",value:[1280,480], crans:[99,99], dots:[1289,1281], visible:[true,true]}	,
{country:"France",cat1:"Charges employeur", cat2:"Autres ",cat3:"Effort construction",value:[360,135], crans:[100,100], dots:[1293,1285], visible:[true,true]}	,
{country:"France",cat1:"Charges employeur", cat2:"Autres ",cat3:"Forfait social",value:[43.6464,0], crans:[100,100], dots:[1294,1285], visible:[true,false]}	,
{country:"Allemagne",cat1:"Charges salarié", cat2:"Sécurité Sociale",cat3:"Maladie/Maternité",value:[3644.9,2460], crans:[34,40], dots:[859,826], visible:[true,true]}	,
{country:"Allemagne",cat1:"Charges salarié", cat2:"Sécurité Sociale",cat3:"Assurance dépendance ",value:[433.3875,292.5], crans:[38,44], dots:[854,817], visible:[true,true]}	,
{country:"Allemagne",cat1:"Charges salarié", cat2:"Sécurité Sociale",cat3:"Vieillesse, invalidité, décès",value:[5731.2,2985], crans:[92,93], dots:[790,728], visible:[true,true]}	,
{country:"Allemagne",cat1:"Charges salarié", cat2:"Chômage",cat3:"Assurance chômage",value:[864,450], crans:[100,100], dots:[780,714], visible:[true,true]}	,
{country:"Allemagne",cat1:"Charges employeur", cat2:"Sécurité Sociale",cat3:"Maladie/Maternité",value:[3244.85,2190], crans:[28,34], dots:[937,966], visible:[true,true]}	,
{country:"Allemagne",cat1:"Charges employeur", cat2:"Sécurité Sociale",cat3:"Assurance dépendance ",value:[433.3875,292.5], crans:[32,39], dots:[941,974], visible:[true,true]}	,
{country:"Allemagne",cat1:"Charges employeur", cat2:"Sécurité Sociale",cat3:"AT",value:[1200,450], crans:[43,46], dots:[955,988], visible:[true,true]}	,
{country:"Allemagne",cat1:"Charges employeur", cat2:"Sécurité Sociale",cat3:"Vieillesse, invalidité, décès",value:[5731.2,2985], crans:[92,93], dots:[1019,1078], visible:[true,true]}	,
{country:"Allemagne",cat1:"Charges employeur", cat2:"Chômage",cat3:"Assurance chômage",value:[864,450], crans:[100,100], dots:[1029,1091], visible:[true,true]}	];

var salaries=[80000,30000];
	


//var countries=["France","Allemagne"];
var cats=["Charges salarié","Charges employeur"];
var nbPerRow=30;

countries.forEach(function(c) {
	c.dots=c.values.map(function(v) {
		return {brut:nbPerRow*nbPerRow,net:Math.round(nbPerRow*nbPerRow*v.net/v.brut),total:Math.round(nbPerRow*nbPerRow*v.total/v.brut)};
	})
})

// dimensions de la vis et échelles

var h=600,w1=250,r=3,h1=h-250, wc=200;

// taille des polices;
var fs1="13px",fs2="11px",fs0="15px";

var slider1Val=0;
var slider2Val=0;

var mode=0;


var svg=d3.selectAll("#chart").append("svg:svg").attr("height",600).attr("width", 1024);

// trace un contour autour des points. k est la marge en points. ie path (123,1) va tracer un contour autour des 123 points en partant du 1er à 1 point de distance de ces points. 

function path(value,k) {
	if(k===undefined) {k=1;}
	var myCoords=[[-k,-k],[-k,Math.ceil(value/nbPerRow)],[value%nbPerRow+k,Math.ceil(value/nbPerRow)],[value%nbPerRow+k,Math.floor(value/nbPerRow)],[k+nbPerRow-1,Math.floor(value/nbPerRow)],[k+nbPerRow-1,-k]];
	if(Math.ceil(value%nbPerRow)==nbPerRow){
	myCoords=[[-k,-k],[-k,Math.ceil(value/nbPerRow)],[nbPerRow+k-1,Math.ceil(value/nbPerRow)],[nbPerRow+k-1,-k]];}
	return d3.svg.line().x(function(d) {return xS(d[0]);}).y(function(d) {return yS(d[1]);})(myCoords)+"Z";
}

// dotsData sera passé au SVG pour dessiner les points, on y met les coordonnées x et y des points.

var dotsData=countries.map(function(c,j) {
	return c.dots.map(function(v,i) {return d3.range(v.total).map(function(i) {return {y:~~(i/nbPerRow),x:i%nbPerRow,class:"net"};})
	;})
;})

var CS=[[[],[]],[[],[]]];
var CE=[[[],[]],[[],[]]];

countries.forEach(function(c,i) {
	cats.forEach(function(t,j) {
		data.filter(function(d) {
			return d.country==c.key&&d.cat1==t
		}).forEach(function(d,k) {
			
			d.id=k // this will be useful later.
			salaries.forEach(function(s,l) {
			if(d.visible[l]) {	
				if(j) {
					CE[i][l].push({country:d.country,cat1:d.cat1,cat2:d.cat2,cat3:d.cat3,value:d.value[l],crans:d.crans[l],class:"CE"+i+"-"+k});

				} else {
					CS[i][l].push({country:d.country,cat1:d.cat1,cat2:d.cat2,cat3:d.cat3,value:d.value[l],crans:d.crans[l],class:"CS"+i+"-"+k});
				}

					dotsData[i][l].filter(function(dot,m) {

						if(j) { // charges employeur
							return m<d.dots[l]&&m>=nbPerRow*nbPerRow&&dot.class=="net";
						} else { // charges salarié
							return m>=d.dots[l]&&m<nbPerRow*nbPerRow&&dot.class=="net";
						}
					}).forEach(function(dot) {
						dot.class="C"+(j?"E":"S")+i+"-"+k;
						if(j) {dot.y++;}
					})
				}
			;})
				
		;})
	})
})




var xS=d3.scale.linear().domain([0,nbPerRow-1]).range([0,220]);
var x=function(d) {return xS(d.x);}

var yS=d3.scale.linear().domain([0,nbPerRow-1]).range([580,360]);
var y=function(d) {return yS(d.y);}

var France=svg.append("svg:g").attr("transform","translate(280,0)");
var Germany=svg.append("svg:g").attr("transform","translate(540,0)");

var listCharges=[];
listCharges[0]=France.append("svg:g").attr("transform","translate(-20, "+yS(nbPerRow)+")")
//.style("text-transform","uppercase")
.classed("charges",1)
.style("font-weight","normal");
listCharges[0].append("svg:g").classed("salarie",1);listCharges[0].append("svg:g").classed("employeur",1);
listCharges[0].append("svg:line").classed("separator",1).attr("x1",-5).attr("y1",0).attr("y2",0).attr("x2",-wc).style("stroke","#575757").style("stroke-width",2)
listCharges[1]=Germany.append("svg:g").attr("transform","translate(-20, "+yS(nbPerRow)+")")
//.style("text-transform","uppercase")
.style("font-weight","normal")
.classed("charges",1);
listCharges[1].append("svg:g").classed("salarie",1);listCharges[1].append("svg:g").classed("employeur",1);
listCharges[1].append("svg:line").classed("separator",1).attr("x1",50+w1).attr("y1",0).attr("y2",0).attr("x2",50+wc+w1).style("stroke","#575757").style("stroke-width",2)
svg.selectAll(".separator").style("opacity",0);


var dots=countries.map(function(c) {return salaries.map(function(s) {return 0;})})

// pour aller plus vite je l'écris en long plutôt que de faire de belles boucles

dots[0][0]=France.append("svg:g").classed("dots france cadre",1);
dots[0][0].selectAll(".s").data(dotsData[0][0]).enter().append("svg:circle")
	.attr("cx",-wc-2*r).attr("cy",y).attr("r",4)
	.attr("class", function(d) {return d.class;})
	.transition().duration(0).delay(0)
	.attr("cx",function(d) {
		if (d.class[1]!="E") {
			return x(d)
		;} else {
			return -600
		;}
})

dots[1][0]=Germany.append("svg:g").classed("dots allemagne cadre",1);
dots[1][0].selectAll(".s").data(dotsData[1][0]).enter().append("svg:circle")
	.attr("cx",2*(w1+r)).attr("cy",y).attr("r",4)
	.attr("class", function(d) {return d.class;})
	.transition().duration(0).delay(0)
		.attr("cx",function(d) {
	if (d.class[1]!="E") {
		return x(d)
	;} else {
		return 600
	;}
})
	
dots[0][1]=France.append("svg:g").classed("dots france non-cadre",1).style("visibility","hidden");
dots[0][1].selectAll(".s").data(dotsData[0][1]).enter().append("svg:circle")
	.attr("cx",-wc-2*r).attr("cy",y).attr("r",4)
	.attr("class", function(d) {return d.class;})
	.transition().duration(0).delay(0)
		.attr("cx",function(d) {
	if (d.class[1]!="E") {
		return x(d)
	;} else {
		return -600
	;}
})

dots[1][1]=Germany.append("svg:g").classed("dots allemagne non-cadre",1).style("visibility","hidden");
dots[1][1].selectAll(".s").data(dotsData[1][1]).enter().append("svg:circle")
	.attr("cx",2*(w1+r)).attr("cy",y).attr("r",4)
	.attr("class", function(d) {return d.class;})
	.transition().duration(0).delay(0)
		.attr("cx",function(d) {
	if (d.class[1]!="E") {
		return x(d)
	;} else {
		return 600
	;}
})

d3.selectAll("circle").style("fill",function(d) {if(d.class=="net"){return "rgb(250, 104, 116)";}else if(d.class[1]=="E") {return "rgb(95, 69, 148)";} else return "rgb(250, 104, 116)";}).style("stroke","none");

oCF=France.append("svg:path").attr("d",path(nbPerRow*nbPerRow)).style("stroke","silver").style("stroke-dasharray","6 6").style("stroke-width",3).style("fill","none");
oCG=Germany.append("svg:path").attr("d",path(nbPerRow*nbPerRow)).style("stroke","silver").style("stroke-dasharray","6 6").style("stroke-width",3).style("fill","none");

var netFC=[],netFT=[],coutEFC=[],coutEFT=[],netAC=[],netAT=[],coutEAC=[],coutEAT=[];

netFC[0]=France.append("svg:path").attr("d",path(countries[0].dots[0].net-1)).style("stroke","rgb(250, 104, 116)").style("fill","none").style("stroke-width",3).style("visibility","hidden");
netFT[0]=France.append("svg:text").text("Salaire net: 65,815").attr("x",xS(nbPerRow/2)).attr("y",yS(~~(countries[0].dots[0].net/nbPerRow)+2)).attr("text-anchor","middle").style("fill","rgb(250, 104, 116)").style("font-size",fs0).style("visibility","hidden");
coutEFC[0]=France.append("svg:path").attr("d",path(countries[0].dots[0].total+nbPerRow-1)).style("stroke","rgb(95, 69, 148)").style("fill","none").style("stroke-width",3).style("visibility","hidden");
coutEFT[0]=France.append("svg:text").text("Coût pour l'employeur: 115,014").attr("x",xS(nbPerRow/2)).attr("y",yS(~~(countries[0].dots[0].total/nbPerRow)+3)).attr("text-anchor","middle").style("fill","#575757").style("font-size",fs0).style("visibility","hidden");

netAC[0]=Germany.append("svg:path").attr("d",path(countries[1].dots[0].net)).style("stroke","rgb(250, 104, 116)").style("fill","none").style("stroke-width",3).style("visibility","hidden");
netAT[0]=Germany.append("svg:text").text("Salaire net: 66,327").attr("x",xS(nbPerRow/2)).attr("y",yS(~~(countries[1].dots[0].net/nbPerRow)+2)).attr("text-anchor","middle").style("fill","rgb(250, 104, 116)").style("font-size",fs0).style("visibility","hidden");
coutEAC[0]=Germany.append("svg:path").attr("d",path(countries[1].dots[0].total+nbPerRow-1)).style("stroke","rgb(95, 69, 148)").style("fill","none").style("stroke-width",3).style("visibility","hidden");
coutEAT[0]=Germany.append("svg:text").text("Coût pour l'employeur: 91,473").attr("x",xS(nbPerRow/2)).attr("y",yS(~~(countries[1].dots[0].total/nbPerRow)+3)).attr("text-anchor","middle").style("fill","#575757").style("font-size",fs0).style("visibility","hidden");

netFC[1]=France.append("svg:path").attr("d",path(countries[0].dots[1].net-1)).style("stroke","rgb(250, 104, 116)").style("fill","none").style("stroke-width",3).style("visibility","hidden");
netFT[1]=France.append("svg:text").text("Salaire net: 23,532").attr("x",xS(nbPerRow/2)).attr("y",yS(~~(countries[0].dots[1].net/nbPerRow)+2)).attr("text-anchor","middle").style("fill","rgb(250, 104, 116)").style("font-size",fs0).style("visibility","hidden");
coutEFC[1]=France.append("svg:path").attr("d",path(countries[0].dots[1].total+nbPerRow-1)).style("stroke","rgb(95, 69, 148)").style("fill","none").style("stroke-width",3).style("visibility","hidden");
coutEFT[1]=France.append("svg:text").text("Coût pour l'employeur: 42,849").attr("x",xS(nbPerRow/2)).attr("y",yS(~~(countries[0].dots[1].total/nbPerRow)+3)).attr("text-anchor","middle").style("fill","#575757").style("font-size",fs0).style("visibility","hidden");

netAC[1]=Germany.append("svg:path").attr("d",path(countries[1].dots[1].net-1)).style("stroke","rgb(250, 104, 116)").style("fill","none").style("stroke-width",3).style("visibility","hidden");
netAT[1]=Germany.append("svg:text").text("Salaire net: 23,813").attr("x",xS(nbPerRow/2)).attr("y",yS(~~(countries[1].dots[1].net/nbPerRow)+2)).attr("text-anchor","middle").style("fill","rgb(250, 104, 116)").style("font-size",fs0).style("visibility","hidden");
coutEAC[1]=Germany.append("svg:path").attr("d",path(countries[1].dots[1].total+nbPerRow-1)).style("stroke","rgb(95, 69, 148)").style("fill","none").style("stroke-width",3).style("visibility","hidden");
coutEAT[1]=Germany.append("svg:text").text("Coût pour l'employeur: 36,368").attr("x",xS(nbPerRow/2)).attr("y",yS(~~(countries[1].dots[1].total/nbPerRow)+3)).attr("text-anchor","middle").style("fill","#575757").style("font-size",fs0).style("visibility","hidden");

titreF=France.append("svg:text").text("France").attr("x",xS(nbPerRow/2)).attr("y",150).attr("text-anchor","middle").style("fill","#6eccbd").style("font-size","36px");
titreA=Germany.append("svg:text").text("Allemagne").attr("x",xS(nbPerRow/2)).attr("y",150).attr("text-anchor","middle").style("fill","#6eccbd").style("font-size","36px");


/*slider1=d3.selectAll("#salarie");
slider1.property("value",function() {return this.value;})
slider1.on("mouseup",function() {drawNet(this.value);})

slider2=d3.selectAll("#employeur");
slider2.property("value",function() {return this.value;})
slider2.on("mouseup",function() {drawCh(this.value);})*/


d3.selectAll("#bouton1").on("click", function() {
	if(mode) {
		changeMode();
		d3.selectAll("#bouton1").classed("on",1);
		d3.selectAll("#bouton2").classed("on",0);
		}
	
	
})

d3.selectAll("#bouton2").on("click", function() {
	if(!mode)  {
		changeMode();
		d3.selectAll("#bouton1").classed("on",0);
		d3.selectAll("#bouton2").classed("on",1);
		}
})


var myData,nbData,iMax,li;

function changeMode() {
	mode=1-mode;
	dots[0][mode].style("visibility","visible");
	dots[1][mode].style("visibility","visible");
	dots[0][1-mode].style("visibility","hidden");
	dots[1][1-mode].style("visibility","hidden");
	drawNet(slider1Val);
	drawCh(slider2Val);
}

function drawNet(newIndex) {
	
	newIndex=parseFloat(newIndex);
	

	CS.forEach(function(c,j) {
		var myData=c[mode].filter(function(d) {return d.crans<=newIndex;})
		c[mode].forEach(function(d,i) {
			//console.log(j+"-"+d.id+": "+d3.selectAll(".CS"+j+"-"+d.id)[0].length);
			
			if(d.crans<=newIndex) {
				d3.selectAll("."+d.class)
			
				.transition()
				.duration(1000)
				.style("fill","silver")
				.attr("cy",function() {return Math.random()*h;})
				.attr("cx",function() {return j?600:-600;})
				.delay(function(dot,k){return k;})
			} else {
				d3.selectAll("."+d.class)
				
				.transition()
				.duration(1000)
				.attr("cy",y)
				.attr("cx",x)
				.style("fill","rgb(250, 104, 116)");
			}
		})
		listCharges[j].selectAll(".salarie").selectAll("text").data(myData).enter().append("svg:text")
			.text(function(d) {return d.cat3+" "+d.value.toFixed(0);})
			.attr("text-anchor",j?"start":"end")
			.attr("x",j?260:-10)
			.attr("y",function(d,i) {return 11*i+15;})
			.style("fill","#fa6873").style("font-size",fs1)
			.transition().delay(300).duration(500).style("fill","#575757").style("font-size",fs2);
			
		listCharges[j].selectAll(".salarie").selectAll("text").filter(function(d,i) {return i>=myData.length;}).remove();
			
	;})

	
	slider1Val=newIndex;

	netFT[1-mode].style("visibility","hidden");netFC[1-mode].style("visibility","hidden");	
	netAT[1-mode].style("visibility","hidden");netAC[1-mode].style("visibility","hidden");
	
	if(newIndex==100){netFT[mode].style("visibility","visible");netFC[mode].style("visibility","visible");
	netAT[mode].style("visibility","visible");netAC[mode].style("visibility","visible");}
	else {netFT[mode].style("visibility","hidden");netFC[mode].style("visibility","hidden");
	netAT[mode].style("visibility","hidden");netAC[mode].style("visibility","hidden");}

}

function drawCh(newIndex) {
	
	newIndex=parseFloat(newIndex);

	CE.forEach(function(c,j) {
		var myData=c[mode].filter(function(d) {return d.crans<=newIndex;})
			c[mode].forEach(function(d,i) {
				//console.log(j+"-"+d.id+": "+d3.selectAll(".CS"+j+"-"+d.id)[0].length);
				
				if(d.crans>newIndex) {
					d3.selectAll("."+d.class)
				
					.transition()
					.duration(1000)
					.style("fill","silver")
					.attr("cy",function() {return Math.random()*h;})
					.attr("cx",function() {return j?600:-600;})
					.delay(function(dot,k){return k;})
				} else {
					d3.selectAll("."+d.class)
					
					.transition()
					.duration(1000)
					.attr("cy",y)
					.attr("cx",x)
					.style("fill","rgb(95, 69, 148)");
				}
			listCharges[j].selectAll(".employeur").selectAll("text").data(myData).enter().append("svg:text")
				.text(function(d) {return d.cat3+" "+d.value.toFixed(0);})
				.attr("text-anchor",j?"start":"end")
				.attr("x",j?260:-10)
				.attr("y",function(d,i) {return -11*i-10;})
				.style("fill","#604592").style("font-size",fs1)
				.transition().delay(300).duration(500).style("fill","#575757").style("font-size",fs2);
			listCharges[j].selectAll(".employeur").selectAll("text").filter(function(d,i) {return i>=myData.length;}).remove();
			})		
	;})
	
	/*CE.forEach(function(c,j) {
		c[mode].filter(function(d,i) {return (i>=((newIndex)*CEl[j]*.01));}).forEach(function(d,i) {
			console.log(j+"-"+d.id+": "+d3.selectAll(".CE"+j+"-"+d.id)[0].length);
			d3.selectAll(".CE"+j+"-"+d.id)
			.style("fill","silver")
			.transition()
			.duration(1000)
			.attr("cy",function() {return Math.random()*h;})
			.attr("cx",function() {return j?2*(w1+r):-wc-2*r;})
			.delay(function(dot,k){return k;})
		;})
		
		c[mode].filter(function(d,i) {return (i<(newIndex)*CEl[j]*.01);}).forEach(function(d,i) {
			d3.selectAll(".CE"+j+"-"+d.id).transition().attr("cy",y).attr("cx",x).style("fill","rgb(95, 69, 148)");
		;})
	;})*/
	/*
	myData=data.filter(function(d) {return d.country=="France"&&d.cat1=="Charges employeur"&&d.value[mode];})
	 nbData=myData.length;

	myData=myData.filter(function(d,i) {return i<.01*nbData*newIndex;})
	 iMax=myData.length;

	listCharges[0].selectAll(".employeur").selectAll("text").data(myData).enter().append("svg:text")
			.text(function(d) {return d.cat3+" "+d.value[mode].toFixed(0);})
			.attr("text-anchor","end")
			.attr("x",15)
			.attr("y",function(d,i) {return -13*i-10;})
			.style("fill","#604592").style("font-size",fs1)
		.transition().delay(300).duration(500).style("fill","#575757").style("font-size",fs2);
	listCharges[0].selectAll(".employeur").selectAll("text").filter(function(d,i) {return i>=iMax;}).remove();

	listCharges[0].selectAll("line").transition().style("opacity",(myData.length&&data.filter(function(d,i) {return d.country=="France"&&d.cat1=="Charges salarié"&&d.value[mode];}).length*slider1Val>100)?1:0);

	myData=data.filter(function(d) {return d.country=="Allemagne"&&d.cat1=="Charges employeur"&&d.value[mode];})
	nbData=myData.length;

	myData=myData.filter(function(d,i) {return i<.01*nbData*newIndex;})
	iMax=myData.length;

	listCharges[1].selectAll(".employeur").selectAll("text").data(myData).enter().append("svg:text")
				.text(function(d) {return d.cat3+" "+d.value.toFixed(0);})
				//.attr("text-anchor","end")
				.attr("x",w1+50)
				.attr("y",function(d,i) {return -13*i-10;})
				.style("fill","#604592").style("font-size",fs1)
			.transition().delay(300).duration(500).style("fill","#575757").style("font-size",fs2);
	listCharges[1].selectAll(".employeur").selectAll("text").filter(function(d,i) {return i>=iMax;}).remove();
	
	listCharges[1].selectAll("line").transition().style("opacity",(myData.length&&data.filter(function(d,i) {return d.country=="Allemagne"&&d.cat1=="Charges salarié"&&d.value[mode];}).length*slider1Val>100)?1:0);
	*/
	coutEFT[1-mode].style("visibility","hidden");coutEFC[1-mode].style("visibility","hidden");	
	coutEAT[1-mode].style("visibility","hidden");coutEAC[1-mode].style("visibility","hidden");
	
	if(newIndex==100){
		coutEFT[mode].style("visibility","visible");
		coutEFC[mode].style("visibility","visible");
		coutEAT[mode].style("visibility","visible");
		coutEAC[mode].style("visibility","visible");
	}
		else {coutEFT[mode].style("visibility","hidden");coutEFC[mode].style("visibility","hidden");
		coutEAT[mode].style("visibility","hidden");coutEAC[mode].style("visibility","hidden");
	}

	slider2Val=newIndex;
}
