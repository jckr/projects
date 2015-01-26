
var w=960,h=520,svg=d3.select("#chart").append("svg").attr({width:w,height:h}).append("g").attr("transform","translate(20,10)");
var cellsize=15,size=50,nbCells=Math.floor((w-20)/cellsize), gapSize=7//15;
var duration=500,d2=duration/2;
var maxrow=Math.floor((h-30)/(cellsize+gapSize));
var colors=d3.scale.category10();
// interface

	var w1=750,h1=50;

	rule=d3.select("#ruleNb").property("value");
	var r=[];
	function decompose(rule) {
		r=[7,6,5,4,3,2,1,0].map(function(d) {return ((rule>>>d)%2);})
	}

	function compose(r) {
		rule=0;
		r.forEach(function(d,i) {rule=rule+(d*Math.pow(2,(7-i)));})
	}
	decompose(rule);

	var rules=d3.select("#rules").append("svg").attr({width:w1,height:h1});
	ruleCS=15;
	var gRules=rules.selectAll("g").data(r).enter().append("g")
		.attr("transform",function(d,i) {return "translate("+(20+90*i)+",0)";});
	gRules.selectAll(".toprect")
		.data(function(d,i) {return [i>3,i%4>1,i%2>0];})
		.enter()
		.append("rect")
		.attr({x:function(d,i) {return i*ruleCS;},y:0,height:ruleCS*.8,width:ruleCS*.8,rx:(ruleCS/5),ry:(ruleCS/5)}).style({stroke:"black",fill:function(d) {return d?"white":"black";}})
	gRules.append("rect").classed("downrect",1).attr({x:ruleCS,y:ruleCS,height:ruleCS*.8,width:ruleCS*.8,rx:(ruleCS/5),ry:(ruleCS/5)}).style({stroke:function(d,i) {return colors(i);}, fill:function(d,i) {return d?colors(i):"white";}})
	gRules.on("click",function(d,i) {
		console.log(r);
		r[i]=1-d;
		console.log(r);
		gRules.data(r);
		gRules.select(".downrect").style("fill",function(d,i) {return d?colors(i):"white";});
		compose(r);
		d3.select("#ruleNb").property("value",rule);
		stop();
	})
	d3.select("#ruleNb").on("change",function() {
		rule=this.value;
		decompose(rule);
		gRules.data(r);
		gRules.select(".downrect").style("fill",function(d,i) {return d?colors(i):"white";});
		stop();
	})
	var rand=d3.select("#rand").property("checked");
	d3.select("#rand").on("change",function() {
		rand=d3.select("#rand").property("checked");
		stop();	
	})

// model
var grid=[];
var data=[];

d3.select("#launch").on("click",run);
function run() {
	d3.select("#launch").property("value","stop").on("click",stop);
	init();
}

function generate() {
var input=data[data.length-1].values;
var output=[];
var ruleRow=[];
input.forEach(function(d,i) {
	ruleId=0;
	if(i) {if (input[i-1].value) {ruleId=ruleId+4}};
	if(d.value) {ruleId=ruleId+2};
	if(i<input.length-1) {if(input[i+1].value) {ruleId=ruleId+1;}};
	output.push({value:r[7-ruleId],rule:ruleId});
})
index=index+1;
return {index:index,values:output}
}

function diag(i,type) {

	var x2=i*cellsize+(cellsize-2)*.5;
	var y2=0;
	var x1=(i+type)*cellsize+(cellsize-2)*.5; // -1: from left, 0: from top, 1: from right
	var y1=-gapSize-2;
	var xm=.5*(x1+x2),ym=.5*(y1+y2);
	return "M"+x1+","+y1+" C "+x1+","+ym+" "+xm+","+ym+" "+x2+","+y2;
}

function key(d) {return d.index;} 

function init() {
	index=0;
	grid=d3.range(nbCells).map(function() {return {value:rand?(Math.random()>.5):0,rule:0};})
	grid[Math.round(nbCells/2)].value=1;

	data=[{index:index,values:grid.slice(0)}];
	svg.selectAll("*").remove();

	var row=svg.selectAll(".rows").data(data,key).enter().append("g").classed("rows",1)
	row.selectAll(".cell").data(function(d) {return d.values}).enter().append("rect")
		.attr({x:function(d,i) {return cellsize*i;},y:0,rx:cellsize/5,ry:cellsize/5,height:cellsize-2,width:cellsize-2})
		.style({fill:function(d) {return (d.value?"black":"white")},stroke:"#eee"})
	timer=setInterval(update,duration);
	
}

function update() {
	var scroll=cellsize+gapSize;
	data.push(generate())
	if(index>maxrow) { // if we reach the bottom, we start removing some rows and scrolling
		data.shift();
	}
	var rows=svg.selectAll(".rows").data(data,key);
	
	// if one row has to leave us, now's the time. Pushed up then out
	rows.exit().transition().ease("linear").duration(d2).attr("transform","translate(0,"+(-scroll)+")").each("end", function() {d3.select(this).transition().style("opacity",0).remove();})

	// all existing rows are positioned where they need to be.
	rows.transition().ease("linear").duration(d2).attr("transform",function(d,i) {return "translate(0,"+(scroll*i)+")";})
	.style("opacity",1) // in case opacity isn't fully set once the lines start moving up

	// now the new guy.
	var newRow=rows.enter()
		.append("g").classed("rows",1)
		.attr("transform","translate(0,"+(d3.min([maxrow,index])*scroll)+")") //
		.style("opacity",0);
	newRow.transition().delay(d2).duration(d2).style("opacity",1) // appears after the others are done moving

	newRow.selectAll("rect").data(function(d) {return d.values}).enter().append("rect")
		.attr({x:function(d,i) {return cellsize*i;},y:0,rx:cellsize/5,ry:cellsize/5,height:cellsize-2,width:cellsize-2})
		.style({fill:function(d) {return d.value?colors(7-d.rule):"white"},stroke:"#eee"})

	// diagonals for the win.

	diags=newRow.selectAll("g")
		.data(function(d) {return d.values;}).enter().append("g")
	.style({"visibility":function(d,i) {return d.value?"visible":"hidden";},fill:"none","stroke":function(d) {return colors(7-d.rule);},"stroke-opacity":.3,"stroke-width":Math.floor(cellsize/10)})
	diags.selectAll("path").data(
		function(d,i) {
			return [-1,0,1].map(function(type) {
				return {i:i,type:type};
			})
		}).enter().append("path")
		.attr("d",function(d) {return diag(d.i,d.type);})

			
}


function stop() {
	if(typeof(timer)!=="undefined"){
		clearInterval(timer);
		timer=undefined;
	}
	running=0;
	d3.select("#launch").property("value","launch model").on("click",run);
}

/*

d3.select("#reset").on("click",function() {
	console.log("reset");
	reset();drawGrid();
	//timer=setInterval(update, 200)
})


function reset() {
	stop();
	happiness=-1;
	d3.select("#success").html("");
	grid=d3.range(size).map(function(i) {
		return d3.range(size).map(function(j) {
			var id=size*i+j;
			
			return {
				col:i,
				row:j,
				com:Math.random()>.5,
				happy:0,
				id:id
			};
		});
	});
	grid2=d3.range(size).map(function(i) {return d3.range(size).map(function(j) {return {col:i,row:j,id:size*i+j,com:grid[i][j].com,happy:0};})});
	checkHappiness();
	d3.selectAll(".cells").style("opacity",1)
	drawGrid();
}

function checkNeighbors(i,j,debug) {
	var x=grid[i][j].col,y=grid[i][j].row;
	i=x;j=y;
	com=grid[i][j].com;
	var n=0;
	var total=0;
	if (i) {
		total=total+1;
		n=n+(grid[i-1][j].com===com);
		if(j) {
			total=total+1;
			n=n+(grid[i-1][j-1].com===com);
		}
		if(j<size-1){
			total=total+1;
			n=n+(grid[i-1][j+1].com===com);
		}
	}
	if (i<size-1) {
		total=total+1;
		n=n+(grid[i+1][j].com===com);
		if(j) {
			total=total+1;
			n=n+(grid[i+1][j-1].com===com);
		}
		if(j<size-1) {
			total=total+1;
			n=n+(grid[i+1][j+1].com===com);
		}
	}
	if (j) {
		total=total+1;
		n=n+(grid[i][j-1].com===com);
	}
	if(j<size-1) {
		total=total+1;
		n=n+(grid[i][j+1].com===com);
	}
	if(debug) {console.log(i,j,n,total,n/total)}
	return n/total;
}

function checkHappiness() {
	pos=[];
	g=0;
	seg=0;
	d3.range(50).forEach(function(i) {
		d3.range(50).forEach(function(j) {
			n=checkNeighbors(i,j);
			//console.log(n/8,t)
			grid[i][j].n=n;
			seg=seg+n;
			if(n<t) {
				grid[i][j].happy=0;
				pos.push({col:grid[i][j].col,row:grid[i][j].row});
			} else {
				grid[i][j].happy=1;
				g=g+1;
			}
		})
	})
	g=g/(50*50);
	d3.select("#unhappy").html((Math.round(1000*(1-g))/10)+"%");
	seg=seg/(size*size);
	return g;

}

d3.select("#slider").on("change", function() {
	t=this.value/100;
	d3.select("#label").html(Math.round(100*t)+"%");
	reset();
})

function run() {
	running=1;
	d3.select("#launch").property("value","reset model").on("click",reset);
	//console.log("running")
	timer=setInterval(update, 1000);

}

function update() {
	console.log(
		g=checkHappiness()
	);
	if(g>.99) {
		console.log("over and out")
		success();
	};
	console.log(pos.length);
	pos=pos.sort(function(a,b) {return Math.random()-.5;})
	var k=0;
	d3.range(size).forEach(function(i) {
		d3.range(size).forEach(function(j) {
			if(grid[i][j].happy) {
				d3.select("#c"+grid[i][j].id).transition().duration(100)
				.style("opacity",function(d) {return .2+.8*grid[i][j].n;})
				.style("stroke",function(d) {return d3.rgb(d.com?com1:com2).darker();})
				//.style("stroke-width",2)
				.attr("transform","translate("+(cellsize*grid[i][j].col)+","+(cellsize*grid[i][j].row)+")");

				//.style("stroke",d3.rgb(grid[i][j].com?"steelblue":"darkorange").darker())
				//.attr({x:0,y:0,width:cellsize,height:cellsize,rx:0,ry:0})//.style("stroke","black");
				grid2[i][j]={col:i,row:j,com:grid[i][j].com,happy:1,id:grid[i][j].id,n:grid[i][j].n};
			} else {
				grid[i][j].col=pos[k].col;
				grid[i][j].row=pos[k].row;
				grid2[pos[k].col][pos[k].row]={col:pos[k].col,row:pos[k].row,com:grid[i][j].com,happy:0,id:grid[i][j].id,n:grid[i][j].n};
				d3.select("#c"+grid[i][j].id).transition()
				.duration(750).ease("linear")
				.attr("transform","translate("+(cellsize*grid[i][j].col)+","+(cellsize*grid[i][j].row)+")")
				.style("opacity",function(d) {return .2+.8*grid[i][j].n;})
				.style("stroke","none")
				k=k+1;
			}
		})
	})
	d3.range(size).forEach(function(i) {
		d3.range(size).forEach(function(j) {
			grid[i][j]={col:grid2[i][j].col,row:grid2[i][j].row,com:grid2[i][j].com,happy:grid2[i][j].happy,id:grid2[i][j].id,n:grid2[i][j].n};
		})
	})
	console.log(k);	
}

function success() {
	d3.select("#success").html("&nbsp;everyone is happy");
	console.log("equilibrium");
	stop();
}

function drawGrid() {
	
	var cells=svg.selectAll(".col").data(grid).selectAll(".cells").data(function(d) {return d;}).style({"opacity":1,"stroke":"none"})
		.transition() 	// those 2 lines are for if a reset/redraw function is called during a transition.  
		.style({"opacity":1,"stroke":"none"}).attr("transform",function(d) {return "translate("+(d.col*cellsize)+","+(d.row*cellsize)+")";});
	cells.select("rect").style("fill",function(d) {return d.com?com1:com2});
	

}
*/

