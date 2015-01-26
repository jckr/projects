var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var match={ad:"AND",ae:"ARE",af:"AFG",ag:"ATG",ai:"AIA",al:"ALB",am:"ARM",ao:"AGO",ar:"ARG",at:"AUT",au:"AUS",aw:"ABW",az:"AZE",ba:"BIH",bb:"BRB",bd:"BGD",be:"BEL",bf:"BFA",bg:"BGR",bh:"BHR",bi:"BDI",bj:"BEN",bm:"BMU",bn:"BRN",bo:"BOL",br:"BRA",bs:"BHS",bt:"BTN",bw:"BWA",by:"BLR",bz:"BLZ",ca:"CAN",cd:"COD",cf:"CAF",cg:"COG",ch:"CHE",ci:"CIV",ck:"COK",cl:"CHL",cm:"CMR",cn:"CHN",co:"COL",cr:"CRI",cu:"CUB",cv:"CPV",cy:"CYP",cz:"CZE",de:"DEU",dj:"DJI",dk:"DNK",dm:"DMA",do:"DOM",dz:"DZA",ec:"ECU",ee:"EST",eg:"EGY",er:"ERI",es:"ESP",et:"ETH",fi:"FIN",fj:"FJI",fo:"FRO",fr:"FRA",ga:"GAB",gb:"GBR",gd:"GRD",ge:"GEO",gh:"GHA",gi:"GIB",gl:"GRL",gm:"GMB",gn:"GIN",gq:"GNQ",gr:"GRC",gt:"GTM",gw:"GNB",gy:"GUY",hk:"HKG",hn:"HND",hr:"HRV",ht:"HTI",hu:"HUN",id:"IDN",ie:"IRL",il:"ISR",in:"IND",iq:"IRQ",ir:"IRN",is:"ISL",it:"ITA",jm:"JAM",jo:"JOR",jp:"JPN",ke:"KEN",kg:"KGZ",kh:"KHM",km:"COM",kn:"KNA",kp:"PRK",kr:"KOR",kw:"KWT",ky:"CYM",kz:"KAZ",la:"LAO",lb:"LBN",lc:"LCA",li:"LIE",lk:"LKA",lr:"LBR",ls:"LSO",lt:"LTU",lu:"LUX",lv:"LVA",ly:"LBY",ma:"MAR",mc:"MCO",md:"MDA",me:"MNE",mg:"MDG",mk:"MKD",ml:"MLI",mm:"MMR",mn:"MNG",mo:"MAC",mr:"MRT",mt:"MLT",mu:"MUS",mv:"MDV",mw:"MWI",mx:"MEX",my:"MYS",mz:"MOZ",na:"NAM",ne:"NER",ng:"NGA",ni:"NIC",nl:"NLD",no:"NOR",np:"NPL",nz:"NZL",om:"OMN",pa:"PAN",pe:"PER",pg:"PNG",ph:"PHL",pk:"PAK",pl:"POL",pr:"PRI",ps:"PSE",pt:"PRT",pw:"PLW",py:"PRY",qa:"QAT",ro:"ROU",rs:"SRB",ru:"RUS",rw:"RWA",sa:"SAU",sb:"SLB",sc:"SYC",sd:"SDN",se:"SWE",sg:"SGP",si:"SVN",sk:"SVK",sl:"SLE",sm:"SMR",sn:"SEN",so:"SOM",sr:"SUR",ss:"SSD",st:"STP",sv:"SLV",sy:"SYR",sz:"SWZ",tc:"TCA",td:"TCD",tg:"TGO",th:"THA",tj:"TJK",tl:"TLS",tm:"TKM",tn:"TUN",to:"TON",tr:"TUR",tt:"TTO",tv:"TUV",tw:"TWN",tz:"TZA",ua:"UKR",ug:"UGA",us:"USA",uy:"URY",uz:"UZB",vc:"VCT",ve:"VEN",vg:"VGB",vn:"VNM",vu:"VUT",ws:"WSM",ye:"YEM",za:"ZAF",zm:"ZMB",zw:"ZWE"};
var centroids={ad:[42.5,1.5],ae:[24,54],af:[33,66],ag:[17.05,-61.8],ai:[18.216667,-63.05],al:[41,20],am:[40,45],ao:[-12.5,18.5],ar:[-34,-64],at:[47.333333,13.333333],au:[-25,135],aw:[12.5,-69.966667],az:[40.5,47.5],ba:[44.25,17.833333],bb:[13.166667,-59.533333],bd:[24,90],be:[50.833333,4],bf:[13,-2],bg:[43,25],bh:[26,50.5],bi:[-3.5,30],bj:[9.5,2.25],bm:[32.333333,-64.75],bn:[4.5,114.666667],bo:[-17,-65],br:[-10,-55],bs:[24,-76],bt:[27.5,90.5],bw:[-22,24],by:[53,28],bz:[17.25,-88.75],ca:[60,-96],cd:[0,25],cf:[7,21],cg:[-1,15],ch:[47,8],ci:[8,-5],ck:[-16.083333,-161.583333],cl:[-30,-71],cm:[6,12],cn:[35,105],co:[4,-72],cr:[10,-84],cu:[22,-79.5],cv:[16,-24],cy:[35,33],cz:[49.75,15],de:[51.5,10.5],dj:[11.5,42.5],dk:[56,10],dm:[15.5,-61.333333],do:[19,-70.666667],dz:[28,3],ec:[-2,-77.5],ee:[59,26],eg:[27,30],er:[15,39],es:[40,-4],et:[8,38],fi:[64,26],fj:[-18,178],fo:[62,-7],fr:[46,2],ga:[-1,11.75],gb:[54,-4],gd:[12.116667,-61.666667],ge:[41.999981,43.499905],gh:[8,-2],gi:[36.133333,-5.35],gl:[72,-40],gm:[13.5,-15.5],gn:[11,-10],gq:[2,10],gr:[39,22],gt:[15.5,-90.25],gw:[12,-15],gy:[5,-59],hk:[22.25,114.166667],hn:[15,-86.5],hr:[45.166667,15.5],ht:[19,-72.416667],hu:[47,20],id:[-5,120],ie:[53,-8],il:[31.5,34.75],in:[20,77],iq:[33,44],ir:[32,53],is:[65,-18],it:[42.833333,12.833333],jm:[18.25,-77.5],jo:[31,36],jp:[36,138],ke:[1,38],kg:[41,75],kh:[13,105],km:[-12.166667,44.25],kn:[17.333333,-62.75],kp:[40,127],kr:[37,127.5],kw:[29.5,47.75],ky:[19.5,-80.666667],kz:[48,68],la:[18,105],lb:[33.833333,35.833333],lc:[13.883333,-60.966667],li:[47.166667,9.533333],lk:[7,81],lr:[6.5,-9.5],ls:[-29.5,28.25],lt:[56,24],lu:[49.75,6.166667],lv:[57,25],ly:[25,17],ma:[32,-5],mc:[43.733333,7.4],md:[47,29],me:[42.5,19.3],mg:[-20,47],mk:[41.833333,22],ml:[17,-4],mm:[22,98],mn:[46,105],mo:[22.157778,113.559722],mr:[20,-12],mt:[35.916667,14.433333],mu:[-20.3,57.583333],mv:[3.2,73],mw:[-13.5,34],mx:[23,-102],my:[2.5,112.5],mz:[-18.25,35],na:[-22,17],ne:[16,8],ng:[10,8],ni:[13,-85],nl:[52.5,5.75],no:[62,10],np:[28,84],nz:[-42,174],om:[21,57],pa:[9,-80],pe:[-10,-76],pg:[-6,147],ph:[13,122],pk:[30,70],pl:[52,20],pr:[18.2482882,-66.4998941],ps:[31.425074,34.373398],pt:[39.5,-8],pw:[6,134],py:[-22.993333,-57.996389],qa:[25.5,51.25],ro:[46,25],rs:[44,21],ru:[60,100],rw:[-2,30],sa:[25,45],sb:[-8,159],sc:[-4.583333,55.666667],sd:[16,30],se:[62,15],sg:[1.366667,103.8],si:[46.25,15.166667],sk:[48.666667,19.5],sl:[8.5,-11.5],sm:[43.933333,12.416667],sn:[14,-14],so:[6,48],sr:[4,-56],ss:[8,30],st:[1,7],sv:[13.833333,-88.916667],sy:[35,38],sz:[-26.5,31.5],tc:[21.733333,-71.583333],td:[15,19],tg:[8,1.166667],th:[15,100],tj:[39,71],tl:[-8.833333,125.75],tm:[40,60],tn:[34,9],to:[-20,-175],tr:[39.059012,34.911546],tt:[11,-61],tv:[-8,178],tw:[24,121],tz:[-6,35],ua:[49,32],ug:[2,33],us:[39.828175,-98.5795],uy:[-33,-56],uz:[41.707542,63.84911],vc:[13.083333,-61.2],ve:[8,-66],vg:[18.5,-64.5],vn:[16.166667,107.833333],vu:[-16,167],ws:[-13.803096,-172.178309],ye:[15.5,47.5],za:[-30,26],zm:[-15,30],zw:[-19,29]};

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
	.style("opacity",.2)
})

   

    function move() {
    	
    	collection.features.forEach(function(f) {
      	centroids[f.id]=path.centroid(f);
      })
  	d3.selectAll("circle").attr("transform",transform);
  projection.translate(d3.event.translate).scale(d3.event.scale);
  feature.attr("d", path);
}

});

function transform(d) {
	if (typeof(centroids[d3.keys(d)[0]])!=="undefined") {
		var	c=projection(centroids[match[d3.keys(d)[0]]]);
		var x=c[0],
			y=c[1];
		return "translate("+x+","+y+")";
	} 	
}


