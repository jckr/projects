var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var match={ad:"AND",ae:"ARE",af:"AFG",ag:"ATG",ai:"AIA",al:"ALB",am:"ARM",ao:"AGO",ar:"ARG",at:"AUT",au:"AUS",aw:"ABW",az:"AZE",ba:"BIH",bb:"BRB",bd:"BGD",be:"BEL",bf:"BFA",bg:"BGR",bh:"BHR",bi:"BDI",bj:"BEN",bm:"BMU",bn:"BRN",bo:"BOL",br:"BRA",bs:"BHS",bt:"BTN",bw:"BWA",by:"BLR",bz:"BLZ",ca:"CAN",cd:"COD",cf:"CAF",cg:"COG",ch:"CHE",ci:"CIV",ck:"COK",cl:"CHL",cm:"CMR",cn:"CHN",co:"COL",cr:"CRI",cu:"CUB",cv:"CPV",cy:"CYP",cz:"CZE",de:"DEU",dj:"DJI",dk:"DNK",dm:"DMA",do:"DOM",dz:"DZA",ec:"ECU",ee:"EST",eg:"EGY",er:"ERI",es:"ESP",et:"ETH",fi:"FIN",fj:"FJI",fo:"FRO",fr:"FRA",ga:"GAB",gb:"GBR",gd:"GRD",ge:"GEO",gh:"GHA",gi:"GIB",gl:"GRL",gm:"GMB",gn:"GIN",gq:"GNQ",gr:"GRC",gt:"GTM",gw:"GNB",gy:"GUY",hk:"HKG",hn:"HND",hr:"HRV",ht:"HTI",hu:"HUN",id:"IDN",ie:"IRL",il:"ISR",in:"IND",iq:"IRQ",ir:"IRN",is:"ISL",it:"ITA",jm:"JAM",jo:"JOR",jp:"JPN",ke:"KEN",kg:"KGZ",kh:"KHM",km:"COM",kn:"KNA",kp:"PRK",kr:"KOR",kw:"KWT",ky:"CYM",kz:"KAZ",la:"LAO",lb:"LBN",lc:"LCA",li:"LIE",lk:"LKA",lr:"LBR",ls:"LSO",lt:"LTU",lu:"LUX",lv:"LVA",ly:"LBY",ma:"MAR",mc:"MCO",md:"MDA",me:"MNE",mg:"MDG",mk:"MKD",ml:"MLI",mm:"MMR",mn:"MNG",mo:"MAC",mr:"MRT",mt:"MLT",mu:"MUS",mv:"MDV",mw:"MWI",mx:"MEX",my:"MYS",mz:"MOZ",na:"NAM",ne:"NER",ng:"NGA",ni:"NIC",nl:"NLD",no:"NOR",np:"NPL",nz:"NZL",om:"OMN",pa:"PAN",pe:"PER",pg:"PNG",ph:"PHL",pk:"PAK",pl:"POL",pr:"PRI",ps:"PSE",pt:"PRT",pw:"PLW",py:"PRY",qa:"QAT",ro:"ROU",rs:"SRB",ru:"RUS",rw:"RWA",sa:"SAU",sb:"SLB",sc:"SYC",sd:"SDN",se:"SWE",sg:"SGP",si:"SVN",sk:"SVK",sl:"SLE",sm:"SMR",sn:"SEN",so:"SOM",sr:"SUR",ss:"SSD",st:"STP",sv:"SLV",sy:"SYR",sz:"SWZ",tc:"TCA",td:"TCD",tg:"TGO",th:"THA",tj:"TJK",tl:"TLS",tm:"TKM",tn:"TUN",to:"TON",tr:"TUR",tt:"TTO",tv:"TUV",tw:"TWN",tz:"TZA",ua:"UKR",ug:"UGA",us:"USA",uy:"URY",uz:"UZB",vc:"VCT",ve:"VEN",vg:"VGB",vn:"VNM",vu:"VUT",ws:"WSM",ye:"YEM",za:"ZAF",zm:"ZMB",zw:"ZWE"};

var projection = d3.geo.mercator()
    .scale(width)
    .translate([width / 2, height / 1.6]);

var pubScale=d3.scale.linear().domain([0,500]).range([0,20]);

var path = d3.geo.path()
    .projection(projection);


var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    ;

var g = svg.append("g"),
    feature = g.selectAll(".feature");

var c = svg.append("g"), 
	pubs = c.selectAll(".pub");

svg.append("rect")
    .attr("class", "frame")
    .attr("width", width)
    .attr("height", height);
var centroids={};
d3.json("world-countries.json", function(collection) {
  var zoom = d3.behavior.zoom()
    .translate(projection.translate())
    .scale(projection.scale())
    .scaleExtent([height, 8 * height])
    .on("zoom", move);

  svg.call(zoom);
  feature = feature
      .data(collection.features)
    .enter().append("path")
      .attr("class", "feature")
      .attr("d", path)
      .style("fill","#eee");
      ;
      collection.features.forEach(function(f) {
      	centroids[f.id]=path.centroid(f);
      })
   d3.json("country-publications.json", function(json) {
	pubs.data(json).enter().append("circle")
	.style("visibility",function(d) {
		if (typeof(match[d3.keys(d)[0]])==="undefined") {
			return "hidden";
		} else {
			return "visible";
		}
	})
	.attr("transform",transform)
	.attr("r",function(d) {return pubScale(d3.values(d)[0]);})
	.style("fill","darkorange")
	.style("opacity",.5)
  .on("click",function(d) {alert(d3.keys(d)[0]);})
  .append("title")
  .text(function(d) {return d3.keys(d)[0]+": "+d3.values(d)[0]+" publications";})
})

   

    function move() {
    	projection.translate(d3.event.translate).scale(d3.event.scale);
    	collection.features.forEach(function(f) {
      	centroids[f.id]=path.centroid(f);
      })
  	d3.selectAll("circle").attr("transform",transform);
  
  feature.attr("d", path);
}

});

function transform(d) {
	if (typeof(match[d3.keys(d)[0]])!=="undefined" && centroids[match[d3.keys(d)[0]]]) {
			console.log(match[d3.keys(d)[0]]);
		var x=centroids[match[d3.keys(d)[0]]][0],
			y=centroids[match[d3.keys(d)[0]]][1];
		return "translate("+x+","+y+")";
	} 	
}


