// this is the example model: 
// initially, 42% countries of the world are not free, 32% are partly free, 26% are free
// at the end of each decade, 
// 5% not free and 10% partly free become free
// 5% free and 15% not free become partly free
// 10% partly free become not free

var w=960,w1=900,h=520,svg=d3.select("#chart").append("svg").attr({width:w,height:h}).append("g").attr("transform","translate(20,10)");
var cellsize=10;
var redNb=+d3.select("#slider").property("value"),blueNb=100;
var grid,running=false,timer;
var blue="blue",red="red";
var fronts,winners;
var strategy=[{"front":1,"winners":1,"outcome":false,"victories":0},{"front":1,"winners":1,"outcome":false,"victories":0},{"front":1,"winners":1,"outcome":false,"victories":0},{"front":1,"winners":1,"outcome":false,"victories":0},{"front":1,"winners":1,"outcome":false,"victories":0},{"front":1,"winners":1,"outcome":false,"victories":0},{"front":1,"winners":1,"outcome":false,"victories":0},{"front":1,"winners":1,"outcome":false,"victories":0},{"front":1,"winners":1,"outcome":false,"victories":0},{"front":1,"winners":1,"outcome":false,"victories":0},{"front":1,"winners":1,"outcome":false,"victories":0},{"front":1,"winners":1,"outcome":false,"victories":0},{"front":1,"winners":1,"outcome":false,"victories":0},{"front":1,"winners":1,"outcome":false,"victories":0},{"front":1,"winners":1,"outcome":false,"victories":0},{"front":1,"winners":1,"outcome":false,"victories":0},{"front":1,"winners":1,"outcome":false,"victories":0},{"front":1,"winners":1,"outcome":false,"victories":0},{"front":1,"winners":1,"outcome":false,"victories":0},{"front":1,"winners":1,"outcome":false,"victories":0},{"front":8,"winners":1,"outcome":false,"victories":1},{"front":7,"winners":1,"outcome":false,"victories":1},{"front":6,"winners":1,"outcome":false,"victories":1},{"front":6,"winners":1,"outcome":false,"victories":1},{"front":6,"winners":1,"outcome":false,"victories":1},{"front":5,"winners":1,"outcome":false,"victories":1},{"front":5,"winners":1,"outcome":false,"victories":1},{"front":13,"winners":2,"outcome":false,"victories":2},{"front":12,"winners":2,"outcome":false,"victories":2},{"front":11,"winners":2,"outcome":false,"victories":2},{"front":10,"winners":2,"outcome":false,"victories":2},{"front":9,"winners":2,"outcome":false,"victories":2},{"front":8,"winners":2,"outcome":false,"victories":2},{"front":15,"winners":3,"outcome":false,"victories":3},{"front":13,"winners":3,"outcome":false,"victories":3},{"front":13,"winners":3,"outcome":false,"victories":3},{"front":12,"winners":3,"outcome":false,"victories":3},{"front":21,"winners":4,"outcome":false,"victories":4},{"front":18,"winners":4,"outcome":false,"victories":4},{"front":15,"winners":4,"outcome":false,"victories":4},{"front":15,"winners":4,"outcome":false,"victories":4},{"front":21,"winners":5,"outcome":false,"victories":5},{"front":21,"winners":5,"outcome":false,"victories":5},{"front":18,"winners":5,"outcome":false,"victories":5},{"front":18,"winners":5,"outcome":false,"victories":5},{"front":27,"winners":6,"outcome":false,"victories":6},{"front":21,"winners":6,"outcome":false,"victories":6},{"front":21,"winners":6,"outcome":false,"victories":6},{"front":27,"winners":7,"outcome":false,"victories":7},{"front":27,"winners":7,"outcome":false,"victories":7},{"front":22,"winners":7,"outcome":false,"victories":7},{"front":27,"winners":8,"outcome":false,"victories":8},{"front":27,"winners":8,"outcome":false,"victories":8},{"front":27,"winners":8,"outcome":false,"victories":8},{"front":22,"winners":8,"outcome":false,"victories":8},{"front":27,"winners":9,"outcome":false,"victories":9},{"front":27,"winners":9,"outcome":false,"victories":9},{"front":37,"winners":10,"outcome":false,"victories":10},{"front":28,"winners":10,"outcome":false,"victories":10},{"front":37,"winners":11,"outcome":false,"victories":11},{"front":37,"winners":11,"outcome":false,"victories":11},{"front":28,"winners":11,"outcome":false,"victories":11},{"front":37,"winners":12,"outcome":false,"victories":12},{"front":7,"winners":4,"outcome":true,"victories":4},{"front":7,"winners":4,"outcome":true,"victories":4},{"front":5,"winners":3,"outcome":true,"victories":3},{"front":5,"winners":3,"outcome":true,"victories":3},{"front":5,"winners":3,"outcome":true,"victories":3},{"front":5,"winners":3,"outcome":true,"victories":3},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2},{"front":3,"winners":2,"outcome":true,"victories":2}]; 
// the best allocations can be calculated at runtime by using the following function, but that would be a speed bump. 
// stratego(); 


var c=1.61803399*2*Math.PI;

reset();

drawGrid();



function split(number,fronts) {
	var ratio=number/fronts;
	var split=[],force=[];
	var q=Math.floor(ratio);
	var r=number%fronts;
	d3.range(fronts).forEach(function(i) {
		if((fronts-i)<=r){split.push(q+1)}else{split.push(q)}
	})
	return split;
}

function force(number,fronts) {
	//console.log(number,fronts);
	var mySplit=split(number,fronts);
	var front=0,force=[];
	d3.range(number).forEach(function(d) {
		if(d>=d3.sum(mySplit.slice(0,front+1))){front=front+1;}
		force.push(front);
	})
	return force;
}

function outcome(number,fronts,winners) {
	var sb=split(100,fronts),
	sr=split(number-(fronts-winners),winners);
	d3.range(fronts-winners).forEach(function() {sr.push(1);})
	var victories=0;
	sr.forEach(function(d,i) {if(d>sb[i]){victories=victories+1;}})
	return {outcome:victories>Math.floor(fronts/2),victories:victories}
}

function stratego() {

	// this determines the best strategies. 
	// it's a pretty slow routine (well a couple secs) so there's no need to run it each time
	// also pretty unefficient. but hey, it worked

	// the idea is to find the minimum amount of fronts that should be chosen by red to achieve victory over blue, or, failing that, to get the maximum amount of victories.
	// so if say 10 fronts yield 3 victories and 13 fronts yield 3 victories too, the routine will suggest 10 fronts as the best strategy. 

	blue=100;
	strategy=[];
	reds=d3.range(101);
	var myFront,myWinners;
	reds.forEach(function(red) {
		var maxvic=0;
		var best={front:1,winners:1,outcome:false,victories:0}
		d3.range(1,blue).some(function(front) {
			var victory=d3.range(front).some(function(winners) {
				myOutcome=outcome(red,front,winners);
				if(myOutcome.outcome){ // enough for victory - smallest amount of fronts & winners 
					best={front:front,winners:winners,outcome:myOutcome.outcome,victories:myOutcome.victories}
					return true;
				}
				else if(myOutcome.victories>maxvic) { // highest number of fronts won 
					best={front:front,winners:winners,outcome:myOutcome.outcome,victories:myOutcome.victories} 
					maxvic=myOutcome.victories;

					// but we continue to run.


				}	// else ...
					// Intuitively if when we add fronts we get fewer victories it's time to stop, but not sure if it's true. it's a speed sink, but one we can live with.
			})
			if(victory) {
				return true; // if victory, no need to try with a different number of fronts either
			}
		})
		strategy.push(best);
	})
	return strategy;
}


function stop() {
	clearInterval(timer);
	timer=undefined;
	running=0;
	d3.select("#launch").property("value","launch model").on("click",run);
}
function regroup() {
	d3.selectAll(".blue").transition()
		.attr({
			cx:function(d,i) {var angle=c*i,r=Math.sqrt(i+1)*cellsize;return Math.cos(angle)*r;},
			cy:function(d,i) {var angle=c*i,r=Math.sqrt(i+1)*cellsize;return Math.sin(angle)*r;}
		})
	d3.selectAll(".red").transition()
		.attr({
			cx:function(d,i) {var angle=c*i,r=Math.sqrt(i+1)*cellsize;return Math.cos(angle)*r;},
			cy:function(d,i) {var angle=c*i,r=Math.sqrt(i+1)*cellsize;return Math.sin(angle)*r;}
		})
}

function reset() {
	
	d3.select("#launch").property("value","fight!").on("click",run) 
	d3.select("#success").html("&nbsp;");
	fronts=strategy[redNb].front;
	winners=strategy[redNb].winners;
	blueForce=force(100,fronts);
	redForce=force(redNb-(fronts-winners),winners);
	d3.range(fronts-winners).forEach(function(i) {redForce.push(winners+i);})
	drawGrid();
}

d3.select("#slider").on("change", function() {
	redNb=+this.value;
	//d3.select("#label").html(redNb);
	reset();
	drawGrid();})


function success() {

	var strat=strategy[redNb];
	var vicString="Red chooses to fight on "+fronts+" front"+((fronts>1)?"s ":" ");
	if(strat.outcome){vicString=vicString+" and wins with "+strat.victories+" victories.";}
	else {
		if(strat.victories){
			vicString=vicString+" and loses but manages to win "+strat.victories;
			if(strat.victories>1) {vicString=vicString+" fronts."} else {vicString=vicString+" front."}
		} else {
			vicString=vicString+" and loses without being able to win any front."
		}
	}


	d3.select("#success").html(vicString);
}

function drawGrid() {
	regroup();
	d3.selectAll(".fronts").transition().style("opacity",0).remove();

	blueSphere=svg.selectAll("#blue").data([1]).enter().append("g").attr({id:"blue","transform":"translate(460,125)"});
	redSphere=svg.selectAll("#red").data([1]).enter().append("g").attr({id:"red","transform":"translate(460,375)"});

	blueSphere.selectAll("#blueBack").data([1]).enter().append("circle").style({fill:blue,stroke:"none","fill-opacity":.125}).attr("id","blueBack");
	redSphere.selectAll("#redBack").data([1]).enter().append("circle").style({fill:red,stroke:"none","fill-opacity":.125}).attr("id","redBack");

	blueSphere.selectAll("#blueText").data([blueForce.length]).enter().append("text").text(String).attr({x:200,y:35,id:"blueText"}).style({fill:blue,"font-size":"96px","font-family":"Serif","font-style":"italic"});
	redSphere.selectAll("#redText").data([redForce.length]).enter().append("text").text(String).attr({x:200,y:35,id:"redText"}).style({fill:red,"font-size":"96px","font-family":"Serif","font-style":"italic"});


	svg.select("#blue").selectAll(".blue").data(blueForce).enter().append("circle").style("opacity",0).classed("blue",1).style({"fill":blue});
	svg.select("#red").selectAll(".red").data(redForce).enter().append("circle").style("opacity",0).classed("red",1).style({"fill":red});

	var blueDots=svg.select("#blue").selectAll(".blue")

		
	blueDots.transition().style("opacity",function(d,i) {return i>=blueForce.length?0:1;})
	.attr({
			r:.4*cellsize,
			cx:function(d,i) {var angle=c*i,r=Math.sqrt(i+1)*cellsize;return Math.cos(angle)*r;},
			cy:function(d,i) {var angle=c*i,r=Math.sqrt(i+1)*cellsize;return Math.sin(angle)*r;},
			class:function(d) {return "blue blue-"+d;},
			transform:""
		})
		

	redDots=svg.select("#red").selectAll(".red")

		
	redDots.transition().style("opacity",function(d,i) {return i>=redForce.length?0:1;})
	.attr({
			r:.4*cellsize,
			cx:function(d,i) {var angle=c*i,r=Math.sqrt(i+1)*cellsize;return Math.cos(angle)*r;},
			cy:function(d,i) {var angle=c*i,r=Math.sqrt(i+1)*cellsize;return Math.sin(angle)*r;},
			class:function(d) {return "red red-"+d;},
			transform:""
		})
	
	d3.select("#redText").data([redForce.length]).transition().text(String).style("opacity",1);
	d3.select("#blueText").transition().style("opacity",1);


	d3.select("#blueBack").transition().attr("r",(Math.sqrt(blueForce.length)+1)*cellsize).style("fill-opacity",.125);
	d3.select("#redBack").transition().attr("r",(Math.sqrt(redForce.length)+1)*cellsize).style("fill-opacity",.125);


}




function run() {
	running=1;
	console.log("running")

	var sb=split(100,fronts),
	sr=split(redNb-(fronts-winners),winners);
	d3.range(fronts-winners).forEach(function() {sr.push(1);})

	d3.select("#launch").property("value","reset").on("click",reset)
	blueSphere=d3.select("#blue");
	redSphere =d3.select( "#red");
	d3.selectAll("#blueText, #redText").transition().style("opacity",0)
	d3.selectAll(".blue0").classed("blue0",0).classed("blue-0",1); // I don't know how this comes to be, 
	d3.selectAll(".red0").classed("red0",0).classed("red-0",1); // but it has to stop.
	d3.selectAll("#redBack, #blueBack").transition().style("fill-opacity",0)

	blueSphere.selectAll("bluefronts").data(sb).enter().append("text").text(String).attr({x:function(d,i) {return ((i+.5)/fronts-.5)*w1;},y:-50,"text-align":"middle"}).classed("fronts",1)
		.style({"fill":blue,"font-family":"serif","font-size":d3.min([24,(w1/(2*fronts))-1])}).style("opacity",0).transition().style("opacity",1).each("end",function(d,i) {d3.select(this)
			.transition().delay(750).duration(1000).attr("y",function() {return (i<strategy[redNb].victories?-500:97.5);})
		})

	redSphere.selectAll("redfronts").data(sr).enter().append("text").text(String).attr({x:function(d,i) {return ((i+.5)/fronts-.5)*w1;},y:-50,"text-align":"middle"}).classed("fronts",1)
		.style({"fill":red,"font-family":"serif","font-size":d3.min([24,(w1/(2*fronts))-1])}).style("opacity",0).transition().style("opacity",1).each("end",function(d,i) {d3.select(this)
			.transition().delay(750).duration(1000).attr("y",function() {return (i<strategy[redNb].victories?-153:500);})
		})

	d3.range(fronts).forEach(function(front) {
		blueSphere.selectAll(".blue-"+front).transition().duration(1000)
			.attr("cx",function(d,i) {
				return (((front+.5)/fronts)-.5)*w1+~~(i/10)*cellsize;
			})
			.attr("cy",function(d,i) {

				return (10-(i%10))*cellsize;
			})
			.each("end", function() {
				d3.select(this).transition().attr("transform",front<strategy[redNb].victories?"translate(0,-500)":"translate(0,122.5)").duration(1000);
			})
		redSphere.selectAll(".red-"+front).transition().duration(1000)
			.attr("cx",function(d,i) {
				return (((front+.5)/fronts)-.5)*w1+~~(i/10)*cellsize;
			})
			.attr("cy",function(d,i) {
				return ((i%10))*cellsize;
			})
			.each("end", function() {
				d3.select(this).transition().attr("transform",front<strategy[redNb].victories?"translate(0,-122.5)":"translate(0,500)").duration(1000);
			})
	})
	success();
}


function update() {
//	drawGrid();
//	evolve();
}