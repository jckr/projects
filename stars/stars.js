/*

        _ __   _ __  ___  _ __    __ _  _ __  __ _ | |_ (_)  ___   _ __  
       | '_ \ | '__|/ _ \| '_ \  / _` || '__|/ _` || __|| | / _ \ | '_ \ 
       | |_) || |  |  __/| |_) || (_| || |  | (_| || |_ | || (_) || | | |
       | .__/ |_|   \___|| .__/  \__,_||_|   \__,_| \__||_| \___/ |_| |_|
       |_|               |_|                                             
                       _                      _         _      _            
      __ _  _ __    __| | __   __ __ _  _ __ (_)  __ _ | |__  | |  ___  ___ 
     / _` || '_ \  / _` | \ \ / // _` || '__|| | / _` || '_ \ | | / _ \/ __|
    | (_| || | | || (_| |  \ V /| (_| || |   | || (_| || |_) || ||  __/\__ \
     \__,_||_| |_| \__,_|   \_/  \__,_||_|   |_| \__,_||_.__/ |_| \___||___/
     
*/

// First thing first, we add an svg component to the chart



// and a div for the buttons. since it has to be above the svg it's easier if it's added programatically than if it's in the HTML.

//var buttons=d3.selectAll("#chart").append("div").classed("buttons",1);
var buttons=d3.selectAll(".buttons").select("ul");
var menu=d3.selectAll(".tab-content");
menu.selectAll("#rotten").on("click",function() {changeX('rotten');});
menu.selectAll("#audience").on("click",function() {changeX('audience');});
menu.selectAll("#story1").on("click",function() {changeX('nbPerStory');});

menu.selectAll("#profit").on("click",function() {changeY('profit%');});
menu.selectAll("#avgEarnings1").on("click",function() {changeY('avgEarnings');});

menu.selectAll("#budget").on("click",function() {changeSize('budget');});
menu.selectAll("#nbItems").on("click",function() {changeSize('nbItems');});
menu.selectAll("#avgEarnings2").on("click",function() {changeSize('avgEarnings');});

menu.selectAll("#specialmode1").on("click",function() {intoSpecialMode(1);});
menu.selectAll("#specialmode2").on("click",function() {intoSpecialMode(2);});



// this variable will be used to address concurrent transitions.

var inTransition=0;

// some variables 

var stars=new Array;
var starsNb=644;
var structNb=4;
var storyTypes=22;
var myColors=d3.scale.category20c();

var panelTab=0;

var colorXp="#073F69";
var colorSt="mediumvioletred";//"#66D9F2";
var colorStarlet1="pink";//"#073F69";
var colorStarlet2="gold";//"#073F69";
var colorBcg="white";

var w=640,h=640;
var mw1=40,mh1=0,mw2=20,mh2=40;
var k=.5;


var svg=d3.selectAll("#chart").append("svg:svg").attr("width",w+"px").attr("height",h+"px");


movies=movies.filter(function(m) {return m.p!=".."&&m.c!="..";});
movies.forEach(function(d,i) {d.id=i;})


var axes={
	'rotten':{low:0,high:100,text:"Rotten tomatoes score",idx:"rotten",max:"100",min:"0"},
	'audience':{low:0,high:100,text:"Audience ratings",idx:"audience",max:"100",min:"0"},
	'storyType':{low:-1,high:22,text:"Story type",max:"",min:""},
	'nbPerStory':{low:0,high:100,text:"Number of movies per story",idx:"story1",max:"100",min:"0"},
	
	'profit%':{low:0,high:800, text:"Profitability (earnings/budget)", idy:"profit",max:"800%",min:"0%"}, //original
	//'profit%':{low:50,high:600}, //to zoom story view appropriately
	'profitAll':{low:0,high:5000,text:"Profitability (earnings/budget) ",max:"5,000%",min:"0%"},
	'avgEarnings':{low:0,high:1000,text:"Average earnings", idy:"avgEarnings1",ids:"avgEarnings2",max:"$1b",min:"$0"},
	'avgEarningsAll':{low:0,high:2200,text:"Average earnings",max:"$2.2b",min:"$0"},
	
	'nbItems':{low:0,high:100, ids:"nbItems"}, //original
	//'nbItems':{low:0,high:500}, // I'm turning this back, sorry :(
	'totEarnings':{low:0,high:1000}, // this, too. instead, use avg earnings
	//'totEarnings':{low:0,high:2500},
	'budget':{low:0,high:1000, ids:"budget"} ,
	//'budget':{low:0,high:2500}
	
	'totEarnings2':{low:0,high:35000}
};
	
var x=function(d,myAxis,jittering) {
	//jittering=true;
	myAxis=myAxis||xAxis;
	if(d==".."){d=.5*(axes[myAxis].low+axes[myAxis].high);}
	var scale=d3.scale.linear().domain([axes[myAxis].low,axes[myAxis].high]).range([mw1,w-mw2]).clamp([true]);
	
	if (jittering) 
		{return scale(d)+(5*Math.random()-2);}
	else 
		{return scale(d);}
}

var y=function(d,myAxis,clamped) {
	if (clamped===undefined){clamped=true;}
	myAxis=myAxis||yAxis;
	if(d==".."){d=.5*(axes[myAxis].low+axes[myAxis].high);}
	var scale=d3.scale.linear().domain([axes[myAxis].low,axes[myAxis].high]).range([h-mh2,mh1]).clamp([clamped]);
	return scale(d);
}

var sizeScale=function(d,myAxis) {
	myAxis=myAxis||sizeAxis;
	if(d==".."){d=.5*(axes[myAxis].low+axes[myAxis].high);}
	var scale=d3.scale.sqrt().domain([axes[myAxis].low,axes[myAxis].high]).range([0,50]).clamp([true]);
	return scale(d);
}


var xAxis='rotten';	// can be: rotten, audience, storyType, nbPerStory;
var yAxis='profit%';	// can be: profit%, avgEarnings;
var sizeAxis='nbItems'; // can be: nbItems, avgEarnings, budget

var specialMode=0;


// This is a helper function that draws the star.

var c1=Math.cos(.2*Math.PI),c2=Math.cos(.4*Math.PI),
    s1=Math.sin(.2*Math.PI),s2=Math.sin(.4*Math.PI),
    r=1,
    
    // ok the constant after r1 is the thickness of the branches. 1 is a "straight" star, less is narrower, more is thicker.
    
    r1=1.5*r*c2/c1,
    star=[[0,-r],[r1*s1,-r1*c1],[r*s2,-r*c2],[r1*s2,r1*c2],[r*s1,r*c1],[0,r1],[-r*s1,r*c1],[-r1*s2,r1*c2],[-r*s2,-r*c2],[-r1*s1,-r1*c1],[0,-r]];
    
lineStar=function(k) {
	var line=d3.svg.line()
		.x(function(d) {return d[0]*k;})
		.y(function(d) {return d[1]*k;})
		//.interpolate("cardinal"); // eh? and why not. it makes for more interesting stars.
	return line(star)+"Z";
}

lilCursor=function(k) {
	var sketch=[[0,0],[-k,k],[-k,1.5*k],[k,1.5*k],[k,k]];
	return d3.svg.line().x(function(d) {return d[0];}).y(function(d) {return d[1];})(sketch)+"Z";
}

// lineMe can be used without arguments to draw a star the size for the selected object

lineMe=function(d) {return lineStar(d.size[sizeAxis]);}

// translate moves and rotates the star.
	
translate=function(d) {
	var x=d.x[xAxis],y=d.y[yAxis];
	return "translate("+x+","+y+") rotate("+(10*(x+y)%360)+")";} 

translateSpecial=function(d,mode) {
	var y;
	if (mode==2) {y=d.y['avgEarningsAll'];} else {y=d.y['profitAll'];}
	var x=d.x['storyType']
	return "translate("+x+","+y+") rotate("+(10*(x+y)%360)+")";} 


// helper function to make transform attributes easier to type.



	
	



calcP = function(d) {return 100*d3.sum(d,function(s) {return s.gross;})/d3.sum(d,function(s) {return s.budget;});}

// some radial gradients which we may not use. but just in case they're here.
// use: .style("fill","url(#grad16)") where 16 can really be any number between 0 and 22 or "Struct"

var rg=svg.append("svg:defs").selectAll("radialGradient").data(storyData).enter().append("svg:radialGradient")
	.attr("id",function(d,i) {return "grad"+i;})
	.attr("cx","50%").attr("cy","50%").attr("r","100%")
	.selectAll("stop").data(function(d) {return [d.color,colorBcg];}).enter().append("svg:stop")
		.attr("offset", function(d,i) {return i;})
		.style("stop-color",String);
svg.selectAll("defs").append("svg:radialGradient")
	.attr("id","gradStruct")
	.attr("cx","50%").attr("cy","50%").attr("r","100%")
	.selectAll("stop").data(function(d) {return [colorSt,colorBcg];}).enter().append("svg:stop")
		.attr("offset", function(d,i) {return i;})
		.style("stop-color",String);

// now these are the variables that are going to be passed to the shapes.

// and before we even get there we are going to enrich the movies variable by computing various ranks.

// I'm thinking: budget, earnings, profit%, audience, rotten - total, by year, by story genre

// first pass. 

movies.forEach(function(m) {m.rank=new Object;})

function sortKey(key,mode,criterion) {
	if (key===undefined) {movies.sort(function(a,b) {return a[key]-b[key];})}
	else {
	if(mode===undefined) {mode="total";}
	movies.filter(function(d) {return (d[key]!="..")&&(mode=="story"?d.s==criterion:true)&&(mode=="year"?d.Year==criterion:true);})
		.sort(function(a,b) {return b[key]-a[key];})
		.forEach(function(m,i) {m.rank[mode+key]=(i+1);})
	;}
}

var crits=["Budget","gross","p","AudienceScore","RottenTomatoes"];
var years=[2007,2008,2009,2010,2011];
crits.forEach(function(c) {
	sortKey(c);
	storyData.forEach(function(s,i) {sortKey(c,"story",i);})
	years.forEach(function(y) {sortKey(c,"year",y);})
})

// this puts the movies array back in its original order.

sortKey();

// ok now every movie in the set has a rank object which stores: 
/*
{totalBudget - rank of budget across all movies
 totalgross - rank of earnings (all movies included)
 totalp - rank of profitability (all movies included)
 totalAudienceScore - rank of audience (all movies included)
 totalRottenTomatoes - rank of RT (all movies included)
 
 storyBudget - rank of budget across movies with same story
 storygross - rank of earnings (across movies with same story)
 storyp - rank of profitability (across movies with same story)
 storyAudienceScore - rank of audience (across movies with same story)
 storyRottenTomatoes - rank of RT (across movies with same story)

 yearBudget - rank of budget across movies with same year
 yeargross - rank of earnings (across movies with same year)
 yearp - rank of profitability (across movies with same year)
 yearAudienceScore - rank of audience (across movies with same year)
 yearRottenTomatoes - rank of RT (across movies with same year)}*/
  


stars=movies.map(function(d,i) {
	myStar={id:d.id,gross:d.gross,budget:d.Budget,c:d.c,p:d.p,story:d.s,rotten:d.RottenTomatoes, audience:d.AudienceScore};
	
	myStar.x={'rotten':x(d.RottenTomatoes,'rotten',true),
		  'audience':x(d.AudienceScore,'audience',true),
		  'storyType':x(d.s,'storyType',true),
		  'nbPerStory':x(movies.filter(function(m) {return m.s==d.s;}).length, 'nbPerStory',true)};
	
	myStar.y={'profit%':y(d.p,'profit%'),
		  'avgEarnings':y(d.gross,'avgEarnings'),
		  'profitAll':y(d.p,'profitAll'),
		  'avgEarningsAll':y(d.gross,'avgEarningsAll'),
		  };
	
	myStar.size={'nbItems':sizeScale(1,'nbItems'),
		     'totEarnings':sizeScale(d.gross,'totEarnings'),
		     'avgEarnings':sizeScale(d.gross,'avgEarnings'),
		     'budget':sizeScale(d.Budget,'budget')};
	
	return myStar;
;})

stories=d3.range(storyTypes).map(function(d,i) {
	var myStars=stars.filter(function(s) {return s.story==d;});
	
	var audience=d3.mean(myStars,function(s) {return s.audience;})
	var rotten=d3.mean(myStars,function(s) {return s.rotten;})
	var nbPerStory=myStars.length;
	
	var myC=d3.mean(myStars,function(s) {return s.c;});
	var myP=calcP(myStars);
	
	var avgEarnings=d3.mean(myStars,function(s) {return s.gross;})
	var totEarnings=d3.sum(myStars,function(s) {return s.gross;})
	var avgBudget=d3.mean(myStars,function(s) {return s.budget;}) //changed to mean budget to size appropriately with stars
	var budget=d3.sum(myStars,function(s) {return s.budget;})
	
	var myP=calcP(myStars);
	var size=d3.max([10,myStars.length]);
	var struct=storyStruct[d];
	
	var myStory={c:myC,
		     p:myP,
		     struct:struct,
		     story:i,
		     nbPerStory:nbPerStory,
		     avgEarnings:avgEarnings,
		     totEarnings:totEarnings,
		     budget:budget,
		     collapsed:true,
		     ranks:{}};
	
	myStory.x={'rotten':x(rotten,'rotten'),
		  'audience':x(audience,'audience'),
		  'storyType':x(i,'storyType'),
		  'nbPerStory':x(nbPerStory, 'nbPerStory')};
		
	myStory.y={'profit%':y(myP,'profit%'),
		  'avgEarnings':y(avgEarnings,'avgEarnings'),
		  'profitAll':y(myP,'profitAll'),
		  'avgEarningsAll':y(avgEarnings,'avgEarningsAll')};
		  
	myStory.size={'nbItems':sizeScale(nbPerStory,'nbItems'),
		     'totEarnings':sizeScale(totEarnings,'totEarnings'), 
		     'avgEarnings':sizeScale(totEarnings,'avgEarnings'), 
		     'budget':sizeScale(avgBudget,'budget')};

	return myStory;
})



structs=d3.range(structNb).map(function(d,i) {
	var myStories=stories.filter(function(s) {return s.struct==d;});
	var myStars=stars.filter(function(s) {return storyStruct[s.story]==d;});
	
	var audience=d3.mean(myStars,function(s) {return s.audience;})
	var rotten=d3.mean(myStars,function(s) {return s.rotten;})
	var nbItems=myStars.length;
	var nbPerStory=d3.mean(myStories,function(s) {return s.nbPerStory;})
	
	var avgEarnings=d3.mean(myStars,function(s) {return s.gross;})
	var totEarnings=d3.sum(myStars,function(s) {return s.gross;})
	var budget=d3.mean(myStars,function(s) {return s.budget;}) //changed to mean budget to size appropriately with stars
	
	var myP=100*d3.sum(myStories,function(s) {return s.totEarnings;})/d3.sum(myStories,function(s) {return s.budget;});
		
	var myC=d3.mean(myStories,function(s) {return s.c;});
	
	
	var myStruct={c:myC,p:myP,struct:i,nbPerStory:nbPerStory,
		     avgEarnings:avgEarnings,
		     totEarnings:totEarnings,
		     budget:budget,
		     collapsed:true,
		     ranks:{}};

	myStruct.x={'rotten':x(rotten,'rotten'),
		  'audience':x(audience,'audience'),
		  'storyType':x(i,'storyType'),
		  'nbPerStory':x(nbPerStory, 'nbPerStory')};
	myStruct.y={'profit%':y(myP,'profit%'),
		    'avgEarnings':y(avgEarnings,'avgEarnings'),
		    'profitAll':y(myP,'profitAll'),
		    'avgEarningsAll':y(avgEarnings,'avgEarningsAll')};
	myStruct.size={'nbItems':sizeScale(nbItems,'nbItems'),
		     'avgEarnings':sizeScale(totEarnings,'avgEarnings'), 
		     'totEarnings':sizeScale(totEarnings,'totEarnings'), 
		     'budget':sizeScale(budget,'budget')};

	
	return myStruct;
	
})

// adding ranks for stories and structs, too.


var critsStory=["budget","totEarnings","p","nbPerStory","avgEarnings"];

critsStory.forEach(function(c) {
	stories.sort(function(a,b) {return (b[c]-a[c]);})
	stories.forEach(function(s,i) {s.ranks[c]=(i+1);})
	structs.sort(function(a,b) {return (b[c]-a[c]);})
	structs.forEach(function(s,i) {s.ranks[c]=(i+1);})
})
stories.sort(function(a,b) {return (a.story-b.story);})
structs.sort(function(a,b) {return (a.struct-b.struct);})



// I'm creating one group for stars, stories and structs to keep them separated and tidy.

gStars=svg.append("svg:g").classed("stars",1);
gStories=svg.append("svg:g").classed("stories",1);
gStructs=svg.append("svg:g").classed("structs",1);

// and one for gridlines, too.


gGridlines=svg.append("svg:g").classed("gridlines",1);
addGridlines();
	

// now these are the shapes proper.
// originally I called them cStructs, cStories and cStars because they were circles, now they are svg:paths


var cStructs=gStructs.selectAll("path").data(structs).enter().append("svg:path")
	.attr("transform",translate)
	.attr("d",lineMe)
	.style("fill",colorSt).style("opacity",.6)
	.style("stroke",d3.rgb(colorSt).brighter())
	.style("stroke-width","2").style("stroke-opacity",1);
cStructs.append("svg:title").text(function(d,i) {return structData[i].name+" <span style='color:#ccc'>click to expand</span>";})

var cStories=gStories.selectAll("path").data(stories).enter().append("svg:path")
	.attr("transform",function(d) {return translate(structs[d.struct]);})
	.attr("d",lineMe)
	.style("fill",function(d,i) {return storyData[i].color;}).style("opacity",.7)
	.style("stroke",function(d,i) {return d3.rgb(storyData[i].color).brighter();})
	.style("visibility","hidden")
	;
cStories.append("svg:title").text(function(d,i) {return storyData[i].name+" <span style='color:#ccc'>click to expand</span>";})
	
var cStars=gStars.selectAll("path").data(stars).enter().append("svg:path")
	.attr("d",lineMe)
	.attr("transform",function(d) {return translate(stories[d.story]);})
	.style("fill",function(d) {return storyData[d.story].color;}).style("opacity",.8)
	.style("visibility","hidden")
	;
cStars.append("svg:title").text(function(d,i) {return movies[i].Title+" <span style='color:#ccc'>click for details</span>";})




/*
            _  _        _                               _               
        ___ | |(_)  ___ | | __ ___    ___   _ __    ___ | |_  __ _  _ __ 
       / __|| || | / __|| |/ // __|  / _ \ | '_ \  / __|| __|/ _` || '__|
      | (__ | || || (__ |   < \__ \ | (_) || | | | \__ \| |_| (_| || |   
       \___||_||_| \___||_|\_\|___/  \___/ |_| |_| |___/ \__|\__,_||_|   
                                                                         
                           _                              
                      ___ | |__    __ _  _ __    ___  ___ 
                     / __|| '_ \  / _` || '_ \  / _ \/ __|
                     \__ \| | | || (_| || |_) ||  __/\__ \
                     |___/|_| |_| \__,_|| .__/  \___||___/
                                        |_|               
*/




cStructs.on("click", function(d,i) {

	// this explodes the struct into story stars
	inTransition++;
	updateStruct(i);
	d.collapsed=false;
	d3.select(".buttons").style("visibility","visible")
	var myButton=buttons.append("li").classed("button",1).html(structData[i].name)
		.classed("struct"+i,1)
		.classed("struct",1)
		.style("border","1px solid "+colorSt);
	myButton.on("click",function() {collapseStruct(d,i);});
	myButton.on("mouseover",function() {highlightStruct(i);})
	myButton.on("mouseout",function() {highlightStruct(-1);})
	myStories=cStories.filter(function(s) {return s.struct==i;});
	gStructs.append("svg:path").style("stroke","none").style("fill",colorXp).style("opacity",0.2)
			.attr("d",lineStar(d.size[sizeAxis]))
			.attr("transform",translate(d))
		.transition().attr("d",lineStar(1000)).duration(500).style("opacity",0).each("end",function() {d3.select(this).remove();})
	myStories.style("visibility","visible");
	myStories.each(function(s,i) {
			var starlets=~~Math.random(40)+20;starlets=d3.range(starlets).map(function(d) {
				var starletX=d3.scale.linear().range([structs[s.struct].x[xAxis]-25+50*Math.random(),s.x[xAxis]]);
				var starletY=d3.scale.linear().range([structs[s.struct].y[yAxis]-25+50*Math.random(),s.y[yAxis]]);
				var k=Math.random();
				return [d,starletX(k),starletY(k)]
			});
						
			gStories.selectAll(".starlets"+i)
				.data(starlets)
				.enter()
				.append("svg:circle")
				.classed("starlets"+i,1)
				.attr("cx",stories[s.struct].x[xAxis]).attr("cy",stories[s.struct].y[yAxis]).attr("r",2).style("fill",colorStarlet1).style("opacity",".5")
				.transition()
				.duration(200)
				.attr("cx",function(d) {return d[1];})
				.attr("cy",function(d) {return d[2];})
				.style("fill",colorStarlet2)
				.each("end",function() {d3.select(this).remove();})
			
			var trail=gStories.append("svg:line")
				.attr("x1",structs[s.struct].x[xAxis]).attr("x2",structs[s.struct].x[xAxis])
				.attr("y1",structs[s.struct].y[yAxis]).attr("y2",structs[s.struct].y[yAxis])
				.style("stroke","#ccc").style("opacity",1);
				
			trail.transition().duration(500)
					.style("opacity",0)
					.attr("x2",s.x[xAxis])
					.attr("y2",s.y[yAxis])
					.each("end",function(){d3.select(this).remove();});
			
	});
	
	
	myStories.transition()
		.duration(1000)
		.ease("elastic")
		.attr("transform",translate);
	d3.select(this).transition()
		.style("opacity",0)
		.each("end",function() {d3.select(this).style("opacity",.7).style("visibility","hidden");
		inTransition--;
		})
		
})

cStories.on("click", function(d,i) {

	// this explodes the story stars into movie stars.
	inTransition++;
	//console.log("you clicked on story #"+i);
	updateStory(i);
	d.collapsed=false;
	
	// this creates the corresponding button to collapse it back.
	d3.select(".buttons").style("visibility","visible")
	var myButton=buttons.append("li").classed("button",1).html(storyData[i].name)
		.style("background-color",function() {return storyData[i].color;})
		.classed("struct"+storyStruct[i],1)
		.classed("story"+i,1);
	myButton.on("click",function() {
			collapseStory(d,i);
		});
	myButton.on("mouseover",function() {highlightStory(i);})
	myButton.on("mouseout",function() {highlightStory(-1);})
	
	// selecting movie stars. they are normally positioned at the same place as the story star.
	
	myStars=cStars.filter(function(s) {return s.story==i;});
	myStars.style("visibility","visible");
	gStories.append("svg:path").style("stroke",colorXp).style("fill","none")
		.attr("d",lineStar(d.size[sizeAxis]))
		.attr("transform",translate(d))
		.transition().attr("d",lineStar(1000)).duration(500).style("opacity",0).each("end",function() {d3.select(this).remove();})
	myStars.each(function(s,i) {
	
		// we create "starlets" that we are going to move from approximately the story position, 
		// to somewhere along the way to the final position of the movie star. this randomness creates 
		// a trail effect
	
		var starlets=~~Math.random(10)+10;starlets=d3.range(starlets).map(function(d) {
			var starletX=d3.scale.linear().range([stories[s.story].x[xAxis]-10+20*Math.random(),s.x[xAxis]]);
			var starletY=d3.scale.linear().range([stories[s.story].y[yAxis]-10+20*Math.random(),s.y[yAxis]]);
			var k=Math.random();
			return [d,starletX(k),starletY(k)]});
		
		// once the data is created we create the corresponding nodes (here circles) and move them.
		
		gStars.selectAll(".starlets"+i)
			.data(starlets)
			.enter()
			.append("svg:circle")
			.classed("starlets"+i,1)
			.attr("cx",stories[s.story].x[xAxis]).attr("cy",stories[s.story].y[yAxis]).attr("r",2).style("fill","gold").style("opacity",".5")
			.transition().duration(200)
				.attr("cx",function(d) {return d[1];})
				.attr("cy",function(d) {return d[2];})
				.each("end",function() {d3.select(this).remove();})
		var myXScale=d3.scale.linear().range([stories[s.story].x[xAxis],s.x[xAxis]]);
		var myYScale=d3.scale.linear().range([stories[s.story].y[yAxis],s.y[yAxis]]);
		
		
		
		var trail=gStories.selectAll(".trail"+i).data(d3.range(1)).enter().append("svg:line").classed("trail"+i,1)
			.attr("x1",stories[s.story].x[xAxis]).attr("x2",stories[s.story].x[xAxis])
			.attr("y1",stories[s.story].y[yAxis]).attr("y2",stories[s.story].y[yAxis])
			.style("stroke","#ccc").style("opacity",.3).style("stroke-width",5);

		trail.transition().duration(500).ease("elastic")
				.style("opacity",0)
				.attr("x1",myXScale(0.2))
				.attr("y1",myYScale(0.2))
				.style("opacity",.05)
				.attr("x2",function(d) {return myXScale(1);})
				.attr("y2",function(d) {return myYScale(1);})
				.style("stroke-width",3)
		.each("end",function(){d3.select(this).remove();});
	});
	
	// now we are going to move all stars.
	
	myStars.transition()
		.duration(1000)
		.ease("elastic")		// for that bouncy effect
		.attr("transform",translate)	// moves it to the position corresponding to the data of the movie
		;
	
	// this final line hides the story star.
	
	d3.select(this).transition().style("opacity",0).each("end",function() {
		d3.select(this).style("opacity",0.7).style("visibility","hidden");
		inTransition--;
	});
		
})
	
collapseAll=function() {
	structs.forEach(collapseStruct);
	inTransition=0;
}



collapseStruct=function(d,i) {
	
	inTransition++;
	
	// this function collapses stories and stars within a structure
	
	myStruct=cStructs.filter(function(d,j) {return j==i;})
	
	// ok so what we do is first we send stories stars to the position of the struct,
	// they are selected,
	
	myStories=cStories.filter(function(s) {return s.struct==i});
	
	// then moved.
	
	myStories.transition()
		.delay(100)
		.duration(1000)
		.style("opacity",.5)
		.attr("transform", function(d) {return translate(structs[i]);})
		.each("end",function() {
			d3.select(this)
			.style("visibility","hidden")
			.style("opacity",0.8);	// at the end of the transition, we hide all the stars.
		});
		
	// we do the same for movie stars.	
	// select (it's actually simpler to move all stars regarless they are visible or not than figure out which ones are visible)
	
	myStars=cStars.filter(function(s) {return storyStruct[s.story]==i;});
	
	// this is (almost) the exact same transition as above
	
	myStars.transition()
		.delay(100)
		.duration(1000)
		.style("opacity",.5)
		.attr("transform", function(d) {return translate(structs[i]);})
		.each("end",function() {
			d3.select(this)
			.style("visibility","hidden")
			.style("opacity",0.8)	// so far it's exactly like the other one
			
	// we add one line to position the movie stars on top of the story stars, so the next time a story star is exploded, 
	// the movie stars will shoot from its position, not from the group star position.
	
			.attr("transform", function(d) {return translate(stories[d.story]);});
			
		});
	
	
	// we throw in a shrinking white star
	
	gStructs.append("svg:path").style("stroke",colorXp).style("fill","none")
			.attr("d",lineStar(1000))
			.style("stroke-width",100)
			.attr("transform",translate(structs[i]))
			.style("opacity",0)
			.transition()
				.attr("d",lineStar(structs[i].size[sizeAxis]))
				.duration(300).delay(100)
				.style("opacity",0.3)
				.each("end",function() {d3.select(this).remove();})
	
	// we remove all buttons that relate to that group.
	d3.selectAll(".buttons").selectAll(".struct"+i).transition()
		.duration(500)
		.style("height","0px")
		.style("opacity",0.2)
		.each("end",function() {
			
			d3.select(this).remove();
			if(!d3.selectAll(".button")[0].length) {d3.select(".buttons").style("visibility","hidden");}
			
		})
		
	// finally, we can now make the group star appear again.
		
		myStruct
			.attr("d",lineStar(0))
			.style("visibility","visible")
			.transition()
				.delay(1000)
				.duration(500)
				.attr("d",lineMe)
				.each("end",function() {inTransition--;})
				;
	
}

collapseStory=function(d,i) {
	d.collapsed=true;
	inTransition++;
	myStory=cStories.filter(function(s,i) {return i==d.story;})
	myStars=cStars.filter(function(s) {return s.story==d.story;})
	myStars.transition()
		.duration(500)
		.style("opacity",.5)
		.attr("transform",function(d) {return translate(stories[d.story]);})
		.each("end",function() {d3.select(this).style("opacity",.8).style("visibility","hidden");})
	
	gStories.append("svg:path").style("stroke",colorXp).style("fill","none")
		.attr("d",lineStar(1000))
		.attr("transform",translate(stories[d.story]))
		.style("opacity",0)
		.transition().attr("d",lineStar(k*stories[d.story].size[sizeAxis])).style("opacity",.8).each("end",function() {d3.select(this).remove();})
	
	d3.selectAll(".buttons").selectAll(".story"+i).transition()
			.duration(500)
			.style("height","0px")
			.style("opacity",0.2)
		.each("end",function() {d3.select(this).remove();if(!d3.selectAll(".button")[0].length) {d3.select(".buttons").style("visibility","hidden");}})
	
	myStory.attr("d",lineStar(0)).style("visibility","visible").transition()
		.delay(500)
		.duration(500)
		.attr("d",lineMe)
		.each("end",function() {inTransition--;});
	
}
/*
                    _              _                                     
        __ _ __  __(_) ___    ___ | |__    __ _  _ __    __ _   ___  ___ 
       / _` |\ \/ /| |/ __|  / __|| '_ \  / _` || '_ \  / _` | / _ \/ __|
      | (_| | >  < | |\__ \ | (__ | | | || (_| || | | || (_| ||  __/\__ \
       \__,_|/_/\_\|_||___/  \___||_| |_| \__,_||_| |_| \__, | \___||___/
                                                        |___/            

*/

function changeAxes(myXAxis,myYAxis,mySizeAxis,duration) {
	if(inTransition<1){
		xAxis=myXAxis;
		yAxis=myYAxis;
		sizeAxis=mySizeAxis;
		
		d3.selectAll("#normal li").classed("active",0);
		d3.selectAll("#"+axes[xAxis].idx).classed("active",1);
		d3.selectAll("#"+axes[yAxis].idy).classed("active",1);
		d3.selectAll("#"+axes[sizeAxis].ids).classed("active",1);
		
		
		if(!duration) {duration=1000;}
		if(specialMode) {outOfSpecialMode(duration);}
		else {
			// now move it

			cStructs.transition().duration(duration)
				.attr("transform",translate)
				.attr("d",lineMe);

			cStories.filter(function(d) {return d.collapsed;}).transition().duration(duration)
				.attr("transform",translate)
				.attr("d",lineMe);
			cStories.filter(function(d) {return !d.collapsed;}).transition().duration(duration)
				.attr("d",lineMe);

			cStars.filter(function(d) {return !stories[d.story].collapsed;}).transition().duration(duration)
				.attr("transform",translate)
				.attr("d",lineMe);
			cStars.filter(function(d) {return stories[d.story].collapsed;}).transition().duration(duration)
				.attr("d",lineMe);
			updateAxes(xAxis,yAxis);
		}
	}
}	


function changeX(myAxis) {changeAxes(myAxis,yAxis,sizeAxis);}
function changeY(myAxis) {changeAxes(xAxis,myAxis,sizeAxis);}
function changeSize(myAxis) {changeAxes(xAxis,yAxis,myAxis);}



function intoSpecialMode(mode) {
	if (mode===undefined) {mode=1;}
//	if(!inTransition){
		if (!specialMode) {
			specialMode=1;		
			var duration=1000;
			cStructs.transition().duration(duration).style("opacity",0).each("end",function() {d3.select(this).style("visibility","hidden").style("opacity",0.6)});
			cStories.transition().duration(duration).style("opacity",0).each("end",function() {d3.select(this).style("visibility","hidden").style("opacity",0.7)});
			d3.selectAll(".buttons").transition().duration(duration).style("opacity",0);
		}
		cStars.style("visibility","visible")
			.transition()	
			.duration(1.5*duration)	
			.style("opacity",.8)	
			.attr("transform",function(d) {return translateSpecial(d,mode);})
			.attr("d",function(d) {return lineStar(d.size['nbItems']);})
		updateAxes("storyType","profitAll");
//	}
}

function outOfSpecialMode(duration) {
	if(inTransition<1){
		if(!duration) {duration=1000;}
		d3.selectAll(".buttons").transition().duration(duration).style("opacity",1);
		cStars.filter(function(d) {return stories[d.story].collapsed;})
			.transition().duration(duration)
			.style("opacity",0)
			.attr("transform",function(d) {return translate(stories[d.story]);})
			.attr("d",lineMe)
			.each("end",function() {d3.select(this).style("visibility","hidden").style("opacity",0.8);})
		
		cStars.filter(function(d) {return !stories[d.story].collapsed;})
			.transition().duration(duration)
			.attr("transform",translate)
			.attr("d",lineMe)
			
		cStories.filter(function(d) {return d.collapsed;})
			.style("opacity",0)
			.style("visibility","visible")
			.transition().duration(2*duration)
			.attr("transform",translate)
			.attr("d",lineMe)
			.style("opacity",0.7);
			
		cStructs.filter(function(d) {return !d.collapsed;})
			.style("opacity",0)
			.style("visibility","visible")
			.transition().duration(2*duration)
			.attr("transform",translate)
			.attr("d",lineMe)
			.style("opacity",0.6);
		updateAxes(xAxis,yAxis);
		specialMode=0;
	}
}
function addGridlines(){
// adds gridlines.
	gGridlines.selectAll("line").remove();
	var x1=d3.scale.linear().domain([axes[xAxis].low,axes[xAxis].high]).range([mw1,w-mw2]);
	var y1=d3.scale.linear().domain([axes[yAxis].low,axes[yAxis].high]).range([h-mh2,mh1]);

	gGridlines.selectAll(".glh").data(y1.ticks(6)).enter().append("svg:line").classed("glh",1)
		.attr("x1",mw1).attr("x2",w-mw2).attr("y1",y1).attr("y2",y1);
	gGridlines.selectAll(".glv").data(x1.ticks(5)).enter().append("svg:line").classed("glv",1)
		.attr("x1",x1).attr("x2",x1).attr("y1",mh1).attr("y2",h-mh2);
	
	gGridlines.append("svg:line").classed("yAxis",1)
			.attr("x1",mw1).attr("x2",w-mw2).attr("y1",h-mh2).attr("y2",h-mh2);
	gGridlines.append("svg:line").classed("xAxis",1)
		.attr("x1",mw1).attr("x2",mw1).attr("y1",mh1).attr("y2",h-mh2);
	
	gGridlines.append("svg:text").attr("x",w-mw2-40).attr("y",h-(mh2/2)).classed("gxlabel",1)
		.text(axes[xAxis].text).attr("text-anchor","end");
		
	gGridlines.append("svg:text").attr("x",mh1-40).attr("y",mw1/2).classed("gylabel",1)
		.text(axes[yAxis].text).attr("text-anchor","end").attr("transform","rotate(-90)");
	
	gGridlines.append("svg:text").attr("x",w-mw2).attr("y",h-(mh2/2)).classed("gxmax",1)
		.text(axes[xAxis].max).attr("text-anchor","end");
	gGridlines.append("svg:text").attr("x",mw1).attr("y",h-(mh2/2)).classed("gxmin",1)
		.text(axes[xAxis].min)
			
	gGridlines.append("svg:text").attr("x",.5*mw1).attr("y",mh2/2-10).classed("gymax",1)
		.text(axes[yAxis].max).attr("text-anchor","middle")
	gGridlines.append("svg:text").attr("x",.5*mw1).attr("y",h-mh2).classed("gymin",1)
		.text(axes[yAxis].min).attr("text-anchor","middle")
	
	
}

function updateAxes(myxAxis,myyAxis) {
	if(myxAxis===undefined){myxAxis=xAxis;}
	if(myyAxis===undefined){myyAxis=yAxis;}
	if(axes[myxAxis].text!=gGridlines.selectAll(".gxlabel").text()){
		gGridlines.selectAll(".gxlabel").transition().style("opacity",0).each("end",function() {
			d3.select(this).text(axes[myxAxis].text).transition().style("opacity",1);})
		gGridlines.selectAll(".gxmax").transition().style("opacity",0).each("end",function() {
			d3.select(this).text(axes[myxAxis].max).transition().style("opacity",1);
		})
		gGridlines.selectAll(".gxmin").transition().style("opacity",0).each("end",function() {
			d3.select(this).text(axes[myxAxis].min).transition().style("opacity",1);
		})
	}
	if(axes[myyAxis].text!=gGridlines.selectAll(".gylabel").text()){
		gGridlines.selectAll(".gylabel").transition().style("opacity",0).each("end",function() {
			d3.select(this).text(axes[myyAxis].text).transition().style("opacity",1);})
		gGridlines.selectAll(".gymax").transition().style("opacity",0).each("end",function() {
			d3.select(this).text(axes[myyAxis].max).transition().style("opacity",1);
		})
		gGridlines.selectAll(".gymin").transition().style("opacity",0).each("end",function() {
			d3.select(this).text(axes[myyAxis].min).transition().style("opacity",1);
		})

	}
	
	/*
	// these are average lines. need refactoring, disabling for now.


	gGridlines.data([calcP(stars)]).append("svg:line").classed("avgP",1)
		.attr("x1",mw).attr("x2",w).attr("y1",y).attr("y2",y);

	gGridlines.data([d3.mean(movies,function(d) {return d.c;})]).append("svg:line").classed("avgC",1)
		.attr("x1",x).attr("x2",x).attr("y1",mh).attr("y2",h);*/

}
/*
     _                        _  _  _                 _          __        
    | |__    __ _  _ __    __| || |(_) _ __    __ _  (_) _ __   / _|  ___  
    | '_ \  / _` || '_ \  / _` || || || '_ \  / _` | | || '_ \ | |_  / _ \ 
    | | | || (_| || | | || (_| || || || | | || (_| | | || | | ||  _|| (_) |
    |_| |_| \__,_||_| |_| \__,_||_||_||_| |_| \__, | |_||_| |_||_|   \___/ 
                                              |___/                        
                                                     _ 
                          _ __    __ _  _ __    ___ | |
                         | '_ \  / _` || '_ \  / _ \| |
                         | |_) || (_| || | | ||  __/| |
                         | .__/  \__,_||_| |_| \___||_|
                         |_|                           

*/
var littlestar={}
updatePanel=function(d) {
	var p1=d3.select(".p1");
	var panel=d3.select("#panel");
	p1.style("display","block");
	var movie=movies[d.id];
	
	// twinkle twinkle little star
	;
	if (stories[movie.s].collapsed) {
		if(structs[stories[movie.s].struct].collapsed) {
			littlestar.x=structs[stories[movie.s].struct].x[xAxis];littlestar.y=structs[stories[movie.s].struct].y[yAxis];}
		else {
		littlestar.x=stories[movie.s].x[xAxis];littlestar.y=stories[movie.s].y[yAxis];}
	}
	else {littlestar.x=stars[d.id].x[xAxis];littlestar.y=stars[d.id].y[yAxis];}
	
	gStars.append("svg:path").classed("selectStar",1).attr("d",lineStar(0)).style("stroke",colorSt).style("fill","none").style("stroke-opacity",.5).style("stroke-width",3).attr("transform",function() {return "translate("+littlestar.x+","+littlestar.y+")";})
		.transition().duration(500).attr("d",lineStar(20)).each("end",function() {d3.select(this).remove();
		})
	
	var barFill="darkorange";
	panelTabs=0;	
	var bScale=d3.scale.linear().range([0,100]).clamp([true]);
	var fScale=d3.scale.linear().range(["chartreuse","#FF7E00","crimson"]);
	
	var barData=[
		{key:"Budget",axis:"budget",text:"Budget",ranks:["totalBudget","storyBudget","yearBudget"]},
		{key:"gross",axis:"avgEarnings",text:"Earnings",ranks:["totalgross","storygross","yeargross"]},
		{key:"p",axis:"profit%",text:"Profitability",ranks:["totalp","storyp","yearp"]},
		{key:"AudienceScore",axis:"audience",text:"Audience",ranks:["totalAudienceScore","storyAudienceScore","yearAudienceScore"]},
		{key:"RottenTomatoes",axis:"rotten",text:"Rotten Tomatoes",ranks:["totalRottenTomatoes","storyRottenTomatoes","yearRottenTomatoes"]}];
	
	panel.html("<a href=\"#nogo\" class=\"close\">×</a><div class=\"row\"><img style=\"float:left;margin:0 10 10 0px\"/><h2></h2><p><strong>Directed by: </strong><span id='director'></span></p><p><strong>Starring: </strong><span id='actors'></span></p><p><strong>Plot: </strong><span id='plot'></span></p></div><div class=\"row\"><p><strong>Story type:&nbsp;</strong><a href=\"#nogo\" id='s'></a></p><ul id=\"pStarPills\" class=\"nav nav-pills\" style=\"font-size:11px\"><li style=\"height:34px;margin-right:10px\"><span style=\"display:block;padding-top:8px;padding-bottom:8px;\"><strong>Movie ranks within:</strong></span></li><li id=\"byAll\" class=\"active\"><a href=\"#\">All</a></li><li id=\"byStory\"><a href=\"#\">Story</a></li><li id=\"byYear\"><a href=\"#\">Year</a></li></ul><div id=\"panelBars\"></div></div>");
	panel.select("h2").html(movie["Title"]+"&nbsp").append("small").html(movie["Year"])
	
	
	panel.select("img").attr("src","images/"+movie["ID"]+".jpg");
	panel.select("#plot").html(movie["Plot"]);
	panel.select("#director").html(movie["Director"]);
	panel.select("#actors").html(movie["Actors"]);
	panel.select("#s").html(storyData[movie.s].name).on("click",function() {updateStory(movie.s);});
	
	var panelBars=panel.selectAll("#panelBars").append("svg:svg").attr("id","bars").attr("height","120px").style("font-size","11	px");
	var bars=panelBars.selectAll("g").data(barData).enter().append("svg:g").attr("transform",function(d,i) {return "translate(0,"+(20*i)+")";})
	bars.append("svg:line").attr("x1",100).attr("x2",200).attr("y1",16).attr("y2",16).style("stroke","#ccc").style("stroke-width","1px");

	var myRects=bars.append("svg:rect")
		.attr("x",100).attr("y",5).attr("height",10)
		.style("fill",function(d) {
			return isNaN(movie[d.key])?"none":fScale.domain([0,.5,1])(movie.rank[d.ranks[0]]/+movies.length)
		;})
		.attr("width",0);
	myRects.transition().attr("width",function(d) {return isNaN(movie[d.key])?0:(bScale.domain([axes[d.axis].low,axes[d.axis].high])(movie[d.key]));});
	
	bars.append("svg:text").attr("x",97).attr("y",14).attr("text-anchor","end").text(function(d) {return d.text+":";});
	bars.append("svg:text").attr("y",14).style("text-align","end").text(function(d) {return isNaN(movie[d.key])?"":movie[d.key].toFixed(0);}).attr("x",110).transition().attr("x",function(d) {return 110+bScale.domain([axes[d.axis].low,axes[d.axis].high])(isNaN(movie[d.key])?130:movie[d.key]);});
	myRects.append("svg:title").classed("bRank",1).text(function(d) {return isNaN(movie[d.key])?"":(movie.rank[d.ranks[0]]+"/"+movies.length);});
	
	var myMarks=bars.append("svg:path").attr("transform","translate(100,17)").attr("d",lilCursor(3)).style("fill","#333");
	myMarks.transition()
		.attr("transform" ,function(d) {return "translate("+(100+bScale.domain([axes[d.axis].low,axes[d.axis].high])(d3.mean(movies, function(m) {return m[d.key];})))+",17)";})
	myMarks.append("svg:title").text(function(d) {return "Average: "+d3.mean(movies, function(m) {return m[d.key];}).toFixed(0);})
	
	panel.selectAll("li a").on("click",function(d,i) {
		var myGroup;
		if(i==0) {myGroup=movies;}
		if(i==1) {myGroup=movies.filter(function(m) {return m.s==movie.s;});}
		if(i==2) {myGroup=movies.filter(function(m) {return m.Year==movie.Year;});}
		
		panel.selectAll("li").classed("active",0);
		panel.selectAll("li").filter(function(x,j) {return j==i+1;}).classed("active",1);
		bars.selectAll(".bRank").text(function(b) {
			return isNaN(movie[b.key])?"":(movie.rank[b.ranks[i]]+"/"+myGroup.length);
		;});
		myRects.transition()
			.style("fill",function(b) {
				return isNaN(movie[b.key])?"none":fScale.domain([0,.5,1])(movie.rank[b.ranks[i]]/+myGroup.length)
			;})
		myMarks.transition()
			.attr("transform" ,function(d) {return "translate("+(100+bScale.domain([axes[d.axis].low,axes[d.axis].high])(d3.mean(myGroup, function(m) {return m[d.key];})))+",17)";})
		myMarks.selectAll("title").text(function(d) {return "Average: "+d3.mean(myGroup, function(m) {return m[d.key];}).toFixed(0);})
		
	;})
	
	panel.selectAll(".close").on("click",function() {p1.style("display","none");})
	$('rect, path').tipsy({html: true, gravity: 's'});
}

updateStory=function(i) {
	
	var story=stories[i];
	var p1=d3.select(".p1");
	var panel=d3.select("#panel");
	p1.style("display","block");
	panel.html("<a href=\"#nogo\" class=\"close\">×</a><div class=\"row\"><div><h2></h2><div class='desc'></div></div></div><div class=\"row\"><div id=\"storyBars\"></div></div></div>");
	panel.selectAll(".close").on("click",function() {p1.style("display","none");})
	panel.selectAll(".desc").append("p").html(storyData[i].desc+". <br/>Part of the <a href=\"#nogo\">"+structData[storyStruct[i]].name+"</a> group. ").selectAll("a").on("click",function() {updateStruct(storyStruct[i]);});
	panel.selectAll("h2").html(storyData[i].name);
	
	var myMovies=movies.filter(function(m) {return m.s==i;}).map(function(m) {return {id:m.id,sort:Math.random()};}).sort(function(a,b) {return a.sort-b.sort;}).slice(0,3).map(function(m) {return m.id;});
	panel.selectAll(".desc").append("p").html("Examples of movies of that group include: ").selectAll(".movies").data(myMovies).enter().append("span")
		.html(function(d,i) {return "<a href=\"#nogo\">"+movies[d].Title+"</a>"+((i==myMovies.length-2)?" or ":(i==myMovies.length-1?".":", "));})
		.on("click",function(d) {updatePanel(movies[d]);})
	
	var barFill="darkorange";
	var bScale=d3.scale.linear().range([0,100]).clamp([true]);
	var fScale=d3.scale.linear().range(["chartreuse","#FF7E00","crimson"]);//["#7aa6fe","#ffa448","red"]);

	
	
	var barData=[
			{key:"budget",axis:"budget",text:"Budget"},
			{key:"avgEarnings",axis:"avgEarnings",text:"Earnings (avg.)"},
			{key:"totEarnings",axis:"totEarnings",text:"Earnings (total)"},
			{key:"p",axis:"profit%",text:"Profitability"},
			{key:"nbPerStory",axis:"nbPerStory",text:"# movies"}
		];
	
	var panelBars=panel.selectAll("#storyBars").append("svg:svg").attr("id","bars").attr("height","120px").style("font-size","11	px");
	var bars=panelBars.selectAll("g").data(barData).enter().append("svg:g").attr("transform",function(d,i) {return "translate(0,"+(20*i)+")";})
	bars.append("svg:line").attr("x1",100).attr("x2",200).attr("y1",16).attr("y2",16).style("stroke","#ccc").style("stroke-width","1px");
	var myRects=bars.append("svg:rect")
		.attr("x",100).attr("y",5).attr("height",10)
		.style("fill",function(d) {
			return isNaN(story[d.key])?"none":fScale.domain([0,.5,1])(story.ranks[d.key]/stories.length)
		;})
		.attr("width",0);
	myRects.transition().attr("width",function(d) {return isNaN(story[d.key])?0:(bScale.domain([axes[d.axis].low,axes[d.axis].high])(story[d.key]));});

	bars.append("svg:text").attr("x",97).attr("y",14).attr("text-anchor","end").text(function(d) {return d.text+":";});
	bars.append("svg:text").attr("y",14).style("text-align","end").text(function(d) {return isNaN(story[d.key])?"":story[d.key].toFixed(0);}).attr("x",110).transition().attr("x",function(d) {return 110+bScale.domain([axes[d.axis].low,axes[d.axis].high])(isNaN(story[d.key])?130:story[d.key]);});
	myRects.append("svg:title").classed("bRank",1).text(function(d) {return isNaN(story[d.key])?"":(story.ranks[d.key]+"/"+stories.length);});

	var myMarks=bars.append("svg:path").attr("transform","translate(100,17)").attr("d",lilCursor(3)).style("fill","#333");
	myMarks.transition()
		.attr("transform" ,function(d) {return "translate("+(100+bScale.domain([axes[d.axis].low,axes[d.axis].high])(d3.mean(stories, function(s) {return s[d.key];})))+",17)";})
	myMarks.append("svg:title").text(function(d) {return "Average: "+d3.mean(stories, function(s) {return s[d.key];}).toFixed(0);})
	$('rect, path').tipsy({html: true, gravity: 's'});

	
}

updateStruct=function(i) {
	var struct=structs[i];
	var panel=d3.selectAll("#panel");
	var p1=d3.selectAll(".p1");
	p1.style("display","block");
	panel.html("<a href=\"#nogo\" class=\"close\">×</a><div class=\"row\"><div><h2></h2><div class='desc'></div></div></div><div class=\"row\"><div id=\"storyBars\"></div></div></div>");
	panel.selectAll(".close").on("click",function() {p1.style("display","none");})
	panel.selectAll(".desc").append("p").html(structData[i].desc);
	panel.selectAll("h2").html(structData[i].name);
	var myStories=stories.filter(function(s) {return s.struct==i;})
	panel.selectAll(".desc").append("p").html(" It comprises: ").selectAll(".story").data(myStories).enter().append("span")
		.html(function(s,i) {return "<a href=\"#nogo\">"+storyData[s.story].name.toLowerCase()+"</a>"+((i==myStories.length-2)?" and ":(i==myStories.length-1?".":", "));})
		.on("click",function(s) {updateStory(s.story);})
		
	var barFill="#FF7E00"; // amber
	var bScale=d3.scale.linear().range([0,100]).clamp([true]);			
		
	var barData=[
			{key:"budget",axis:"budget",text:"Budget"},
			{key:"avgEarnings",axis:"avgEarnings",text:"Earnings (avg.)"},
			{key:"totEarnings",axis:"totEarnings2",text:"Earnings (total)"},
			{key:"p",axis:"profit%",text:"Profitability"},
			{key:"nbPerStory",axis:"nbPerStory",text:"# movies (avg)"}
		];

	var panelBars=panel.selectAll("#storyBars").append("svg:svg").attr("id","bars").attr("height","120px").style("font-size","11	px");
	var bars=panelBars.selectAll("g").data(barData).enter().append("svg:g").attr("transform",function(d,i) {return "translate(0,"+(20*i)+")";})
	bars.append("svg:line").attr("x1",100).attr("x2",200).attr("y1",16).attr("y2",16).style("stroke","#ccc").style("stroke-width","1px");
	var myRects=bars.append("svg:rect")
		.attr("x",100).attr("y",5).attr("height",10)
		.style("fill",barFill)
		//.style("fill",function(d) {return fScale.domain([axes[d.axis].high,d3.mean(structs,function(s) {return s[d.key];}),axes[d.axis].low])(struct[d.key]);})
		.attr("width",0);
	myRects.transition().attr("width",function(d) {return isNaN(struct[d.key])?0:(bScale.domain([axes[d.axis].low,axes[d.axis].high])(struct[d.key]));});

	bars.append("svg:text").attr("x",97).attr("y",14).attr("text-anchor","end").text(function(d) {return d.text+":";});
	bars.append("svg:text").attr("y",14).style("text-align","end").text(function(d) {return isNaN(struct[d.key])?"":struct[d.key].toFixed(0);}).attr("x",110).transition().attr("x",function(d) {return 110+bScale.domain([axes[d.axis].low,axes[d.axis].high])(isNaN(struct[d.key])?130:struct[d.key]);});
	myRects.append("svg:title").classed("bRank",1).text(function(d) {return isNaN(struct[d.key])?"":(struct.ranks[d.key]+"/"+structs.length);});
	
	
	
	var myMarks=bars.append("svg:path").attr("transform","translate(100,17)").attr("d",lilCursor(3)).style("fill","#333");//.style("stroke","none").style("stroke-width",1).style("opacity",1);
	myMarks.transition()
		.attr("transform" ,function(d) {return "translate("+(100+bScale.domain([axes[d.axis].low,axes[d.axis].high])(d3.mean(structs, function(s) {return s[d.key];})))+",17)";})
	myMarks.append("svg:title").text(function(d) {return "Average: "+d3.mean(structs, function(s) {return s[d.key];}).toFixed(0);})

	$('rect, path').tipsy({html: true, gravity: 's'});

}

clearPanel=function() {d3.select("#Panel").html("");}

/*


                 _                        _  _  _               
                | |__    __ _  _ __    __| || |(_) _ __    __ _ 
                | '_ \  / _` || '_ \  / _` || || || '_ \  / _` |
                | | | || (_| || | | || (_| || || || | | || (_| |
                |_| |_| \__,_||_| |_| \__,_||_||_||_| |_| \__, |
                                                          |___/ 
                    _             _    _                     
                   | |__   _   _ | |_ | |_  ___   _ __   ___ 
                   | '_ \ | | | || __|| __|/ _ \ | '_ \ / __|
                   | |_) || |_| || |_ | |_| (_) || | | |\__ \
                   |_.__/  \__,_| \__| \__|\___/ |_| |_||___/
                                                             
*/                                                            

highlightStory=function(i) {
	
	// this downplays all the stars which do not belong to a certain story
	
	// now the deal with inTransition: 
	// if there is any unfinished transition - it just turns opacity down.
	// but if nothing is going on, it uses a transition for extra comfort.
	
	if(i>-1){
		var myStars=cStars.filter(function(d) {return d.story!=i;});
		var myStories=cStories.filter(function(d) {return d.story!=i;})
		
		if(inTransition>0) {
			myStars.style("opacity",0.1);
			myStories.style("opacity",0.1);
			cStructs.style("opacity",0.1);}
		else {
			myStars.transition().style("opacity",0.1);
			myStories.transition().style("opacity",0.1);
			cStructs.transition().style("opacity",0.1);}
	}
	// or restores them to their former glory
	else {
	
		if(inTransition>0) {
			cStars.style("opacity",0.8);
			cStories.style("opacity",0.7);
			cStructs.style("opacity",0.6);
		}
		else {
			cStars.transition().style("opacity",0.8);
			cStories.transition().style("opacity",0.7);
			cStructs.transition().style("opacity",0.6);
		}
	}
}


highlightStruct=function(i) {

	
	if(i>-1){
	
		var myStars=cStars.filter(function(d) {return storyStruct[d.story]!=i;});
		var myStories=cStories.filter(function(d) {return d.struct!=i;})
		var myStructs=cStructs.filter(function(d) {return d.struct!=i;})
		if(inTransition>0){
			myStars.style("opacity",0.1);
			myStories.style("opacity",0.1);
			myStructs.style("opacity",0.1);
		} else {
			myStars.transition().style("opacity",0.1);
			myStories.transition().style("opacity",0.1);
			myStructs.transition().style("opacity",0.1);
			
		}
	}
	else {
		if(inTransition>0){
			cStars.style("opacity",0.8);
			cStories.style("opacity",0.7);
			cStructs.style("opacity",0.6);
		} else {
			cStars.transition().style("opacity",0.8);
			cStories.transition().style("opacity",0.7);
			cStructs.transition().style("opacity",0.6);
		}
	}
}




$('path').tipsy({html: true, gravity: 's'});




//cStars.on("mouseout",clearPanel)
//cStars.on("click",collapseStory) 
cStars.on("click",updatePanel);

