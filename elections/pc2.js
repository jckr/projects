// inspired from the code from jason davies

var m = [30, 10, 10, 10],
    w = 940 - m[1] - m[3],
    h = 500 - m[0] - m[2];

var x = d3.scale.ordinal().rangePoints([0, w], 1),
    y = {},
    dragging = {};

var villes=info.map(function(ville) {return '"'+ville.ta+'"';})
var v=d3.select("#ville")
	.attr("data-source","["+villes.toString()+"]")
	//.on("onselect",function() {console.log(d3.select(this).property("value"));});
$('.typeahead').typeahead({onselect: function(obj) { console.log(obj) }})
var colors=d3.scale.category10();
var cHash={"ville":colors(0),"département":colors(1),"région":colors(2),"arrondissement":colors(3),"pays":colors(4)};

var villesHash=new Object;
info.forEach(function(d,i) {villesHash[d.ta]=i;})

function select(ville) {
	if (ville in villesHash) {
		selection=[villesHash[ville]];
		updateGrid();
	}
}

var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    background,
    foreground;

var svg = d3.select("#parallel").append("svg:svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
  .append("svg:g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

cars=data;
var selection=[];
  // Extract the list of dimensions and create a scale for each.
  x.domain(dimensions = d3.keys(cars[0]).filter(function(d) {
    return d != "name" && (y[d] = d3.scale.linear()
        .domain(d3.extent(cars, function(p) { return +p[d]; }))
        .range([h, 0]));
  }));

  // add index to data. 
  
  data.forEach(function(d,i) {d.id=i;})

  // Add grey background lines for context.
  background = svg.append("svg:g")
      .attr("class", "background")
    .selectAll("path")
      .data(cars)
    .enter().append("svg:path")
      .attr("d", path)
      //.style("opacity",.1)
      ;

  // Add foreground lines for focus.
  foreground = svg.append("svg:g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(cars)
    .enter().append("svg:path")
      .attr("d", path)
      .style("stroke-width",function(d,i) {if(info[i].regID==24){return 3;}else{return 1;}})
      .style("stroke",function(d,i) {if(info[i].regID==24){return "black";} else {return colors(info[i].regID);}})
     ;

  // Add a group element for each dimension.
  var g = svg.selectAll(".dimension")
      .data(dimensions)
    .enter().append("svg:g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
      .call(d3.behavior.drag()
        .on("dragstart", function(d) {
          dragging[d] = this.__origin__ = x(d);
          background.attr("visibility", "hidden");
        })
        .on("drag", function(d) {
          dragging[d] = Math.min(w, Math.max(0, this.__origin__ += d3.event.dx));
          foreground.attr("d", path);
          dimensions.sort(function(a, b) { return position(a) - position(b); });
          x.domain(dimensions);
          g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
        })
        .on("dragend", function(d) {
          delete this.__origin__;
          delete dragging[d];
          transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
          transition(foreground)
              .attr("d", path);
          background
              .attr("d", path)
              .transition()
              .delay(500)
              .duration(0)
              .attr("visibility", null);
        }));

  // Add an axis and title.
  g.append("svg:g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
    .append("svg:text")
      .attr("text-anchor", "middle")
      .attr("y", -9)
      .text(String);

  // Add and store a brush for each axis.
  g.append("svg:g")
      .attr("class", "brush")
      .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
    .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);

/*$(function() {
	var villes = info.map(function(d){return d.nom;});
	$( "#ville" ).autocomplete({
		source: villes,
		change: function(event, ui) {selection=[villes.indexOf(ui.item.value)];updateGrid(); }

	});
});*/

selection=d3.range(data.length);updateGrid();

function position(d) {
  var v = dragging[d];
  return v == null ? x(d) : v;
}

function transition(g) {
  return g.transition().duration(500);
}

// Returns the path for a given data point.
function path(d) {
  return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
  selection=[];
  var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
      extents = actives.map(function(p) { return y[p].brush.extent(); });
  foreground.style("display", function(d,i) {
    if(actives.every(function(p, j) {
      return extents[j][0] <= d[p] && d[p] <= extents[j][1];
    })) {selection.unshift(i);return null;} else {return "none";}
  });
  /*selection=data.filter(function(d) {
    return actives.every(function(p, i) {
      return extents[i][0] <= d[p] && d[p] <= extents[i][1];
    });
  }).map(function(d) {return d.id;});*/
  updateGrid();
}

function brushclear() {
	dimensions.forEach(function(d) { if(!y[d].brush.empty()){y[d].brush.clear();}});
	foreground.style("display",null);
	d3.selectAll("rect").attr("height",0);
}


function updateGrid() {
	var columns=["Nom","Inscrits","Abstention","Blancs","Eva Joly","Marine Le Pen", "Nicolas Sarkozy", "Jean-Luc Mélenchon", "François Bayrou", "François Hollande", "Abstention 2ème tour", "Blancs 2ème tour", "Hollande 2ème tour", "Sarkozy 2ème tour"];
	var myGrid=d3.select("#myGrid").html("");
	myGrid.append("table").attr("class","table table-striped table-condensed");
	var table=myGrid.select("table");
	//table.style("font-size","8px");
	table.append("thead");
	table.select("thead").selectAll("th").data(columns).enter().append("th").html(String);
	
	var tr=table.append("tbody").classed("scrollable",1).selectAll("tr").data(selection).enter().append("tr");
	tr.append("th").html(function(d) {return info[d].nom;})
	tr.selectAll("td").data(function(d) {return info[d].votes;}).enter()
		.append("td").classed("rightalign",1)
		.style("font-weight",function(d,i) {return (i&&!y[dimensions[i-1]].brush.empty())?"bold":null;})
		.html(function(d) {return d.disp;})
		.attr("title",function(d) {return d3.format(",")(d.tip)+" électeurs";})
		
}
