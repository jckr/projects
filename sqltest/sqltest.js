var svg=d3.select("#chart").append("svg:svg");
var build=1;




var cScale=d3.scale.linear().domain([0,20,25,35,60,80,100]).range(["blue","lightblue","yellow","green","brown","grey","white"])

var x=50,y=50,c=10;

var data=d3.range(y).map(function(d) {return d3.range(x).map(function(e) {return 0;});})

d3.text("http://127.0.0.1/php/mapread2.php", function(txt) {
	txt.split("\n").forEach(function(line,i) {
		line.split(",").forEach(function(d,j) {
			data[i][j]=parseFloat(d);
			d3.selectAll(".r"+i+".c"+j).style("fill",function() {return cScale(data[i][j]);});
		})
	});
})


var buildBtn=d3.select("#chart").append("div").classed("button",1).classed("pushed",1)
	.attr("id","build")
	.html("build")
	.on("click",function() {d3.selectAll(".button").classed("pushed",0);
	d3.select(this).classed("pushed",1);
	build=1;})

var buildBtn=d3.select("#chart").append("div").classed("button",1).classed("pushed",0)
	.attr("id","dig")
	.html("dig")
	.on("click",function() {d3.selectAll(".button").classed("pushed",0);
	d3.select(this).classed("pushed",1);
	build=-1;})

var grid=svg.append("svg:g").attr("width",(x*c)+"px").attr("height",(y*c)+"px").attr("transform","translate(0,50)").classed("grid",1);

var rows=grid.selectAll(".row").data(d3.range(y)).enter().append("svg:g").classed("row",1)
	.attr("transform",function(i) {return "translate(0,"+(c*i)+")";})

var cells=rows.selectAll(".cell").data(function(i) {return d3.range(x).map(function(d) {return [i,d];});}).enter().append("svg:rect").classed("cell",1)
	.attr("transform",function(d) {return "translate("+(c*d[1])+",0)";})
	.attr("class",function(d) {return "cell r" + d[0]+  " c" + d[1];})
	.attr("width",c).attr("height",c)
	.style("fill",function(d) {return cScale(data[d[0]][d[1]]);})
	.on("click", function(d) {clickme(d);})
	
function clickme(d) {
	var r=d[0],c=d[1];
	update(r,c,5);
	update(r+1,c,2);
	update(r-1,c,2);
	update(r,c+1,2);
	update(r,c-1,2);
	}

function update(r,c,v) {
	if(r>=0 && r<y && c>=0 && c<x) {
		data[r][c]=d3.max([d3.min([100,data[r][c]+v*build]),0]);
		d3.selectAll(".r"+r+".c"+c).style("fill",function() {return cScale(data[r][c]);});
		d3.text("http://127.0.0.1/php/mapupdate.php?height="+data[r][c]+"&col="+c+"&row="+r,function() {console.log("http://127.0.0.1/php/mapupdate.php?height="+data[r][c]+"col="+c+"row="+r);});
	}
}