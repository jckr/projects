var letters=["O","F","D","J","S","A","U","E","N","B","P","C","T","O","R","V","I","G","L","E","U","M","B","E","A","R","Y","C","H","S","T",];

var months=[
[-1,-1,-1,0,-1,1,-1,-1,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,-1,-1,-1,4,5,6,-1,-1,-1,-1],
[-1,0,-1,-1,-1,-1,-1,1,-1,2,-1,-1,-1,-1,3,-1,-1,-1,-1,-1,4,-1,-1,-1,5,6,7,-1,-1,-1,-1],
[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,-1,-1,1,2,-1,3,4,-1,-1],
[-1,-1,-1,-1,-1,0,-1,-1,-1,-1,1,-1,-1,-1,2,-1,3,-1,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,-1,-1,1,-1,2,-1,-1,-1,-1],
[-1,-1,-1,0,-1,-1,1,-1,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
[-1,-1,-1,0,-1,-1,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,-1,-1,-1,-1,-1,-1,-1,3,-1,-1,-1,-1],
[-1,-1,-1,-1,-1,0,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,-1,-1,3,-1,-1,-1,-1,-1,-1,-1,-1,4,5],
[-1,-1,-1,-1,0,-1,-1,1,-1,-1,2,-1,3,-1,-1,-1,-1,-1,-1,4,-1,5,6,7,-1,8,-1,-1,-1,-1,-1],
[0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,3,-1,-1,-1,-1,-1,-1,-1,-1,4,5,-1,6,-1,-1,-1,-1,-1],
[-1,-1,-1,-1,-1,-1,-1,-1,0,-1,-1,-1,-1,1,-1,2,-1,-1,-1,3,-1,4,5,6,-1,7,-1,-1,-1,-1,-1],
[-1,-1,0,-1,-1,-1,-1,1,-1,-1,-1,2,-1,-1,-1,-1,-1,-1,-1,3,-1,4,5,6,-1,7,-1,-1,-1,-1,-1],
];


var dur=1000;

var svg=d3.select("#chart").append("svg").attr("width",500).attr("height",500);
/*
var tLetters=svg.selectAll(".letters").data(letters).enter().append("text")
	.text(function(d,i){return letters[i];})
	.style("font-size",32)
	.style("font-family","consolas")
	.attr("x",function(d,i){return i*15;})
	.style("fill","#eee")
	.attr("y",50)
;
var month=0
iterate();
function iterate() {
	tLetters.transition()
		.duration(dur)
		.delay(dur)
		.style("fill",function(d,i){return months[month][i]>-1?"#000":"#eee";})
		.each("end",function(d,i){if (i===letters.length-1) {
			month+=1;if(month>11){month=0;}
			iterate();
		}});
};
*/
var tLetters=svg.selectAll(".letters").data(letters).enter().append("text")
	.text(function(d,i){return letters[i];})
	.style("font-size",32)
	.style("font-family","consolas")
	.attr("x",function(d,i){return i*15;})
	.style("opacity",0)
	.attr("y",50)
;
var month=0
iterate();
function iterate() {
	tLetters.transition()
		.duration(dur)
		.delay(dur)
		.style("opacity",function(d,i){return months[month][i]>-1?1:0;})
		.attr("x",function(d,i){return months[month][i]>-1?225+months[month][i]*15:i*15;;})

		.each("end",function(d,i){if (i===letters.length-1) {
			month=(month+1)%12;
			iterate();
		}});
};

	//.style("visibility","hidden")

/*var gMonths=svg.selectAll(".months").data(months).enter().append("g")
	.style("visibility","hidden")
	.transition()
	.duration(dur)
	.delay(function(d,i) {return dur*i;})

gMonths.selectAll(".letters").data(function(d) {return d;}).enter().append("text")
	.text(function(d,i){return letters[i];})
	.style("font-size",36)
	.attr("x",function(d) {})
*/
