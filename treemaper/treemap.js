var w = 960,
    h = 500,
    color = d3.scale.category20c();

var treemap = d3.layout.treemap()
    .size([w, h])
    .sticky(true)
    .value(function(d) { return d.size; });

var div = d3.select("#chart").append("div")
    .style("position", "relative")
    .style("width", w + "px")
    .style("height", h + "px");

// this will where the data for tableau will be written
var tableau=d3.select("#chart").append("div")

div.data([data]).selectAll("div")
    .data(treemap.nodes)
    .enter().append("div")
      .attr("class", "cell")
      .style("background", function(d) { return d.children ? color(d.name) : null; })
      .call(cell)
      .text(function(d) { return d.children ? null : d.name; });

generateOutput();

d3.select("#size").on("click", function() {
    div.selectAll("div")
        .data(treemap.value(function(d) { return d.size; }))
    .transition()
        .duration(1500)
        .call(cell);

    d3.select("#size").classed("active", true);
    d3.select("#count").classed("active", false);
    generateOutput();
});

d3.select("#count").on("click", function() {
    div.selectAll("div")
        .data(treemap.value(function(d) { return 1; }))
      .transition()
        .duration(1500)
        .call(cell);

    d3.select("#size").classed("active", false);
    d3.select("#count").classed("active", true);
    generateOutput();
});


function cell() {
  this
      .style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}


function p(node,hierarchy) {
  if (typeof(hierarchy)==='undefined') {hierarchy="";}
  if ("parent" in node) {
    return p(node["parent"],hierarchy)+">"+node["parent"].name;
  } else {
    return hierarchy;
  }
}

function generateOutput() {
var n=treemap.nodes().filter(function(node) {return "size" in node;}) // keeps only leaves
var table=tableau.append("table");
table.append("tr").html("<td>Id</td><td>Path</td><td>Top-level category</td><td>Name</td><td>Value</td><td>Corner</td><td>x</td><td>y</td>");
n.forEach(function(node,id) {
	var name=node.name;
	var value=node.value;
	var path=p(node).substr(1);
	var toplevel=path.split(">")[0];
	var leftX=node.x;
	var rightX=node.x+node.dx;
	var topY=node.y;
	var bottomY=node.y+node.dy;
	
	var rows=[[id,path,toplevel,name,value,0,leftX,topY],
		  [id,path,toplevel,name,value,1,rightX,topY],
		  [id,path,toplevel,name,value,2,rightX,bottomY],
		  [id,path,toplevel,name,value,3,leftX,bottomY]];
	table.selectAll("#newlines").data(rows).enter().append("tr")   		 // effectively adds 4 lines to the table
	     .selectAll("td").data(function(d) {return d;}).enter().append("td") // then adds one td cell per element in each line of the rows matrix 		
	     .html(String);				   			 // then writes the content in the cell. 
})	
}		  