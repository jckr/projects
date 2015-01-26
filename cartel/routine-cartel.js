var width=960,height=900;
var svg=d3.select("#chart").append("svg").attr({width:width,height:height});
var vis=svg.append("g").attr("transform","translate(480,450)")
var defs=svg.append("defs")
defs.append("path").attr({id:"loop",d:"M0,400 A400,400 0 1,0 -0.1,400"})

var data=[];
var senders={"Stefanie Posavec":0,"Santiago Ortiz":1,"Paolo Ciuccarelli":2,"Andrew Vande Moere":3,"Benjamin Wiederkehr":4,"Gregor Aisch":5,"Enrico Bertini":6,"Moritz Stefaner":7,"Jan Willem Tulp":8,"Andy Kirk":9,"Jérôme Cukier":10}
var maxHeight;
var colors=d3.scale.category20();
	var maxV=[78,7,24];
	var maxH=[[4,.8,2.5],[3,.8,1.5]];
	var core=[[75,75,75],[75,75,75]];
	var varNames=["age","dayofweek","hour"];

	var mode=0,variable=0;
var legends=[
	[
		["June 2011",.5/78],
		["Sep 2011",3/24],
		["Nov 2011",6/24],
		["Jan 2012",9/24],
		["Mar 2012",.5],
		["June 2012",15.5/24],
		["Aug 2012",18/24],
		["Oct 2012",22/24]
	],
	[
		["Monday",.5/7],
		["Tuesday",1.5/7],
		["Wednesday",2.5/7],
		["Thursday",3.5/7],
		["Friday",4.5/7],
		["Saturday",5.5/7],
		["Sunday",6.5/7],
		["",0]
	],[
		["Midnight",0/24],
		["3 AM",3/24],
		["6 AM",6/24],
		["9 AM",9/24],
		["Noon",12/24],
		["3 PM",15/24],
		["6 PM",18/24],
		["9 PM",21/24]
	]]


d3.csv("cartel.csv",function(csv) {
	data=csv;
	csv.forEach(function(d,i){
		d.age=Math.floor(+d.age/7);
		d.hour=+d.hour;
		d.timeStamp=+d.timeStamp;
		d.sender=+senders[d.from];
		d.dayofweek=(+d.dayofweek+5)%7;
		d.id=i;
		d.height=[[0,0,0],[0,0,0]]});

	csv.sort(function(a,b) {return (a.sender-b.sender);})

	var height=[{},{},{}];
	var myHeight=[{},{},{}];
	var sender=0;
 maxHeight=d3.range(11).map(function(d) {return [0,0,0]})
	csv.forEach(function(d) {
		//console.log(d.hour);
		if (d.sender!=sender) {
			myHeight=[{},{},{}];
			sender=d.sender;
		}
		if (d.age in height[0]) {
			d.height[0][0]=height[0][d.age]=height[0][d.age]+1;
		} else {
			d.height[0][0]=height[0][d.age]=1;
		}

		if (d.dayofweek in height[1]) {
			d.height[0][1]=height[1][d.dayofweek]=height[1][d.dayofweek]+1;
		} else {
			d.height[0][1]=height[1][d.dayofweek]=1;
		}

		if (d.hour in height[2]) {
			d.height[0][2]=height[2][d.hour]=height[2][d.hour]+1;
		} else {
			d.height[0][2]=height[2][d.hour]=1;
		}

		if (d.age in myHeight[0]) {
			d.height[1][0]=myHeight[0][d.age]=myHeight[0][d.age]+1;
		} else {
			d.height[1][0]=myHeight[0][d.age]=1;
		}
		if(d.height[1][0]>maxHeight[sender][0]) {maxHeight[sender][0]=d.height[1][0];}


		if (d.dayofweek in myHeight[1]) {
			d.height[1][1]=myHeight[1][d.dayofweek]=myHeight[1][d.dayofweek]+1;
		} else {
			d.height[1][1]=myHeight[1][d.dayofweek]=1;
		}

		if(d.height[1][1]>maxHeight[sender][1]) {maxHeight[sender][1]=d.height[1][1];}

		if (d.hour in myHeight[2]) {
			d.height[1][2]=myHeight[2][d.hour]=myHeight[2][d.hour]+1;
		} else {
			d.height[1][2]=myHeight[2][d.hour]=1;
		}
		if(d.height[1][2]>maxHeight[sender][2]) {maxHeight[sender][2]=d.height[1][2];}
	})

	csv.forEach(function(d) {
		if(d.sender) {
			d.height[1][0]=d.height[1][0]+d3.sum(maxHeight.slice(0,d.sender),function(d) {return d[0];})
			d.height[1][1]=d.height[1][1]+d3.sum(maxHeight.slice(0,d.sender),function(d) {return d[1];})
			d.height[1][2]=d.height[1][2]+d3.sum(maxHeight.slice(0,d.sender),function(d) {return d[2];})
		}
	})
	d3.select("#core").on("click",function() {mode=1-mode;update();})
	vis.on("click",function() {mode=1-mode;update();})
	/*vis.selectAll("rect").data(csv).enter().append("rect") // will change to path later
		.attr({width:15,height:5,x:function(d) {return 10+0*25*d.sender+15*d.height[0][0];}})
		.style({fill:function(d) {return colors(d.sender);},opacity:function(d) {return d.new==="TRUE"?1:.5;}})
		.attr("transform",function(d) {return "rotate("+(360*d.age/542)+")";})
	*/
	vis.append("g").selectAll("path").data(csv).enter().append("path").classed("slices",1)
		.attr({d:path,transform:rotate})
		.style({fill:function(d) {return colors(d.sender);},opacity:function(d) {return d.new==="TRUE"?1:.5;}})
		.style("fill","steelblue")
		.append("title")
		.text(function(d) {return d.year+"/"+d.month+"/"+d.day;})
	d3.selectAll(".slices").on("mouseover",info)
	d3.selectAll(".slices").on("mouseout",infout)
	vis.selectAll("circle").data(d3.range(10)).enter().append("circle")
		.attr({r:function(d) {return core[mode][variable]+(d3.sum(maxHeight.slice(0,d),function(c) {return c[variable];}))*maxH[mode][variable]*mode;}})
		.style({stroke:"#888",fill:"none","stroke-dasharray":"2 2","opacity":0})
	vis.append("g").selectAll(".rays").data(d3.range(maxV[variable])).enter().append("path").attr("d","M0,0 h450").style("stroke","white").classed("rays",1)
		.attr("transform",function(d,i) {return "rotate("+(360*(i+.5)/maxV[variable])+")"})
	vis.selectAll("text")
	.data(legends[variable])
	.enter()
	.append("text")
	.attr("transform",function(d) {return "rotate("+((360*d[1])%360)+") translate(0,-400) ";})
	.classed("legend",1)
	.text(function(d) {return d[0]})//.attr("transform","rotate(-90)")


	//csv.sort(function(a,b) {return (a.age-b.age)*1000+senders[a.from]-senders[b.from];})
	//csv.forEach(function(d,i){d.ageOrder=i;})
	//csv.sort(function(a,b) {return (a.dayofweek-b.dayofweek)*1000000+(senders[a.from]-senders[b.from])*1000+(a.timeStamp-b.timeStamp);})
	//csv.forEach(function(d,i){d.dowOrder=i;})
	//csv.sort(function(a,b) {return (a.Hour-b.Hour)*1000000+(senders[a.from]-senders[b.from])*1000+(a.timeStamp-b.timeStamp);})
	//csv.forEach(function(d,i){d.timeOrder=i;})


	
	
	

})

d3.select("#b1").on("click",function() {
	d3.selectAll(".btn").classed("active",0).classed("btn-primary",0);
	d3.select("#b1").classed("active",1).classed("btn-primary",1);
	variable=0;
	update();
})

d3.select("#b2").on("click",function() {
	d3.selectAll(".btn").classed("active",0).classed("btn-primary",0);
	d3.select("#b2").classed("active",1).classed("btn-primary",1);
	variable=1;
	update();
})


d3.select("#b3").on("click",function() {
	d3.selectAll(".btn").classed("active",0).classed("btn-primary",0);
	d3.select("#b3").classed("active",1).classed("btn-primary",1);
	variable=2;
	update();
})

var verbose=false;
function path(d,i,verbose) {

			var r=d.height[mode][variable];
			/*if(mode&&d.sender){
				r=r+maxHeight[d.sender-1][variable];
				console.log(r);
			}*/
			var a=2*Math.PI/maxV[variable];
			var x1=r*maxH[mode][variable]+core[mode][variable];

			var x2=x1+maxH[mode][variable];
			var y1=y2=0;
			var x3=Math.cos(a)*x1;
			var y3=Math.sin(a)*x1;
			var x4=Math.cos(a)*x2;
			var y4=Math.sin(a)*x2;
	if(verbose){console.log("mode:",mode);console.log("variable:",variable);console.log("height:",d.height[mode][variable],"maxh",maxH[mode][variable]);
console.log("angle:",a,"cos",Math.cos(a),"sin",Math.sin(a));
console.log("core:",core[mode][variable]);
console.log("x1",x1,"x2",x2,"x3",x3,"x4",x4);
console.log("y1",y1,"y2",y2,"y3",y3,"y4",y4);}
			return "M "+x1+","+y1+" L "+x2+","+y2+" A "+x2+","+x2+" 0 0,1 "+x4+","+y4+" L "+x3+","+y3+" A "+x1+","+x1+" 0 0,0 "+x1+","+y1
		}

function info(d) {
	d3.select("#toggle").html(d.new=="FALSE"?"Reply":"New message");
	d3.select("#name").select("strong").html(d.from);
	d3.select("#date").html(d.day+"/"+d.month+"/"+d.year);
	d3.select("#dow").html(["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][d.dayofweek])
	d3.select("#hour").html(d.hour+":"+(+d.minute<10?"0":"")+d.minute);
} 

function infout() {
	d3.select("#toggle").html("<em><br>Click anywhere<br>to toggle the view</em>");
	d3.select("#name").select("strong").html("");
	d3.select("#info").selectAll("span").html("");
}

	function rotate(d) {return "rotate("+((270+360*d[varNames[variable]]/maxV[variable])%360)+")";}
	function update(myMode,myVariable) {
		if(myMode){mode=myMode;}
		if(myVariable){variable=myVariable;}
		vis.selectAll(".slices").transition().duration(1500)
		.attr({d:path,transform:rotate})
		vis.selectAll("circle").transition().duration(1500)
.attr({r:function(d) {return core[mode][variable]+(1+d3.sum(maxHeight.slice(0,d),function(c) {return c[variable];}))*maxH[mode][variable]*mode;}}).style("opacity",mode)
	d3.selectAll(".rays").transition().duration(1500)
		.attr("transform",function(d,i) {return "rotate("+((270+360*(i)/maxV[variable])%360)+")"})
	
	d3.selectAll(".legend")
	.text(function(d,i) {return legends[variable][i][0];})
	.transition().duration(1500)
	.attr("transform",function(d,i) {return "rotate("+((360*legends[variable][i][1])%360)+") translate(0,-400) ";})
	
	}