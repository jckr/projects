var svg=d3.select("svg");
var largePaths=d3.selectAll(".depts path");
var circos=[];
var cScale=d3.scale.linear().domain([0,0.5,1]).range(["rgb(204, 0, 51)","#eee","#005384"]);
var mode=0;

largePaths.each(function() {
	var path=d3.select(this);
	var id=path.attr("id");
	var circ=id.slice(id.length-2);
	var dept=id.slice(1,id.length-2);
	var title=dept+"-"+circ;
	//path.selectAll("title").data([title]).enter().append("title").text(String);
	var infos={};
	var d=path.attr("d");
	var tokens=d.replace("M","").replace("L"," ").replace("C"," ").replace("z","").replace("Z","").replace("m","").split(" ");
		var minX=9999,maxX=0,minY=9999,maxY=0,x=0,y=0;
		tokens.forEach(function(token) {
			if (tokens.length){
			var coord=token.split(","),x=+coord[0],y=+coord[1];

			if (x>maxX){maxX=x;}
			if (x<minX){minX=x;}
			if (y>maxY){maxY=y;}
			if (y<minY){minY=y;}
		}
		})

	if (+dept===999){
		minX=34*circ-34;
		maxX=20+minX;
		minY=510;
		maxY=530;
		
	}
	
	infos={
		id:id,
		
		minX:minX,
		maxX:maxX,
		minY:minY,
		maxY:maxY,
		x:(minX+maxX)/2,
		y:(minY+maxY)/2,
		height:maxY-minY,
		width:maxX-minX,
		area:(maxY-minY)*(maxX-minX)};
	if(+dept===999){infos.lx=infos.x+10;infos.ly=infos.y+10;}
	circos.push(infos);

})
d3.selectAll("title").remove();

circos.sort(function(a,b){if(a.id>b.id) {return 1;} else {if(a.id<b.id){return -1;}};return 0;})
var data;
d3.csv("chances.csv",function(csv) {data=csv;
	csv.forEach(function(d,i){
		circos[i].index=i;

		circos[i].nom=d.nom;
		circos[i].cDroite=d.cDroite;
		circos[i].cGauche=d.cGauche;
		circos[i].sD=d.sD;
		circos[i].sG=d.sG;
		circos[i].sT2=+d.sT2;
		circos[i].sH2=+d.sH2;
		circos[i].cG=+d.cG;
		circos[i].cD=+d.cD;
		circos[i].important=+d.important;
		var path=d3.select("#"+circos[i].id);
		path.attr("i",i);
		path.transition().duration(2000).style("fill",function() {return cScale(circos[i].cD);})
		//if(+d.important){path.style("stroke","black").style("stroke-width",2);}


	})
	circos.sort(function(a,b){return a.cD-b.cD;});
	circos.forEach(function(d,i) {d.rank=i;});
	circos.sort(function(a,b){if(a.id>b.id) {return 1;} else {if(a.id<b.id){return -1;}};return 0;})

	var importantC=circos.filter(function(d) {return d.important;})
	var hashedP=svg.selectAll(".important").data(importantC).enter()
		.append("path")
		.attr("d",function(d) {return d3.select("#"+d.id).attr("d");})
		.attr("i",function(d) {return d.index;})
		.classed("important",1)
		.attr("id",function(d) {return d.id.replace("c","i");})
		.attr("transform",function(d) {return d3.select("#"+d.id).attr("transform");})
		.style("fill","url(#hashed)");
	var largeRects=svg.selectAll("rect").data(circos).enter()
		.append("rect")
			.attr("x",function(d){return d.x;}).attr("rx",2).attr("ry",2)
			.attr("y",function(d){return d.y;})
			.attr("id",function(d){return d.id.replace("c","r");})
			.attr("width",1)//function(d){return d.width;})
			.attr("height",1)//function(d){return d.height;})
			.style("fill",function(d) {return cScale(d.cD);})
		//	.style("stroke",function(d) {return d.important?"black":"white";})

	var hashedR=svg.selectAll(".importantR").data(importantC).enter()
		.append("rect")
		.attr("x",function(d){return 550+15*(d.index%25)+1;})
		.attr("y",function(d){return 50+15*(~~(d.index/25))+1;})
		.attr("id",function(d) {return d.id.replace("c","R");})
		.attr("width",13)
		.attr("height",13)
		.style("fill","url(#hashed)")
		.style("opacity",0)
	largeRects
	.transition()
		.duration(1000)
			.attr("x",function(d,i) {return 550+15*(i%25)+1;})
			.attr("y",function(d,i) {return 50+15*(~~(i/25))+1;})
			.attr("width",13)
			.attr("height",13)
		.each("end",function(d) {d3.select("#"+d.id.replace("c","R")).style("opacity",1)})
		//.each("end",function(d) {d3.select("#"+d.id).transition().style("opacity",0);})
	hashedP
		.on("mouseover",function() {highlightP(d3.select(this).attr("i"));})
		.on("mouseout",function() {unlightP(d3.select(this).attr("i"));})
	hashedR
		.on("mouseover",highlight)
		.on("mouseout",unlight)
		.on("click",order);
	largeRects
		.on("mouseover",highlight)
		.on("mouseout",unlight)
		.on("click",order);
	largePaths
		.on("mouseover",function() {console.log(d3.select(this).attr("i"));highlightP(d3.select(this).attr("i"));})
		.on("mouseout",function() {unlightP(d3.select(this).attr("i"));})

	var lineV=svg.append("line").attr("x1",0).attr("y1",0).attr("x2",0).attr("y2",600).style("opacity",.2).style("stroke","black").style("visibility","hidden");
	var lineH=svg.append("line").attr("x1",0).attr("y1",0).attr("x2",550).attr("y2",0).style("opacity",.2).style("stroke","black").style("visibility","hidden");
	
	var infoPanel=svg.append("g").attr("transform","translate(550,0)")
	var nomCirco=d3.select("h6");
	var labelCDroite=infoPanel.append("text").attr("x",40).attr("y",20).classed("infolabel",1);
	var nomCDroite=infoPanel.append("text").attr("y",20).attr("x",220).classed("nom",1);
	var labelCGauche=infoPanel.append("text").attr("x",40).attr("y",40).classed("infolabel",1);
	var nomCGauche=infoPanel.append("text").attr("y",40).attr("x",220).classed("nom",1);
	var cdBkg=infoPanel.append("rect").attr("y",6).attr("rx",2).attr("ry",2).style("opacity",0).attr("width",35).attr("height",18);
	var cgBkg=infoPanel.append("rect").attr("y",26).attr("rx",2).attr("ry",2).style("opacity",0).attr("width",35).attr("height",18);
	var chanceD=infoPanel.append("text").attr("x",18).attr("text-anchor","middle").attr("y",20).style("fill","white");
	var chanceG=infoPanel.append("text").attr("x",18).attr("text-anchor","middle").attr("y",40).style("fill","white");

	svg.append("text").attr("x",550).attr("y",550).text("Les circonscriptions hachurées sont celles où se présente un ")
	svg.append("text").attr("x",550).attr("y",565).text("ministre de François Fillon ou de Jean-Marc Ayrault. ")
	svg.append("text").attr("x",550).attr("y",580).text("Cliquez sur un rectangle pour changer leur mode de classement.")

	svg.append("text").attr("x",10).attr("y",518).text("Français établis à l'étranger").style("font-style","italic").style("fill","#888");
	svg.append("text").attr("x",275).attr("y",570).text("Prédiction moyenne: 249 sièges à droite, 329 à gauche").attr("text-anchor","middle").style("font-size","16").style("font-weight","bold")
	function highlightP(i) {
		var d=circos[+i];
		var id=d.id.replace("c","");

		d3.selectAll("#r"+id).style("stroke","black").style("stroke-width",5);
		d3.selectAll("#c"+id).transition().style("fill","black");
		lineV.style("visibility","visible").transition().attr("x1",d.lx||d.x).attr("x2",d.lx||d.x);
		lineH.style("visibility","visible").transition().attr("y1",d.ly||d.y).attr("y2",d.ly||d.y);
		update(i);
	}

	function unlightP(i) {
		var id=circos[+i].id.replace("c","");
		d3.selectAll("#r"+id).style("stroke",null).style("stroke-width",null)
		d3.selectAll("#c"+id).transition().style("fill",cScale(circos[+i].cD))
		lineV.style("visibility","hidden")
		lineH.style("visibility","hidden")
		clear();
	}

	function highlight(d) {
		var id=d.id.replace("c","");
		d3.selectAll("#c"+id).transition().style("fill","black")
		d3.selectAll("#r"+id).style("stroke","black").style("stroke-width",5)
		lineV.style("visibility","visible").transition().attr("x1",d.lx||d.x).attr("x2",d.lx||d.x);
		lineH.style("visibility","visible").transition().attr("y1",d.ly||d.y).attr("y2",d.ly||d.y);
		update(d.index);
	}
	function unlight(d) {

		var id=d.id.replace("c","");
		var i=d.index;
		d3.selectAll("#c"+id).transition().style("fill",cScale(circos[+i].cD));	
		d3.selectAll("#r"+id).style("stroke",null).style("stroke-width",null);	
		lineV.style("visibility","hidden")
		lineH.style("visibility","hidden")
		clear();
	}	

	function update(i) {
		var d=circos[i];
		nomCirco.html(d.nom);
		labelCDroite.text("Candidat soutenu par l'UMP:");
		nomCDroite.text((d.sD==="m"?"M. ":"Mme ")+d.cDroite);
		labelCGauche.text("Candidat soutenu par le PS:");
		nomCGauche.text((d.sG==="m"?"M. ":"Mme ")+d.cGauche);
		cdBkg.transition().style("opacity",1).style("fill",cScale(circos[+i].cD));
		cgBkg.transition().style("opacity",1).style("fill",cScale(circos[+i].cD));
		chanceD.text(d3.format("%1")(d.cD));
		chanceG.text(d3.format("%1")(d.cG));

	}
	
	function clear() {
		nomCirco.html("");
		infoPanel.selectAll("text").text("");
		cdBkg.transition().style("opacity",0)
		cgBkg.transition().style("opacity",0)
	}
	function order() {
		if(mode){
			largeRects.transition()
			.attr("x",function(d) {return 550+15*(d.index%25)+1;})
			.attr("y",function(d) {return 50+15*(~~(d.index/25))+1;});
			hashedR.transition()
			.attr("x",function(d) {return 550+15*(d.index%25)+1;})
			.attr("y",function(d) {return 50+15*(~~(d.index/25))+1;});
		} else {
			largeRects.transition()
			.attr("x",function(d) {return 550+15*(d.rank%25)+1;})
			.attr("y",function(d) {return 50+15*(~~(d.rank/25))+1;});
			hashedR.transition()
			.attr("x",function(d) {return 550+15*(d.rank%25)+1;})
			.attr("y",function(d) {return 50+15*(~~(d.rank/25))+1;});
		};
		mode=1-mode;
	}		
})



