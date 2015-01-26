var width = 960,
    height = 850;

var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);

var defs=svg.append("defs");
var vis=svg
    .append("g")//.attr("transform","translate("+thVis+","+tvVis+")");

//vis.append("rect").style("fill","white").attr({x:-width/2,y:-height/2,width:width,height:height}).on("click",function() {teamHighlighted=-1;charHighlighted=-1;draw(i,true);}).on("mouseover",hideModal)

var i=0;

var slider=d3.select("#slider");

var play=function() {};

var incidents=[],weapons={},victims=[],offenders=[],relationships={},agencies={},circumstances={};

function agencies() {d3.csv("agencies.csv",function(csv) {
	agencies=d3.nest().key(function(d) {return d.agency;}).map(csv);
	console.log(csv.length+" agencies loaded.")
	weapons();
})}

function weapons() {d3.csv("weapons.csv",function(csv) {
	weapons=d3.nest().key(function(d) {return d.weapon;}).map(csv);
	console.log(csv.length+" weapons loaded.")
	circumstances();
})}

function circumstances() {d3.csv("circumstances.csv",function(csv) {
	circumstances=d3.nest().key(function(d) {return d.circumstance;}).map(csv);
	console.log(csv.length+" circumstances loaded.")
	relationships();
})}

function relationships() {d3.csv("relationships.csv",function(csv) {
	relationships=d3.nest().key(function(d) {return d.code;}).map(csv);
	console.log(csv.length+" relationships loaded.")
	incidents();
})}

function incidents() {d3.csv("incidents.csv", function (csv) {
	incidents=csv;
	console.log(csv.length+" incidents loaded.")
	victims();
}}

function victims() {d3.csv("victims.csv", function (csv) {
	victims=csv;
	console.log(csv.length+" victims loaded.")
	offenders();
}}

function offenders() {d3.csv("offenders.csv", function (csv) {
	offenders=csv;
	console.log(csv.length+" incidents loaded.")
	main();
}}

function main() {
	console.log("data loaded.")
}
/*
d3.csv("teams.csv", function (teams) {
	tms=teams;
	teamHash={};
	groupHash={};
	teams.forEach(function(d) {
		teamHash[d.team]=+d.id;
		groupHash[d.team]=+d.gh;
	})
	d3.csv("chapters.csv",function(chapters) {
		console.log("chapters loaded");
		chp=chapters;
		d3.csv("characters.csv",function(characters) {
			console.log("characters loaded");

			chr=characters;
			charHash={}; // maps the characterID of a character (which corresponds to the source data file, and therefore is not a continuous, 
						 // sequential list of integers) into the position of the character in the characters array

			characters.forEach(function(d) {
				charHash[+d.characterID]=d;
			})

			d3.csv("events.csv",function(events) {
				console.log("events loaded");
				eve1=events;
				eve=d3.nest().key(function(d) {return d.chapterID;}).entries(events);
				var timer;
				var ticked=0;

				d3.select("#slider").on("change",function() {clearInterval(timer);i=this.value;update(i);})
				d3.select("#stop").on("click",function() {
					if (running) {
						stop();
					} else {
						start();
					}
				})

				play=function() {
					if(i===maxStep&&!running){i=-1;stop();}
					if(i<maxStep){i++;running=1;
					d3.select("#stop").html("Pause&nbsp;<i class='icon-pause icon-white'>").on("click",stop);
					slider.property("value",i);
					update(i);} else {stop();}	
				}

				start=function() {
					timer=setInterval("play()", 250);
				}

				stop=function () {
					clearInterval(timer);
					running=0;
					d3.select("#stop").html("Play&nbsp;<i class='icon-play icon-white'>").on("click",start);
				}

				init();
				
				function init() {
					interface();
					draw(maxStep,true);
					//update(i)
				}

				function interface() {
				}

				function calculate() {
					//var 
				}
				function update(i) {
					draw(i);
				}
			})
		})
	})
})
// our helper functions

function draw(i,mode) {//console.log(i);
	}


}

function drawCharTimeline() {}
function drawModal(d,j) {
	console.log(d,j);
	d3.select("#infobox")
	.html("<h6>"+
		books[chp[d.time].bookID].title+
		" - "+
		chp[d.time].title+"</h6><hr><strong>"+times[i].characters[d.index].name+"</strong>"+d.story+" <strong>"+(d.details?d.details:"")+"</strong>");
	d3.select("#infobox")
	.style({display:"block",top:null,width:"200px"})
	.transition()
	.style({left:(intL+(d.time/maxStep)*5*bSize+5)+"px",bottom:170+j*10+"px"})
	}
function drawCharModal(d,j) {
//	console.log(d,d.x,d.r,d.y);
	var x=d.x+thVis,y=d.y+tvVis;
	d3.select("#infobox").html("<h6>"+d.name+"</h6><hr><em>Click for details</em>")
	.style({display:"block",bottom:null,width:"120px"})
	.transition()
	.style({left:(x+d.r+5)+"px",top:(y-d.r-13+50)+"px"})
}
function drawMentionedModal(d) {
	var cTimeScale=d3.scale.linear().domain([0,maxStep]).range([5,5*bSize-5]);
	var x=cTimeScale(d.time)+intL+5;
	d3.select("#infobox").html("<h6>"+
		books[chp[d.time].bookID].title+
		" - "+
		chp[d.time].title+"</h6><hr>Mentioned in this chapter")
	.style({display:"block",width:"200px",top:null}).
	transition().style({left:x+"px",bottom:"160px"})
}
function drawGroupModal(d,j) {
	var x=340*Math.cos(d.pos)+thVis+5;
	var y=340*Math.sin(d.pos)+tvVis-20+50;

	text=[
		["These characters seek to gain more power and sometimes to rule the Kingdom."],
		["The many followers and courtesans of Queen Cersei. Main ennemies of the Starks during the books."],
		["Pirates, monsters or outlaws, these groups will fight anyone and everyone."],
		["The main protagonists of the books and their allies."],
		["These do not seek more power, and only fight to defend themselves or others."]
	][j];
	d3.select("#infobox").html("<h6>"+d.name+"</h6><hr>"+text+"<br><em>Click on a circle for more details</em>")
	.style({display:"block",bottom:null,width:"200px"})
	.transition()
	.style({left:x+"px",top:y+"px"})	
}

function hideModal() {
	d3.select("#infobox").style("display","none");
}*/