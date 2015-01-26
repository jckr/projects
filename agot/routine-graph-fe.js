

var width = 960,
    height = 500;

var color = d3.scale.category20();

var fisheye = d3.fisheye()
    .radius(120);

var force = d3.layout.force()
    .charge(-240)
    .linkDistance(40)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height);
links.forEach(function(d) {d.weight=1;})
var data={nodes:nodes,links:links};
  var n = data.nodes.length;

  force.nodes(data.nodes).links(data.links);

  // Initialize the positions deterministically, for better results.
  data.nodes.forEach(function(d, i) { d.x = d.y = width / n * i; });

  // Run the layout a fixed number of times.
  // The ideal number of times scales with graph complexity.
  // Of course, don't run too long�you'll hang the page!
  force.start();
  for (var i = n; i > 0; --i) force.tick();
  force.stop();

  // Center the nodes in the middle.
  var ox = 0, oy = 0;
  data.nodes.forEach(function(d) { ox += d.x, oy += d.y; });
  ox = ox / n - width / 2, oy = oy / n - height / 2;
  data.nodes.forEach(function(d) { d.x -= ox, d.y -= oy; });

  var link = svg.selectAll(".link")
      .data(data.links)
    .enter().append("line")
      .attr("class", "link")
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; })
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.selectAll(".node")
      .data(data.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", function(d) {return d.size;})
      .style("fill", function(d) { return color(d.group); })
      .call(force.drag);

  svg.on("mousemove", function() {
    fisheye.center(d3.mouse(this));

    node
        .each(function(d) { d.display = fisheye(d); })
        .attr("cx", function(d) { return d.display.x; })
        .attr("cy", function(d) { return d.display.y; })
        .attr("r", function(d) { return d.display.z * 4.5; });

    link
        .attr("x1", function(d) { return d.source.display.x; })
        .attr("y1", function(d) { return d.source.display.y; })
        .attr("x2", function(d) { return d.target.display.x; })
        .attr("y2", function(d) { return d.target.display.y; });
  });


