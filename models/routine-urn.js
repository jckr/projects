var w=960,h=500,svg=d3.select("#chart").append("svg").attr({width:w,height:h}),s=50,w1=300,h1=40,step=(h-h1)/s;
var data=[];
var paths=[];
d3.range(1000).forEach(function() { // generating 100 paths
	var mydata=[{red:1,blue:1}];
	var rx=(w-300)/2;bx=(w-300)/2;y=h1;
	var mypath={
		red:"M"+rx+" "+y,
		blue:"M"+bx+" "+y,
	};
	var rx2=rx,bx2=bx;
	d3.range(s).forEach(function(i) {
		var d=mydata[i];
		var e={};
		var p=d.red/(d.red+d.blue);
		if (Math.random()<p) {// red ball drawn
			e.red=d.red+1;e.blue=d.blue;
		} else {
			e.blue=d.blue+1;e.red=d.red;
		}
		rx=rx2;bx=bx2;
		rx2=(w-300)*(e.red/(e.blue+e.red));
		bx2=(w-300)*(e.blue/(e.blue+e.red));
		//mypath.red=mypath.red+"v "+(step/2)+" C"+rx+","+(y+step/2)+" "+rx2+","+(y+step/2)+" "+rx2+","+(y+step);
		//mypath.blue=mypath.blue+"v "+(step/2)+" C"+bx+","+(y+step/2)+" "+bx2+","+(y+step/2)+" "+bx2+","+(y+step);		
		mypath.red=mypath.red+" C"+rx+","+y+" "+rx2+","+y+" "+rx2+","+(y+step);
		mypath.blue=mypath.blue+" C"+bx+","+y+" "+bx2+","+y+" "+bx2+","+(y+step);		
		
		y=y+step;
		mydata.push(e);
	});
	//myballs=[];
	//d3.range(mydata.red).forEach(function(x) {myballs.push(0);})
	//d3.range(mydata.blue).forEach(function(x) {myballs.push(1);})
	//console.log(myballs);
	data.push(mydata);
	paths.push(mypath);
});
g=svg.append("g").selectAll("g").data(paths).enter().append("g").attr("id",function(d,i){return "g"+i;})
g.style({fill:"none","stroke-opacity":function(d,i) {return i?0:.7},"stroke-width":function(d,i) {return i?1:5;}})
g.append("path").style({stroke:"red"}).attr("d",function(d,i) {return paths[i].red;});
g.append("path").style({stroke:"blue"}).attr("d",function(d,i) {return paths[i].blue;});
svg.append("g").attr("id","balls");

svg.append("text").attr("id","text1").text("Cumulative distributions of red and blue balls after 1 drawing").attr("x",20).attr("y",h1/2);
svg.append("text").attr("id","text2").text("Contents of the urn, step by step, drawing #1").attr("x",w-w1-20).attr("y",h1/2);

makeBalls(0);

d3.select("#slider").on("change",function() {
	r=this.value;
	//console.log(r);
	g.transition()
		.style("stroke-opacity",function(d,i){return (i==r)?.7:((i<r)?0.1:0);})
		.style("stroke-width",function(d,i) {return (i==r)?5:1;})
	makeBalls(r);
})
var row;
function makeBalls(r) {
	b=svg.select("#balls").selectAll(".balls").data(d3.range(s).map(function(k) {return d3.range(k+2);})).enter()
	.append("g").attr("transform",function(d,i) {return "translate("+(w-w1)+","+(h1+(i*step))+")";})
	.attr("class",function(d,i) {return "r"+i;})
	.classed("balls",function(d) {return 1;})
	

	b.selectAll("circle").data(function(d) {return d;})
	.enter()
	.append("circle")
	.attr("cx",function(d,i) {return i*w1/s-step/2;} )
	.attr("cy",step/2).style("fill","white")
	.attr("r",step/4)

	data[r].forEach(function(d,i) {
		row=d3.select(".r"+i);if(i<s){
		var l=row.selectAll("circle")[0].length;
		var red=d.red;
		var lucky=-1;
		if (i>0) {
			if (d.red>data[r][i-1].red) {lucky=d.red-1} else {lucky=d.red;}
		}
		row.selectAll("circle").transition()
			.attr("r",function(d,i) {return (i==lucky)?(step/3):(step/4);})
			.style("fill",function(d,i) {return i<red?"red":"blue";})
			.style("opacity",function(d,i) {return i==lucky?1:.5})
		}
	})	

	svg.select("#text1").text("Cumulative distributions of red and blue balls after "+(r+1)+" drawing"+(r?"s":""));
	svg.select("#text2").text("Contents of the urn, step by step, drawing #"+(r+1))
}

