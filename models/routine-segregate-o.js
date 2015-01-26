// this is the example model: 
// initially, 42% countries of the world are not free, 32% are partly free, 26% are free
// at the end of each decade, 
// 5% not free and 10% partly free become free
// 5% free and 15% not free become partly free
// 10% partly free become not free

var w=960,h=520,svg=d3.select("#chart").append("svg").attr({width:w,height:h}).append("g").attr("transform","translate(250,10)");
var cellsize=10,size=50;
var t=d3.select("#slider").property("value")/100;
var happiness=-1;
var grid,grid2,running=false,timer;
var com1=
	"steelblue"
	//"green"
	,com2=
	//"purple"
	//"red"
	"darkorange";

var pos=[];
//svg.selectAll(".gridv").data(d3.range(26)).enter().append("path").attr("d",function(d) {return "M"+(20*d)+",0 v 500"}).style("stroke","#eee");
//svg.selectAll(".gridv").data(d3.range(26)).enter().append("path").attr("d",function(d) {return "M0,"+(20*d)+" h 500"}).style("stroke","#eee");

reset();

svg.selectAll(".col").data(grid).enter()
	.append("g").classed("col",1)
	.selectAll(".cells").data(function(d) {return d;}).enter()
		.append("g").attr("transform",function(d) {return "translate("+(d.col*cellsize)+","+(d.row*cellsize)+")";}).classed("cells",1).attr("id",function(d) {return "c"+d.id;})
			.append("rect").attr({x:1,y:1,height:cellsize-2,width:cellsize-2,rx:2,ry:2});
drawGrid();

d3.select("#reset").on("click",function() {
	console.log("reset");
	reset();drawGrid();
	//timer=setInterval(update, 200)
})

function stop() {
	clearInterval(timer);
	timer=undefined;
	running=0;
	d3.select("#launch").property("value","launch model").on("click",run);
}

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
	d3.range(50).forEach(function(i) {
		d3.range(50).forEach(function(j) {
			n=checkNeighbors(i,j);
			//console.log(n/8,t)
			grid[i][j].n=n;
			if(n<t) {
				grid[i][j].happy=0;
				pos.push({col:grid[i][j].col,row:grid[i][j].row,n:n*(grid[i][j].com?1:-1)});
			} else {
				grid[i][j].happy=1;
				g=g+1;
			}
		})
	})
	g=g/(50*50);
	d3.select("#unhappy").html((Math.round(1000*(1-g))/10)+"%");
	console.log(pos.length);
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
	pos=pos.sort(function(a,b) {return a.n-b.n;})
	
	d3.range(size).forEach(function(i) {
		d3.range(size).forEach(function(j) {
			if(grid[i][j].happy) {
				d3.select("#c"+grid[i][j].id).transition().duration(100)
				.style("opacity",function(d) {return .2+.8*d.n;})
				.attr("transform","translate("+(cellsize*grid[i][j].col)+","+(cellsize*grid[i][j].row)+")")
				//.style("stroke",d3.rgb(grid[i][j].com?"steelblue":"darkorange").darker())
				//.attr({x:0,y:0,width:cellsize,height:cellsize,rx:0,ry:0})//.style("stroke","black");
				grid2[i][j]={col:i,row:j,com:grid[i][j].com,happy:1,id:grid[i][j].id,n:grid[i][j].n};
			} else {
				var col,row;
				if (grid[i][j].com) {
					col=pos[pos.length-1].col;
					row=pos[pos.length-1].row;
					pos=pos.slice(0,pos.length-1);
				} else {
					col=pos[0].col;
					row=pos[0].row;
					pos.shift();
				}
				grid[i][j].col=col;
				grid[i][j].row=row;
				grid2[col][row]={col:col,row:row,com:grid[i][j].com,happy:0,id:grid[i][j].id,n:grid[i][j].n};
				d3.select("#c"+grid[i][j].id).transition()
				.duration(750).ease("linear")
				.attr("transform","translate("+(cellsize*grid[i][j].col)+","+(cellsize*grid[i][j].row)+")")
				.style("opacity",function(d) {return .2+.8*d.n;});
			}
		})
	})
	d3.range(size).forEach(function(i) {
		d3.range(size).forEach(function(j) {
			grid[i][j]={col:grid2[i][j].col,row:grid2[i][j].row,com:grid2[i][j].com,happy:grid2[i][j].happy,id:grid2[i][j].id,n:grid2[i][j].n};
		})
	})
}

function success() {
	d3.select("#success").html("&nbsp;everyone is happy");
	console.log("equilibrium");
	stop();
}

function drawGrid() {
	
	var cells=svg.selectAll(".col").data(grid).selectAll(".cells").data(function(d) {return d;});
	cells.select("rect").style("fill",function(d) {return d.com?com1:com2});
	

}

