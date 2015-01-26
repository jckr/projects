// this is the example model: 
// initially, 42% countries of the world are not free, 32% are partly free, 26% are free
// at the end of each decade, 
// 5% not free and 10% partly free become free
// 5% free and 15% not free become partly free
// 10% partly free become not free

var w=960,h=520,svg=d3.select("#chart").append("svg").attr({width:w,height:h}).append("g").attr("transform","translate(250,10)");
var cellsize=20;
var p=d3.select("#slider").property("value")/100;
var grid,running=false,timer;
var full="#777",empty="beige";
var joins,joinsl,joinsd,joinsdl;
//svg.selectAll(".gridv").data(d3.range(26)).enter().append("path").attr("d",function(d) {return "M"+(20*d)+",0 v 500"}).style("stroke","#eee");
//svg.selectAll(".gridv").data(d3.range(26)).enter().append("path").attr("d",function(d) {return "M0,"+(20*d)+" h 500"}).style("stroke","#eee");

reset();

svg.selectAll(".col").data(grid).enter()
	.append("g").classed("col",1).attr("transform",function(d,i) {return "translate("+20*i+",0)";})
	.selectAll(".cells").data(function(d) {return d;}).enter()
		.append("g").attr("transform",function(d,i) {return "translate(0,"+20*i+")";}).classed("cells",1);
svg.selectAll(".cells").append("rect").classed("background",1).attr({height:cellsize,width:cellsize});
svg.selectAll(".cells").append("rect").classed("foreground",1).attr({x:1,y:1,height:cellsize-2,width:cellsize-2,rx:4,ry:4});
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
	d3.select("#success").html("");
	d3.selectAll(".water").remove();
	grid=d3.range(25).map(function(i) {return d3.range(25).map(function(j) {return (Math.random()>p?1:0);})});
	drawGrid();
}

d3.select("#slider").on("change", function() {
	p=this.value/100;
	d3.select("#label").html(Math.round(100*p)+"%");
	reset();
	drawGrid();})

function run() {
	running=1;
	d3.select("#launch").property("value","reset model").on("click",reset);
	console.log("running")
	d3.range(25).forEach(function(i) {pour(i,0,"up");})
}

function pour(col,row,dir) {
	//console.log("attemping pour",row,col,dir)
	if(!grid[col][row]) { // pouring
		//console.log("pouring")
		grid[col][row]=2;
		var x=(col+.5)*cellsize,y=(row+.5)*cellsize,dx=0,dy=0;
		if(dir==="up"){dy=-cellsize;} else {
			if(dir==="left"){
				dx=cellsize;
			} else {
				dx=-cellsize;
			}
		}
		svg.append("path").classed("water",1).style("stroke-width",cellsize-2).attr("d", function() {
			return "M"+(x+dx)+","+(y+dy)+"L"+(x+dx)+","+(y+dy);
		})
		.transition().duration(50).ease("linear")
		.attr("d",function() {
			return "M"+(x+dx)+","+(y+dy)+"L"+x+","+y;
		})
		.each("end",function() {
			if(row==24) {success();} else {
				pour(col,row+1,"up"); // pour down
				if(col) {pour(col-1,row,"left")}; // pour left
				if(col<24) {pour (col+1,row,"right")}; // pour right
			}
		})
	} // else cell is full or flooded, so no need to pour
}

function success() {
	d3.select("#success").html("&nbsp;percolation successful");
	console.log("percolated");
}

function drawGrid() {
	svg.selectAll(".joins").remove();
	var cells=svg.selectAll(".col").data(grid).selectAll(".cells").data(function(d) {return d;});
	cells.select(".foreground").style("fill",function(d) {return d?full:empty});
	cells.select(".background").style("fill",function(d) {return d?empty:empty});
	
	
	 joinsl=d3.range(24).map(function(col) {return d3.range(25).map(function(row) {
		return (grid[col][row]===grid[col+1][row])?{row:row,col:col,visible:1,color:grid[col][row]}:{row:row,col:col,visible:0,color:0};
	})})
	 joinsd=d3.range(25).map(function(col) {return d3.range(24).map(function(row) {
		return (grid[col][row]===grid[col][row+1])?{row:row,col:col,visible:1,color:grid[col][row]}:{row:row,col:col,visible:0,color:0};
	})})
	joinsdl=d3.range(24).map(function(col) {return d3.range(24).map(function(row) {
		return (
				(grid[col][row]===grid[col][row+1])&&
				(grid[col][row]===grid[col+1][row])&&
				(grid[col][row]===grid[col+1][row+1]))?{row:row,col:col,visible:1,color:grid[col][row]}:{row:row,col:col,visible:0,color:0};
	})})


	svg.selectAll(".joinsl").data(joinsl).enter().append("g").classed("joinsl",1).classed("joins",1)
		.selectAll("rect").data(function(d) {return d;}).enter().append("rect")
		.attr("y",function(d) {return d.row*cellsize+1;})
		.attr("x",function(d) {return (d.col+1)*cellsize-5;})
		.attr({height:cellsize-2,width:10})
		.style("fill",function(d) {return d.color?full:empty;}).style("stroke","none")
		.style("visibility",function(d) {return d.visible?"visible":"hidden";})

	svg.selectAll(".joinsd").data(joinsd).enter().append("g").classed("joinsd",1).classed("joins",1)
		.selectAll("rect").data(function(d) {return d;}).enter().append("rect")
		.attr("y",function(d) {return (d.row+1)*cellsize-5;})
		.attr("x",function(d) {return d.col*cellsize+1;})
		.attr({width:cellsize-2,height:10})
		.style("fill",function(d) {return d.color?full:empty;}).style("stroke","none")
		.style("visibility",function(d) {return d.visible?"visible":"hidden";})

	svg.selectAll(".joinsdl").data(joinsdl).enter().append("g").classed("joinsdl",1).classed("joins",1)
		.selectAll("rect").data(function(d) {return d;}).enter().append("rect")
		.attr("y",function(d) {return (d.row+1)*cellsize-5;})
		.attr("x",function(d) {return (d.col+1)*cellsize-5;})
		.attr({width:10,height:10})
		.style("fill",function(d) {return d.color?full:empty;}).style("stroke","none")
		.style("visibility",function(d) {return d.visible?"visible":"hidden";})
		

}

function update() {
	drawGrid();
	evolve();
}