// fish kg per capita
var data=[5.3,5.2,16.4,52.1,6.4,2.1,24.2,13.4,1.7,30.3,14.9,43.4,15.6,24.5,12.5,7.8,38.1,1.7,6.8,3,6.9,34.4,4.2,1.8,1.8,25,13.9,23.8,11.6,3.6,5.9,20.1,26.5,5.5,19.7,22.7,7.5,13.9,15.3,8.7,22.6,10.4,11.6,5.5,24.5,1,27.1,10.8,4.4,16.7,6.9,0.8,16.4,0.2,35.8,31.7,34.8,47.6,34.9,28,8.4,14.8,29.6,21.1,37,2.2,10.4,1.6,33.3,4,3,87.4,5.1,24.3,7.1,21.4,20.6,24.4,30.6,60.8,5.7,2.9,3.5,74.6,12.4,2.3,18.5,12.6,9.4,0,5,9.9,37.6,27.8,7.4,5,50.1,176.5,8.5,30.2,17.2,20.6,10.8,0.2,9.6,2.2,25.5,14.7,1.5,19,20.7,20.3,26.4,4.7,3.3,9,51.4,0.7,1.9,12.2,4,21.4,32.4,9.5,54.8,52.7,12.1,5.3,18.9,2.1,31.4,40.5,16.2,46.3,22.8,9,24.3,64.3,26.1,8,9.4,30.1,7.6,40,21.7,1.7,15.1,6.5,28.5,15,2.1,0.3,30.9,4.8,0.3,7,14.4,13,6.9,3.3,15.6,16.9,22.6,20.3,5.1,24.1,9.3,0.3,30.3,16.6,26.1,4.6,6.2,1.3];

var texts=[
{text:
	{eng:"Koreans eat 52 kilogrammes of fish annually, which is among the highest rates seen in industrialised nations. Given this high level of consumption, Korea is also one of the leading global markets for fish, with imports topping $5.5 billion annually.",
	kor:"한국인들은 연간 52킬로그램의 어류를 먹으며, 이는 산업화된 국가들중 가장 높은 어류 소비율에 속합니다. 이렇게 높은 수준의 소비량을 고려해 볼 때, 한국은 주요한 세계 수산 시장들중 하나이기도 하며 연간 55억 달러 이상의 수산제품을 수입합니다."},
	countrylabel:{eng:"Korea",kor:"대한민국"}
	, countries:[125]},
{text:
	{eng:"Iceland's position in the mid-North Atlantic has long made it a global fishing power. Dwindling cod stocks once jeopardized the fishing and processing industries, but they have since recovered and exports now top $3 billion annually.",
	 kor:"아이슬란드는 북대서양의 중앙에 위치하여 오랫 동안 세계적인 어업 강국의 자리를 점하였습니다. 줄어드는 대구 어획량으로 인해 한때 어업 및 가공 산업이 위태로운 경지에 빠졌었지만, 그 이후로 어획량이 회복되어 지금은 수출이 연간 30억 달러 이상입니다."},
	 countrylabel:{eng:"Iceland",kor:"아이슬란드"}
	, countries:[71]},
{text:
	{eng:"Peru and Chile are the dominant fisheries powers of South America, thanks to Pacific Ocean fishing grounds that are home to world-leading stocks of anchoveta, mackerel and sardine. Peruvian and Chilean fishing industries process their catch into fish meal, used as livestock feed, and fish oil, both of which boost exports.",
	kor:"페루와 칠레는 남미의 유력한 수산 강국이며, 이는 멸치류, 고등어 및 정어리의 세계적 주요 어족의 본거지인 태평양 연안 어장이 있기 때문입니다. 페루와 칠레의 수산업체들은 포획한 어류를 가축사료용 어분(魚粉) 및 어유(魚油)로 가공하며, 이 두 가지 모두 수출을 증가시킵니다."},
	countrylabel:{eng:"Peru and Chile",kor:"페루 및 칠레"}
	, countries:[121,31]},	
{text:
	{eng:"When Namibia became independent in 1990, it decided to allow locals to bid for fishing rights instead of selling them to foreign firms. It now exports over half a million tons of fish and fish products a year and landings are increasing.",
	 kor:"나미비아가 1990년에 독립되었을 때, 어업권을 외국 회사에 파는 대신에 지역 업체들이 어업권에 입찰할 수 있도록 결정했습니다. 현재 나미비아는 한 해에 50만 톤 이상의 어류 및 수산 제품을 수출하고 있으며 수출량이 증가하고 있습니다."},
	 countrylabel:{eng:"Namibia",kor:"나미비아"}
	, countries:[107]},
{text:
	{eng:"China accounts for over 60% of global aquaculture production, as well as being the world's most important capture fisheries country. It is also is the world's main producer and exporter of fish products.",
	 kor:"중국은 전세계 양식 생산량의 60% 이상을 차지하고 있으며, 동시에 세계에서 가장 중요한 포획 어업국이기도 합니다. 중국은 또한 세계에서 주요한 수산 생산국이자 수출국입니다."},
	countrylabel:{eng:"China",kor:"중국"}
	,countries:[32]},
{text:
	{eng:"Demand for fish and fish products is declining in Japan, partly due changing lifestyles and consumer preferences, particularly among younger generations, but the country is still the world's biggest importer of fish products.",
	kor:"일본은 어류 및 수산 제품 수요가 줄어들고 있는 데, 이는 부분적으로는 생활양식과 소비자 선호가 변화하고 있기 때문이며, 특히 젊은 층에서 변화하고 있기 때문입니다. 하지만 일본은 여전히 세계 최대 수산 제품 수입국입니다."},
	countrylabel:{eng:"Japan",kor:"일본"}
	,countries:[79]},
{text:
	{eng:"<br/><br/>",kor:"<br/><br/>"},
	countryLabel:{eng:"World",kor:"세계"}
	,countries:[]}
];


var centered=null;
var color = d3.scale.linear()
	.domain([-1,0, 50])//d3.max(data)])
	.range(["#eee","#ECFAFE", "#066E88"]); 
	//.range(["#eee","#eee", "#B84C49"]); 
var width=960,height=500;
var svg = d3.select("#chart").append("svg")
	.attr("width", width + 100)
	.attr("height", height + 100)
	.append("g")
	
	.attr("transform", "translate(50,50)");
var lang="kor";
if(window.location.search=="?lang=kor") {lang="kor";}
d3.select("#alang").html(function() {return (lang=='eng')?'Switch to Korean':'Switch to English';})

svg.append("rect")
    .attr("class", "frame").style("fill","none").style("stroke","none")
    .attr("width", width)
    .attr("height", height)
    .on("click",function() {click();})
    .on("dblclick",reset)

//svg.append("rect").attr("x",-50).attr("y",-50).attr("width",1060).attr("height",500).style("fill","#C5F1FC");



var project = d3.geo.mercator().scale(1000),//albers(),
idToNode = {},
links = [],
nodes = countries.features.map(function(d,i) {
	var xy = project(d.geometry.coordinates);
	return idToNode[d.id] = {
		index:i,
		x: xy[0],
		y: xy[1],
		gravity: {x: xy[0], y: xy[1]},
		r: Math.sqrt(d.properties.population/400),
		data:[d.properties.population,d.properties.production,d.properties.consumption,d.properties.area],
		value: data[+d.id],
		name:d.properties.name
	};
});

var path = d3.geo.path().projection(project);

var states=svg.append("g").attr("id", "states");

  states
    .selectAll("path")
      .data(collection.features)
    .enter().append("svg:path")
      .attr("d", path)
      .attr("stroke", "none")
      .attr("fill", "#eee")
      .attr("fill-opacity", .7)
      .on("click",click);
    //.append("svg:title")
    //	  .text(function(d) { return d.properties.name; });



d3.select("#population").on("click",function() {
	
	d3.selectAll("button").classed("active",0);
	d3.select("#population").classed("active",1);
	nodes.forEach(function(node) {node.r=Math.sqrt(node.data[0]/400);});
	svg.selectAll(".circle0").data(nodes).transition().duration(1000).attr("r",function(d){return d.r;});

	d3.select("#legend").html("인구 (천명 단위)").classed("interface0-4",1).classed("interface0-5",0).classed("interface0-6",0);
	
	
});

d3.select("#production").on("click",function() {
	d3.selectAll("button").classed("active",0);
	d3.select("#production").classed("active",1);
	nodes.forEach(function(node) {node.r=Math.sqrt(node.data[1]/10);});
	svg.selectAll(".circle0").data(nodes).transition().duration(1000).attr("r",function(d){return d.r;});
	
	d3.select("#legend").html("어류 생산량 (천톤 단위)").classed("interface0-4",1).classed("interface0-5",0).classed("interface0-6",0);
	
	
});

d3.select("#consumption").on("click",function() {
	d3.selectAll("button").classed("active",0);
	d3.select("#consumption").classed("active",1);
	nodes.forEach(function(node) {node.r=Math.sqrt(node.data[2]/10);});
	svg.selectAll(".circle0").data(nodes).transition().duration(1000).attr("r",function(d){return d.r;});
	
	d3.select("#legend").html("어류 소비량 (천톤 단위)").classed("interface0-4",0).classed("interface0-5",0).classed("interface0-6",1);
	
	
});

var circle0=svg.selectAll(".circle0")
	.data(nodes)
	.enter().append("circle")
	.attr("class",function(d) {return "circle0 c"+d.index;})
	//.attr("class",function(d) {return "C"+d.index+" circle0";})
	.style("fill", function(d) { return color(data[d.index]); })
	.attr("cx", function(d) { return d.x; })
	.attr("cy", function(d) { return d.y; })
	.attr("r",0)
	//.attr("r", function(d, i) { return d.r; })
	.style("opacity",.5)	
.append("title")
	.text(function(d) {
		//console.log(d);
		var title="<table><thead><tr><th style='text-align:left;font-size:12px;'>"+d.name+"</th></tr></thead><tbody>";
		title+="<tr><th style='text-align:left'>인구: </th><td style='text-align:right'>"+d3.format(",")(d.data[0]*1000)+"</td></tr>";
		title+="<tr><th style='text-align:left'>어류 생산량: </th><td style='text-align:right'>"+d3.format(",")(d.data[1])+" kt</td></tr>";
		title+="<tr><th style='text-align:left'>어류 소비량: </th><td style='text-align:right'>"+d3.format(",")(d.data[2])+" kt</td></tr>";
		title+="<tr><th style='text-align:left'>(1인당): </th><td style='text-align:right'>"+data[d.index]+" kg/년</td></tr></tbody></table>";
		return title;
	});
svg.selectAll(".circle0").attr("r",0);
svg.selectAll(".circle0").on("mouseover",function(d) {d3.selectAll(".C"+d.index).style("visibility","visible");})
svg.selectAll(".circle0").on("mouseout",function(d) {d3.selectAll(".C"+d.index+":not(.highlighted)").style("visibility","hidden");})

svg.selectAll(".circle1")
	.data(nodes)
	.enter().append("circle")
	.attr("class",function(d) {return "C"+d.index+" circle1";})
	.style("fill", "none")
	.attr("cx", function(d) { return d.x; })
	.attr("cy", function(d) { return d.y; })
	.attr("r", function(d, i) { return Math.sqrt(d.data[0]/400); })
	.style("stroke","red")
	.style("visibility","hidden");


svg.selectAll(".circle2")
	
	.data(nodes)
	.enter().append("circle")
	.attr("class",function(d) {return "C"+d.index+" circle2";})
	.style("fill", "none")
	.attr("cx", function(d) { return d.x; })
	.attr("cy", function(d) { return d.y; })
	.attr("r", function(d, i) { return Math.sqrt(d.data[1]/10); })
	.style("stroke","blue")
	.style("visibility","hidden");
	


svg.selectAll(".circle3")
	
	.data(nodes)
	.enter().append("circle")
	.attr("class",function(d) {return "C"+d.index+" circle3";})
	
	.style("fill", "none")
	.attr("cx", function(d) { return d.x; })
	.attr("cy", function(d) { return d.y; })
	.attr("r", function(d, i) { return Math.sqrt(d.data[2]/10); })
	.style("stroke","green")
	.style("visibility","hidden");
	
function init(selection) {
	nodes = countries.features.map(function(d) {
		var xy = project(d.geometry.coordinates);
		return idToNode[d.id] = {
			x: xy[0],
			y: xy[1],
			gravity: {x: xy[0], y: xy[1]},
			r: Math.sqrt(d.properties.area/4000),
			data:[d.properties.population,d.properties.production,d.properties.consumption,d.properties.area],
			value: data[+d.id],
			name:d.properties.name
		};
});}
var currentView=0;
var pages=d3.select("#pages");
var tabs=data.tabs;
var li=pages.append("ul").selectAll("li").data(["prev"].concat(d3.range(1,8),["next"])).enter().append("li");
li.append("a").attr("href","#").html(function(d) {
	if (d=="prev") {return "&larr; 이전으로";};
	if (d=="next") {return "다음으로 &rarr;";};
	return d;})
li.filter(function(d) {return d=="prev";}).classed("prev",1).classed("disabled",1);
li.filter(function(d) {return d=="next";}).classed("next",1);
li.filter(function(d,i) {return i==1;}).classed("active",1);

li.on("click", function(d,i) {
	if (d3.select(this).classed("disabled")==0) {
		if(d=="prev"&&currentView>0) {
			currentView--;	
			
		} else if (d=="next"&&currentView<6) {
			currentView++;
		} else {
			currentView=i-1;
		}
		li.filter(function(d) {return d=="prev";}).classed("disabled",(currentView==0));
		li.filter(function(d) {return d=="next";}).classed("disabled",(currentView==6));
	
		li.classed("active",0);
		li.filter(function(d) {return d==(currentView+1);}).classed("active",1);
		transitionTo(currentView);
	}
})	

var transitionTo = function transitionTo() {
	d3.select("#cPanel").select("p").html(texts[currentView].text[lang]);
	if(currentView<6) {
			d3.selectAll(".circle1,.circle2,.circle3").classed("highlighted",0).style("visibility","hidden");
			//d3.selectAll(".circle0").transition().attr("r",0).each("end",function() {d3.select(this).style("visibility","hidden");});
			d3.selectAll(".circle0").attr("r",0).style("visibility","hidden");
			texts[currentView].countries.forEach(function(c) {
				d3.selectAll(".C"+c+", .c"+c).classed("highlighted",1).style("visibility","visible");
				//d3.selectAll(".c"+c).style("visibility","visible").transition().attr("r",function(d){return d.r;});
				d3.selectAll(".c"+c).style("visibility","visible").classed("highlighted",1).attr("r",function(d){return d.r;});
			})
	} else {
		d3.selectAll(".circle1,.circle2,.circle3").classed("highlighted",0).style("visibility","hidden");
		d3.selectAll(".circle0").classed("highlighted",0).style("visibility","visible").transition().attr("r",function(d){return d.r;});
	}

}

function initText() {/*
	d3.select("#stories").selectAll("button").remove();
	d3.select("#stories").selectAll("button").data(texts).enter()
		.append("button")
		.classed("btn",1)
		.attr("id",function(d) {return d.countrylabel["eng"];})
		.html(function(d) {return d.countrylabel[lang];})
		.on("click",function(d) {
			d3.select("#stories").selectAll("button").classed("active",0);
			d3.select(this).classed("active",1);
			d3.selectAll(".circle1, .circle2, .circle3").classed("highlighted",0).style("visibility","hidden");
			d.countries.forEach(function(c) {d3.selectAll(".C"+c).classed("highlighted",1).style("visibility","visible");});
			d3.select("#cPanel").select("p").html(d.text[lang]);
		})*/
}

function changeLang() {
	lang=(lang=='eng')?'kor':'eng';
	window.location.search="?lang="+lang;
	d3.select("#alang").html(function() {return (lang=='eng')?'Switch to Korean':'Switch to English';})
	//d3.select("#cPanel").selectAll("a").html(function(d) {return d.countrylabel[lang];})
}
transitionTo();


function click(d) {
  var x = 0,
      y = 0,
      k = 1;

  var e=d3.event;
  d3.selectAll(".selected").classed("selected",0);
  if(d) {d3.select(this).classed("selected",1);}
  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = -centroid[0];
    y = -centroid[1];
    k = 3;
    
    centered = d;
  } else {
    centered = null;
    if(d){d3.select(this).classed("selected",0)}
  }

  svg.transition()
      .duration(1000)
      .attr("transform", "scale(" + k + ")translate(" + (x+80) + "," + (y+20) + ")")
}

function reset() {
projection = d3.geo.mercator()
    .scale(width)
    .translate([width / 2, height / 2]);
svg.transition().duration(1000).attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}


$('circle').tipsy({html: true, gravity: 's'});