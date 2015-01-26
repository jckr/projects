d3.selectAll("svg").remove();
var svg=d3.selectAll("#chart").append("svg:svg");
var build=1;

var colors=["green","darkorange","salmon","green","navy","red","mediumblue","grey"];


var myCandidat=-1;
var trueCandidat=-1;

var server="http://127.0.0.1/php/vote/"

var hasVoted=0;
var id;
var cScale=colors.map(function(c) {return d3.scale.linear().domain([0,5]).clamp([true]).range(["white",c]);})

var barycenters=[];
var candidats={1:"François Bayrou",2:"François Hollande",3:"Eva Joly",4:"Marine Le Pen",5:"Jean-Luc Mélenchon",6:"Nicolas Sarkozy"}
var x=50,y=50,c=10;
var voteX,voteY;
var cross="M0,0h"+c+"v-"+c+"h-"+c+"v"+c+"l"+c+" -"+c+"h-"+c+"l"+c+" "+c+"Z";
var data=d3.range(8).map(function(c) {return d3.range(x).map(function(d) {return d3.range(y).map(function(e) {return 0;});});})
var records;
d3.json(server+"pf_read.php", function(result) {
	d3.selectAll("#loading").remove();
	records=result.values.map(function(r) {return r.value;});
	records.forEach(function(r) {
		var myX=parseFloat(r.depenses),myY=parseFloat(r.recettes);
		if(myX>=0&&myX<x&&myY>=0&&myY<y) {
			data[0][myY][myX]++;
			if(r.vote){
				data[parseFloat(r.vote)][myY][myX]++;
			}
		}
	})
	// now let's calculate barycenters
	 d3.keys(candidats).forEach(function(c) {
		var myRecords=records.filter(function(r) {return r.vote==c;});
		if (myRecords.length) {
			barycenters.push({id:c,x:Math.round(d3.mean(myRecords,function(r) {return r.depenses;})),
			        	       y:Math.round(d3.mean(myRecords,function(r) {return r.recettes;}))
				});
			}
	})
	grid.selectAll(".bary").data(barycenters).enter().append("svg:g").classed("bary",1)
		.attr("transform",function(d) {return "translate("+d.x*c+","+(d.y+1)*c+")";})
		.append("svg:path").classed("barypath",1).attr("d",cross).style("fill","none").style("stroke",function(d) {return colors[d.id];})
		.append("svg:title").text(function(d) {return candidats[d.id];})
		//.style("stroke","black")
		;
	$('.barypath').tipsy({html: true, gravity: 's'});
	
	
	cells.style("fill",function(d) {return cScale[0](data[0][d[0]][d[1]]);})
	
	
	
});

var mover=d3.selectAll("#mover").selectAll("div").data(d3.keys(candidats)).enter().append("div").append("span")
	.classed("label",1)
	.style("background-color",function(d,i) {return colors[i+1];})
	.html(function(d) {return candidats[d];});
mover.on("mouseout", function() {cells.style("fill",function(d) {return cScale[0](data[0][d[0]][d[1]]);})})
mover.on("mouseover",function(c) {console.log(c);cells.style("fill",function(d) {return cScale[c](data[c][d[0]][d[1]]);})})
	

var grid=svg.append("svg:g").attr("width",(x*c)+"px").attr("height",(y*c)+"px").attr("transform","translate(7,0)").classed("grid",1);
grid.append("svg:text").attr("x",-10).attr("y",0)
var rows=grid.selectAll(".row").data(d3.range(y)).enter().append("svg:g").classed("row",1)
	.attr("transform",function(i) {return "translate(0,"+(c*i)+")";})
var cells=rows.selectAll(".cell").data(function(i) {return d3.range(x).map(function(d) {return [i,d];});}).enter().append("svg:rect").classed("cell",1)
	.attr("transform",function(d) {return "translate("+(c*d[1])+",0)";})
	.attr("class",function(d) {return "cell r" + d[0]+  " c" + d[1];})
	.attr("width",c).attr("height",c)
	//
	.on("click", function(d) {clickme(d);})


grid.append("svg:g").append("svg:line").attr("x1",c*(x/2)).attr("x2",c*(x/2)).attr("y1",0).attr("y2",y*c).style("stroke","black");
grid.append("svg:g").append("svg:line").attr("y1",c*(y/2)).attr("y2",c*(y/2)).attr("x1",0).attr("x2",x*c).style("stroke","black");

	
function clickme(d) {
	console.log("you clicked!");
	var minDistance=99;
	if(!hasVoted) {
		d3.json(server+"pf_insert.php?depenses="+d[1]+"&recettes="+d[0]+(myCandidat>-1?"&vote="+myCandidat:""), function(result) {
			hasVoted=1;
			showForm();
			id=result.id;voteX=d[1];voteY=d[0];
			console.log("data at X-"+voteX+" Y-"+voteY+" used to be "+data[0][voteY][voteX]);
			data[0][voteY][voteX]++;
			if(myCandidat>0){data[myCandidat][voteY][voteX]++;}
			console.log("data at X-"+voteX+" Y-"+voteY+" it is now "+data[0][voteY][voteX]);
			updateGrid();
			d3.selectAll(".bary").style("visibility","visible");
			d3.selectAll("#mover").style("display","block");
			//if(myCandidat==-1){d3.selectAll("#myform").selectAll(".span3").classed("input",1).html("&nbsp;");d3.selectAll("#targetCdt").remove();}
	
			grid.append("svg:g")
				.attr("transform",function(d) {return "translate("+voteX*c+","+(voteY+1)*c+")";})
				.append("svg:path").classed("mypath",1).attr("d",cross).style("fill","none").style("stroke","black")
				.append("svg:title").text("Votre choix")
			
			$(".mypath").tipsy({html: true, gravity: 's'});
			
			barycenters.forEach(function(b) {
				var myDistance=Math.sqrt((b.x-voteX)*(b.x-voteX)+(b.y-voteY)*(b.y-voteY));
				if (myDistance<minDistance) {
					trueCandidat=parseFloat(b.id);
					minDistance=myDistance;}
				})
			
			if (trueCandidat>-1) {
				d3.selectAll("#msg")
				.classed("alert-message",0).classed("success",0)
				.style("display","block")
				.html("Votre choix est proche de celui des électeurs de ")
				.append("span").classed("label",1)
				.style("background-color",colors[trueCandidat])
				.html(candidats[trueCandidat]);
			}
				
			
		})
		}
	else {	//console.log(server+"pf_update.php?id="+id+"&depenses="+d[1]+"&recettes="+d[0]);
/*		d3.json(server+"pf_update.php?id="+id+"&depenses="+d[1]+"&recettes="+d[0], function() {
			data[0][voteY][voteX]--;
			if(myCandidat>0){data[myCandidat][voteY][voteX]--;}
			updateGrid();
			voteX=d[1];voteY=d[0];
			data[0][voteY][voteX]++;
			if(myCandidat>0){data[myCandidat][voteY][voteX]++;}
			updateGrid();
		})*/
	}
}
			
showForm=function() {d3.selectAll("#myform").style("display","block");}

updateC=function(candidat) {candidat=parseFloat(candidat);if(candidat){
		d3.select("#targetCdt").html("<span class='label' id='targetCdt'>"+candidats[candidat]+"</span>");
		var alert=d3.selectAll("#msg").html("Candidat mis à jour").style("display","block");
		
		alert.transition().delay(500).duration(500).style("opacity",0).each("end",function() {alert.style("display","none").style("opacity",1);});
		myCandidat=candidat;	
	}
;}

updateGrid=function() {
	d3.selectAll(".r"+voteY+".c"+voteX).style("fill",function() {return cScale[0](data[0][voteY][voteX]);});
	console.log(data[0][voteY][voteX])
;}
	