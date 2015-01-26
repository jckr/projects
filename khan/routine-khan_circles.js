var data,b,pl;
var colors=["#5D656F","#7B876F","#99A86D","#B6C96D"];
var r=100;
var h=120,w=4000;
var rScale=d3.scale.linear().domain([0,w]).range([0,r]).clamp([true]);
var videos;
//var palette=d3.scale.category10();
var svg=d3.select("#chart").append("svg").attr("version","1.1").attr("xmlns","http://www.w3.org/2000/svg").attr("width",w).attr("height",h);
//d3.select("body").style("background","#eee");
d3.csv("yt.csv",function(csv) {

	csv.slice(0,csv.length-1).forEach(function(d,i) {if(+d.playlistID!==+csv[i+1].playlistID) {d.last=1}else{d.last=0};})
	var myPL="1-1-1",myIndex=0;
	csv.forEach(function(d) {if(d.topicID+"-"+d.subtopicID+"-"+d.playlistID!==myPL){myIndex++;myPL=d.topicID+"-"+d.subtopicID+"-"+d.playlistID;};d.pl=myIndex;})
	b=csv;
	data=d3.nest()
		.key(function(d) {return +d.topicID;})
		.key(function(d) {return +d.subtopicID;})
		.key(function(d) {return +d.playlistID;})
		.entries(csv);
	pl=d3.nest()
		.key(function(d) {return d.topicID+"-"+d.subtopicID+"-"+d.playlistID;})
		.rollup(function(d) {return {count:d.length,max:d3.max(d,function(v){return +v.viewers;}),min:d3.min(d,function(v) {return +v.viewers;})}})
		.entries(csv);
//var
 videos=svg.selectAll(".topics").data(data).enter()
	.append("g")
	.classed("topics",1)
	.attr("id",function(d) {return "T"+d.key;})
	.style("fill",function(d,i){return colors[i];})
	.selectAll(".subtopics").data(function(d) {return d.values;}).enter()
		.append("g")
		.classed("subtopics",1)
		.attr("id",function(d) {return "S"+d.key;})
		
		.selectAll(".playlists").data(function(d) {return d.values;}).enter()
			.append("g")
			.classed("playlists",1)
			.attr("id",function(d) {return "P"+d.key;})
			


			
			videos // largest circle;
				.append("circle").attr("cx",25).attr("cy",25)
				.attr("r",function(d){var myPl=d.values[0].pl;return rScale(Math.sqrt(pl[myPl].values.max));})

			videos.selectAll(".videos").data(function(d) {return d.values;}).enter()
				.append("circle") // finally :)
				.attr("r",function(d) {return rScale(Math.sqrt(d.viewers));})
				.attr("transform",function(d) {
						var max=pl[d.pl].values.max,min=pl[d.pl].values.min;
						
						// if first or last circle, position in middle, 

						if (+d.viewers===max||+d.viewers===min) {return "translate(25,25)";}
						
						// else position somewhere within larger circle

						var angle=Math.random()*Math.PI*2;
						var l=rScale(Math.sqrt(Math.random()*(d.viewers-min)+min));
						var x=25+l*Math.cos(angle),y=25+l*Math.sin(angle);
						return "translate("+x+","+y+")";

					})
				.style("fill",function(d) {
					return "none"; // no longer necessary
					var max=pl[d.pl].values.max,min=pl[d.pl].values.min;

					if(+d.viewers===min){return "white"};
					if(+d.viewers===max){return null}; // default color for the group
					return "none"; // else: no fill
					
				})
				.style("stroke",function(d) {
					var max=pl[d.pl].values.max,min=pl[d.pl].values.min;
					if(+d.viewers===min){return null}; // default color for the group
					if(+d.viewers===max){return null}; // default color for the group
					return "white"; // else: no fill
				})
				.style("stroke-opacity",.25)

				videos // smallest circle;
				.append("circle").attr("cx",25).attr("cy",25)
				.attr("r",function(d){var myPl=d.values[0].pl;return rScale(Math.sqrt(pl[myPl].values.min));}).style("fill","white");



svg.selectAll(".playlists").attr("transform",function(d,i) {
				return "translate("+((i+.5)*r/2)+","+(r/2)+")";
				var x=i%14;//%24;
				var y=~~(i/15);
				x=i;
				y=0;
				//return "translate("+(r+(x+.5)*2*r)+","+(r+y*2*r)+")";
			})
})