var w=960,h=350,h1=400;
var svg=d3.select("#chart").append("svg").attr("version","1.1").attr("xmlns","http://www.w3.org/2000/svg").attr("width",w).attr("height",h1);
var tweetDiv=d3.select("#chart").append("div").classed("span8 offset2",1).attr("height",100).html("chargement des tweets...").attr("id","tweetDiv");
var data,agg,ids;

var x=d3.scale.linear().domain([0,92]).range([20,930]);
var y=d3.scale.linear().domain([0,2500]).range([h,0]);

var s1=d3.scale.linear().domain([1,9]).range([0,4]);
var s2=d3.scale.linear().range([0,.2]);
var tweetId,details;
function r(x) {return Math.round(x,0);}
var legends=svg.append("g").attr("id","legends").attr("text-anchor","middle");
legends.append("path").attr("d","m"+x(2)+",355v3")
legends.append("text").attr("x",x(2)).attr("y",370).text("18:30");

legends.append("path").attr("d","m"+x(20)+",355v3")
legends.append("text").attr("x",x(20)).attr("y",370).text("20:00");
legends.append("path").attr("d","m"+(x(29))+",355v3L"+(x(38.1))+",358v-3");
legends.append("text").attr("x",x(33.55)).attr("y",370).text("Première mi-temps");

legends.append("path").attr("d","m"+(x(40.4))+",355v3L"+(x(51))+",358v-3");
legends.append("text").attr("x",x(45.7)).attr("y",370).text("Deuxième mi-temps");

legends.append("path").attr("d","m"+x(57)+",355v3")
legends.append("text").attr("x",x(57)).attr("y",370).text("23:00");

legends.append("path").attr("d","m"+x(69)+",355v3")
legends.append("text").attr("x",x(69)).attr("y",370).text("0:00");

legends.append("path").attr("d","m"+x(81)+",355v3")
legends.append("text").attr("x",x(81)).attr("y",370).text("1:00");

legends.append("path").attr("d","m"+x(93)+",355v3")
legends.append("text").attr("x",x(93)).attr("y",370).text("2:00");

legends.append("text").attr("x",x(0)+5).attr("y",y(0)).attr("text-anchor","end").text("0")
legends.append("text").attr("x",x(0)+5).attr("y",y(500)).attr("text-anchor","end").text("100")
legends.append("text").attr("x",x(0)+5).attr("y",y(1000)).attr("text-anchor","end").text("200")
legends.append("text").attr("x",x(0)+5).attr("y",y(1500)).attr("text-anchor","end").text("300")
legends.append("text").attr("x",x(0)+5).attr("y",y(2000)).attr("text-anchor","end").text("400")
legends.append("text").attr("x",x(0)-20).attr("y",50).attr("text-anchor","start").text("Tweets par minute")

legends.append("text").attr("x",900).attr("y",80).attr("text-anchor","end").text("Tweets négatifs").classed("neg",1)
legends.append("text").attr("x",900).attr("y",100).attr("text-anchor","end").text("Tweets positifs").classed("pos",1)
d3.csv("tweets.csv",function(csv) {
	data=csv;
	data.forEach(function(d,i) {d.pos=+d.pos;d.time=+d.time;d.index=i;})
	agg=d3.nest().key(function(d) {return d.time;}).rollup(function(d) {var pos=0,neg=0;d.forEach(function(p){if(p.pos){pos+=1;}else{neg+=1;}});return [pos,neg];}).entries(data);
	ids=d3.nest().key(function(d) {return d.time;}).key(function(d) {return d.pos;}).entries(data);
	//var 
	details=[];

	d3.csv("details.csv",function (csv2) {
		details=csv2;
		tweetDiv=tweetDiv.classed("well",1).style("margin-bottom",0).html("").append("div").classed("span8",1)
		tweetDiv.append("div").classed("row",1).append("div").attr("id","user").append("a");
		tweetDiv.append("div").classed("row",1).append("div").attr("id","text").html("Passez votre souris sur les barres pour explorer les tweets")
		tweetDiv.append("div").classed("row",1).append("div").attr("id","time").append("a");
		
	});

	//var 
	tweetId=-1;

	var barchart=svg.selectAll("g").data(agg).enter()
		.append("g").classed("barchart",1)
		.attr("transform",function(d,i) {return "translate("+x(i)+",0)";})
	
	var posG=barchart
		.append("g");
	var pos=posG
			.append("rect")
			.attr("x",1).attr("width",8)
			.attr("y",function(d) {return y(d.values[0]);})
			.attr("height",function(d) {return h-y(d.values[0]);})
			.classed("pos",1);

	var negG=barchart
		.append("g");
	var neg=negG
			.append("rect")
			.attr("x",1).attr("width",8)
			.attr("y",function(d) {return y(d.values[0]+d.values[1]);})
			.attr("height",function(d) {return h-y(d.values[1]);})
			.classed("neg",1);

	pos.on("mousemove",function(d,i) {
		var m=d3.mouse(this);
		var d0,y0;
		d0=d.values[0];
		y0=y(d0);
		s2.domain([h,y0]);
		var id=r(d0*(s2(m[1])+r(s1(m[0]))*.2))-1
		updateTweet(ids[i].values[1].values[id].index);

	})

	neg.on("mousemove",function(d,i){
		var m=d3.mouse(this);
		var d0,d1,y0,y1;
		d0=d.values[0];
		d1=d.values[1];
		y0=y(d0);
		y1=y(d1+d0);
		s2.domain([y0,y1]);
		var id=r(d1*(s2(m[1])+r(s1(m[0]))*.2))-1
		updateTweet(ids[i].values[0].values[id].index);
		
	})

	pos.on("click",function(d,i) {
		if(details.length){
			var tweet=details[tweetId];
			if (tweet.id){
				window.open("https://twitter.com/" + tweet.user + "/status/" + tweet.id,"_blank");
			}

		}
	})

	function updateTweet(id) {
		if (details.length) {
			if (tweetId!==id) {
				var tweet=details[id]
				d3.select("#user").select("a").html(tweet.user);
				d3.select("#text").html(tweet.text);
				d3.select("#time").html(tweet.time);
				tweetId=id;
			}	
		}
	}

})