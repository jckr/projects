var width = 960,
    height = 470,
    cellSize=5;
var helper;
var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);
var maxStep=364;
var defs=svg.append("defs");
var vis=svg
    .append("g");
var running=0;
var colors=["pink","green","red","blue","yellow"];
var colors=["red","red","red","red","red"]
var timer;
var i;
var binner=d3.hexbin().x(function(d) {return d.x;}).y(function(d) {return d.y;}).radius(5)
var selector={st:"",agency:"",month:"",cursor:"",iim:"",nbVictims:"",victimAge:"",victimSex:"",nbKillers:"",killerAge:"",killerSex:"",relType:"",relation:"",circ:""};
var sortKey={direction:"asc",key:"exactDate"}
var page=1;var totalPages=0;
var selection;
var day=0;
var c=1.61803399*2*Math.PI;
var reveal=0;
var slider=d3.select("#slider");
/*var projection = d3.geo.mercator()
    .center([-96, 38.3])
    .scale(5600);*/
var projection=d3.geo.albersUsa();
var fday=[0,31,59,90,120,151,181,212,243,273,304,334]; // first day of that month
var lMonth=[31,28,31,30,31,30,31,31,30,31,30,31]; // length of months
var mName=["January","February","March","April","May","June","July","August","September","October","November","December"]
//var play=function() {};

var incidents=[],weapons={},victims=[],offenders=[],relationships={},agencies={},circumstances={},vHash={},oHash={},iHash;
var grid=d3.range(width/cellSize).map(function() {return d3.range(height/cellSize).map(function() {return [];})})
var agenciesAr=[],iHash={},times=[];
var path = d3.geo.path();
loadbar(200);	

init();

function loadbar(p) {
	if (!p) {d3.select("#loadbar")
		//.transition()
		//.style("opacity",0)
		.remove();} else {
	d3.select("#loadbar").select(".bar").transition().duration(p).style("width","80%")
	}
}

function init() {
	loadMap();

	// LOADING DATA

	function loadMap() {
		d3.json("us.json",function(error,json) {
		us=json;
		
		loadAgencies();
	})}

	function loadAgencies() {d3.csv("agencies.csv",function(error,csv) {
		agencies=d3.nest().key(function(d) {return d.agency;}).rollup(function(d) {return d[0];}).map(csv);
		var ka=d3.keys(agencies);
		ka.forEach(function(k) {var d=agencies[k];var xy=projection([+d.lon,+d.lat]);d.x=xy[0],d.y=xy[1];})
		console.log(csv.length+" agencies loaded.")
		agenciesAr=ka.map(function(k) {return agencies[k];})
		
		loadWeapons();
	})}

	function loadWeapons() {d3.csv("weapons.csv",function(error,csv) {
		weapons=d3.nest().key(function(d) {return d.weapon;}).rollup(function(d) {return d[0];}).map(csv);
		console.log(csv.length+" weapons loaded.")
		
		loadCircumstances();
	})}

	function loadCircumstances() {d3.csv("circumstances.csv",function(error,csv) {
		circumstances=d3.nest().key(function(d) {return d.circumstance;}).rollup(function(d) {return d[0];}).map(csv);
		console.log(csv.length+" circumstances loaded.")
		
		loadRelationships();
	})}

	function loadRelationships() {d3.csv("relationships.csv",function(error,csv) {
		relationships=d3.nest().key(function(d) {return d.code;}).rollup(function(d) {return d[0];}).map(csv);
		console.log(csv.length+" relationships loaded.")
		
		loadVictims();

	})}

	function loadVictims() {d3.csv("victims.csv", function (error,csv) {
		victims=csv;
		vHash=d3.nest().key(function(d) {return d.incidentId;}).map(victims)

		console.log(csv.length+" victims loaded.")
		
		loadOffenders();
	})}

	function loadOffenders() {d3.csv("offenders.csv", function (error,csv) {
		offenders=csv;
		oHash=d3.nest().key(function(d) {return d.incidentId;}).map(offenders)

		console.log(csv.length+" offenders loaded.")
		
		loadIncidents();
	})}

	function loadIncidents() {d3.csv("incidents.csv", function (error,csv) {
		incidents=csv;
		console.log(csv.length+" incidents loaded.")
		// now some massaging
		var ipm=d3.nest().key(function(d) {return d.agency;}).key(function(d) {return (d.month-1);}).rollup(function(d) {return d.length;}).map(incidents); // incidents per month



		incidents.forEach(function(d,i) {
			var id=d.incidentId;
			d.month=+d.month;
			if(i) { // rewriting incInMonth so that it means what I think it means
				e=incidents[i-1];
				if(d.agency==e.agency&&d.month==e.month){
					d.incInMonth=e.incInMonth+1;
				} else {
					d.incInMonth=1;
				}
			} else {d.incInMonth=1;}
			d.victims=vHash[id].slice(0);
			d.offenders=oHash[id].slice(0);

			if(!d.exactDate) { // unless exact date is known
				d.approxDate=true;
				var m=+d.month-1;
				
				d.exactDate=Math.floor(fday[m]+lMonth[m]*(d.incInMonth-1+Math.random())/ipm[d.agency][m]);
			} else {d.approxDate=false;}
			if(!d.exactLon) {
				//console.log(d.agency)
				var x=agencies[d.agency].x;var y=agencies[d.agency].y;
				var a=Math.random()*2*Math.PI,c=Math.cos(a),s=Math.sin(a);
				var dist=10*(Math.random()*Math.random());
				dist=0;
				d.x=x+c*dist;d.y=y+s*dist;

				var state=agencies[d.agency].stateabbr;
				//if(state=="HI") {d.x=d.x+700;d.y=d.y-100;}
				//if(state=="AK") {d.x=d.x+400;d.y=d.y+600;}

				if(d.x>0&&d.x<width&&d.y>0&&d.y<height) {
					var xx=Math.floor(x/cellSize),yy=Math.floor(y/cellSize);
					if(xx>0&&xx<width/cellSize&&yy>0&&yy<height/cellSize)
					{grid[xx][yy].push({time:d.exactDate,iId:id})}
				}
			} else {
				var xy=projection([d.exactLon,d.exactLat]);
				d.x=xy[0];d.y=xy[1];
			}

			d.victimAge={unknown:0,child:0,teenager:0,"young adult":0,adult:0,elderly:0}
			d.victimSex={unknown:0,male:0,female:0}

			d.victims.forEach(function(v,i) { // victims arranged in spiral around incident location
				var step=1;
				var angle=c*i;
				v.x=d.x+Math.cos(angle)*Math.sqrt(i+1);
				v.y=d.y+Math.sin(angle)*Math.sqrt(i+1);
				v.exactDate=d.exactDate
				if(v.age==0) {d.victimAge.unknown=d.victimAge.unknown+1}
				if(v.age>0&&v.age<13) {d.victimAge.child=d.victimAge.child+1}
				if(v.age>14&&v.age<19) {d.victimAge.teenager=d.victimAge.teenager+1}
				if(v.age>18&&v.age<25) {d.victimAge["young adult"]=d.victimAge["young adult"]+1}
				if(v.age>26&&v.age<65) {d.victimAge.adult=d.victimAge.adult+1}
				if(v.age>64) {d.victimAge.elderly=d.victimAge.elderly+1}
				if(v.age=="BB"||v.age=="NB") {d.victimAge.child=1}
				if(v.sex=="U") {d.victimSex.unknown=d.victimSex.unknown+1}
				if(v.sex=="M") {d.victimSex.male=d.victimSex.male+1}
				if(v.sex=="F") {d.victimSex.female=d.victimSex.female+1}
			})

			d.killerAge={unknown:0,child:0,teenager:0,"young adult":0,adult:0,elderly:0}
			d.killerSex={unknown:0,male:0,female:0}

			d.offenders.forEach(function(k) {
				if(k.age==0) {d.killerAge.unknown=d.killerAge.unknown+1}
				if(k.age>0&&k.age<13) {d.killerAge.child=d.killerAge.child+1}
				if(k.age>14&&k.age<19) {d.killerAge.teenager=d.killerAge.teenager+1}
				if(k.age>18&&k.age<25) {d.killerAge["young adult"]=d.killerAge["young adult"]+1}
				if(k.age>26&&k.age<65) {d.killerAge.adult=d.killerAge.adult+1}
				if(k.age>64) {d.killerAge.elderly=d.killerAge.elderly+1}
				if(k.age=="BB"||k.age=="NB") {d.killerAge.child=d.killerAge.child+1}
				if(k.sex=="U") {d.killerSex.unknown=d.killerSex.unknown+1}
				if(k.sex=="M") {d.killerSex.male=d.killerSex.male+1}
				if(k.sex=="F") {d.killerSex.female=d.killerSex.female+1}	
			})

			d.agName=agencies[d.agency].name; // convenience
			d.stateabbr=agencies[d.agency].stateabbr
			d.stateNb=agencies[d.agency].stateNb;
			d.agencyNb=agencies[d.agency].agencyNb;
			d.offenders.sort(function(a,b) {return relationships[a.relationship].type-relationships[b.relationship].type;}) // still inaccurate but there are not that many cases where it makes a difference
			d.mainkiller=d.offenders[0].offenderId;
			
			d.mkRel=d.offenders[0].relationship;
			
			d.mkRelType=relationships[d.mkRel].type;
			d.mkRelNb=+relationships[d.mkRel].relNb;
			d.mkRelTypeVerbose=["close","family","friend","known","stranger","unknown"][d.mkRelType]
			d.mkRelPhrase=relationships[d.mkRel].phrase;
			d.mkCirc=+d.offenders[0].circumstances;//console.log(d.mkCirc);
			d.mkCircPhrase=circumstances[d.mkCirc].name;
			d.mkCircType=circumstances[d.mkCirc].type;
			d.mkCircNb=+circumstances[d.mkCirc].circNb;


		})
		iHash=d3.nest().key(function(d) {return d.incidentId;}).rollup(function(d) {return d[0]}).map(incidents);
		incidents.sort(function(a,b) {return a.exactDate-b.exactDate;})
		ipd=d3.nest()
			.key(function(d) {return d.exactDate;})
			.rollup(function(d) {return d.incidentId;})
			.map(incidents);
		
		main();
	})}
}

function calculate(first) {
	victims.sort(function(a,b) {return a.exactDate-b.exactDate;})
	var myVictims=[];
	//var
	i=0;
	d3.range(365).forEach(function(myDay) {
		while(victims[i]&&victims[i].exactDate==myDay) { 
			myVictims.push(victims[i]);
			i=i+1;
		}
		//console.log(day,i)
		var myHexBin=binner(myVictims);
		if(myDay) {
			var h=times[myDay-1];
			myHexBin.forEach(function (b,j) {
				
				if(j>=h.length) {b.new=true} else 
				{b.new=b.length>h[j].length}
			})
		} else {myHexBin.forEach(function(b) {b.new=true;})}
		times.push(myHexBin);
	})
	if(first) {
		console.log("data precomputed");
		loadbar(100);
		interface();
	}

}
function interface() {
	d3.select("#sliderdiv").style("display","block");
	d3.select("#lower").html(
		'<div id="total" class="row"></div>'+
		'<div class="pages"></div>'+
		'<div id="details">'+
			'<div id="sort"></div>'+
			'<div id="header"></div>'+
			'<div id="records">'+
				'<div class="row" id="st"></div>'+
				'<ul></ul>'+
			'</div>'+
		'</div>'+
		'<div class="pages"></div>');
	idPages=["nbPages","first","pdwn","prev","p-3","p-2","p-1","p","p1","p2","p3","next","pup","last"];
	d3.selectAll(".pages").selectAll("div").data(idPages).enter().append("div").attr("class",String).classed("pagesgination span",1)
	d3.selectAll(".nbPages").classed("pagesgination",0)

	var st=d3.select("#st");st.append("div").classed("span",1).style("width","280px")
	st.selectAll(".st").data(["Total","<13","<19","<25","<65","65+","M","F"]).enter().append("div")
		.classed("span",1).style({width:"25px","margin-left":"0px","text-align":"center"}).html(String)
	d3.select("#slider").on("change",function() {clearInterval(timer);day=+this.value;update(day);})
				d3.select("#stop").on("click",function() {
					if (running) {
						stop();
					} else {
						start();
					}
				})
	var map=vis.append("g").attr("id","map");
	map.selectAll("path")
      .data([topojson.object(us, us.objects.land)])
    .enter().append("path")
      .attr("d", path).style({fill:"#eee",stroke:"none"});
	vis.append("g").attr("id","murders");
	vis.append("path").attr("d","M0,0h960").attr("id","haxis").style({stroke:"red",opacity:0})
	vis.append("path").attr("d","M0,0h470").attr("id","vaxis").style({stroke:"red",opacity:0})
	day=364;draw(day);
	updateSelection();
	details(false);
}

function main() {
	console.log("data loaded.")
	calculate(true);

	
	//svg.selectAll("circle").data(agenciesAr).enter().append("circle").attr({cx:function(d) {return d.x;},cy:function(d) {return d.y;},r:1}).style({stroke:"black",fill:"none"})
}

function play() {
	if(day===maxStep) {day=-1;if(running) {stop();}}
	if(day<maxStep){day=day+1;running=1;
	d3.select("#stop").html("Pause&nbsp;<i class='icon-pause'>").on("click",stop);
	slider.property("value",day);
	update(day);} else {stop();}	
}

function start() {
	timer=setInterval("play()", 100);
}

function stop() {
	clearInterval(timer);
	running=0;
	d3.select("#stop").html("Play&nbsp;<i class='icon-play'>").on("click",start);
}

function update(myDay) {draw(myDay);}
function writedate(myDay) {
	var m=11;
	fday.some(function(d,i) {if (d>myDay) {m=i-1;return true}})
	var DOM=myDay-fday[m]+1;
	var DOMd=DOM%10;
	var suffix=["th","st","nd","rd"][DOMd]||"th";
	return mName[m]+" "+DOM+suffix;
}
function draw(myDay) {
	if(!reveal) {d3.selectAll(".reveal").transition().style("opacity",1);loadbar(false);}
	var t=times[myDay];
	var victimTotal=d3.sum(t,function(d) {return d.length;})

	d3.select("#victimTotal").html(victimTotal+" dead")
	d3.select("#date").html(writedate(myDay))

	var murderLayer=vis.select("#murders");
	var hex=murderLayer.selectAll(".hexagon").data(t);
	hex.exit().remove();
	hex.enter().append("path").attr({
		d:binner.hexagon, 
		transform:function(d) {return "translate("+d.x+","+d.y+")";}}).classed("hexagon",1);
	murderLayer.selectAll(".hexagon")
		.style("fill",function(d) {return d3.scale.linear().domain([0,10,500]).range(["#eee","black","red"])(d.length)})
		.style("stroke",function(d) {return d.new?"red":"null"})
		.on("mouseover",function(d) {d3.select(this).style("stroke","red");})
		.on("mouseout",function(d) {d3.select(this).style("stroke", d.new?"red":"null");})
		.on("click",function(d,i) {
			helper=d;
			d3.keys(selector).forEach(function(k) {selector[k]="";})
			selector.cursor="cursor";
			var cursorIncidents={};
			d.forEach(function(v) {cursorIncidents[v.incidentId]=true;//console.log(cursorIncidents);
			})
			selection=[];
			d3.keys(cursorIncidents).forEach(function(k) {selection.push(iHash[k]);})
			page=1;totalPages=Math.floor(selection.length/10)+1;
			details(false);
		} )
}

// creating the details screen

function updateSelection(down) {
	console.log("selection updated.")
	selection=(down?selection:incidents).filter(function(d) {
		if (selector.st!=="") {
			if (d.stateabbr!=selector.st) {return false;}
		}
		if (selector.agency!=="") {
			if (d.agName!=selector.agency) {return false;}
		}
		if (selector.month!=="") {
			if (d.month!=selector.month) {return false;}
		}
		if (selector.iim!=="") {
			if (d.iim!=selector.iim) {return false;}
		}
		if (selector.nbVictims!=="") {
			if (d.nbVictims!=selector.nbVictims) {return false;}
		}
		if (selector.victimAge!=="") {
			if (!d.victimAge[selector.victimAge]) {return false;}
		}
		if (selector.victimSex!=="") {
			if (!d.victimSex[selector.victimSex]) {return false;}
		}
		if (selector.nbKillers!=="") {
			if (d.nbOffenders!=selector.nbKillers) {return false;}
		}
		if (selector.killerAge!=="") {
			if (!d.killerAge[selector.killerAge]) {return false;}
		}
		if (selector.killerSex!=="") {
			if (!d.killerSex[selector.killerSex]) {return false;}
		}
		if (selector.relType!=="") {
			if (d.mkRelTypeVerbose!==selector.relType) {return false;}
		}
		if (selector.relation!=="") {
			if (d.mkRelPhrase!==selector.relation) {return false;}
		}
		if (selector.circ!=="") {
			if (d.mkCircPhrase!==selector.circ) {return false;}
		}
		return true;
	}); 
	page=1;
	totalPages=Math.floor(selection.length/10)+1;
}

function sortSelection() {

	if(sortKey.direction=="asc") {
		selection.sort(function (a,b) {return (a[sortKey.key]-b[sortKey.key]);})
	} else {
		selection.sort(function (b,a) {return (a[sortKey.key]-b[sortKey.key]);})
	}
	page=1;
}

// writing to the bottom part of the screen

function details(refresh) {
	//console.log(page);

	var hexagon="M4,0l4.33,2.5l0,5l-4.33,2.5l-4.33,-2.5l0,-5l4.33,-2.5z",rectangle="M0,2h8v8h-8Z",circle="M4,2 A4,4 0 1,1 3.99,2Z"

		d3.select("#records").selectAll("li").remove() // might as well, safer and not really slower
		if(refresh) {updateSelection();}
	
	var totalCases=selection.length;
	var totalVictims=d3.sum(selection,function(d) {return d.nbVictims;});
	var totalKillers=d3.sum(selection,function(d) {return d.nbOffenders;});
	d3.select("#total").html(
		"<div id='ltotalVictims' class='span'><strong>Victims:&nbsp;</strong>"+
		totalVictims+"</div>&nbsp;<div id='ltotalCases' class='span'><strong>Cases:&nbsp;</strong>"+
		totalCases+"</div>&nbsp;<div class='span' id='ltotalKillers'><strong>Killers:&nbsp;</strong>"+totalKillers+"</div>")
	
	var sortDisplay=d3.keys(selector).filter(function(k) {return selector[k]!==""})
	
	var posselector={
		cursor:[0,0],
		st:[0,25],
		agency:[50,25],
		month:[300,25],
		iim:[350,25],
		nbVictims:[400,0],
		victimAge:[400,25],
		victimSex:[430,0],
		nbKillers:[500,0],
		killerAge:[500,25],
		killerSex:[530,0],
		relType:[600,25],
		relation:[600,0],
		circ:[700,25]}

	var lblSelector={cursor:"area",st:"state",agency:"agency",month:"month",nbVictims:"nb. victims",victimAge:"one victim is",victimSex:"one victim is",nbKillers:"nb. killers",relation:"relation",circ:"details"}
	
	d3.select("#sort").selectAll("span").remove();
	if(!sortDisplay.length) {
		d3.select("#sort").append("span").append("em").html("Click on the map or on the records to filter")
	} else {
	d3.select("#sort").selectAll("span").data(sortDisplay).enter().append("span").classed("selector",1);
	d3.select("#sort").selectAll(".selector")
		//.style("left",function(d) {return posselector[d][0]+"px"})
		//.style("top", function(d) {return posselector[d][1]+"px"})
		.html(function(d) {return "<strong>"+lblSelector[d]+"</strong>: "+selector[d]+"&nbsp;&times;"})
	.on("click",function(d) {
		selector[d]="";
		updateSelection(false);	// this time the new selection will be broader than the current one
		details(false);
	})
	d3.select("#sort").selectAll("span").data(sortDisplay).exit().remove();
	}

	var pagination=d3.selectAll(".pages").classed("row",1);
	pagination.selectAll(".nbPages").html("<strong>Page </strong>"+page+"/"+totalPages);
	pagination.selectAll(".first").html("1").on("click",function() {page=1;details(false);})
	pagination.selectAll(".pdwn")
		.html("<i class='icon-backward'></i>")
		.style("visibility",(page>10)?null:"hidden")
		.on("click",function() {page=page-10;details(false);})
	pagination.selectAll(".prev")
		.html("<i class='icon-chevron-left'></i>")
		.style("visibility",(page>1)?null:"hidden")
		.on("click",function() {page=page-1;details(false);})
	pagination.selectAll(".p-3")
		.html(page-3)
		.style("visibility",(page>3)?null:"hidden")
		.on("click",function() {page=page-3;details(false);})
	pagination.selectAll(".p-2")
		.html(page-2)
		.style("visibility",(page>2)?null:"hidden")
		.on("click",function() {page=page-2;details(false);})
	pagination.selectAll(".p-1")
		.html(page-1)
		.style("visibility",(page>1)?null:"hidden")
		.on("click",function() {page=page-1;details(false);})
	pagination.selectAll(".p")
		.html(page)
	pagination.selectAll(".p3")
		.html(page+3)
		.style("visibility",(page<totalPages-2)?null:"hidden")
		.on("click",function() {page=page+3;details(false);})
	pagination.selectAll(".p2")
		.html(page+2)
		.style("visibility",(page<totalPages-1)?null:"hidden")
		.on("click",function() {page=page+2;details(false);})
	pagination.selectAll(".p1")
		.html(page+1)
		.style("visibility",(page<totalPages)?null:"hidden")
		.on("click",function() {page=page+1;details(false);})
	pagination.selectAll(".pup")
		.html("<i class='icon-forward'></i>")
		.style("visibility",(page<totalPages-9)?null:"hidden")
		.on("click",function() {page=page+10;details(false);})
	pagination.selectAll(".next")
		.html("<i class='icon-chevron-right'></i>")
		.style("visibility",(page<totalPages)?null:"hidden")
		.on("click",function() {page=page+1;details(false);})
	pagination.selectAll(".last").html(totalPages).on("click",function() {page=totalPages;details(false);})

	


	var cats=[
	{label:"ST",key:"stateNb",class:"stateLbl"},
	{label:"Agency",key:"agencyNb",class:"agencyLbl"},
	{label:"Month",key:"exactDate",class:"monthLbl"},
	//{label:"#",key:"exactDate",class:"iimLbl"},
	{label:"Victims",key:"nbVictims",class:"totVictimsLbl"},
	{label:"Killers",key:"nbOffenders",class:"totKillersLbl"},
	{label:"Relation",key:"mkRelNb",class:"totRelationLbl"},
	{label:"Details",key:"mkCircNb",class:"circLbl"}
	]

	d3.select("#header").classed("btn-group",1).selectAll("button")
	.data(cats)
	.enter()
	.append("button")
	.html(function(d) {return d.label;}).attr("class",function(d) {return "btn Lbl "+d.class;})
	.on("click",function(d) {
		if(d.key==sortKey.key&&sortKey.direction=="asc") {
			sortKey.direction="desc";
			d3.select("#header").selectAll(".btn").html(function(l) {return l.label;})
			d3.select(this).html(d.label+"&nbsp;").classed("dropup",0).append("span").classed("caret",1);
		} else {
			sortKey.key=d.key;
			sortKey.direction="asc";
			d3.select("#header").selectAll(".btn").html(function(l) {return l.label;})
			d3.select(this).html(d.label+"&nbsp;").classed("dropup",1).append("span").classed("caret",1);
		}
		sortSelection()
		details(false);
	})
	
	var myRecords=d3.select("#records").select("ul").selectAll("li").data(selection.slice(10*page-10,10*page));
	myRecords.exit().remove()
	myRecords.enter().append("li").classed("record",1);
	myRecords=d3.selectAll(".record");
	myRecords.append("span").classed("stateSlct",1).html(function(d) {return d.stateabbr;})
	myRecords.append("span").classed("agencySlct",1).html(function(d) {return d.agName;})
	myRecords.append("span").classed("monthSlct",1).html(function(d) {return mName[d.month-1];})

	myRecords.append("span").style("width","20px")
	myRecords.append("span").classed("victimsSlct nbVictimsSlct",1).html(function(d) {return d.nbVictims;}).style("font-weight","bold").style("color",function(d) {return d3.scale.linear().domain([0,4,8]).range(["#ccc","black","red"])(d.nbVictims)})

	myRecords.append("span").classed("victimsSlct nbVictimsChild",1)
		.html(function(d) {return d.victimAge.child;})
		.style("opacity", function(d) {return (d.victimAge.child>0)?1:0;})
		.style("color",function(d) {return d3.scale.linear().domain([0,1,2]).range(["#ccc","black","red"])(d.victimAge.child)})
		.on("click",function() {selector.victimAge="child";updateSelection(false);details(false);})
	myRecords.append("span").classed("victimsSlct nbVictimsTeenager",1)
		.html(function(d) {return d.victimAge.teenager;})
		.style("opacity", function(d) {return (d.victimAge.teenager>0)?1:0;})
		.style("color",function(d) {return d3.scale.linear().domain([0,2,4]).range(["#ccc","black","red"])(d.victimAge.teenager)})
		.on("click",function() {selector.victimAge="teenager";updateSelection(false);details(false);})

	myRecords.append("span").classed("victimsSlct nbVictimsYA",1)
		.html(function(d) {return d.victimAge["young adult"];})
		.style("opacity", function(d) {return (d.victimAge["young adult"]>0)?1:0;})
		.style("color",function(d) {return d3.scale.linear().domain([0,2,4]).range(["#ccc","black","red"])(d.victimAge["young adult"])})
		.on("click",function() {selector.victimAge="young adult";updateSelection(false);details(false);})

	myRecords.append("span").classed("victimsSlct nbVictimsAdult",1)
		.html(function(d) {return d.victimAge.adult;})
		.style("opacity", function(d) {return (d.victimAge.adult>0)?1:0;})
		.style("color",function(d) {return d3.scale.linear().domain([0,4,8]).range(["#ccc","black","red"])(d.victimAge.adult)})
		.on("click",function() {selector.victimAge="adult";updateSelection(false);details(false);})

	myRecords.append("span").classed("victimsSlct nbVictimsElderly",1)
		.html(function(d) {return d.victimAge.elderly;})
		.style("opacity", function(d) {return (d.victimAge.elderly>0)?1:0;})
		.style("color",function(d) {return d3.scale.linear().domain([0,2,4]).range(["#ccc","black","red"])(d.victimAge.child)})
		.on("click",function() {selector.victimAge="elderly";updateSelection(false);details(false);})

	myRecords.append("span").classed("victimsSlct nbVictimsMale",1)
		.html(function(d) {return d.victimSex.male;})
		.style("opacity", function(d) {return (d.victimSex.male>0)?1:0;})
		.style("color",function(d) {return d3.scale.linear().domain([0,4,8]).range(["#ccc","black","red"])(d.victimSex.male)})
		.on("click",function() {selector.victimSex="male";updateSelection(false);details(false);})

	myRecords.append("span").classed("victimsSlct nbVictimsFemale",1)
		.html(function(d) {return d.victimSex.female;})
		.style("opacity", function(d) {return (d.victimSex.female>0)?1:0;})
		.style("color",function(d) {return d3.scale.linear().domain([0,2,4]).range(["#ccc","black","red"])(d.victimSex.female)})
		.on("click",function() {selector.victimSex="female";updateSelection(false);details(false);})

		
	myRecords.append("span").style("width","20px")
	myRecords.append("span").classed("nbKillersSlct",1).html(function(d) {return d.nbOffenders}).style("font-weight","bold").style("color",function(d) {return d3.scale.linear().domain([0,4,8]).range(["#ccc","black","red"])(d.nbVictims)})

	myRecords.append("span").style("width","55px")


	myRecords.append("span").classed("relationSlct",1).html(function(d) {
		return d.mkRelTypeVerbose+(d.mkRelPhrase?(" ("+d.mkRelPhrase+")"):"");
	}).on("click",function(d) {selector.relation=d.mkRelPhrase;updateSelection(true);details();})


	//myRecords.append("span").classed("relationSlct",1).html(function(d) {return d.mkRelPhrase;})
	
	myRecords.append("span").classed("circSlct",1).html(function(d) {
		return d.mkCircType+(d.mkCircPhrase?(" ("+d.mkCircPhrase+")"):"");
	}).on("click",function(d) {selector.circ=d.mkCircPhrase;updateSelection(true);details();})

	d3.selectAll(".stateSlct").on("click",function(d) {selector.st=d.stateabbr;updateSelection(true);details(false);})
	d3.selectAll(".agencySlct").on("click",function(d) {selector.agency=d.agName;updateSelection(true);details(false);})
	d3.selectAll(".monthSlct").on("click",function(d) {selector.month=d.month;updateSelection(true);details(false);})
	d3.selectAll(".iimSlct").on("click",function(d) {selector.month=d.incInMonth;updateSelection(true);details(false);})

	d3.selectAll(".nbVictimsSlct").on("click",function(d) {selector.nbVictims=+d.nbVictims;updateSelection(true);details(false);})
	d3.selectAll(".nbKillersSlct").on("click",function(d) {selector.nbKillers=+d.nbOffenders;updateSelection(true);details(false);})

	d3.selectAll(".killerSlct").on("click",function(d) {
		var classes=d3.select(this).attr("class").split(" ");
		var age={kAgeUnk:"unknown",kAge0:"child",kAge1:"teenager",kAge2:"young adult",kAge3:"adult",kAge4:"elderly"}[classes[1]];
		var sex={kM:"male",kF:"female",kU:"unknown"}[classes[2]];
		if(selector.killerAge!==age){selector.killerAge=age;updateSelection(true);details(false);}
		else {selector.killerSex=sex;details();}
	})

	d3.selectAll(".victimSlct").on("click",function(d) {
		var classes=d3.select(this).attr("class").split(" ");
		var age={vAgeUnk:"unknown",vAge0:"child",vAge1:"teenager",vAge2:"young adult",vAge3:"adult",vAge4:"elderly"}[classes[1]];
		var sex={vM:"male",vF:"female",vU:"unknown"}[classes[2]];
		if(selector.victimAge!==age){selector.victimAge=age;updateSelection(true);details(false);}
		else {selector.victimSex=sex;updateSelection(true);details(false);}
	})
	d3.selectAll(".record").selectAll("*").on("mouseover",function(d) {//console.log("mouseover",d);
		d3.select("#haxis").transition().style("opacity",.25).attr("d", "M0,"+d.y+"h960");
		d3.select("#vaxis").transition().style("opacity",.25).attr("d", "M"+d.x+",0v470");
	})		
	d3.selectAll(".record").selectAll("*").on("mouseout",function() {
		d3.select("#haxis").transition().style("opacity",0);
		d3.select("#vaxis").transition().style("opacity",0);
	})
}

// GENERATING STORIES FROM THE MURDERS

function stories(query) {

}
function storiesHL(query) {}
function clear() {}
function storify(selection,incident) {
	var debug=
	//true
	false
	;

	myAgency=agencies[incident.agency];
	myVictims=incident.victims;
	myOffensders=incident.offenders;
	state=myAgency.state;
	block=selection.append("div").classed("story",1);
	if(debug){console.log("writing header");}
	header=block.append("p").classed("header",1);
	header.append("span").html(state).classed("state",1).on("click",stories({state:state})).on("mouseover",storiesHL({state:state})).on("mouseout",clear)
	header.append("span").html("&nbsp;")
	header.append("span").html(myAgency.name).classed("agency",1).on("click",stories({agency:myAgency.agency})).on("mouseover",storiesHL({agency:myAgency.agency})).on("mouseout",clear)
	header.append("span").html("&nbsp;")
	header.append("span").html(mName[incident.month-1]).classed("agency",1).on("click",stories({month:incident.month})).on("mouseover",storiesHL({month:incident.month})).on("mouseout",clear)
	header.append("span").html("&nbsp;")
	

	story=block.append("p");
	story.append("span").html("On ");
	story.append("span").html(writedate(incident.exactDate)).classed("date",1).on("cick",stories({date:incident.exactDate})).on("mouseover",storiesHL({date:incident.exactDate})).on("mouseout",clear);
	if(incident.approxDate) {
		story.append("span").html(" (approximately), ")}
	else {
		story.append("span").html(", ");
	}
	if(debug){console.log("writing date");}

	
	if (incident.nbVictims==1) 
	{	
		storifyVictim(story,incident.victims[0])
		story.append("span").html(" was shot. ")
		if(debug){console.log("1 victim.");}

	}
	else {
		if(debug){console.log("Several victims");}
		story.append("span").html(incident.nbVictims+" people").classed("nbVictims",1).on("click",stories({nbVictims:incident.nbVictims})).on("mouseover",storiesHL({nbVictims:incident.nbVictims})).on("mouseout",clear);
		story.append("span").html(" were shot: ")
		incident.victims.forEach(function(v,i) {
			var last=(i==incident.nbVictims-1)
			if(last) {
				story.append("span").html(" and ")
			}
			storifyVictim(story,v)
			story.append("span").html(last?". ":", ")
		})
	}

	if(incident.nbOffenders==1) {
		{	
			if(debug){console.log("1 offender.");}
			myOffender=incident.offenders[0];
			if(myOffender["age"]==0&&myOffender["sex"]=="U") {
				if(debug){console.log("Killer unknown");}
				story.append("span").html(" We know nothing of the killer. ")
			} else {
				if(relationships[myOffender["elationship"]].type=="4") {
					if(debug){console.log("Relationship with single killer unknown.");}
					story.append("span").html("We don't know if the killer knew the victim.").classed("relations",1)
						.on("click",stories({reltype:4}))
						.on("mouseover",storiesHL({reltype:4}))
						.on("mouseout",clear)
				} else {
					if(debug){console.log("Relationship with single killer known.");}
					story.append("span").html("The killer is ")
					storifyKillerAS(story,myOffender)
					story.append("span").html(". "+(myOffender["sex"]=="F"?"She was ":"He was "))
					storifyKillerR(story,myOffender)
					story.append("span").html(". ")
				}
			}
		}
	} else {
		if(debug){console.log("Several killers.");}
		story.append("span").html("There were "+incident.nbOffenders+" killers: ").classed("nbOffenders",1)
			.on("click",stories({nbOffenders:incident.nbOffenders}))
			.on("mouseover",storiesHL({nbOffenders:incident.nbOffenders}))
			.on("mouseout",clear)

		unknownKillers=incident.offenders.filter(
			function(d) {
				return (
					(d["age"]==0)&&
					(d["sex"]=="U")
				);})
		knownKillers=incident.offenders.filter(function(d) {return !((d["age"]==0)&&(d["sex"]=="U"));})
		var uk=unknownKillers.length,kk=knownKillers.length;
		if (unknownKillers.length==incident.nbOffenders) {
			if(debug){console.log("All killers unknown.");}
			story.append("span").html(", but that's all we know. ")
		} else {
			if(debug){console.log("Some killers are known.");}
			if (kk.length==1) { // since there are several killers, there must be at least an unknown killer.
				if(debug){console.log("One killer in known, the others are unknown");}
				storifyKillerAS(story,knownKillers[0])
				story.append("span").html(" and "+uk+" other person"+(uk==1)?". ":"s. ")
			} else { 
				if(uk) { // there are other unknown killers
					if(debug){console.log("There are several known killers and at least one unknown killer.");}
					knownKillers.forEach(function(k,i) {
						var last=(i==kk-1)
						storifyKillerAS(story,k)
						story.append("span").html(last?" ":", ")
					})
					story.append("span").html("and "+uk+" other person"+(uk==1?". ":"s. "))
				} else {
					if(debug){console.log("All killers are known.");}
					knownKillers.forEach(function(k,i) {
						var last=(i==kk-1)
						if(last){story.append("span").html(" and ")}
						storifyKillerAS(story,k)
						story.append("span").html(last?". ":", ")
					})				
				}
			}
		}
		var myKillers=incident.offenders.slice(0);
		myKillers.sort(function(a,b) {return relationships[a["relationship"]].type-relationships[a["relationship"]].type;})
		var mainKiller=myKillers[0]; // the best-known killer to the victim
		var rt=relationships[mainKiller["relationship"]].type;
		if(rt==4) {
					if(debug){console.log("No relationship known with any of the killers.");}
					story.append("span").html("We don't know if the victim knew any of the killers. ").classed("relations",1)
						.on("click",stories({reltype:4}))
						.on("mouseover",storiesHL({reltype:4}))
						.on("mouseout",clear)
					}
		if(rt==3) {	if(debug){console.log("No relationship with any of the killers.");}
						story.append("span").html("The victim didn't know any of the killers. ").classed("relations",1)
						.on("click",stories({reltype:3}))
						.on("mouseover",storiesHL({reltype:3}))
						.on("mouseout",clear)
					}	
		if(rt<2) {
			if(debug){console.log("Relationship known with any of the killers. ");}
			story.append("span").html("One of the killers was ");
			storifyKillerR(story,mainKiller)
		}
	}
}

function storifyVictim(selection,myVictim) {
	var sex=myVictim["sex"];
	var age=myVictim["age"];

	if(age=="NB"||age=="BB") {
		selection.append("span").html("a ")
		selection.append("span").html("baby").classed("age",1).on("click",stories({vage:"baby"}))
		if(sex=="M") {
			selection.append("span").html(" ")
			selection.append("span").html("boy").classed("sex",1).on("click",stories({vsex:"M"}))
		} 
		if(sex=="F") {
			selection.append("span").html(" ")
			selection.append("span").html("girl").classed("sex",1).on("click",stories({vsex:"F"}))
		}
	}
	if(age&&age<13) {
		selection.append("span").html("a ")
		selection.append("span").html(age+"-years-old").classed("age",1).on("click",stories({vage:"kid"}))
		if(sex=="M") {
			selection.append("span").html(" ")
			selection.append("span").html("boy").classed("sex",1).on("click",stories({vsex:"M"}))
		} 
		if(sex=="F") {
			selection.append("span").html(" ")
			selection.append("span").html("girl").classed("sex",1).on("click",stories({vsex:"F"}))
		}
	}
	if(age&&age>12&&age<19) {
		selection.append("span").html("a ")
		selection.append("span").html(age+"-years-old").classed("age",1).on("click",stories({vage:"teenager"}))
		if(sex=="M") {
			selection.append("span").html(" ")
			selection.append("span").html("boy").classed("sex",1).on("click",stories({vsex:"M"}))
		} 
		if(sex=="F") {
			selection.append("span").html(" ")
			selection.append("span").html("girl").classed("sex",1).on("click",stories({vsex:"F"}))
		}
	}
	if(age&&age>18&&age<25) {
		selection.append("span").html("a ")
		selection.append("span").html(age+"-years-old").classed("age",1).on("click",stories({vage:"young"}))
		if(sex=="M") {
			selection.append("span").html(" ")
			selection.append("span").html("man").classed("sex",1).on("click",stories({vsex:"M"}))
		} 
		if(sex=="F") {
			selection.append("span").html(" ")
			selection.append("span").html("woman").classed("sex",1).on("click",stories({vsex:"F"}))
		}
	}
	if(age&&age>24&&age<65) {
		selection.append("span").html("a ")
		selection.append("span").html(age+"-years-old").classed("age",1).on("click",stories({vage:"adult"}))
		if(sex=="M") {
			selection.append("span").html(" ")
			selection.append("span").html("man").classed("sex",1).on("click",stories({vsex:"M"}))
		} 
		if(sex=="F") {
			selection.append("span").html(" ")
			selection.append("span").html("woman").classed("sex",1).on("click",stories({vsex:"F"}))
		}
	}
	if(age&&age>65) {
		selection.append("span").html("a ")
		selection.append("span").html(age+"-years-old").classed("age",1).on("click",stories({vage:"old"}))
		if(sex=="M") {
			selection.append("span").html(" ")
			selection.append("span").html("man").classed("sex",1).on("click",stories({vsex:"M"}))
		} 
		if(sex=="F") {
			selection.append("span").html(" ")
			selection.append("span").html("woman").classed("sex",1).on("click",stories({vsex:"F"}))
		}
	}
	if(!age) {
		selection.append("span").html("a ")
		if(sex=="M") {
			selection.append("span").html(" ")
			selection.append("span").html("man").classed("sex",1).on("click",stories({vsex:"M"}))
		} 
		if(sex=="F") {
			selection.append("span").html(" ")
			selection.append("span").html("woman").classed("sex",1).on("click",stories({vsex:"F"}))
		}
		if(sex=="U") {
			selection.append("span").html(" ")
			selection.append("span").html("person").classed("sex",1).on("click",stories({vsex:"U"}))
		} 	
	}
}

function storifyKillerAS(selection,myKiller) {
	var sex=myKiller["sex"];
	var age=myKiller["age"];

	if(age=="NB"||age=="BB") {
		selection.append("span").html("a ")
		selection.append("span").html("baby").classed("age",1).on("click",stories({kage:"baby"}))
		if(sex=="M") {
			selection.append("span").html(" ")
			selection.append("span").html("boy").classed("sex",1).on("click",stories({ksex:"M"}))
		} 
		if(sex=="F") {
			selection.append("span").html(" ")
			selection.append("span").html("girl").classed("sex",1).on("click",stories({ksex:"F"}))
		}
	}
	if(age&&age<13) {
		selection.append("span").html("a ")
		selection.append("span").html(age+"-years-old").classed("age",1).on("click",stories({kage:"kid"}))
		if(sex=="M") {
			selection.append("span").html(" ")
			selection.append("span").html("boy").classed("sex",1).on("click",stories({ksex:"M"}))
		} 
		if(sex=="F") {
			selection.append("span").html(" ")
			selection.append("span").html("girl").classed("sex",1).on("click",stories({ksex:"F"}))
		}
	}
	if(age&&age>12&&age<19) {
		selection.append("span").html("a ")
		selection.append("span").html(age+"-years-old").classed("age",1).on("click",stories({kage:"teenager"}))
		if(sex=="M") {
			selection.append("span").html(" ")
			selection.append("span").html("boy").classed("sex",1).on("click",stories({ksex:"M"}))
		} 
		if(sex=="F") {
			selection.append("span").html(" ")
			selection.append("span").html("girl").classed("sex",1).on("click",stories({ksex:"F"}))
		}
	}
	if(age&&age>18&&age<25) {
		selection.append("span").html("a ")
		selection.append("span").html(age+"-years-old").classed("age",1).on("click",stories({kage:"young"}))
		if(sex=="M") {
			selection.append("span").html(" ")
			selection.append("span").html("man").classed("sex",1).on("click",stories({ksex:"M"}))
		} 
		if(sex=="F") {
			selection.append("span").html(" ")
			selection.append("span").html("woman").classed("sex",1).on("click",stories({ksex:"F"}))
		}
	}
	if(age&&age>24&&age<65) {
		selection.append("span").html("a ")
		selection.append("span").html(age+"-years-old").classed("age",1).on("click",stories({kage:"adult"}))
		if(sex=="M") {
			selection.append("span").html(" ")
			selection.append("span").html("man").classed("sex",1).on("click",stories({ksex:"M"}))
		} 
		if(sex=="F") {
			selection.append("span").html(" ")
			selection.append("span").html("woman").classed("sex",1).on("click",stories({ksex:"F"}))
		}
	}
	if(age&&age>65) {
		selection.append("span").html("a ")
		selection.append("span").html(age+"-years-old").classed("age",1).on("click",stories({kage:"old"}))
		if(sex=="M") {
			selection.append("span").html(" ")
			selection.append("span").html("man").classed("sex",1).on("click",stories({ksex:"M"}))
		} 
		if(sex=="F") {
			selection.append("span").html(" ")
			selection.append("span").html("woman").classed("sex",1).on("click",stories({ksex:"F"}))
		}
	}
	if(!age) {
		selection.append("span").html("a ")
		if(sex=="M") {
			selection.append("span").html(" ")
			selection.append("span").html("man").classed("sex",1).on("click",stories({ksex:"M"}))
		} 
		if(sex=="F") {
			selection.append("span").html(" ")
			selection.append("span").html("woman").classed("sex",1).on("click",stories({ksex:"F"}))
		}
		if(sex=="U") {
			selection.append("span").html(" ")
			selection.append("span").html("person").classed("sex",1).on("click",stories({ksex:"U"}))
		} 	
	}
}

function storifyKillerR(selection,myKiller) {
	var rel=relationships[myOffender["relationship"]];
	var type=rel.type;
	if (type==3) {
		selection.append("span").html("unknown to the victim").classed("relations",1)
			.on("click",stories({reltype:3}))
			.on("mouseover",storiesHL({reltype:3}))
			.on("mouseout",clear)
	}
	if (type==1) {
		selection.append("span").html("well known to the victim").classed("relations",1)
			.on("click",stories({reltype:1}))
			.on("mouseover",storiesHL({reltype:1}))
			.on("mouseout",clear)
		selection.append("span").html(" (")
		selection.append("span").html(rel.phrase).classed("relation",1)
			.on("click",stories({relation:rel.phrase}))
			.on("mouseover",storiesHL({relation:rel.phrase}))
			.on("mouseout",clear)
		selection.append("span").html(")")		
	}
	if (type==2) {
		selection.append("span").html("known to the victim").classed("relations",1)
			.on("click",stories({reltype:2}))
			.on("mouseover",storiesHL({reltype:2}))
			.on("mouseout",clear)
		selection.append("span").html(" (")
		selection.append("span").html(rel.phrase).classed("relation",1)
			.on("click",stories({relation:rel.phrase}))
			.on("mouseover",storiesHL({relation:rel.phrase}))
			.on("mouseout",clear)
		selection.append("span").html(")")		
	}
}