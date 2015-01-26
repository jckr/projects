// 5% not free and 10% partly free become free
// 5% free and 15% not free become partly free
// 10% partly free become not free

// 42% not free, 32% partly free, 26% free

// in other words: 

// at the end of a period, 
// 95% of free stay free, .5%

w=960,h=500,svg=d3.select("#chart").append("svg");

var matrix=[
[.95,.1,.05],
[.05,.8,.15],
[  0,.1, .8]];
var vector=//[1,0,0];			
[.32,.26,.42];
var prevVector=[0,0,0];
function mult(matrix,vector) {
	v0=matrix[0][0]*vector[0]+matrix[0][1]*vector[1]+matrix[0][2]*vector[2];
	v1=matrix[1][0]*vector[0]+matrix[1][1]*vector[1]+matrix[1][2]*vector[2];
	v2=matrix[2][0]*vector[0]+matrix[2][1]*vector[1]+matrix[2][2]*vector[2];
	return [v0,v1,v2];
}

var rSize=400,rWidth=50, rSpace=132;
var color=["blue","green","red"];

var gradients=[];
color.forEach(function(c1,i) {
	color.forEach(function(c2,j) {
		gradients.push({
			name:"G"+i+"-"+j,
			stops:[
				{offset:"0%",color:c1},
				{offset:"100%",color:c2}
			]
		})
	})
})

var defs=svg.append("defs");
defs.selectAll("LinearGradient").data(gradients).enter()
		.append("linearGradient")
		.attr("id",function(d) {return d.name;})
		.selectAll("stop").data(function(d) {return d.stops;}).enter()
			.append("stop")
			.attr("stop-color",function(d) {return d.color;})
			.attr("offset",function(d) {return d.offset;});

var key = function(d) {
	return d.index;
};

function sumTrunc(d,i) {return d3.sum(d.filter(function(l,j) {return (j<i)?l:0;}))}

var _id_ =0;
function generate() {
	_id_=_id_+1;
	prevVector=vector.slice();
	vector=mult(matrix,vector);
	//console.log("prevVector:",prevVector)
	//console.log("vector",vector)
	var values=[];
	var runningY_p=[];
	var runningY=[];
	var rp=0,r=0;

	d3.range(prevVector.length).forEach(function(d,i) {
		runningY_p.push(rp);
		runningY.push(r);
		rp=rp+prevVector[i];
		r=r+vector[i];
	})
	

	//console.log("runningY_p:",runningY_p)
	
	//console.log("runningY:",runningY)
	var counter=0;
	prevVector.forEach(function(v1,i) {
		vector.forEach(function(v2,j) {
			var width=v1*matrix[j][i];
			var y1=runningY_p[i];
			var y2=runningY[j];
			
			var dest=j;
			var source=i;
			var visible=!(i===j);
			values.push({width:width,y1:y1,y2:y2,dest:dest,source:source,visible:visible});

			runningY_p[i]=y1+width;
			runningY[j]=y2+width;
			counter=counter+1;
			//console.log(counter+": path of size "+width+" between "+source+" and "+dest+".")
			//console.log(runningY_p[i],runningY[j]);

		})
	})
	//console.log(runningY_p,prevVector,runningY,vector);
	return {index:_id_,state:prevVector,values:values};
}
/*
	values=[
		{
			value:prevVector[0],
			y:0,
			paths:[
				{
					y1:prevVector[0]*matrix[0][1]/2,
					y2:vector[0]+prevVector[0]*matrix[0][1]/2,
					width:prevVector[0]*matrix[0][1],
					source:0,
					color:1
				},
				{
					y1:prevVector[0]*(matrix[0][1]+matrix[0][2]/2),
					y2:vector[0]+vector[1]+prevVector[0]*matrix[0][2]/2,
					width:prevVector[0]*matrix[0][2],
					source:0,
					color:2
				}
			]
		},
		{
			value:prevVector[1],
			y:prevVector[0],
			paths:[
				{
					y1:prevVector[0]+prevVector[1]*matrix[1][0]/2,
					y2:prevVector[1]*matrix[1][0]/2,
					width:prevVector[1]*matrix[1][0]/2,
					source:1,
					color:0
				},
				{
					y1:prevVector[0]+prevVector[1]*(matrix[1][0]+matrix[1][2]/2),
					y2:vector[0]+vector[1]+prevVector[0]*matrix[0][2]+prevVector[1]*matrix[1][2]/2,
					width:prevVector[1]*(matrix[1][2]),
					source:1,
					color:2
				}
			]
		},
		{
			value:prevVector[2],
			y:prevVector[0]+prevVector[1],
			paths:[
				{
					y1:prevVector[0]+prevVector[1]+prevVector[2]*matrix[2][0]/2,
					y2:prevVector[1]*matrix[1][0]+prevVector[2]*matrix[2][0]/2,
					width:prevVector[2]*matrix[2][0],
					source:2,
					color:0
				},
				{
					y1:prevVector[0]+prevVector[1]+prevVector[2]*(matrix[2][1]/2+matrix[2][0]),
					y2:vector[0]+prevVector[0]*matrix[0][1]+prevVector[2]*matrix[2][1]/2,
					width:prevVector[2]*matrix[2][1],
					source:2,
					color:1
				}
			]
		}
	];
	return {
		index:_id_,
		vector:vector,
		prevVector:prevVector,
		values:values
	};
};*/



function diagLine(y1,y2,sWidth,init) {
	//console.log(y1,y2,sWidth,init)
	var w=sWidth;
	var Y1=rSize*(y1+w/2);
	var Y2=rSize*(y2+w/2);
	//console.log(w,Y1,Y2);
	var YM=(Y1+Y2)/2;
	var X1=rWidth;
	var X2=X1+(init?0:rSpace);
	var XM=(X1+X2)/2;
	
	return "M"+X1+","+Y1+" Q "+XM+","+Y1+" "+XM+","+YM+" "+XM+","+Y2+" "+X2+","+Y2;
}

function diag(y1,y2,sWidth,init) {
	//console.log(y1,y2,sWidth,init)
	var w=sWidth,W=sWidth*rSize;
	var Y1=rSize*(y1+w/2);
	var Y2=rSize*(y2+w/2);
	var Y11=Y1-W/2,Y12=Y1+W/2,Y21=Y2-W/2,Y22=Y2+W/2;
	//console.log(w,Y1,Y2);
	var YM=(Y1+Y2)/2,YM1=(Y11+Y21)/2,YM2=(Y12+Y22)/2;
	var X1=rWidth;
	var X2=X1+(init?0:rSpace);
	var XM=(X1+X2)/2,XM1=XM+((Y1<Y2)?W/2:-W/2),XM2=XM-((Y1<Y2)?W/2:-W/2);
	var XA=X2-(init?0:10);

	var path="M"+X1+","+Y11+" Q "+XM1+","+Y11+" "+XM1+","+YM1+" "+XM1+","+Y21+" "+XA+","+Y21+
		   " L "+X2+","+Y2+" L "+XA+","+Y22+
		   " Q "+XM2+","+Y22+" "+XM2+","+YM2	+" "+XM2+","+Y12+" "+X1+","+Y12+"Z";
	return path;
	//return "M"+X1+","+Y1+" Q "+XM+","+Y1+" "+XM+","+YM+" "+XM+","+Y2+" "+X2+","+Y2;
}

var data;


function init() {

	function make(groups) {
		groups.append("g").attr("transform", "translate("+rWidth+","+(rSize+30)+")").selectAll("text").data(function(d) {return d.state}).enter().append("text")
			.text(function(d) {return (Math.round(d*1000)/10)+"%";})
			.style("fill",function(d,i) {return color[i];})
			.attr({"text-anchor":"end","y":function(d,i){return i*15;}})
			groups.append("text").attr({x:rWidth,y:rSize+15,"text-anchor":"end"}).text(function(d) {return d.index;})
		var group=groups.selectAll(".group").data(function(d) {return d.values;}).enter().append("g").classed("group",1)

		group.append("rect")
			.attr({y:function(d) {return rSize*d.y1;}, height:function(d) {return rSize*d.width;}, width:rWidth,
			// rx:5,rY:5
			})
			.style({"fill":function(d) {return color[d.source];}, "stroke": "white"});
		group.append("path")
			.style({"fill":function(d) {
				return "url(#G"+d.source+"-"+d.dest+")";
				//return color[d.dest];
			}, "stroke":"none","fill-opacity":function(d) {return d.visible?.5:0.1;},
			//"stroke-width":function(d) {return rSize*d.width;}
			})
			.attr("d", function(d) {return diag(d.y1,d.y2,d.width,true);})
			.transition()
			.attr("d", function(d) {return diag(d.y1,d.y2,d.width,false);})
		group.selectAll("path")
			.on("mouseover",function(d) {console.log(d.source,d.dest);
				d3.select(this).transition()
				.attr("d",function(d) {return diag(d.y1,d.y2,d.width,false);})
				//.style("stroke",function(d) {return color[d.dest];})
				.style("fill-opacity",1);
			})
			.on("mouseout",function(d) {d3.select(this).transition()
				//.style("stroke","#ccc")
				.attr("d",function(d) {return diag(d.y1,d.y2,d.width,false);})
				.style("fill-opacity",function(d) {return d.visible?0.5:0.1;})
			})
	}

	function update() {
		data.shift();
		data.push(generate());

		svg.selectAll(".groups").transition().attr("transform",function(d,i) {return "translate("+((rWidth+rSpace)*(i-1))+",0)";});
		var newGroup=svg.selectAll(".groups").data(data,key).enter().append("g").attr("transform",function(d,i) {return "translate("+((rWidth+rSpace)*(i+1))+",0)";}).attr("id",function(d) {return "g"+d.index;}).classed("groups",1)
		.call(make);
		
		newGroup.transition().attr("transform",function(d,i) {return "translate("+((rWidth+rSpace)*6)+",0)";})
		svg.selectAll(".groups").data(data,key).exit().transition().attr("transform",function(d,i) {return "translate("+(-(rWidth+rSpace))+",0)";}).remove();
	}

	d3.range(6).map(generate);

	var groups=svg.selectAll(".groups")
		.data(data,key).enter().append("g").attr("transform",function(d,i) {return "translate("+((rWidth+rSpace)*i)+",0)";})
		.attr("id",function(d) {return "g"+d.index;}).classed("groups",1).call(make)

	setInterval(update, 2000);



}


			
/*$(function() {
	$("#sliderState").slider({
		range:true,
		min:0,
		max:100,
		values:[32,58],
		slide: function(event,ui) {
			console.log(ui.values[0],ui.values[1]-ui.values[0]);
		}
	})
})*/

/*group=groups.selectAll("g").data(function(d) {return d.values;}).enter().append("g");

	group.append("rect")
		.attr({y:function(d) {return rSize*d.y;},
			   height:function(d) {return rSize*d.value;},
			   width:rWidth,rx:5,ry:5})
		.style("fill",function(d,i) {return color[i];}).style("stroke","white");
	group.selectAll("path").data(function(d) {return d.paths}).enter().append("path")
		.attr("d",function(d) {
			return diag(d.y1,d.y2,d.width,true);
			//var y1=d.y1*rSize,y2=d.y2*rSize,ym=(y1+y2)/2;
			//return "M"+rWidth+","+y1+"Q "+rWidth+","+y1+" "+rWidth+","+ym+" 50,"+y2+" 80,"+y2;
		})
		.style("stroke-width",function(d) {return 200*d.width;})
		.style("stroke","#ccc").style("fill","none")
		.style("stroke-opacity",.5)
		.transition().attr("d",function(d) {return diag(d.y1,d.y2,d.width,false);})
//*/

/*
 $(function() {
        $( "#slider-range" ).slider({
            range: true,
            min: 0,
            max: 500,
            values: [ 75, 300 ],
            slide: function( event, ui ) {
                $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
            }
        });
        $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
            " - $" + $( "#slider-range" ).slider( "values", 1 ) );
    });*/