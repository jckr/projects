var menus=[
"<ul class=\"nav nav-list\"><li class=\"nav-header\">1er tour</li>"+
"<li><a href=\"#\" onmouseover=\"highlight(2)\" onmouseout=\"highlight(0)\" style=\"color: rgb(237, 32, 39); \">Jean-Luc Mélenchon</a></li>"+
"<li><a href=\"#\" onmouseover=\"highlight(3)\" onmouseout=\"highlight(0)\" style=\"color: rgb(204, 0, 51); \">François Hollande</a></li>"+
"<li><a href=\"#\" onmouseover=\"highlight(4)\" onmouseout=\"highlight(0)\" style=\"color: rgb(65, 179, 117); \">Eva Joly</a></li>"+
"<li><a href=\"#\" onmouseover=\"highlight(5)\" onmouseout=\"highlight(0)\" style=\"color: rgb(235, 128, 46); \">François Bayrou</a></li>"+
"<li><a href=\"#\" onmouseover=\"highlight(6)\" onmouseout=\"highlight(0)\" style=\"color: rgb(0, 83, 132); \">Nicolas Sarkozy</a></li>"+
"<li><a href=\"#\" onmouseover=\"highlight(7)\" onmouseout=\"highlight(0)\" style=\"color: rgb(31, 47, 83); \">Marine Le Pen</a></li>"+
"<li><a href=\"#\" onmouseover=\"highlight(8)\" onmouseout=\"highlight(0)\" style=\"color: rgb(204, 204, 204); \">Abstention, blanc, nul, sans réponse</a></li>"+
"</ul>",
"<ul class=\"nav nav-list\">"+
"<li class=\"nav-header\">2ème tour</li>"+
"<li><a href=\"#\" onmouseover=\"highlight(9)\" onmouseout=\"highlight(0)\" style=\"color: rgb(204, 0, 51); \">François Hollande</a></li>"+
"<li><a href=\"#\" onmouseover=\"highlight(10)\" onmouseout=\"highlight(0)\" style=\"color: rgb(0, 83, 132); \">Nicolas Sarkozy</a></li>"+
"<li><a href=\"#\" onmouseover=\"highlight(11)\" onmouseout=\"highlight(0)\" style=\"color: rgb(204, 204, 204); \">Abstention, blanc, nul, sans réponse</a></li>"+
"</ul>",
"<ul class=\"nav nav-list\">"+
"<li class=\"nav-header\">1er tour 2007</li>"+
"<li><a href=\"#\" onmouseover=\"highlight(12)\" onmouseout=\"highlight(0)\" style=\"color: rgb(237, 32, 39); \">Olivier Besancenot</a></li>"+
"<li><a href=\"#\" onmouseover=\"highlight(13)\" onmouseout=\"highlight(0)\" style=\"color: rgb(204, 0, 51); \">Ségolène Royal</a></li>"+
"<li><a href=\"#\" onmouseover=\"highlight(14)\" onmouseout=\"highlight(0)\" style=\"color: rgb(235, 128, 46); \">François Bayrou</a></li>"+
"<li><a href=\"#\" onmouseover=\"highlight(15)\" onmouseout=\"highlight(0)\" style=\"color: rgb(0, 83, 132); \">Nicolas Sarkozy</a></li>"+
"<li><a href=\"#\" onmouseover=\"highlight(16)\" onmouseout=\"highlight(0)\" style=\"color: rgb(31, 47, 83); \">Jean-Marie Le Pen</a></li>"+
"<li><a href=\"#\" onmouseover=\"highlight(17)\" onmouseout=\"highlight(0)\" style=\"color: rgb(204, 204, 204); \">Abstention, blanc, nul, sans réponse</a></li>"+
"</ul>",
"<ul class=\"nav nav-list\">"+
"<li class=\"nav-header\">2ème tour 2007</li>"+
"<li><a href=\"#\" onmouseover=\"highlight(18)\" onmouseout=\"highlight(0)\" style=\"color: rgb(204, 0, 51); \">Ségolène Royal</a></li>"+
"<li><a href=\"#\" onmouseover=\"highlight(19)\" onmouseout=\"highlight(0)\" style=\"color: rgb(0, 83, 132); \">Nicolas Sarkozy</a></li>"+
"<li><a href=\"#\" onmouseover=\"highlight(20)\" onmouseout=\"highlight(0)\" style=\"color: rgb(204, 204, 204); \">Abstention, blanc, nul, sans réponse</a></li>"+
"</ul>"
];



var h=450,w=380,bw=75,ch=400;
var paper = new Raphael(document.getElementById('questio'), w, h);

// rectangles: id 0-3

for(i=0;i<4;i++) {
	paper.rect(11+88*i,400,75,0)
	//.data("value", data[0].values[0].values[0].values[i])
	.attr({fill: "#4682b4",stroke:"none"})
	.attr({height: data[0].values[0].values[0].values[i].pourcentage*400})
	.attr({y: (1-data[0].values[0].values[0].values[i].pourcentage)*400});
}

// texts: id 4-7

for(i=0;i<4;i++) {
	paper.text(11+88*i+75/2,10+(1-data[0].values[0].values[0].values[i].pourcentage)*400, (100*data[0].values[0].values[0].values[i].pourcentage).toFixed(0))
	.attr({fill:"#fff","font-size":13});
}

// circles

for(i=0;i<4;i++) {
	for(j=1;j<20;j++) {
		paper
		.circle(11+88*i+75/2,
			//(1-data[0].values[vMap[j].c].values[vMap[j].v].values[i].pourcentage)*400, 
			(1-data[0].values[0].values[0].values[i].pourcentage)*400,
			10)
		.attr({fill:"none",stroke:colors[j],"stroke-width":2,"stroke-opacity":0});
		paper
		.text(11+15+88*i+75/2,
			(1-data[0].values[vMap[j].c].values[vMap[j].v].values[i].pourcentage)*400, 
			(100*data[0].values[vMap[j].c].values[vMap[j].v].values[i].pourcentage).toFixed(0))
		.attr({"text-anchor":"start","font-size":13,"opacity":0});
	}
}

var labels=["Tout à fait\nd'accord","D'accord","Pas d'accord","Pas du tout\nd'accord"];
var label2=["Moins contrôler","Plus contrôler","",""];
// labels

for(i=0;i<4;i++) {
	paper
	.text(11+88*i+75/2,437,labels[i]);
}


var reponses=["R2","R3","R4","R5"];
var question=0;
var cat=0;



function updateQuestion(i) {
question=i-1;
$("#questions li").removeClass("active");
$("#questions #q"+i).addClass("active");
cat=0;


for(i=0;i<4;i++) {
	paper.getById(i).animate({
		height: data[question].values[0].values[0].values[i].pourcentage*400,
		y: (1-data[question].values[0].values[0].values[i].pourcentage)*400},250,"easeIn");
	
	paper.getById(i+4)
		.attr({text: (100*data[question].values[0].values[0].values[i].pourcentage).toFixed(0)})
		.animate({y: 10+(1-data[question].values[0].values[0].values[i].pourcentage)*400,opacity:1},250,"easeIn");
	
	idCat.forEach(function(cat) {cat.forEach(function(j) {
		paper.getById(6+j*2+38*i).attr({cy:(1-data[question].values[0].values[0].values[i].pourcentage)*400,"stroke-opacity":0});
		paper.getById(6+j*2+38*i+1).attr({
			y:(1-data[question].values[vMap[j].c].values[vMap[j].v].values[i].pourcentage)*400,
			text:(100*data[question].values[vMap[j].c].values[vMap[j].v].values[i].pourcentage).toFixed(0),
			"opacity":0});
		});
	});
	
	if(question===9) {paper.getById(i+160).attr({text:label2[i]});}
	else {paper.getById(i+160).attr({text:labels[i]});}
}



}

function updateCats(x) {
cat=x;
if (cat) { //opening
	for(i=0;i<4;i++) {
		paper.getById(i).animate({
			height: 1
			},250,"easeIn");
		
		paper.getById(i+4)
			.animate({opacity:0},250,"easeIn");
		idCat.forEach(function(cat) {cat.forEach(function(j) {
			console.log(paper.getById(6+j*2+38*i).attr({cy:(1-data[question].values[0].values[0].values[i].pourcentage)*400,"stroke-opacity":0}).id);
		});});
		idCat[cat].forEach(function(j) {
			paper.getById(6+j*2+38*i)
			.animate({
				cy:(1-data[question].values[vMap[j].c].values[vMap[j].v].values[i].pourcentage)*400,
				"stroke-opacity":1},500,"bounce");
		});
	}
	
	$("#votes").html(menus[cat-1]);
	}
else { // closing
	for(i=0;i<4;i++) {
			paper.getById(i).animate({
				height: data[question].values[0].values[0].values[i].pourcentage*400
				},250,"easeIn");
			
			paper.getById(i+4)
				.animate({opacity:1},250,"easeIn");
			idCat.forEach(function(cat) {cat.forEach(function(j) {
				paper.getById(6+j*2+38*i).attr({cy:(1-data[question].values[0].values[0].values[i].pourcentage)*400,"stroke-opacity":0});
			});});
				
		}
	$("#votes").html("");
	}
	
}
	
function highlight(v) {
	for(i=0;i<4;i++){
		idCat[cat].forEach(function(j) {
			if(v===(j+1)) {
				paper.getById(6+j*2+38*i+1).attr("opacity",1);
				paper.getById(6+j*2+38*i).attr("opacity",1);
			}
			else { 
				paper.getById(6+j*2+38*i+1).attr("opacity",0);
				if(v) {paper.getById(6+j*2+38*i).attr("opacity",0.2);}
				else {paper.getById(6+j*2+38*i).attr("opacity",1);}
			}
		});
	}
}

//$('circle').tipsy({html: true, gravity: 'w'});