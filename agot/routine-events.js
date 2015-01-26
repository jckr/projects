var width = 960,
    height = 850;

var maxStep=72,running=0;
var color = d3.scale.category20();
var teamHighlighted=-1, charHighlighted=-1;
var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);
var myId,myTime;

var bSize=140,intL=920-5*(bSize);
var thVis=480,tvVis=340;
var wIC=[
"#ddddf8","#c6c6de","#a4a4b8","#6b6b78","#333339"];

var colors={
	"kill":wIC[4],
	"dies":wIC[4],
	"changes":wIC[0],
	"healed":wIC[1],
	"alive":wIC[1],
	"hurt":wIC[3],
	"captured":wIC[2],
	"named":wIC[0],
	"lost title":wIC[3],
}

var rank={
"Captain ":1,
"Grand Maester ":2,
"High Septon ":2,
"Khal ":3,
"Khaleesi ":3,
"King ":3,
"Lady ":1,
"Lord ":2,
"Lord Commander ":2,
"Maester ":1,
"Prince ":2,
"Princess ":2,
"Queen ":3,
"Septa ":1,
"Septon ":1,
"Ser ":1}

var groups=["Opportunists","Lannisters","Antagonists","Starks","Neutral"];

var defs=svg.append("defs");
var pattern=defs.append("pattern").attr({id:"captured",x:0,y:0,width:3,height:3, patternUnits:"userSpaceOnUse"})
	pattern.append("rect").attr({width:5,height:5}).style({fill:wIC[2]});
	//pattern.append("rect").attr({width:5,height:5}).style({stroke:"none",fill:"#ccc"})
	//pattern.append("path").attr("d","M0,0v3").style({stroke:"white",fill:"none"})

	pattern=defs.append("pattern").attr({id:"hurt",x:0,y:0,width:3,height:3, patternUnits:"userSpaceOnUse"})
	pattern.append("rect").attr({width:5,height:5}).style({fill:wIC[3]});
	
	//pattern.append("rect").attr({width:5,height:5}).style({stroke:"none",fill:"#ccc"})
	//pattern.append("path").attr("d","M0,0h3").style({stroke:"white",fill:"none"})

	pattern=defs.append("pattern").attr({id:"hurtcaptured",x:0,y:0,width:3,height:3, patternUnits:"userSpaceOnUse"})
	pattern.append("rect").attr({width:5,height:5}).style({fill:wIC[3]});
	
	//pattern.append("rect").attr({width:5,height:5}).style({stroke:"none",fill:"#ccc"})
	//pattern.append("path").attr("d","M0,0h3v3").style({stroke:"white",fill:"none"})

defs.append("path").attr({id:"gUp",d:"M-335,0 A335,335 0 0,1 335,0"});	// to write on circles.
defs.append("path").attr({id:"gDown",d:"M-345,0 A345,345 0 0,0 345,0"}); 
// in SVG it's not possible to write on a circle, but it is to write on an arc.
// here I am using 2 circles, else part of the writing would be upside down.

var vis=svg
    .append("g").attr("transform","translate("+thVis+","+tvVis+")");

vis.append("rect").style("fill","white").attr({x:-width/2,y:-height/2,width:width,height:height}).on("click",function() {teamHighlighted=-1;charHighlighted=-1;draw(i,true);}).on("mouseover",hideModal)

var i=72;

var times=[],		// all events of one chapter;
	charTimes=[],	// all events related to one character over time; 
	charMentions=[]; // let's not filter at each iteration m'kay?
var slider=d3.select("#slider");

var r=200;
var play=function() {};
var rScale=d3.scale.sqrt();



var chp,chr,eve,eve1,tms,charHash, teamHash,groupHash, teamCircle, teamShown, charShown, totalChars,totalMentions,teamUpdates;

var books=[
{title:"A Game of Thrones",color:"#3E6668",first:0,last:72},
{title:"A Clash of Kings",color:"#B09A63",first:73,last:142},
{title:"A Storm of Swords",color:"#4F7841",first:143,last:224},
{title:"A Feast for Crows",color:"#CC666B",first:225,last:270},
{title:"A Dance with Dragons",color:"#D1D2D4",first:271,last:343}];

var bookSelected=0;

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

				//var 
				totalMentions=0;
				//var 
				totalChars=0;
				var totalTeams=0;
				var maxMentions=1;
				var maxTMentions=1;
				var charCircle=[];
				//var
				teamCircle=[];
				//var 
				charShown={};
				//var 
				teamShown={};
				init();
				
				function init() {
					svg.append("text").attr({x:20,y:20,id:"chapter"}).style("font-weight","bold");
					svg.append("text").attr({x:20,y:40,id:"POV"}).style("font-style","italic");
					vis.append("circle").attr({r:r,id:"large"}).style({"fill":"none","stroke":"black"});
					vis.append("g").attr("id","groups");
					vis.append("g").attr("id","teams");
					vis.append("g").attr("id","eventDisks");
					vis.append("g").attr("id","characters");
					vis.append("g").attr("id","eventTexts")
					vis.append("g").attr("id","links");
					vis.append("g").attr("id","legend").attr("transform","translate("+(755-thVis)+","+(550-tvVis)+")");
					calculate();
					console.log("positions calculated.")
					//start(i);
					interface();
					draw(maxStep,true);
					//update(i)
				}

				function interface() {
					var myInt=svg.append("g").attr({id:"interface",transform:"translate(0,665)"});
					myInt
					.append("text")
					.attr({x:20,y:180})
					.text("Restrict to these books:")
					.style({"font-weight":"normal","font-family":"Open Sans"});
					//myInt.append("text").attr({x:20,y:165}).text("Spoiler alert").style({"font-style":"italic","font-family":"Open Sans"});
					var bookButtons=myInt.selectAll(".bookButton").data(books).enter().append("g").classed("bookButton",1).attr("transform",function(d,i) {return "translate("+(intL+bSize*i)+",163)";})
					bookButtons.append("path")
						.style({
							fill:function(d) {return d.color;},
							stroke:function(d) {return "white"},
							"fill-opacity":function(d,i) {return (i<=bookSelected)?1:0.1;}
						})
					.attr("d",function(d,i) {
						if(i==0){
							return "M0,5 Q0,0 5,0 h "+(bSize-5)+"l10,10l-10,10h-"+(bSize-5)+"Q0,20 0,15  Z";
						}
						if(i<4){
							return "M0,0h"+bSize+"l10,10l-10,10h-"+bSize+"l10,-10Z";
						}
						return "M0,0h"+(bSize-5)+"Q"+bSize+",0 "+bSize+",5 v10 Q"+bSize+",20 "+(bSize-5)+",20h-"+(bSize-5)+"l10,-10Z";
					})
					//.attr({width:140,height:20,rx:5,ry:5})

					var timelineBooks=myInt.selectAll(".timelineBooks").data(books).enter().append("rect").classed("timelineBooks",1)
						.attr({
							x:function(d,i) {return (i>bookSelected)?922:(intL+(d.first/maxStep)*(5*bSize)+2)},
							width:function(d,i) {var val=0;
								if(i>bookSelected) {return val;}
								val=5*bSize*(d.last-d.first)/maxStep;
								if(i>0) {val=val-2;}
								if(i<bookSelected) {val=val-2;}
								return val;},
							y:140,
							height:2
						}).style("fill",function(d) {return d.color;})
					bookButtons.append("text").text(function(d) {return d.title;}).attr("y",14).attr("x",15).style("font-size","10px");
					bookButtons.on("click",function(d,j) {
						stop();
						bookSelected=j;
						maxStep=books[j].last;
						d3.select("#slider").property("max",maxStep);
						if(i>maxStep) {i=maxStep;}
						draw(i,true);
						d3.selectAll(".bookButton").select("path").transition().style("fill-opacity",function(d,i) {return (i<=bookSelected)?1:0.1;})
						d3.selectAll(".timelineBooks").transition().attr({
							x:function(d,i) {return (i>bookSelected)?922:(intL+(d.first/maxStep)*5*bSize+2)},
							width:function(d,i) {var val=0;
								if(i>bookSelected) {return val;}
								val=720*(d.last-d.first)/maxStep;
								if(i>0) {val=val-2;}
								if(i<bookSelected) {val=val-2;}
								return val;}	,						y:140,
							height:2
						})
					})
					var charBlock=myInt.append("g").attr({"id":"charBlock"}).attr("transform","translate(0,50)");
					charBlock.append("rect").attr({id:"emptyCharInt",width:5*bSize,height:75,x:intL,y:-30,rx:5,ry:5}).style({fill:"#eee",stroke:"#ddd"});
					charBlock.append("text").attr({id:"clickme",x:562,y:10,"text-anchor":"middle"}).text("Click a circle above for information about a character").style({"font-style":"italic","font-family":"Open Sans"})
					charInt=charBlock.append("g").attr("id","charInt");
					var charFullName=charInt.append("text").attr({x:20,y:5});
					charFullName.append("tspan").attr("id","charPrefix").style({"font-style":"italic","font-size":"14px"})
					charFullName.append("tspan").attr("id","charName").style({"font-weight":"normal","font-size":"14px"})
					var charFullTeam=charInt.append("text").attr({x:20,y:-15}).style({"font-style":"normal","font-size":"12px"})
					charFullTeam=charFullTeam.append("tspan").text("Team ");
					charFullTeam=charFullTeam.append("tspan").attr("id","charTeam").style("font-weight","bold");
					
					charInt.append("text").attr({id:"charTitle",x:20,y:20}).style({"font-weight":"normal","font-size":"12px"})
					charInt.append("text").attr({id:"charStatus",x:20,y:35}).style({"font-family":"Open Sans","font-size":"12px"})
					
					charInt.append("g").attr({id:"charTimeLine",transform:"translate("+intL+",20)"}).append("path").attr("d","M5,3v-3h"+(5*bSize-10)+"v3").style({"stroke":"#ccc","fill":"none"});

					myInt.append("text").text("Character details:").style({"font-family":"Open Sans","font-weight":"bold"}).attr({x:20,y:12,id:"cd"});
					myInt.append("text").text("Time control:").style({"font-family":"Open Sans","font-weight":"bold"}).attr("id","cd").attr({id:"tc",x:20,y:110});


					// legend

					var legend=d3.select("#legend").style({"font-family":"Open Sans","font-size":"10px"});
					legend.append("rect").attr({x:30,y:-20,width:136,height:145,rx:5,ry:5})
					//.style({fill:"#eee",stroke:"#ddd"})
					.style({"stroke":"#eee","fill":"none"})
					.attr("id","legRect");
					var line1=legend.append("g");
					line1.selectAll("circle").data([3,5,7,10,15]).enter().append("circle")
						.attr({cx:function(d,i) {return 38+27*i},cy:function(d) {return 20-d;},r:String}).style({stroke:"black",fill:wIC[3]});
					line1.append("text").attr({y:30,x:35}).text("Rarely");
					line1.append("text").attr("y",30).attr("x",161).attr("text-anchor","end").text("Often");
					line1.append("text").text("Appears:").attr("x",35).style("font-weight","bold");

					line2=legend.append("g").attr("transform","translate(0,50)");
					line2.selectAll("circle").data(d3.range(5)).enter().append("circle")
						.attr({cx:function(d,i) {return 45+27*i},cy:10,r:10}).style({stroke:"black",fill:function(d) {return wIC[d];}})
					line2.append("text").text("Fit").attr({x:35,y:30});
					line2.append("text").text("Dead").attr({x:161,y:30,"text-anchor":"end"});
					line2.append("text").text("Status:").attr({x:35,y:-3}).style("font-weight","bold");

					line3=legend.append("g").attr("transform","translate(0,90)")
					line3.append("circle").attr({cx:45,cy:10,r:10}).style({stroke:"black",fill:wIC[0]})
					line3.append("circle").attr({cx:151,cy:10,r:10}).style({stroke:"black",fill:wIC[4]})
					line3.append("path").attr("d","M45,10 Q 128,-10 151,10").style({stroke:"#ccc",fill:"none"});
					line3.append("text").text("Each link is a kill.").attr({x:94,y:30,"text-anchor":"middle"});
					
					

				}

				function calculate() {
					//var 
					myTime={teams:teams.slice(0),groups:groups.slice(0),characters:[],charHash:{},info:{totalMentions:0,maxMentions:0,totalChars:0,totalTeams:0},links:[],events:[]};
					myTime.teams.forEach(function(d) {d.chars={};})
					var charShown={},teamShown={};
					eve.forEach(function(d,i) {		// we will loop one per chapter
						var myEvents=eve[i].values; // all events in this chapter
						teamUpdates=[]; 			// the teams for which we'll re-compute the character positions
						var recentEvents=[];
						var myChapter=d;
						myEvents.forEach(function(e,i) {
						//console.log(e);
							var id=+e.characterID;
							//console.log(id);
							var t=charHash[id].Team,c=+e.chapterID,w=+e.withID;
							//console.log(i,t,c,w);
							myTime.info.chapter=chapters[i].title;
							myTime.info.pov=charHash[chapters[i].povID].Name;

							if(e.event==="mentioned") {
								// if a character is also killed, captured, hurt, or if they die or change title, they will also be mentioned.
								myTime.info.totalMentions=myTime.info.totalMentions+1;
								if (id in charShown) { // character has been seen in a previous chapter
									var m=charShown[id].mentions=charShown[id].mentions+1;
									if(m>myTime.info.maxMentions) {
										myTime.info.maxMentions=m;
									}
									charShown[id].chapters.push(c);
									charTimes[myTime.charHash[id]].mentions.push({time:c});
									if(teamUpdates.indexOf(teamHash[t])==-1) {teamUpdates.push(teamHash[t])}; 
								} else {
									myTime.characters.push({id:+id,name:charHash[id].Name,team:charHash[id].Team,title:charHash[id].title,prefix:charHash[id].prefix,isDead:+charHash[id].isDead,isCaptured:+charHash[id].isCaptured,isHurt:+charHash[id].isHurt});
									myTime.charHash[id]=myTime.info.totalChars; // in order to retrieve the character node corrsponding to a certain id. 
																				// ex. Robb Stark (1431) -> times[x].charHash["1431"]
									charTimes.push({id:+id,
										name:charHash[id].Name,
										initialStatus:{team:charHash[id].Team,isDead:+charHash[id].isDead,isCaptured:+charHash[id].isCaptured,isHurt:+charHash[id].isHurt},
										mentions:[{time:c}],
										events:[],
										kills:[{time:c,bodycount:0}],
										bodycount:0
									});

									myTime.info.totalChars=myTime.info.totalChars+1;
									charShown[id]={mentions:1,chapters:[c]};
									myTime.teams[teamHash[t]].chars[id]=true;
								}
							}
							if(e.event==="killed") {
								myTime.characters[myTime.charHash[id]].isDead=1;
								charShown[id].isDead=1;
								if(e.withID!=="") {
									myTime.links.push({killer:e.withID,victim:id,chapter:c});
									myTime.events.push({text:myTime.characters[myTime.charHash[id]].name+" killed by "+myTime.characters[myTime.charHash[e.withID]].name,type:"killed"})
									charTimes[myTime.charHash[id]].events.push({index:myTime.charHash[id],time:c,type:"killed",details:myTime.characters[myTime.charHash[e.withID]].name,story:" is killed by "});
									charTimes[myTime.charHash[e.withID]].events.push({index:myTime.charHash[e.withID],time:c,type:"kills",details:myTime.characters[myTime.charHash[id]].name,story:" kills "});
									charTimes[myTime.charHash[e.withID]].bodycount=charTimes[myTime.charHash[e.withID]].bodycount+1;
									charTimes[myTime.charHash[e.withID]].kills.push({index:myTime.charHash[e.withID],time:c,bodycount:charTimes[myTime.charHash[e.withID]].bodycount})
									recentEvents.push({type:"kill",text:"killed by"+myTime.characters[myTime.charHash[e.withID]].name,id:myTime.charHash[id],withID:myTime.charHash[e.withID],details:e.details});

								} else {
									myTime.events.push({text:myTime.characters[myTime.charHash[id]].name+" killed.",type:"killed",time:c})
									charTimes[myTime.charHash[id]].events.push({index:myTime.charHash[id],time:c,type:"killed",story:" is killed."});
									recentEvents.push({type:"kill",text:"is killed.",id:myTime.charHash[id],withID:myTime.charHash[e.withID],details:e.details});
								}

							}
							if(e.event==="dies") {
								myTime.characters[myTime.charHash[id]].isDead=1;
								charShown[id].isDead=1;
								myTime.events.push({text:myTime.characters[myTime.charHash[id]].name+" dies.",type:"killed",time:c})
								charTimes[myTime.charHash[id]].events.push({index:myTime.charHash[id],time:c,type:"dies",story:" dies."});
								recentEvents.push({type:"death",text:"dies",id:myTime.charHash[id],details:e.details});

							}
							if(e.event==="captured") {
								myTime.characters[myTime.charHash[id]].isCaptured=1;
								charShown[id].isCaptured=1;
								myTime.events.push({text:myTime.characters[myTime.charHash[id]].name+" is captured.",type:"captured",time:c})
								charTimes[myTime.charHash[id]].events.push({index:myTime.charHash[id],time:c,type:"captured",details:e.team,story:" is captured by "});
								recentEvents.push({type:"capture",text:"captured by"+e.team,id:myTime.charHash[id],withID:myTime.charHash[e.withID],team:e.team,details:e.details});
								
							}
							if(e.event==="hurt") {
								myTime.characters[myTime.charHash[id]].isHurt=1;
								charShown[id].isHurt=1;
								myTime.events.push({text:myTime.characters[myTime.charHash[id]].name+" is hurt.",type:"hurt",time:c})
								if(e.withID&&!isNaN(e.withID)) {
									charTimes[myTime.charHash[id]].events.push({index:myTime.charHash[id],time:c,type:"hurt",story:" is hurt by ",details:myTime.characters[myTime.charHash[+e.withID]].name})
									recentEvents.push({type:"hurt",text:"hurt by "+myTime.characters[myTime.charHash[+e.withID]].name,id:myTime.charHash[id],withID:myTime.charHash[e.withID],team:e.team,details:e.details});
								} else {
									charTimes[myTime.charHash[id]].events.push({index:myTime.charHash[id],time:c,type:"hurt",story:" is hurt."})
								}
							}
							if(e.event==="healed") {
								myTime.characters[myTime.charHash[id]].isHurt=0;
								charShown[id].isHurt=0;
								myTime.events.push({text:myTime.characters[myTime.charHash[id]].name+" is healed.",type:"ok",time:c})

								if(e.withID&&!isNaN(e.withID)) {
									//console.log(myTime.characters[myTime.charHash[e.withID]]);
									charTimes[myTime.charHash[id]].events.push({index:myTime.charHash[id],time:c,type:"healed",story:" is healed by ",details:myTime.characters[myTime.charHash[e.withID]].name})
									recentEvents.push({type:"healed",text:"healed by"+myTime.characters[myTime.charHash[e.withID]].name,id:myTime.charHash[id],withID:myTime.charHash[e.withID],details:e.details});
								} else {
									charTimes[myTime.charHash[id]].events.push({index:myTime.charHash[id],time:c,type:"healed",story:" is healed."})
									recentEvents.push({type:"healed",text:"healed",id:myTime.charHash[id],withID:myTime.charHash[e.withID],details:e.details});
								}
							}
							
							if(e.event==="named") {myId=myTime.charHash[id];
								if(e.title==="lost title") {
									 // why I have to do that is a mystery. 
										//console.log(myTime);
								//	console.log(e);
								//console.log(myTime,myTime.characters[myTime.charHash[id]]);
								
									//console.log(charTimes[myId].events);
									recentEvents.push({
										type:"lost title",
										text:"no longer "+myTime.characters[myId].title,
										id:myId,
										withID:myTime.charHash[e.withID],
										details:e.details,
										title:e.title
									});
									
									charTimes[myId].events.push({
										index:myTime.charHash[id],
										time:c,
										type:"lost title",
										details:myTime.characters[myId].title,
										story:" is no longer "
									});
									//console.log(myTime.characters[myId]);
									myTime.characters[myId]["title"]="";
									myTime.characters[myId]["prefix"]=e.prefix;
								} else {
									myTime.characters[myTime.charHash[id]].title=e.title;
									myTime.characters[myTime.charHash[id]].prefix=e.prefix;
									//console.log(e.title,myTime.characters[myTime.charHash[id]]);
									recentEvents.push({
										type:"named",
										text:"becomes "+myTime.characters[myId].title,
										id:myTime.charHash[id],
										withID:myTime.charHash[e.withID],
										details:e.details,
										title:e.title
									});
									charTimes[myId].events.push({
										index:myTime.charHash[id],
										time:c,
										type:"named",
										details:myTime.characters[myId].title,
										story:" becomes "
									});
									
								}
							}
							if(e.event==="alive"){
								myTime.characters[myTime.charHash[id]].isDead=0;
								charShown[id].isDead=0;
								myTime.events.push({text:myTime.characters[myTime.charHash[id]].name+" is alive.",type:"ok",time:c})
								charTimes[myTime.charHash[id]].events.push({index:myTime.charHash[id],time:c,type:"alive",story:" is alive."})
								recentEvents.push({type:"alive",text:"alive",id:myTime.charHash[id],withID:myTime.charHash[e.withID],details:e.details});
							}
							if(e.event==="freed"){
								myTime.characters[myTime.charHash[id]].isCaptured=0;
								charShown[id].isCaptured=0;
								myTime.events.push({text:myTime.characters[myTime.charHash[id]].name+" is freed.",type:"ok",time:c})
								charTimes[myTime.charHash[id]].events.push({index:myTime.charHash[id],time:c,type:"freed",story:" is free."})
								recentEvents.push({type:"freed",text:"free",id:myTime.charHash[id],withID:myTime.charHash[e.withID],details:e.details});

							}
							if(e.event==="changes allegiances") {

								var newt=e.team;
								var currentt=myTime.characters[myTime.charHash[id]].team;
								if(newt!=currentt){
								//	console.log(e);
									myTime.teams[teamHash[newt]].chars[id]=true;
									delete myTime.teams[teamHash[currentt]].chars[id];
									myTime.characters[myTime.charHash[id]].team=newt;
									if(e.title){myTime.characters[myTime.charHash[id]].title=e.title;}
									myTime.events.push({text:myTime.characters[myTime.charHash[id]].name+" changes teams ("+newt+")",type:"change",time:c})
									charTimes[myTime.charHash[id]].events.push({index:myTime.charHash[id],time:c,type:"changes teams",details:"",story:teams[teamHash[e.team]].joins})
									recentEvents.push({type:"changes",text:teams[teamHash[e.team]].joins,id:myTime.charHash[id],withID:myTime.charHash[e.withID],team:e.team,details:e.details});

								} else {
									// console.log(c,id,newt,myTime.characters[myTime.charHash[id]].team,e,"not taken into account.")
								}
							}
						})
				
						// now we populate a "pusher" object. 
						// what's the difference?
						// myTime is incremented each time and does not contain any position info.
						// pusher is reinitiated and contains position info.

	                    var pusher={
							teams:[],
							characters:[],
							info:{totalMentions:myTime.info.totalMentions,maxMentions:myTime.info.maxMentions,totalChars:myTime.info.totalChars
							//	,totalTeams:myTime.info.totalTeams
							},
							groups:[],
							links:[],
							events:[],
							recentEvents:[]
						};
						recentEvents.forEach(function(d) {
							pusher.recentEvents.push(d);})

						myTime.teams.forEach(function(d) {
							var chars=d3.keys(d.chars); 
							pusher.teams.push({chars:chars,team:d.team,collapsed:true,mentions:0});
						})
						myTime.groups.forEach(function(d) {pusher.groups.push({name:d,angle:0,pos:0,start:0,end:0});})
						
						myTime.characters.forEach(function(d) {
								pusher.characters.push({id:d.id,name:d.name,team:d.team,teamID:teamHash[d.team],isCaptured:d.isCaptured,isDead:d.isDead,isHurt:d.isHurt,title:d.title,prefix:d.prefix,mentions:charShown[d.id].mentions});

								pusher.teams[teamHash[d.team]].mentions=pusher.teams[teamHash[d.team]].mentions+charShown[d.id].mentions;
						})
						myTime.links.forEach(function(d) {pusher.links.push({killer:d.killer,victim:d.victim,chapter:d.chapter});})
						myTime.events.forEach(function(d) {pusher.events.push({text:d.text,type:d.type});})
						
						// now we'll recompute the relative importance of teams.
						
						// at this stage we can compute the size of each team and its position on the larger circle.
						var runningPos=Math.PI/2;
						var sumSqrt=d3.sum(pusher.teams,function(t) {return Math.sqrt(t.mentions);})
						pusher.teams.forEach(function(t) {
							//	t.angle=t.mentions*2*Math.PI/pusher.info.totalMentions;
							t.angle=Math.sqrt(t.mentions)*2*Math.PI/sumSqrt;//console.log(t.angle)
							t.pos=runningPos+t.angle/2;
							t.posx=posx(t);
							t.posy=posy(t);
							t.halfchord=halfchord(t);
							runningPos=runningPos+t.angle;
							pusher.groups[groupHash[t.team]].angle=pusher.groups[groupHash[t.team]].angle+t.angle;


							//console.log(t.mentions,pusher.info.totalMentions)
						})
						var grunningPos=Math.PI/2;
						pusher.groups.forEach(function(d) {
							d.start=grunningPos;
							d.end=d.start+d.angle;if(d.end>(Math.PI*2)){d.end=d.end-(Math.PI*2);}
							d.pos=grunningPos+d.angle/2;if(d.pos>(Math.PI*2)){d.pos=d.pos-(Math.PI*2);}
							grunningPos=grunningPos+d.angle;if(grunningPos>(Math.PI*2)){grunningPos=grunningPos-(Math.PI*2);}
						})


						// now, for the teams where there has been movement, we are going to re-compute how individual nodes should be positioned.
						pusher.teams.forEach(function(myTeam) {
						
							var 
							//myTeam=pusher.teams[id],
							chars=myTeam.chars;

							var circles=[]; // this would be the circles of the characters, inside those of the teams
							var nodes=chars.map(function(d,i) {return {value:charShown[d].mentions, name:charHash[d].Name,id:d};})
							var tree={name:"root",children:nodes};
							var s=2*myTeam.halfchord;
							var pack=d3.layout.pack().size([s,s]) 
								.value(function(d) {return d.value;})
								.sort(d3.descending)
								(tree);

							circles=pack.slice(1).map(function(d,i) {return {id:nodes[i].id,r:d.r,x:d.x-s/2+myTeam.posx,y:d.y-s/2+myTeam.posy};})
							circles.forEach(function(d,i) {
								id=d.id;
								pusher.characters[myTime.charHash[d.id]].x=d.x; // here goes nothing ...
								pusher.characters[myTime.charHash[d.id]].y=d.y;
								pusher.characters[myTime.charHash[d.id]].r=d.r;
							})
						})

						pusher.links.forEach(function(d) {
							var killer=pusher.characters[myTime.charHash[d.killer]],
								victim=pusher.characters[myTime.charHash[d.victim]];

							if(killer){
								d.x1=pusher.characters[myTime.charHash[d.killer]].x;
								d.y1=pusher.characters[myTime.charHash[d.killer]].y;
							}
							else {
								d.x1=0;d.y1=0;console.log("no killer for ",d) // that should never happen
							}
							if(victim){
								d.x2=pusher.characters[myTime.charHash[d.victim]].x;
								d.y2=pusher.characters[myTime.charHash[d.victim]].y;
							}
							else {
								d.x2=0;d.y2=0;console.log("no victim for ",d) // that should never happen either
							}
							if(!d.x1){
							//console.log(d);
							} // which should not happen
							var hx=(d.x1+d.x2)/4,hy=(d.y1+d.y2)/4 // barycenter between center of circle (0,0) and middle of the straight chord (d.x1+d.x2)+2...
							d.class="link t"+killer.teamID+" t"+victim.teamID;
							d.path="M"+d.x1+","+d.y1+" Q "+hx+","+hy+" "+d.x2+","+d.y2+" L"+d.x2+","+d.y2;
						})

						times.push(pusher);
					})
					charTimes.forEach(function(charTime) {
						charTime.events=d3.nest().key(function(d) {return d.time;}).entries(charTime.events);
					})
				}
				function update(i) {
					draw(i);
				}
			})
		})
	})
})
// our helper functions

function iPack(a,s) {
	// a is an array of numbers
	// s is the size of the circle.
	// this function is a trimmed down version of the packed circle layout algorithm. 
	// what it does is turn a set of numbers into a set of elements that determine a circle. 

	var nodes=a.map(function(d,i) {return {value:d};})
	var tree={name:"root",children:nodes};
	var pack=d3.layout.pack()
	.size([s,s])
	.value(function(d) {return d.value;})(tree);
	return pack.slice(1).map(function(d){return {d:d,r:d.r,k:(s/2)/d.r,x:d.x-s/2,y:d.y-s/2};})
}


function posx(d) {
	return r*Math.cos(d.pos);
}

function posy(d) {
	return r*Math.sin(d.pos);
}

function cposx(d) {
	return r*(Math.cos(d.pos-d.angle/2)+Math.cos(d.pos+d.angle/2))/2;
}

function cposy(d) {
	return r*(Math.sin(d.pos-d.angle/2)+Math.sin(d.pos+d.angle/2))/2;
}
function halfchord(d) {
	return d3.min([100,d3.max([0.1,r*Math.sin(d.angle/2)])]);
}


function halfchord2(d) {
	return d3.max([0.1,300*Math.sin(d.angle/2)]);
}

function myr(d) {
	return d3.max([0.1,d.r]);
}

function chord(d) {
	//var angle=d.angle,pi=Math.PI,a1=angle-pi/2,a2=angle+pi/2,hc=halfchord(d),x=posx(d),y=posy(d);
	//var x1=x+hc*Math.cos(a1),y1=y+hc*Math.sin(a1),x2=x+hc*Math.cos(a2),y2=y+hc*Math.sin(a2);
	//return "M"+x1+","+y1+" L"+x2+","+y2;
	var x1=r*Math.cos(d.pos-d.angle/2),
		x2=r*Math.cos(d.pos+d.angle/2),
		y1=r*Math.sin(d.pos-d.angle/2),
		y2=r*Math.sin(d.pos+d.angle/2);

	return "M"+x1+","+y1+" L"+x2+","+y2;
}

function key(d) {return d.id;}

function draw(i,mode) {//console.log(i);
	var ease=mode?"cubic-in-out":"linear";
	var cScale=d3.scale.linear().domain([0,10]).range(["red","#ccc"]).clamp([true]);
	var groupsg=vis.select("#groups").selectAll(".group").data(times[i].groups)
	var teamsg=vis.select("#teams").selectAll(".team").data(times[i].teams, key);
	var ed=vis.select("#eventDisks").selectAll(".character").data(times[i].characters, key);
	var chars=vis.select("#characters").selectAll(".character").data(times[i].characters, key);
	var et=vis.select("#eventTexts").selectAll(".character").data(times[i].characters, key);
	var links=vis.select("#links").selectAll(".link").data(times[i].links);

	// teams are created.

	newTeams=teamsg.enter().append("g").attr("class",function(d,i) {return "team t"+i;})
	newTeams.append("text")
		.text(function(d) {return d.team})
		.style("visibility",function(d,i) {return (i==teamHighlighted)?"visible":"hidden"})
		.attr("transform", function(d) {
			var a=r+d.halfchord+10;
			var x=Math.cos(d.pos)*a;
			var y=Math.sin(d.pos)*a;
			return "translate("+x+","+y+") rotate("+(d.pos*180/Math.PI+90)+")";
		})
		.attr("text-anchor","middle")
	newTeams.append("circle").classed("background",1).attr({cx:posx,cy:posy,r:halfchord});
	teamsg.exit().remove();

	// teams transition

	d3.selectAll(".team").transition().ease(ease).select("text").attr("transform", function(d) {
		var a=r+d.halfchord+10;
		var x=Math.cos(d.pos)*a;
		var y=Math.sin(d.pos)*a;
		return "translate("+x+","+y+") rotate("+(d.pos*180/Math.PI+90)+")";
	})
		.style("visibility",function(d,i) {return (i==teamHighlighted)?"visible":"hidden"})
	teamsg.transition().select(".background").attr({cx:posx,cy:posy,r:halfchord});

	// groups created.

	newGroups=groupsg.enter().append("g").attr("class",function(d,i) {return "group g"+i;})
	d3.select("#groups").selectAll("text").remove();
	d3.selectAll(".group").append("text")
		.append("textPath").classed("tp",1)
		.attr("xlink:href",function(d) {return Math.sin(d.pos)<0?"#gUp":"#gDown"})
		.attr("startOffset",function(d) {
			if(Math.sin(d.pos)<0) { // up
				//console.log(d.pos,(100*(Math.PI-d.pos)/Math.PI));
				return (100*(d.pos-Math.PI)/Math.PI)+"%"; // both arcs start from the left. So startOffset for the upper arc
			} else {									  // is high for low angles, and low for high angles.
				return (100-(100*(d.pos)/Math.PI))+"%";		 	  // this is the opposite for the lower arc.
			}
		})
		.text(function(d) {return d.name})
		.style("visibility",function(d,i) {return (d.angle>.1?"visible":"hidden");})
		.attr("text-anchor","middle")
		.on("mouseover",drawGroupModal)

	newGroups.append("path").style({fill:wIC[2],stroke:"white","stroke-width":2})
		.attr("d",arc).attr("id",function(d) {return "g"+d.name;})

	// groups transition
/*console.log("---")
	d3.selectAll(".tp").transition().ease(ease)
		.attr("xlink:href",function(d) {return (Math.sin(d.pos)<0?"#gUp":"#gDown");})
		.attr("startOffset",function(d) {
			if(Math.sin(d.pos)<0) { // up
				console.log(d.pos);
				return (100*(d.pos-Math.PI)/Math.PI)+"%"; // both arcs start from the left. So startOffset for the upper arc
			} else {									  // is high for low angles, and low for high angles.
				return (100-(100*(d.pos)/Math.PI))+"%";		 	  // this is the opposite for the lower arc.
			}
		})
		.style("visibility",function(d,i) {return (d.angle>.1?"visible":"hidden");})*/

	d3.selectAll(".group")
	//.transition().ease(ease) // transition will create avatars for the arcs
	.select("path").attr("d",arc)

	// links created

	newLinks=links.enter().append("path").classed("link",1).attr("d",function(d) {return d.path;}).style("stroke","red")

	// links transition

	d3.selectAll(".link").transition()
		.attr("d",function(d) {return d.path;})
		.attr("class",function(d) {return d.class;})
		.style("stroke",function(d) {return cScale(i-d.chapter);});
	links.exit().remove();

	// event disks, event texts created

	newD=ed.enter().append("g").classed("character",1).attr("transform",function(d) {return "translate("+d.x+","+d.y+")";});
	newT=et.enter().append("g").classed("character",1).attr("transform",function(d) {return "translate("+d.x+","+d.y+")";});

	// characters created
	newChars=chars.enter().append("g").classed("character",1).attr("transform",function(d) {return "translate("+d.x+","+d.y+")";});
	newChars.append("circle").classed("charcircle",1);
	

	chars.exit().remove(); // this happens when going back in time.
	ed.exit().remove();
	et.exit().remove();

	// characters transition - size & fill of circle
	vis.select("#characters").selectAll(".character").transition()
		.attr({r:function(d) {return d.r;}})
		.style("fill",function(d) {
		if(d.isDead) {
			return wIC[4]; // that settles it
		}
		if(d.isHurt) {
			return wIC[3];
		} 
		if (d.isCaptured) {
			return wIC[2];
		}
		return wIC[1];
		})
		.style("stroke-width",function(d) {return rank[d.prefix];})

	// characters interaction
		vis.select("#characters").selectAll(".character").on("mouseover",drawCharModal);

	vis.select("#characters").selectAll(".character")
		.on("click", function(d,j) {
			console.log(d);
			teamHighlighted=d.teamID;
			charHighlighted=j;
			console.log(teamHighlighted,charHighlighted);
			d3.selectAll(".highlighted").classed("highlighted",0);
			d3.selectAll(".t"+teamHighlighted).classed("highlighted",1);
			d3.selectAll(".team text").style("visibility",function(d,i) {return (i==teamHighlighted)?"visible":"hidden"})
			draw(i,true);
		})

	// characters transition
	d3.selectAll(".character")// that is, including event disks & event texts
	.attr("class",function(d) {return "character t"+d.teamID+" c"+d.id;})
	.transition().ease(ease).attr("transform",function(d) {return "translate("+d.x+","+d.y+")";}) 
	.select(".charcircle")
	.attr({
		r:myr
	})
	.style("fill",function(d) {
		if(d.isDead) {
			return wIC[4]; // that settles it
		}
		if(d.isHurt) {
			return wIC[3];
		} 
		if (d.isCaptured) {
			return wIC[2];
		}
		return wIC[1];
	}).style("stroke-width",function(d) {return d.isDead?0:rank[d.prefix];})


	// dealing with highlighted team

	if(teamHighlighted>-1) {
		//console.log("painting the town red")
		d3.selectAll(".highlighted").classed("highlighted",0);
		d3.selectAll(".t"+teamHighlighted).classed("highlighted",1);
	}

	// events of this chapter.

	if(!mode){
	times[i].recentEvents.forEach(function(e) {
		var d=times[i].characters[e.id];//console.log(d);

		var myDisk=vis.select("#eventDisks").select(".c"+d.id);
		var myText=vis.select("#eventTexts").select(".c"+d.id);

		myDisk.append("circle").attr({r:d.r}).style({opacity:.5,fill:colors[e.type]}).transition().delay(750).duration(250).attr("r",d.r*2).style("opacity",0).each("end",function() {d3.select(this).remove();})
		myText.append("text").
		attr({x:0,y:d3.min([-10,-d.r-5]),"text-anchor":"middle"})
		.style({"fill":colors[e.type],opacity:1,stroke:"none"})
		.text(d.name)
		.transition().duration(1000).style("opacity",0).each("end",function() {d3.select(this).remove();})
		myText.append("text").
		attr({x:-1,y:d3.min([-10,-d.r-5])+1,"text-anchor":"middle"})
		.style({"fill":"black",opacity:1,stroke:"none"})
		.text(d.name)
		.transition().duration(1000).style("opacity",0).each("end",function() {d3.select(this).remove();})
		myText.append("text").attr({x:-1,y:d.r+16,"text-anchor":"middle"}).style({"fill":"black",opacity:1,stroke:"none"}).text(e.text)
		.transition().delay(750).duration(250).style("opacity",0).each("end",function() {d3.select(this).remove();})
		myText.append("text").attr({x:0,y:d.r+15,"text-anchor":"middle"}).style({"fill":colors[e.type],opacity:1,stroke:"none"}).text(e.text)
		.transition().delay(750).duration(250).style("opacity",0).each("end",function() {d3.select(this).remove();})
			
	})
	}

	// character details

	if(charHighlighted>-1) {
		var cTimeScale=d3.scale.linear().domain([0,maxStep]).range([5,5*bSize-5]);
		charInt=d3.select("#interface").select("#charInt");
		charInt.transition().style("opacity",1);
		d3.select("#emptyCharInt").transition().style("fill-opacity",.2)
		d3.select("#emptyCharInt").on("mouseover",hideModal);
		d3.select("#clickme").transition().style("opacity",0);
		charInt.select("#charPrefix").text(times[i].characters[charHighlighted].prefix);
		charInt.select("#charName").text(charTimes[charHighlighted].name);
		charInt.select("#charTeam").text(times[i].characters[charHighlighted].team);
		charInt.select("#charTitle").text(function() {var myChar=times[i].characters[charHighlighted];if(!myChar.isDead) {return myChar.title;}})
		charInt.select("#charStatus").text(function() {var myChar=times[i].characters[charHighlighted];if(myChar.isDead) {return "Dead";}
			if(myChar.isHurt) {if(myChar.isCaptured) {return "Hurt and captive";} else {return "Hurt";}}if(myChar.isCaptured) {return "Captive";} else {return "";} 
		})

		
		var charMentioned=charTimes[charHighlighted].mentions;
		var charEvents=charTimes[charHighlighted].events;

		var markers=charInt.select("#charTimeLine").selectAll(".markers").data(charMentioned);
		markers.exit().remove();
		markers.enter().append("g").classed("markers",1).append("circle").attr({"cy":0,"r":2.5}).style({"fill":"#222","opacity":.5});
		markers.transition().attr("transform",function(d) {return "translate("+cTimeScale(d.time)+",0)"}).style("visibility",function(d) {return d.time<i?"visible":"hidden";})
		markers.on("mouseover",drawMentionedModal);
		var markEvents=charInt.select("#charTimeLine").selectAll(".markEvents").data(charEvents);
		markEvents.exit().remove();
		markEvents.enter().append("g").classed("markEvents",1);
		var myEvents=charInt.select("#charTimeLine").selectAll(".markEvents").selectAll(".markEvent").data(function(d) {return d.values;});
		myEvents.exit().remove();
		myEvents.enter().append("circle").classed("markEvent",1)
			.attr({cy:function(d,i) {return -(i+1)*10;},r:3}).style("fill",function(d) {return colors[d.type];})
		d3.selectAll(".markEvent").style("visibility",function(d) {return d.time<i?"visible":"hidden";})
		markEvents.transition().attr("transform",function(d) {return "translate("+cTimeScale(d.key)+",0)"})
		markEvents.selectAll(".markEvent").on("mouseover",function(d,j) {
			console.log("calling drawmodal - ",d,j,d3.select(this).datum());drawModal(d,j);
		})
		var cursor = charInt.selectAll(".cursor").data([1]).enter().append("path").classed("cursor",1)
		.style("stroke-dasharray","2 4")
		.style({stroke:wIC[4],fill:wIC[0]});
		charInt.selectAll(".cursor").transition()
		//.attr("d",function() {return "M"+(202+(i/maxStep)*720)+",25 l3,3 v6 h-6 v-6 Z";})
		.attr("d",function() {return "M"+(intL+cTimeScale(i))+",-30v75";});
	} else {
		charInt=d3.select("#interface").select("#charInt");
		charInt.transition().style("opacity",0);
		d3.select("#clickme").transition().style("opacity",1);
		d3.select("#emptyCharInt").transition().style("fill-opacity",1);

	}


}
function arc(d) {
	var path="M",r1=330,r2=322;
	path=path+" "+Math.cos(d.start)*r1+","+Math.sin(d.start)*r1;
	path=path+" A"+r1+","+r1+" 0 "; // ellipse radius, ellipse rotation
	path=path+(d.angle>Math.PI?1:0); // short or long arc?
	path=path+",1 ";
	path=path+" "+Math.cos(d.end)*r1+","+Math.sin(d.end)*r1;
	path=path+"L";
	path=path+" "+Math.cos(d.end)*r2+","+Math.sin(d.end)*r2;
	path=path+" A"+r2+","+r2+" 0 "; // ellipse radius, ellipse rotation
	path=path+(d.angle>Math.PI?1:0); // short or long arc?
	path=path+",0 "; // reverse direction
	path=path+" "+Math.cos(d.start)*r2+","+Math.sin(d.start)*r2;
	path=path+"Z";
	return path;}

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
}