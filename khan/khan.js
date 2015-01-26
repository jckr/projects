var width=4000,height=4000,max_length=100,max_radius=500,radius=width/2-max_length/4;
var cluster=d3.layout.cluster().size([360,radius]);
var diagonal=d3.svg.diagonal.radial().projection(function(d) {return [d.y,d.x/180*Math.PI]})

var offset={
  "Art History":{x:5,y:-50},
  "Arithmetic and Pre-Algebra":{x:20,y:-210},
  "Geometry":{x:-23,y:600},
  "Math":{x:-20,y:-350},
  "Science":{x:0,y:-200},
  "Finance & Economy":{x:0,y:-320},
  "Humanities":{x:20,y:-300}
}



var selectors=["playlist", "subtopic", "topic", "root"];
var nodes,links; // comment this line to make the variables local and no longer global
function duration(d) {if (d.duration) {return d.duration} else {return d3.sum(d.children, duration);}}
function views(d) {if (d.views) {return d.views} else {return d3.sum(d.children, views);}}
function cat(d) {if(!d.depth) {return 0};if(d.depth===1){return d.id};return cat(d.parent);}

function sToY(d) {
  var myString="";
  if (d>31556736){
    var years=Math.floor(d/31556736);
    myString=myString+years+" year"+(years>1?"s":"");
    d=d-years*31556736;
  }
  if (d>2629728){
    var months=Math.floor(d/2629728);
    if(myString!==""){myString=myString+", ";}
    myString=myString+months+" month"+(months>1?"s":"");
    d=d-months*2629728;
  }
  if (d>86400){
    var days=Math.floor(d/86400);
    if(myString!==""){myString=myString+", ";}
    myString=myString+days+" day"+(days>1?"s":"");
    d=d-days*86400;
  }
  if (d>3600){
    var hours=Math.floor(d/3600);
    if(myString!==""){myString=myString+", ";}
    myString=myString+hours+" hour"+(hours>1?"s":"");
    d=d-hours*3600;
  }
  if (d>60){
    var minutes=Math.floor(d/60);
    if(myString!==""){myString=myString+", ";}
    myString=myString+minutes+" minute"+(minutes>1?"s":"");
    d=d-minutes*60;
  }
  if(d>0){
    if(myString!==""){myString=myString+" and ";}
    myString=myString+d+" second"+(d>1?"s":"");
  }
  return myString;
}

var loveScale=d3.scale.linear().domain([0,100,1000]).range(["#888","#080","#0f0"]);
var yearScale=d3.scale.ordinal().domain([2006,2007,2008,2009,2010,2011,2012]).range(["#F0F9E8","#CCEBC5","#A8DDB5","#7BCCC4","#4EB3D3","#2B8CBE","#08589E"]);
var catScale=d3.scale.ordinal().domain(["math","science","finance-and-economy","humanities"]).range(["red","orange","blue","green"]);
var vis=d3.select("#chart")
  .append("svg").attr("version","1.1").attr("xmlns","http://www.w3.org/2000/svg")
  .attr("width",width).attr("height",height)
  .append("g").attr("id","vis")
  .attr("transform","translate("+(radius+max_length*2)+","+(radius+max_length*2)+")");


var info;
d3.csv("info.csv",function(csv){
  info=d3.nest().key(function(d){return d.Id;}).rollup(function(d) {return d[0];}).map(csv);

  d3.json("hierarchical_library_tree_full.json",function(data) {

    //var 
    nodes=cluster.nodes(data);
    nodes.forEach(function(d,i) {d.index=i;})
    var min_duration=d3.min(nodes,function(d) {return d.duration;});
    var max_duration=d3.max(nodes,function(d) {return d.duration;});
    var sum_duration=d3.sum(nodes,function(d) {return d.duration;});
    var d_max_scale=d3.scale.linear().range([1,max_length]).domain([0,max_duration]);
    var d_sum_scale=d3.scale.linear().range([1,max_radius*max_radius]).domain([0,sum_duration]);

    var min_views=d3.min(nodes,function(d) {return d.views;});
    var max_views=d3.max(nodes,function(d) {return d.views;});
    var sum_views=d3.sum(nodes,function(d) {return d.views;});
    var v_max_scale=d3.scale.linear().range([1,max_length]).domain([0,max_views]);
    var v_sum_scale=d3.scale.linear().range([1,max_radius*max_radius]).domain([0,sum_views]);

    var node=vis.selectAll("g.node").data(nodes).enter()
      .append("g")
      .classed("node",1)
      .classed("video_node",function(d) {return d.kind==="Video";})
      .classed("playlist_node",function(d) {return d.kind==="Topic";})
      .classed("subtopic_node",function(d) {return (d.kind!=="Topic"&&d.kind!=="Video")&&d.depth>1;})
      .classed("topic_node",function(d) {return (d.kind!=="Topic"&&d.kind!=="Video")&&d.depth===1;})
      .classed("root_node",function(d) {return (d.kind!=="Topic"&&d.kind!=="Video")&&d.depth===0;})
      .attr("id",function(d) {
        if(d.kind==="Video"){return d.readable_id;}
        if(d.kind==="Topic"){return d.id;}
        return d.name;
      })
      .attr("transform",function(d) {
        if(d.kind){
            if(offset[d.name]){
              d.y=600+offset[d.name].y;
              d.x+=offset[d.name].x;
            }
        }
        return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
      })
    
    selectors.forEach(function(s) {
      var snode=vis.selectAll("."+s+"_node");
        snode
        .append("circle")
        .classed("node_duration_circle",1)
        .attr("r",function(d) {return Math.sqrt(d_sum_scale(duration(d)));})
        .style("stroke",function(d) {if(d.depth===1){return catScale(d.id);}else {return null};})

        snode
        .append("circle")
        .classed("node_views_circle",1)
        .attr("r",function(d) {return Math.sqrt(v_sum_scale(views(d)));})

        snode
        .append("circle")
        .classed("node_views_circle_inner",1)
        .attr("r",function(d) {return Math.sqrt(v_sum_scale(d.views))||0;})

        snode
        .append("circle")
        .classed("node_views_circle_outer",1)
        .attr("r",function(d) {return Math.sqrt((v_sum_scale(d.views))+1)||0;})

    })
    
    vis.selectAll(".video_node")
      .append("rect")
      .classed("video_duration_ray",1)
      .classed("max_duration",function(d) {return d.duration===max_duration;})
      .attr("height",1)
      .attr("width", function(d)  {return d_max_scale(d.duration);})
      .style("fill",function(d) {

        var myInfo=info[d.youtube_id];
        
        if(myInfo){
          
          return yearScale(myInfo.year);
        } else {
          return "#eee";
        }
      })
      .attr("x",2)

    vis.selectAll(".video_node")
      .append("rect")
      .classed("video_views_ray",1)
      .classed("max_views",function(d) {return d.views===max_views;})
      .attr("height",1)
      .attr("width",function(d) {return v_max_scale(d.views);})
      .style("fill",function(d) {

        var myInfo=info[d.youtube_id];
        
        if(myInfo){
          
          return loveScale(myInfo.numRaters);
        } else {
          return "#eee";
        }
      })
      .attr("x",function(d) {return max_length+4;})
  
    //var 
    links=vis.selectAll("path.link")
      .data(cluster.links(nodes))
      .enter()
      .append("path")
      .attr("class",function(d) {return "link depth_"+d.source.depth;})
      .attr("id", function(d) {return "path_"+d.target.index;}) 
      .style("stroke",function(d) {return catScale(cat(d.source));}).style("opacity",.25)
      .attr("d",diagonal);
        
    vis.selectAll(".subtopic_node, .topic_node, .root_node")
      .append("text")
      .classed("sublabel",1)
      .attr("dx",0)
      .attr("dy",20)
      .text(function(d) {return "Duration: "+sToY(duration(d));})
      .attr("transform",function(d) {return "rotate("+(90-d.x)+")";})
      .attr("text-anchor","middle")
     vis.selectAll(".subtopic_node, .topic_node, .root_node")
      .append("text")
      .classed("sublabel",1)
      .attr("dx",0)
      .attr("dy",32)
      .text(function(d) {return "views: "+d3.format(",")(views(d));})
      .attr("transform",function(d) {return "rotate("+(90-d.x)+")";})
      .attr("text-anchor","middle")
    
    node.selectAll(".subtopic_node,.topic_node,.root_node")
      .append("text")
      .attr("class",function(d) {
        if(d.depth>1){return "subtopic_label";}
        if(d.depth===1){return "topic_label";}
        return "root_label";
      })
      .attr("transform", function(d) {return "rotate(" + (90 - d.x) + ")";})
      .attr("text-anchor", "middle")
      .text(function(d) {return d.name;})

    vis.selectAll(".playlist_label").data(nodes.filter(function(d) {return d.kind==="Topic";})).enter()
      .append("text")
      .classed("playlist_label",1)
      .append("svg:textPath") 
      .attr("xlink:href", function(d) {return "#path_"+d.index;})
      .attr("startOffset","90%")
      .text(function(d) {return d.name;});

    d3.selectAll(".video_node").append("text").classed("video_label",1)
      .attr("display","none")
      .text(function(d) {return d.title;})

  })
})