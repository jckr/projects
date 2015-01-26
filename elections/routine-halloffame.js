// clc

var svg=d3.select("svg");

var data;
var partis=["UMP","SOC","FN","CEN"];
var comments=[
	"L'UMP a réussi à gagner du terrain dans presque 400 circonscriptions. Une centaine de candidats ont fait progresser leur parti de plus de 10 points par rapport au premier tour de la présidentielle. 11 députés sont élus au premier tour. Certains candidats parachutés ont un score faible du fait de dissidents (par exemple Henri Guaino ou Claude Guéant)",
	"Le PS et ses candidats ont progressé dans pas moins de 470 circonscriptions, et plus de 150 députés ont devancé les résultats du premier tour de la présidentielle de plus de 10 points. 28 députés sont élus au premier tour.",
	"Le FN n'a progressé que dans peu de circonscriptions. Marine Le Pen a amélioré son score de 10 points dans sa circonscription mais il n'y a que 5 autres candidats qui ont fait progresser le score du parti de plus de 2 points.",
	"Les candidats sous l'étiquette \"Le centre pour la France\" ont fait de moins bons résultats que François Bayrou à l'élection présidentielle. Seuls 4 sont qualifiés pour le 2ème tour. Il n'y a pas eu de candidats pour chaque circonscription."];

var pbutton=[3,2,1,0];
var sortids=["candsort","circosort","scoresort","diffsort"];
var icons={
	"-1":"icon-chevron-down",
	"0":"",
	"1":"icon-chevron-up"
};

var selected=1;
var criteres=["candidat","circo","scoreLG","scoreDiff"];
var critere=3;
var titreKeys=["circo","scoreLG","scoreDiff"];
var direction=[0,0,0,-1];
var buttonP=d3.select("#partis").selectAll("a");
var titre=d3.select("#titre").selectAll("a");
var cScale=d3.scale.linear().domain([-0.3,0,0.3]).range(["red","#eee","green"]);
var map,circos,geoHash;
var myGeo,candDiv,dataHash;
var comment=d3.select("#comments");
comment.html(comments[selected]);
d3.csv("halloffame.csv",function(csv){
	
	d3.csv("geography.csv",function(geo) {myGeo=geo;
		csv=csv.map(function(d) {return {
				circo:d.circo,
				cId:d.cId,
				parti:d.parti,
				candidat:d.candidat,
				etiquette:d.etiquette,
				voixLG:+d.voixLG,
				scoreLG:+d.scoreLG,
				voixPT1:+d.voixPT1,
				exprimesPT1:+d.exprimesPT1,
				scorePT1:+d.scorePT1,
				scoreDiff:+d.scoreDiff,
				voixDiff:+d.voixDiff,
				voixRatio:+d.voixRatio,
				scoreRatio:+d.scoreRatio,
				inscrits:+d.inscrits,
				elu:+d.elu,
				dept:d.dept,
				nom:d.nom
			};
		})
		data=d3.nest()
		.key(function(d) {return d.parti;})
		.sortValues(function(a,b){return b.scoreDiff-a.scoreDiff;})
		.entries(csv);
		data[selected].values.forEach(function(d,i) {d.rank=i;})
		//var
		candDiv=d3.select("#candidats");
			var lines=candDiv
			.selectAll(".line").data(data[selected].values).enter()
				.append("div").classed("line",1).attr("id",function(d,i){return "l"+i;})




			lines
				.append("div").classed("rank",1).html(function(d,i){return (i+1)+"."})
			lines
				.append("div").classed("star",1)
					.append("i").attr("class",function(d) {return ["","icon-star-empty","icon-star"][d.elu];})					
			lines
				.append("div").classed("candidat",1).html(function(d) {return d.candidat+(d.etiquette.length?(" ("+d.etiquette+")"):"");});
			lines
				.append("div").classed("circo",1).html(function(d) {return d.circo;})
			lines
				.append("div").classed("score",1).classed("number",1).html(function(d){return d3.format("0.1f")(100*+d.scoreLG)})
					.append("title").classed("scoreTitle",1).text(
						function(d) {
							return "voix: "+d3.format(",")(+d.voixLG)+" ("+["battu","qualifié","élu"][d.elu]+")";
						}
					);
			lines
				.append("div").classed("scoreDiff",1).classed("number",1).html(function(d){return d3.format("0.1f")(100*+d.scoreDiff)})
					.append("title").classed("scoreDiffTitle",1).text(function(d) {return "Différence en voix:"+d3.format(",")(+d.voixDiff);});
			
			//var 
			geoHash=d3.nest()
				.key(function(d) {return d.circo;})
				.rollup(function(d) {return d[0];}) // there should be only one item per circo number
				.map(geo); // this creates a hash that can associate a circo ID width all the geographic information

			geo=d3.nest()
				.key(function(d) {return d.group;})
				.entries(geo);myGeo=geo;
			
			//var 
			
			//var
			dataHash=d3.nest()
				.key(function(d) {return d.cId;})
				.rollup(function(d){return d[0];})
				.map(data[selected].values);

			map=svg.selectAll("g").data(geo).enter()
				.append("g").classed("depts",1).attr("id",function(d){return d.key;});
			circos=map.selectAll("path").data(function(d) {return d.values}).enter()
				.append("path").classed("circ",1)
				.attr("id",function(d) {return d.circo;})
				.attr("d",function(d) {return d.path;})
				.attr("transform",function(d) {return d.transform || null;})
				.style("fill",function(d) {return cScale(+dataHash[d.circo].scoreDiff);});

				vLine=svg.append("line").classed("coordLine",1).attr("x1",0).attr("x2",0).attr("y1",0).attr("y2",600).style("opacity",0);
				hLine=svg.append("line").classed("coordLine",1).attr("x1",0).attr("x2",530).attr("y1",0).attr("y2",0).style("opacity",0);

					
			buttonP.on("click",changeParti);
			titre.on("click",resort);
			circos.on("mouseover",highlight_map);
			circos.on("mouseout",clear_map);
			lines.on("mouseover",highlight_div);
			lines.on("mouseout",clear_div);

			function highlight_map(d){
				//console.log(dataHash[d.circo]);
				d3.select("#"+d.circo).transition().style("fill","black");
				i=dataHash[d.circo].rank;
				vLine.transition().attr("x1",d.x).attr("x2",d.x).style("opacity",.5);
				hLine.transition().attr("y1",d.y).attr("y2",d.y).style("opacity",.5);
				//console.log(dataHash[d.circo]);
				candDiv.property("scrollTop",d3.max([0,(i-5)*18]));
				candDiv.select("#l"+i).selectAll("div").classed("selected",1);
			}
			function clear_map(d){
				d3.select("#"+d.circo).transition().style("fill",function(d) {return cScale(+dataHash[d.circo].scoreDiff);})
				vLine.transition().style("opacity",0);
				hLine.transition().style("opacity",0);
				candDiv.selectAll("div").classed("selected",0);
			}

			function highlight_div(d,i){
				var x=geoHash[d.cId].x,y=geoHash[d.cId].y;
				d3.select(this).selectAll("div").transition().style("background-color","#eee");
				d3.select("#"+d.cId).transition().style("fill","black");
				vLine.transition().attr("x1",x).attr("x2",x).style("opacity",.5);
				hLine.transition().attr("y1",y).attr("y2",y).style("opacity",.5);
			}
			function clear_div(d,i){
				d3.select(this).selectAll("div").transition().style("background-color","#fff");
				d3.select("#"+d.cId).transition().style("fill",cScale(+d.scoreDiff));
				vLine.transition().style("opacity",0);
				hLine.transition().style("opacity",0);
			}
			function resort(d,i){
				critere=i;
				if(direction[i]===1){
					direction=[0,0,0,0];
					direction[i]=-1;
				} else {
					direction=[0,0,0,0];
					direction[i]=1;
				}
				d3.select("#titre").selectAll("i").data(direction).attr("class",function(d) {return icons[d];})
				//console.log(direction);
				//console.log(i);
				//console.log(criteres[i]);
				//console.log(direction[i]);
				data[selected].values.sort(function(a,b){
					if(a[criteres[i]]>b[criteres[critere]]){return direction[critere];}
					if(a[criteres[i]]<b[criteres[critere]]){return -direction[critere];}
					return 0;
				})
				data[selected].values.forEach(function(d,i) {d.rank=i;})
				lines.data(data[selected].values);

				lines=d3.select("#candidats").selectAll(".line");

				lines.select(".rank").html(function(d,i){return (i+1)+"."})
				lines.select("i").attr("class",function(d) {return ["","icon-star-empty","icon-star"][d.elu];})					
				lines.select(".candidat").html(function(d) {return d.candidat+(d.etiquette.length?(" ("+d.etiquette+")"):"");});
				lines.select(".circo",1).html(function(d) {return d.circo;})
				lines.select(".score").html(function(d){return d3.format("0.1f")(100*+d.scoreLG)})
				lines.select(".scoreTitle").text(function(d) {return "voix: "+d3.format(",")(+d.voixLG)+" ("+["battu","qualifié","élu"][d.elu]+")";});
				lines.select(".scoreDiff").html(function(d){return d3.format("0.1f")(100*+d.scoreDiff)})
				lines.select(".scoreDiffTitle").text(function(d) {return "Différence en voix:"+d3.format(",")(+d.voixDiff);});

				
				data[selected].values.forEach(function(d) {
					d3.select("#"+d.cId).transition().style("fill",cScale(+d.scoreDiff));
				})
			}

			function changeParti(d,i){
				selected=pbutton[i];
				comment.html(comments[selected]);
				data[selected].values.sort(function(a,b){
					if(a[criteres[critere]]>b[criteres[critere]]){return direction[critere];}
					if(a[criteres[critere]]<b[criteres[critere]]){return -direction[critere];}
					return 0;
				})
				dataHash=d3.nest()
				.key(function(d) {return d.cId;})
				.rollup(function(d){return d[0];})
				.map(data[selected].values);

				d3.select("ul").selectAll("li").classed("active",function(a,j) {return i==(j-1);})
				
				lines.data(data[selected].values).enter().append("line").classed("line",1);
				lines.data(data[selected].values).exit().remove();
				lines=d3.select("#candidats").selectAll(".line");


				lines.select(".rank").html(function(d,i){return (i+1)+"."})
				lines.select("i").attr("class",function(d) {return ["","icon-star-empty","icon-star"][d.elu];})					
				lines.select(".candidat").html(function(d) {return d.candidat+(d.etiquette.length?(" ("+d.etiquette+")"):"");});
				lines.select(".circo",1).html(function(d) {return d.circo;})
				lines.select(".score").html(function(d){return d3.format("0.1f")(100*+d.scoreLG)})
				lines.select(".scoreTitle").text(function(d) {return "voix: "+d3.format(",")(+d.voixLG)+" ("+["battu","qualifié","élu"][d.elu]+")";});
				lines.select(".scoreDiff").html(function(d){return d3.format("0.1f")(100*+d.scoreDiff)})
				lines.select(".scoreDiffTitle").text(function(d) {return "Différence en voix:"+d3.format(",")(+d.voixDiff);});

				circos.transition().style("fill",function(d) {return cScale(+dataHash[d.circo].scoreDiff);});
			
		}	
	})
})

