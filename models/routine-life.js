// this is the example model: 
// initially, 42% countries of the world are not free, 32% are partly free, 26% are free
// at the end of each decade, 
// 5% not free and 10% partly free become free
// 5% free and 15% not free become partly free
// 10% partly free become not free

w=960,h=520,svg=d3.select("#chart").append("svg").attr({width:w,height:h}).append("g").attr("transform","translate(20,10)");


var grid,running=false,timer;
var liveC="#CB4154";

svg.selectAll(".gridv").data(d3.range(48)).enter().append("path").attr("d",function(d) {return "M"+(20*d)+",0 v 500"}).style("stroke","#eee");
svg.selectAll(".gridv").data(d3.range(26)).enter().append("path").attr("d",function(d) {return "M0,"+(20*d)+" h 940"}).style("stroke","#eee");

reset();
grid=d3.range(47).map(function(i) {return d3.range(25).map(function(j) {return {value:Math.random()>.85?1:0,row:j,col:i};})});


svg.selectAll(".col").data(grid).enter()
	.append("g").classed("col",1).attr("transform",function(d,i) {return "translate("+20*i+",0)";})
	.selectAll(".cells").data(function(d) {return d;}).enter()
		.append("rect").classed("cells",1);
drawGrid();

d3.select("#reset").on("click",function() {
	console.log("reset");
	reset();drawGrid();
})

function stop() {
	clearInterval(timer);
	timer=undefined;
	running=0;
	d3.select("#launch").property("value","launch model").on("click",run);
}

function reset() {
	stop();
	grid=d3.range(47).map(function(i) {return d3.range(25).map(function(j) {return {value:0,row:j,col:i};})});
}

function run() {
	timer=setInterval(update,1000);
	running=1;
	d3.select("#launch").property("value","stop").on("click",stop);
}
function drawGrid() {
	svg.selectAll(".col").data(grid).selectAll(".cells").data(function(d) {return d;})
	.attr("y",function(d) {
		//console.log(d,d.row);
		return 20*d.row+1;
	})
	.attr({
		x:1,width:18,height:18,rx:3,ry:3}).style({"stroke":"white","fill":function(d) {return d.value?liveC:"white"}})
		.attr("id",function(d) {return "C"+d.row+"-"+d.col;})
		.on("click", function(d) {
			if(running){
				stop();
			}
			var live=d.value=1-d.value;
			d3.select(this).transition().style("fill",live?liveC:"white");
		})
}

function neighbors(i,j) {
	n=0;
	if(i) {
		if(j) {
			n=n+grid[i-1][j-1].value;
		}
		n=n+grid[i-1][j].value;
		if(j<24){
			n=n+grid[i-1][j+1].value;
		}
	}
	if(j) {
		n=n+grid[i][j-1].value;
	}
	if(j<24) {
		n=n+grid[i][j+1].value;
	}
	if(i<46) {
		if(j) {
			n=n+grid[i+1][j-1].value;
		}
		n=n+grid[i+1][j].value;
		if(j<24) {
			n=n+grid[i+1][j+1].value;
		}
	}
	return n;
}

function evolve() {
	var total=0;
	var newgrid=d3.range(47).map(function(i) {return d3.range(25).map(function(j) {return grid[i][j].value;})});
	d3.range(47).forEach(function(i) {
		d3.range(25).forEach(function(j) {

			n=neighbors(i,j);
			if(grid[i][j].value){
				if (n<2||n>3) {
					console.log("cell "+j+"-"+i+" had "+n+" neighbors so it had to die.")
					d3.select("#C"+j+"-"+i).call(die);
					newgrid[i][j]=0;
				} else {
					console.log("cell "+j+"-"+i+" has "+n+" neighbors, so it can keep on living.")
				}
			}
			else {
				if(n==3) {
					console.log("cell "+j+"-"+i+" has "+n+" neighbors. Welcome to the world!")
					d3.select("#C"+j+"-"+i).call(rise);
					newgrid[i][j]=1;
				}
			}
		})
	})

	d3.range(47).forEach(function(i) {d3.range(25).forEach(function(j) {
		if(grid[i][j].value!=newgrid[i][j]) {
			total=total+1;
			grid[i][j].value=newgrid[i][j];	
		}
	})});
	if(!total) { // no cell has changed in this turn 
		stop();
	}
}

function die(cell) {
	var d=cell.datum()
	cell.transition()
		.duration(1000)
		.attr({"height":0,y:d.row*20+18})
		.style("fill","black")
		.each("end",function() {d3.select(this).style("fill","white");})
}

function rise(cell) {
	var d=cell.datum();
	svg.append("circle").attr({cx:20*(d.col+.5),cy:20*(d.row+.5),r:0}).style({"fill":"none","stroke":"gold"}).transition().duration(1000)
		.attr("r",300)
		.style("stroke-opacity",0)
		.each("end",function() {d3.select(this).remove();})
	cell.attr({x:10,y:10+d.row*20,height:0,width:0}).style("fill",liveC).transition().delay(500).ease("elastic").attr({x:1,y:1+d.row*20,height:18,width:18})
}

function update() {
	drawGrid();
	evolve();
}