var width = 960,
    height = 800;

var maxStep=72,running=0;
var color = d3.scale.category20();
var teamHighlighted=-1, charHighlighted=-1;
var svg = d3.select("#chart").append("svg")
    .attr("width", width)    .attr("height", height);
var myId,myTime;
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


var prefix={
	"knight":"Ser",
	"knight of the King's guard":"Ser",
	"lord":"Lord",
	"septon":"septon",
	"high septon":"",
	"septa":"septa",
	"maester":"maester",
	"grand maester":"grand maester",
	"lady":"Lady",
	"Queen of Westeros":"Queen",
	"Queen regent":"Queen",
	"Master of the coin":"Lord",
	"Hand of the King":"Lord",
	"Master of Whispers":"Lord",

}

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



var vis=svg
    .append("g").attr("transform","translate(430,350)");

vis.append("rect").style("fill","white").attr({x:-width/2,y:-height/2,width:width,height:height}).on("click",function() {teamHighlighted=-1;charHighlighted=-1;newdraw(i,true);})

var i=72;

var times=[],		// all events of one chapter;
	charTimes=[];	// all events related to one character over time; 

var slider=d3.select("#slider");

var r=200;
var play=function() {};
var rScale=d3.scale.sqrt();



var chp,chr,eve,eve1,tms,charHash, teamHash, teamCircle, teamShown, charShown, totalChars,totalMentions,teamUpdates;

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
	teams.forEach(function(d) {
		teamHash[d.team]=+d.id;
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
					if(i===maxStep&&!running){i=-1;}
					if(i<maxStep){i++;running=1;
					d3.select("#stop").html("Pause").on("click",stop);
					slider.property("value",i);
					update(i);} else {stop();}	
				}

				start=function() {
					timer=setInterval("play()", 250);
				}

				stop=function () {
					clearInterval(timer);
					running=0;
					d3.select("#stop").html("Play").on("click",start);
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
					vis.append("g").attr("id","teams");
					//vis.append("g").attr("id","events");
					vis.append("g").attr("id","characters");
					vis.append("g").attr("id","links");
					calculate();
					console.log("positions calculated.")
					//start(i);
					interface();
					newdraw(maxStep,true);
					//update(i)
				}

				function interface() {
					var myInt=svg.append("g").attr({id:"interface",transform:"translate(0,665)"});
					myInt
					.append("text")
					.attr({x:20,y:115})
					.text("Show timeline until:")
					.style("font-weight","bold");
					var bookButtons=myInt.selectAll(".bookButton").data(books).enter().append("g").classed("bookButton",1).attr("transform",function(d,i) {return "translate("+(202+145*i)+",100)";})
					bookButtons.append("rect")
						.style({
							fill:function(d) {return d.color;},
							stroke:function(d) {return d3.rgb(d.color).darker();},
							"fill-opacity":function(d,i) {return (i<=bookSelected)?1:0;}
						})
					.attr({width:140,height:20,rx:5,ry:5})

					var timelineBooks=myInt.selectAll(".timelineBooks").data(books).enter().append("rect").classed("timelineBooks",1)
						.attr({
							x:function(d,i) {return (i>bookSelected)?922:(202+(d.first/maxStep)*720+(i?2:0))},
							width:function(d,i) {var val=0;
								if(i>bookSelected) {return val;}
								val=720*(d.last-d.first)/maxStep;
								if(i>0) {val=val-2;}
								if(i<bookSelected) {val=val-2;}
								return val;},
							y:130,
							height:2
						}).style("fill",function(d) {return d.color;})
					bookButtons.append("text").text(function(d) {return d.title;}).attr("y",14).attr("x",10).style("font-size","10px");
					bookButtons.on("click",function(d,j) {
						stop();
						bookSelected=j;
						maxStep=books[j].last;
						d3.select("#slider").property("max",maxStep);
						if(i>maxStep) {i=maxStep;}
						newdraw(i,true);
						d3.selectAll(".bookButton").select("rect").transition().style("fill-opacity",function(d,i) {return (i<=bookSelected)?1:0;})
						d3.selectAll(".timelineBooks").transition().attr({
							x:function(d,i) {return (i>bookSelected)?922:(202+(d.first/maxStep)*720+(i?2:0))},
							width:function(d,i) {var val=0;
								if(i>bookSelected) {return val;}
								val=720*(d.last-d.first)/maxStep;
								if(i>0) {val=val-2;}
								if(i<bookSelected) {val=val-2;}
								return val;}	,						y:130,
							height:2
						})
					})
					var charInt=myInt.append("g").attr({"id":"charInt"});
					charInt.append("text").attr({id:"charName",y:20}).style({"font-weight":"bold","font-size":"16px"})
					charInt.append("g").attr({id:"charTimeLine",transform:"translate(202,20)"}).append("path").attr("d","M0,0h720").style("stroke","purple");
				}

				function calculate() {
					//var 
					myTime={teams:teams.slice(0),characters:[],charHash:{},info:{totalMentions:0,maxMentions:0,totalChars:0,totalTeams:0},links:[],events:[]};
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
									charTimes[myTime.charHash[id]].events.push({time:c,type:"mentioned"});
									//var m=teamShown[t].mentions=teamShown[t].mentions+1:
									//total number of mentions of characters in a team would best be summed each time we need it.
									if(teamUpdates.indexOf(teamHash[t])==-1) {teamUpdates.push(teamHash[t])}; 
								} else {
									myTime.characters.push({id:+id,name:charHash[id].Name,team:charHash[id].Team,title:charHash[id].title,isDead:+charHash[id].isDead,isCaptured:+charHash[id].isCaptured,isHurt:+charHash[id].isHurt});
									myTime.charHash[id]=myTime.info.totalChars; // in order to retrieve the character node corrsponding to a certain id. 
																				// ex. Robb Stark (1431) -> times[x].charHash["1431"]
									charTimes.push({id:+id,
										name:charHash[id].Name,
										nitialStatus:{team:charHash[id].Team,isDead:+charHash[id].isDead,isCaptured:+charHash[id].isCaptured,isHurt:+charHash[id].isHurt},
										events:[{time:c,type:"mentioned"}],
										kills:[{time:c,bodycount:0}],
										bodycount:0
									});

									myTime.info.totalChars=myTime.info.totalChars+1;
									charShown[id]={mentions:1,chapters:[c]};
									myTime.teams[teamHash[t]].chars[id]=true;
									/*if (t in teamShown) { // but the team is known.
										teamShown[t].chapters.push(c);
										myTime.teams[teamShown[t].id].chars[id]=true;
									} else { // new character & new team.
										var myTeam={team:t,chars:{},collapsed:true};
										myTeam.chars[id]=true;
										myTime.teams.push(myTeam);
										teamShown[t]={mentions:1,chapters:[c],id:myTime.info.totalTeams};
										myTime.info.totalTeams=myTime.info.totalTeams+1;
									}
									if(teamUpdates.indexOf(teamShown[t].id)==-1) {
										teamUpdates.push(teamShown[t].id)
									};*/
									if(teamUpdates.indexOf(teamHash[t])==-1) {
										teamUpdates.push(teamHash[t])
									} 	
								}
							}
							if(e.event==="killed") {
								myTime.characters[myTime.charHash[id]].isDead=1;
								charShown[id].isDead=1;
								if(e.withID!=="") {
									myTime.links.push({killer:e.withID,victim:id,chapter:c});
									//console.log(myTime.characters[myTime.charHash[e.withID]].name);
									//console.log(c,e);
									myTime.events.push({text:myTime.characters[myTime.charHash[id]].name+" killed by "+myTime.characters[myTime.charHash[e.withID]].name,type:"killed"})
									charTimes[myTime.charHash[id]].events.push({time:c,type:"killed",details:myTime.characters[myTime.charHash[e.withID]].name,story:" is killed by "});
									charTimes[myTime.charHash[e.withID]].events.push({time:c,type:"kills",details:myTime.characters[myTime.charHash[id]].name,story:" kills "});
									charTimes[myTime.charHash[e.withID]].bodycount=charTimes[myTime.charHash[e.withID]].bodycount+1;
									charTimes[myTime.charHash[e.withID]].kills.push({time:c,bodycount:charTimes[myTime.charHash[e.withID]].bodycount})

								} else {
									myTime.events.push({text:myTime.characters[myTime.charHash[id]].name+" killed.",type:"killed",time:c})
									charTimes[myTime.charHash[id]].events.push({time:c,type:"killed",story:" is killed."});
								}
								recentEvents.push({type:"kill",id:myTime.charHash[id],withID:myTime.charHash[e.withID],details:e.details});

							}
							if(e.event==="dies") {
								myTime.characters[myTime.charHash[id]].isDead=1;
								charShown[id].isDead=1;
								myTime.events.push({text:myTime.characters[myTime.charHash[id]].name+" dies.",type:"killed",time:c})
								charTimes[myTime.charHash[id]].events.push({time:c,type:"dies",story:"dies."});
								recentEvents.push({type:"death",id:myTime.charHash[id],details:e.details});

							}
							if(e.event==="captured") {
								myTime.characters[myTime.charHash[id]].isCaptured=1;
								charShown[id].isCaptured=1;
								myTime.events.push({text:myTime.characters[myTime.charHash[id]].name+" is captured.",type:"captured",time:c})
								charTimes[myTime.charHash[id]].events.push({time:c,type:"captured",details:e.team,story:" is captured by "});
								recentEvents.push({type:"capture",id:myTime.charHash[id],withID:myTime.charHash[e.withID],team:e.team,details:e.details});
								
							}
							if(e.event==="hurt") {
								myTime.characters[myTime.charHash[id]].isHurt=1;
								charShown[id].isHurt=1;
								myTime.events.push({text:myTime.characters[myTime.charHash[id]].name+" is hurt.",type:"hurt",time:c})
								if(e.withID&&!isNaN(e.withID)) {
									charTimes[myTime.charHash[id]].events.push({time:c,type:"hurt",story:" is hurt by ",details:myTime.characters[myTime.charHash[+e.withID]].name})
								} else {
									charTimes[myTime.charHash[id]].events.push({time:c,type:"hurt",story:" is hurt."})
								}
								recentEvents.push({type:"hurt",id:myTime.charHash[id],withID:myTime.charHash[e.withID],team:e.team,details:e.details});
							}
							if(e.event==="healed") {
								myTime.characters[myTime.charHash[id]].isHurt=0;
								charShown[id].isHurt=0;
								myTime.events.push({text:myTime.characters[myTime.charHash[id]].name+" is healed.",type:"ok",time:c})

								if(e.withID&&!isNaN(e.withID)) {
									//console.log(myTime.characters[myTime.charHash[e.withID]]);
									charTimes[myTime.charHash[id]].events.push({time:c,type:"healed",story:" is healed by ",details:myTime.characters[myTime.charHash[e.withID]].name})
								} else {
									charTimes[myTime.charHash[id]].events.push({time:c,type:"healed",story:" is healed."})
								}
								recentEvents.push({type:"healed",id:myTime.charHash[id],withID:myTime.charHash[e.withID],details:e.details});
							}
							
							if(e.event==="named") {
								if(e.title==="lost title") {
									myId=myTime.charHash[id]; // why I have to do that is a mystery. 
										//console.log(myTime);
								//	console.log(e);
								//console.log(myTime,myTime.characters[myTime.charHash[id]]);
								
									//console.log(charTimes[myId].events);
									recentEvents.push({
										type:"lost title",
										id:myId,
										withID:myTime.charHash[e.withID],
										details:e.details,
										title:e.title
									});
									/*console.log({
										time:c,
										type:"lost title",
										details:myTime.characters[myTime.charHash[id]].title,
										story:" is no longer "
									});*/
									charTimes[myId].events.push({
										time:c,
										type:"lost title",
										details:myTime.characters[myId].title,
										story:" is no longer "
									});
									//console.log(myTime.characters[myId]);
									myTime.characters[myId]["title"]="";
								} else {
									myTime.characters[myTime.charHash[id]].title=e.title;
									//console.log(e.title,myTime.characters[myTime.charHash[id]]);
									recentEvents.push({
										type:"named",
										id:myTime.charHash[id],
										withID:myTime.charHash[e.withID],
										details:e.details,
										title:e.title
									});
									//console.log(id);
									//console.log(myTime[charHash[id]]);
									/*

									charTimes[myTime[charHash[id]].events.push({
										time:c,
										type:"named",
										details:e.title,
										story:" becomes "})*/
								}
								//console.log(myTime.characters[myTime.charHash[id]]);
							}
							if(e.event==="alive"){
								myTime.characters[myTime.charHash[id]].isDead=0;
								charShown[id].isDead=0;
								myTime.events.push({text:myTime.characters[myTime.charHash[id]].name+" is alive.",type:"ok",time:c})
								charTimes[myTime.charHash[id]].events.push({time:c,type:"alive",story:" is alive."})
								recentEvents.push({type:"alive",id:myTime.charHash[id],withID:myTime.charHash[e.withID],details:e.details});
							}
							if(e.event==="freed"){
								myTime.characters[myTime.charHash[id]].isCaptured=0;
								charShown[id].isCaptured=0;
								myTime.events.push({text:myTime.characters[myTime.charHash[id]].name+" is freed.",type:"ok",time:c})
								charTimes[myTime.charHash[id]].events.push({time:c,type:"freed",story:" is free."})
								recentEvents.push({type:"freed",id:myTime.charHash[id],withID:myTime.charHash[e.withID],details:e.details});

							}
							if(e.event==="changes allegiances") {

								var newt=e.team;
								var currentt=myTime.characters[myTime.charHash[id]].team;
								if(newt!=currentt){
									/*if(!(newt in teamShown)) {
										teamShown[newt]={mentions:1,chapters:[c],id:myTime.info.totalTeams};
										myTime.info.totalTeams=myTime.info.totalTeams+1;
										myTime.teams.push({team:newt,chars:{},collapsed:true});
									}*/
									//console.log(teamShown[newt]);
									myTime.teams[teamHash[newt]].chars[id]=true;
									delete myTime.teams[teamHash[currentt]].chars[id];
									//.log("at "+c+", "+id+" was removed from team "+teamShown[t].id+" ("+myTime.teams[teamShown[t].id].team+")");
									myTime.characters[myTime.charHash[id]].team=newt;
									myTime.events.push({text:myTime.characters[myTime.charHash[id]].name+" changes teams ("+newt+")",type:"change",time:c})
									charTimes[myTime.charHash[id]].events.push({time:c,type:"changes teams",details:newt,story:teams[teamHash[e.team]].joins})
									recentEvents.push({type:"changes",id:myTime.charHash[id],withID:myTime.charHash[e.withID],team:e.team,details:e.details});

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
						myTime.characters.forEach(function(d) {
								pusher.characters.push({id:d.id,name:d.name,team:d.team,teamID:teamHash[d.team],isCaptured:d.isCaptured,isDead:d.isDead,isHurt:d.isHurt,title:d.title,mentions:charShown[d.id].mentions});

								pusher.teams[teamHash[d.team]].mentions=pusher.teams[teamHash[d.team]].mentions+charShown[d.id].mentions;
						})
						myTime.links.forEach(function(d) {pusher.links.push({killer:d.killer,victim:d.victim,chapter:d.chapter});})
						myTime.events.forEach(function(d) {pusher.events.push({text:d.text,type:d.type});})
						// now we'll recompute the relative importance of teams.
						//pusher.teams.forEach(function(d) {
							
						//	var chars=d.chars;
						//	d.mentions=d3.sum(chars, function(d) {return charShown[d].mentions;})
							// we re-sum the number of mentions for the teams which have changed.
						//})
						//console.log(pusher);

						// at this stage we can compute the size of each team and its position on the larger circle.
						var runningPos=Math.PI/2;
						pusher.teams.forEach(function(t) {
							t.angle=t.mentions*2*Math.PI/pusher.info.totalMentions;
							t.pos=runningPos+t.angle/2;
							t.posx=posx(t);
							t.posy=posy(t);
							t.halfchord=halfchord(t);
							runningPos=runningPos+t.angle;
							//console.log(t.mentions,pusher.info.totalMentions)
						})

						// now, for the teams where there has been movement, we are going to re-compute how individual nodes should be positioned.
						pusher.teams.forEach(function(myTeam) {
						//teamUpdates.forEach(function(id) {

						// in this function the position of the circles of all the characters of the teams which have changed during the chapter
						// will be recomputed.

							var 
							//myTeam=pusher.teams[id],
							chars=myTeam.chars;

							var circles=[]; // this would be the circles of the characters, inside those of the teams
							var nodes=chars.map(function(d,i) {return {value:charShown[d].mentions, name:charHash[d].Name,id:d};})
							//console.log(nodes);
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
								//if(d.r<1){console.log("char "+d.id+ "("+myTime.charHash[d.id]+") in "+myChapter.key+" is unusually small: "+d.r)}
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
							if(!d.x1){console.log(d);} // which should not happen
							var hx=(d.x1+d.x2)/4,hy=(d.y1+d.y2)/4 // barycenter between center of circle (0,0) and middle of the straight chord (d.x1+d.x2)+2...
							d.class="link t"+killer.teamID+" t"+victim.teamID;
							d.path="M"+d.x1+","+d.y1+" Q "+hx+","+hy+" "+d.x2+","+d.y2+" L"+d.x2+","+d.y2;
						})

						times.push(pusher);
					})
				}
				function update(i) {
					newdraw(i);
				}
			/*	function update(i) {	
					svg.select("#chapter").text(chapters[i].title);
					svg.select("#POV").text(charHash[chapters[i].povID].Name);

					var myEvents=eve[i].values; // all events in one chapter.
					//var 
					teamUpdates=[]; // teams who will be updated in this chapter. Their circles will be redrawn.
					myEvents.forEach(function(e) {
						if(e.event==="mentioned") {
							totalMentions=totalMentions+1;
							var id=+e.characterID,t=charHash[id].Team,c=+e.chapterID;
							if (d3.keys(charShown).indexOf(id.toString())>-1) { // the character is known.
								//
								var m=charShown[id].mentions=charShown[id].mentions+1;
								//console.log(m);
								if(m>maxMentions){
									maxMentions=m;
								}
								charShown[id].chapters.push(c);
								var m=teamShown[t].mentions=teamShown[t].mentions+1;
								if(m>maxTMentions){
									maxTMentions=m;
								}
								teamShown[t].chapters.push(c);
								if(teamUpdates.indexOf(teamShown[t].id)==-1) {teamUpdates.push(teamShown[t].id)}; 
							} else { // new character. 
								// console.log("introducing "+charHash[id].Name+" ("+id+") in chapter "+i);
								totalChars=totalChars+1;
								charCircle.push({id:id});
								charShown[+id]={mentions:1,chapters:[c]};

								if (d3.keys(teamShown).indexOf(t)>-1) { // but the team is known.
									var m=teamShown[t].mentions=teamShown[t].mentions+1;
									if(m>maxTMentions){
										maxTMentions=m;
									}
									teamShown[t].chapters.push(c);

									teamCircle[teamShown[t].id].chars.push(id);

								} else { // new character & new team.
									teamCircle.push({team:t,chars:[id],collapsed:true});
									teamShown[t]={mentions:1,chapters:[c],id:totalTeams};
									totalTeams=totalTeams+1;
									
								}
								if(teamUpdates.indexOf(teamShown[t].id)==-1) {teamUpdates.push(teamShown[t].id)}; 
							}
						}
						if(e.event==="killed") {

						}
					})
					//console.log(teamCircle[0].chars)
					//console.log("for chapter "+i+", updating "+teamUpdates)
					teamUpdates.forEach(function(id) {

						// in this function the position of the circles of all the characters of the teams which have changed during the chapter
						// will be recomputed.

						var myCircle=teamCircle[id],t=myCircle.team,chars=myCircle.chars;
						//console.log("team "+id+" ("+t+")")
						myCircle.circles=[]; // this would be the circles of the characters, inside those of the teams

						var nodes=chars.map(function(d,i) {return {value:charShown[d].mentions, name:charHash[d].Name,id:d};})
						//console.log(nodes);
											var tree={name:"root",children:nodes};
						var s=100;
						var pack=d3.layout.pack().size([s,s]) // to be rescaled
							.value(function(d) {return d.value;})
							.sort(d3.descending)
							(tree);

						myCircle.circles=pack.slice(1).map(function(d,i) {return {mentions:nodes[i].value, name:nodes[i].name, id:nodes[i].id,pr:d.r,px:d.x-s/2,py:d.y-s/2};})
					})
					
					var	runningPos=0;

					teamCircle.forEach(function(t) {
						t.mentions=teamShown[t.team].mentions;
						angle=t.mentions*2*Math.PI/totalMentions;
						t.angle=angle;
						t.pos=runningPos+angle/2;
						var px=t.posx=posx(t);
						var py=t.posy=posy(t);
						var hc=t.halfchord=halfchord(t);
						t.circles.forEach(function(d) {
							d.x=(d.px*hc/50)+px;
							d.y=(d.py*hc/50)+py;
							d.r=(d.pr*hc/50);

							charHash[d.id].x=d.x;
							charHash[d.id].y=d.y;
							charHash[d.id].r=d.r
							//console.log(charHash[d.id]);
						})

						runningPos=runningPos+angle;
						//console.log(t.team,t.mentions,t.pos,sumSquare);
					})

					draw(i);
				}*/

				

				function draw(i) {
					rScale
						.domain([0,maxMentions])
						//.range([0,10]);
						.range([0,d3.min([20,100*r/totalMentions])]);

					/*charCircle.forEach(function(c) {
						c.pos=runningPos;
						c.mentions=charShown[c.id].mentions;
						runningPos=runningPos+charShown[c.id].mentions/totalMentions;
					})

					var newChars=svg.selectAll(".characters").data(charCircle).enter()
						.append("g").classed("characters",1);
					newChars.append("circle")
								.attr("cx",function(d) {return posx(d.pos);})
								.attr("cy",function(d) {return posy(d.pos);})
								.attr("r",function(d) {return rScale(d.mentions);} )
					newChars.append("text")
							.attr("x",function(d) {return posx(d.pos);})
							.attr("y",function(d) {return posy(d.pos);})
							.attr("text-anchor","middle")
							.text(function(d) {return charHash[d.id].Name})
							.transition()
							.style("opacity",0)
							.each("end",function() {d3.select(this).remove();})
					svg.selectAll(".characters").select("circle")
						.transition()
						.attr("cx",function(d) {return posx(d.pos);})
						.attr("cy",function(d) {return posy(d.pos);})
						.attr("r",function(d) {return rScale(d.mentions);} )
					*/



					var newTeams=vis.selectAll(".team").data(teamCircle).enter()
						.append("g").classed("team",1).attr("id",function(d,i) {return "T"+i;})
						/*.on("click",function(d) {
							d.collapsed=!d.collapsed;
							d3.select(this).select(".characters").style("visibility",d.collapsed?"hidden":"visible");
						})*/
					/*newTeams.append("circle")
						.attr({cx:posx,cy:posy,r:halfchord})
						.style({fill:function(d) {return color(d.team)}})
						.classed("background",1)*/

					newTeams.append("path").classed("chord",1)
						.attr("d",chord).attr("id",function(d,i) {return "c"+i;})
					newTeams.append("path").classed("ray",1)
						.attr("d",function(d) {return "M0,0 L"+posx(d)+","+posy(d);})
						
					newTeams.append("circle")
						.attr({cx:posx,cy:posy,r:5})
						.classed("center",1)
					newTeams.append("text")
						.attr({x:function(d) {return r+halfchord(d)+5},y:5,"text-anchor":"start"})
						.attr("transform",function(d) {return "rotate("+(180*d.pos/Math.PI)+")";})

						.text(function(d) {return d.team})

					newTeams.append("g").classed("characters",1)
						//.attr("transform", function(d) {return "translate("+posx(d)+","+posy(d)+") scale("+(halfchord(d)/50)+")";})
						//.style("visibility","hidden");
					d3.selectAll(".characters").selectAll(".character").data(function(d) {return d.circles;}).enter().append("circle").classed("character",1)
						.attr({cx:function(d) {return d.x},cy:function(d) {return d.y},r:function(d) {return d.r}})
						.style({"fill":"white","stroke":"black"})

					var teamsg=svg.selectAll(".team");
					teamsg.select(".background")
						.transition()
						.attr({cx:posx,cy:posy,r:halfchord})
					teamsg.select(".center").transition().attr({cx:posx,cy:posy})
					teamsg.select(".chord").transition()					
										.attr("d",chord)
					teamsg.select(".ray").transition()					.attr("d",function(d) {return "M0,0 L"+posx(d)+","+posy(d);})


					teamsg.select("text")
						.transition()
						.attr("x",function(d) {return r+halfchord(d)+5;})
						//.text(function(d) {return d.team})
						.attr("transform",function(d) {return "rotate("+(180*d.pos/Math.PI)+")";})

					//teams.select(".characters").transition().attr("transform", function(d) {
					//	return "translate("+posx(d)+","+posy(d)+") scale("+(halfchord(d)/50)+")"});

					teamsg.select(".characters").selectAll(".character").data(function(d) {return d.circles;}).transition().attr({cx:function(d) {return d.x},cy:function(d) {return d.y},r:function(d) {return d.r}})
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
	return d3.max([0.1,r*Math.sin(d.angle/2)]);
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

function newdraw(i,mode) {//console.log(i);
	var ease=mode?"cubic-in-out":"linear";
	var cScale=d3.scale.linear().domain([0,10]).range(["red","#ccc"]).clamp([true]);
	var teamsg=vis.select("#teams").selectAll(".team").data(times[i].teams, key);
	var chars=vis.select("#characters").selectAll(".character").data(times[i].characters, key);
	var links=vis.select("#links").selectAll(".link").data(times[i].links);

	newTeams=teamsg.enter().append("g").attr("class",function(d,i) {return "team t"+i;})
	newTeams.append("text")
		.text(function(d) {return d.team})
		.style("visibility",function(d,i) {return ((d.team.length<d.halfchord/5)||i==teamHighlighted)?"visible":null})
		.attr("transform", function(d) {
			var a=r+d.halfchord+10;
			var x=Math.cos(d.pos)*a;
			var y=Math.sin(d.pos)*a;
			return "translate("+x+","+y+") rotate("+(d.pos*180/Math.PI+90)+")";
		})
		.attr("text-anchor","middle")

	newTeams.append("circle").classed("background",1).attr({cx:posx,cy:posy,r:halfchord});

	teamsg.exit().remove();
	d3.selectAll(".team").transition().ease(ease).select("text").attr("transform", function(d) {
		var a=r+d.halfchord+10;
		var x=Math.cos(d.pos)*a;
		var y=Math.sin(d.pos)*a;
		return "translate("+x+","+y+") rotate("+(d.pos*180/Math.PI+90)+")";
	})
		.style("visibility",function(d) {return (d.team.length<d.halfchord/5)?"visible":"hidden"})

	teamsg.transition().select(".background").attr({cx:posx,cy:posy,r:halfchord});

	newLinks=links.enter().append("path").classed("link",1).attr("d",function(d) {return d.path;}).style("stroke","red")
	d3.selectAll(".link").transition()
		.attr("d",function(d) {return d.path;})
		.attr("class",function(d) {return d.class;})
		.style("stroke",function(d) {return cScale(i-d.chapter);});
	links.exit().remove();

	newChars=chars.enter().append("g").classed("character",1).attr("transform",function(d) {return "translate("+d.x+","+d.y+")";});
	newChars.append("g").classed("events",1)
	newChars.append("circle").classed("charcircle",1)
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
	newChars.append("g").classed("eventTexts",1)

	chars.exit().remove();
	d3.selectAll(".character").attr("class",function(d) {return "character t"+d.teamID+" c"+d.id;})
		.on("click", function(d,j) {
			console.log(d);
			teamHighlighted=d.teamID;
			charHighlighted=j;
			console.log(teamHighlighted,charHighlighted);
			d3.selectAll(".highlighted").classed("highlighted",0);
			d3.selectAll(".t"+teamHighlighted).classed("highlighted",1);
			d3.selectAll(".team text").style("visibility",function(d,i) {return ((d.team.length<d.halfchord/5)||i==teamHighlighted)?"visible":"hidden"})
			newdraw(i,true);
		})
	d3.selectAll(".character").transition().ease(ease).attr("transform",function(d) {return "translate("+d.x+","+d.y+")";})
	//.duration(1000)
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
	})

	if(teamHighlighted>-1) {
		console.log("painting the town red")
		d3.selectAll(".highlighted").classed("highlighted",0);
		d3.selectAll(".t"+teamHighlighted).classed("highlighted",1);
	}
	if(!mode){
	times[i].recentEvents.forEach(function(e) {
		var d=times[i].characters[e.id];//console.log(d);

		myChar=d3.select(".c"+d.id);
		myChar.select(".events").append("circle").attr({r:d.r}).style({opacity:.5,fill:colors[e.type]}).transition().delay(750).duration(250).attr("r",d.r*2).style("opacity",0).each("end",function() {d3.select(this).remove();})
		myChar.select(".eventTexts").append("text").
		attr({x:0,y:d3.min([-10,-d.r-5]),"text-anchor":"middle"})
		.style({"fill":colors[e.type],opacity:1,stroke:"none"})
		.text(d.name)
		.transition().duration(1000).style("opacity",0).each("end",function() {d3.select(this).remove();})
		myChar.select(".eventTexts").append("text").
		attr({x:-1,y:d3.min([-10,-d.r-5])+1,"text-anchor":"middle"})
		.style({"fill":"black",opacity:1,stroke:"none"})
		.text(d.name)
		.transition().duration(1000).style("opacity",0).each("end",function() {d3.select(this).remove();})
		myChar.select(".eventTexts").append("text").attr({x:-1,y:d.r+16,"text-anchor":"middle"}).style({"fill":"black",opacity:1,stroke:"none"}).text(e.type)
		.transition().delay(750).duration(250).style("opacity",0).each("end",function() {d3.select(this).remove();})
		myChar.select(".eventTexts").append("text").attr({x:0,y:d.r+15,"text-anchor":"middle"}).style({"fill":colors[e.type],opacity:1,stroke:"none"}).text(e.type)
		.transition().delay(750).duration(250).style("opacity",0).each("end",function() {d3.select(this).remove();})
			
	})
	}

	if(charHighlighted>-1) {
		charInt=d3.select("#interface").select("#charInt");
		charInt.transition().style("opacity",1);
		charInt.select("#charName").text(charTimes[charHighlighted].name);

		var charMentioned=charTimes[charHighlighted].events.filter(function(d) {return (d.time<i&&d.type=="mentioned");})
		var charEvents=charTimes[charHighlighted].events.filter(function(d) {return (d.time<i&&d.type!=="mentioned");})
		charEvents=d3.nest().key(function(d) {return d.time;}).entries(charEvents);
		var markers=charInt.select("#charTimeLine").selectAll(".markers").data(charMentioned);
		markers.exit().remove();
		markers.enter().append("g").classed("markers",1).append("circle").attr({"cy":0,"r":2.5}).style({"fill":"#222","opacity":.5});
		markers.transition().attr("transform",function(d) {return "translate("+(d.time/maxStep)*720+",0)"})

		var markEvents=charInt.select("#charTimeLine").selectAll(".markEvents").data(charEvents);
		markEvents.exit().remove();
		markEvents.enter().append("g").classed("markEvents",1)
			.selectAll(".markEvent").data(function(d) {return d.values}).enter().append("circle").classed("markEvent",1)
			.attr({cy:function(d,i) {return -(i+1)*12;},r:3}).style("fill",function(d) {return colors[d.type];})
			
		markEvents.transition().attr("transform",function(d) {return "translate("+(+d.key/maxStep)*720+",0)"})
		markEvents.on("mouseover",drawModal)
			.on("mouseout",hideModal)
	} else {
		charInt=d3.select("#interface").select("#charInt");
		charInt.transition().style("opacity",0);
	}
}

function drawCharTimeline() {}
function drawModal(d,i) {
	d3.select("#infobox").style({display:"block"}).transition().style({left:202+(d.time/maxStep)*720+"px",top:660-(i+1)*12-30+"px"}).html("<h3>"+times[i].characters[charHighlighted].name+"</h3>"+story[d.type]+" "+isNan(d.details)?d.details:times[i].characters[d.details].name);
}
function hideModal() {
	d3.select("#infobox").style("display","none");
}