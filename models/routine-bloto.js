// this is the example model: 
// initially, 42% countries of the world are not free, 32% are partly free, 26% are free
// at the end of each decade, 
// 5% not free and 10% partly free become free
// 5% free and 15% not free become partly free
// 10% partly free become not free

var w=960,h=520,svg=d3.select("#chart").append("svg").attr({width:w,height:h}).append("g").attr("transform","translate(250,10)");
var cellsize=10;
var reds=d3.select("#slider").property("value")/100,blues=100;
var grid,running=false,timer;
var blue="blue",red="red";
var fronts,winners;
var strategy=stratego();


var c=1.61803399*2*Math.PI;

reset();

drawGrid();

d3.select("#launch").on("click",run) 


function run() {
	running=1;
	console.log("running")
}

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
	var split=split(number,fronts);
	var front=0,force=[];
	d3.range(number).forEach(function(d) {
		if(d>=d3.sum(split.slice(0,front+1))){front=front+1;console.log(d,front);}
		force.push(front);
	})
	return force;
}

function outcome(number,fronts,winners) {
	var sb=split(100,fronts),sr=split(number,winners);
	var victories=0;
	sr.forEach(function(d,i) {if(d>sb[i]){victories=victories+1;}})
	return {outcome:victories>Math.floor(fronts/2),victories:victories}
}

function stratego() {
	blue=100;
	strategy=[];
	reds=d3.range(2,101);
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
				}
			})
			if(victory) {
				return true; // if victory, no need to try with a different number of fronts either
			}
		})
		strategy.push(best);console.log(best);
	})
	return strategy;
}


function stop() {
	clearInterval(timer);
	timer=undefined;
	running=0;
	d3.select("#launch").property("value","launch model").on("click",run);
}

function reset() {
	stop();
	d3.select("#success").html("");
	fronts=strategy[red].fronts;
	winners=strategy[red].winners;
	blueForce=force(number,fronts);
	redForce=force(red,winners);
	drawGrid();
}

d3.select("#slider").on("change", function() {
	red=this.value/100;
	d3.select("#label").html(Math.round(100*p)+"%");
	reset();
	drawGrid();})


function success() {
	//
}

function drawGrid() {
	blueSphere=svg.append("g").attr({id:"blue","transform","translate(450,200)"});
	redSphere=svg.append("g").attr({id:"blue","transform","translate(450,200)"});

	blueDots=blueSphere.selectAll("circle").data(blueForce).enter().append("circle")
		.attr({
			r:cellsize,
			cx:function(d,i) {var angle=c*i,r=Math.sqrt(i+1)*cellsize;return Math.cos(angle)*r;}
			cy:function(d,i) {var angle=c*i,r=Math.sqrt(i+1)*cellsize;return Math.sin(angle)*r;}
			class:function(d) {return "blue-"+d;}
		})
		.style("fill",blue)

	redDots=redSphere.selectAll("circle").data(blueForce).enter().append("circle")
		.attr({
			r:cellsize,
			cx:function(d,i) {var angle=c*i,r=Math.sqrt(i+1)*cellsize;return Math.cos(angle)*r;}
			cy:function(d,i) {var angle=c*i,r=Math.sqrt(i+1)*cellsize;return Math.sin(angle)*r;}
			class:function(d) {return "red-"+d;}
		})
		.style("fill",red)
}

function update() {
//	drawGrid();
//	evolve();
}