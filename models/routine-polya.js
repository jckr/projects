var w=960,h=500,svg=d3.select("#chart").append("svg").attr({width:w,height:h}),s=50,w1=300,h1=40,h2=40,step=(h-h1-h2)/s;
var data=[];
var paths=[];
var prob=d3.range(1000).map(function() {return [0,1].map(function() {return (d3.range(s+2).map(function() {return 0;}))})});



d3.range(1000).forEach(function(k) { // generating 100 paths
	var mydata=[{red:1,blue:1}];
	var rx=(w-300)/2;bx=(w-300)/2;y=h1;
	var mypath={
		red:"M"+rx+" "+y,
		blue:"M"+bx+" "+y,
	};
	var rx2=rx,bx2=bx;
	
	 
	
	var e={};
	d3.range(s).forEach(function(i) {
		var d=mydata[i];
		e={};
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
		
		mypath.red=mypath.red+"v"+(step/4)+" Q"+rx+","+(y+step/2)+" "+.5*(rx+rx2)+","+(y+step/2)+" "+rx2+","+(y+step/2)+" "+rx2+","+(y+.75*step)+" v"+.25*step;
		mypath.blue=mypath.blue+"v"+(step/4)+" Q"+bx+","+(y+step/2)+" "+.5*(bx+bx2)+","+(y+step/2)+" "+bx2+","+(y+step/2)+" "+bx2+","+(y+.75*step)+" v"+.25*step;

		//mypath.red=mypath.red+" C"+rx+","+y+" "+rx2+","+y+" "+rx2+","+(y+step);
		//mypath.blue=mypath.blue+" C"+bx+","+y+" "+bx2+","+y+" "+bx2+","+(y+step);		
		
		y=y+step;
		mydata.push(e);
		
	});
	if(k){
		prob[k][0]=prob[k-1][0].map(function(d,i) {if(i==e.red){return d+1}else{return d;}})
		prob[k][1]=prob[k-1][1].map(function(d,i) {if(i==e.blue){return d+1}else{return d;}})

	} else {
		prob[k][0][e.red]=1;
		prob[k][0][e.blue]=1;
	}
	//console.log(prob[prob.length-1]);
	
	data.push(mydata);
	paths.push(mypath);
});
g=svg.append("g").selectAll("g").data(paths).enter().append("g").attr("id",function(d,i){return "g"+i;})
g.style({fill:"none","stroke-opacity":function(d,i) {return i?0:.7},"stroke-width":function(d,i) {return i?1:5;}})
//g.append("path").style({stroke:"red"}).attr("d",function(d,i) {return paths[i].red;});
g.append("path").style({stroke:"blue"}).attr("d",function(d,i) {return paths[i].blue;});
svg.append("g").attr("id","balls");

svg.append("text").attr("id","text1").text("Cumulative distributions of red and blue balls after 1 drawing").attr("x",20).attr("y",h1/2);
svg.append("text").attr("id","text2").text("Contents of the urn, step by step, drawing #1").attr("x",w-w1-20).attr("y",h1/2);

redbars=svg.append("g").attr("transform","translate(0,"+(h-h2));
bluebars=svg.append("g").attr("transform","translate(0,"+(h-h2));

/*redbars.selectAll("rect").data(prob[0][0]).enter().append("rect").style("fill","red")
	.attr("x",function(d,i) {return i*(w-w1-20)/(s+1)})
	.attr("y",function(d,i) {return h-d;})
	.attr("height",function(d) {return d;})
	.attr("width", .8*(w-w1)/(s+1));
*/

bluebars.selectAll("rect").data(prob[0][1]).enter().append("rect").style("fill","blue")
	.attr("x",function(d,i) {return i*(w-w1-20)/(s+1)})
	.attr("y",function(d,i) {return h-d;})
	.attr("height",function(d) {return d;})
	.attr("width", .8*(w-w1)/(s+1)).append("title").text(function(d,i) {return "After 1 drawing, there has been "+i+" blue balls "+prob[0][1][i]+" times."});



makeBalls(0);

d3.select("#slider").on("change",function() {
	r=+(this.value);
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

	redbars.selectAll("rect").data(prob[r][0]).transition()
	.attr("y",function(d,i) {return h-3*d;})
	.attr("height",function(d) {return 3*d;})
	
	bluebars.selectAll("rect").data(prob[r][1]).transition()
	.attr("y",function(d,i) {return h-3*d;})
	.attr("height",function(d) {return 3*d;})
	bluebars.selectAll("rect").select("title").text(function(d,i) {return "After "+(r+1)+" drawings, there has been "+i+" blue balls "+prob[r][1][i]+" times."});


}

