
var countries=[
{name:"Canada", group:"OECD"},
{name:"USA", group:"OECD"},
{name:"Mexico", group:"OECD"},
{name:"Brazil", group:"BRIICS"},
{name:"Turkey", group:"OECD"},
{name:"Korea", group:"OECD"},
{name:"Japan", group:"OECD"},
{name:"Oceania", group:"OECD"},
{name:"C.Europe", group:"OECD"},
{name:"China", group:"BRIICS"},
{name:"E.Africa", group:"Rest of the world"},
{name:"India", group:"BRIICS"},
{name:"Indonesia", group:"BRIICS"},
{name:"Rest C.Am.", group:"Rest of the world"},
{name:"Rest S.Am.", group:"Rest of the world"},
{name:"Russia", group:"BRIICS"},
{name:"S.Africa", group:"BRIICS"},
{name:"SE.Asia", group:"Rest of the world"},
{name:"Stan", group:"Rest of the world"},
{name:"Ukraine", group:"Rest of the world"},
{name:"W.Africa", group:"Rest of the world"},
{name:"W.Europe", group:"OECD"}];

function colors(mycolor, scope, levels) {
var s,l,h;
s=d3.hsl(d3.rgb(mycolor)).s
l=d3.hsl(d3.rgb(mycolor)).l
h=d3.hsl(d3.rgb(mycolor)).h
myCols=d3.range(levels).map(function(d,i) {return d3.hsl("hsl(" + (d3.scale.linear().domain([0,levels-1]).range([h-scope,h+scope])(i))+","+~~(100*s)+"%,"+~~(100*l)+"%)");})
myCols=myCols.map(function(d) {return d.rgb().toString();})
return myCols;
}
countries.forEach(function(c,i) {c.id=i;})
var palette=d3.scale.category20c();

var groups=["OECD","BRIICS","Rest of the world"];
groups=groups.map(function(g) {return {name:g,color:palette(g)};})

groups.forEach(function(g) {
	myCountries=countries.filter(function(c) {return c.group==g.name;})
	var nbItems=myCountries.length;
	myCountries.forEach(function(c,i) {countries[c.id].color=colors(g.color, 20, nbItems)[i];});
});


var values="Canada;5318190;5361310;5420900;5400800;5405080;5412870;5440980;5441560;5449740;5423480;5443860;5509850;5577900;5601900;5623450;5646110;5680690;5285310;5292670;5299190;5230590;5189580;5162380;5134360;5096860;5054160;5001030;5001290;4974440;4953610;4945020;4923760;4910340;4895500$USA;2880690;2693650;2701710;2654000;2692050;2699100;2728290;2744490;2760670;2755160;2769490;2814340;2908360;2959580;3021580;3065710;3143140;2752380;2513010;2452650;2340540;2274620;2204660;2163110;2116030;2093130;2048230;2015450;1950540;1922340;1906120;1902670;1886310;1890000$Mexico;232026;228568;225638;188823;188823;185203;185203;190432;190432;180297;163092;162778;162850;168059;168059;165209;165325;213070;188098;163923;116821;90325;89400.3;67733.1;73401.9;67759.5;70498.4;59118.8;59110.2;56868.7;56861.7;56861.7;56853;59770.1$Brazil;4902200;4730370;4566240;4514700;4466400;4362320;4325420;4226970;4156330;4126480;4089480;4140320;4226510;4313080;4440580;4528940;4600140;4595110;4355360;3960680;3699090;3486610;3333920;3206130;3187660;3034920;2935070;2861240;2790540;2723760;2659180;2656150;2570170;2535900$Turkey;66288.4;66266.6;66266.6;59194.1;59194.1;61502;61502;58776.2;61084.3;58455.6;52110.4;47391.2;43388.1;43304.9;38667.8;38597;38597;57001.6;50922.9;46274.1;34591.9;29941.2;26163.1;21846.2;17352.1;15045.7;11105.3;4667.08;6972.62;0;0;0;0;0$Korea;169748;157579;159946;157343;161105;160965;158598;153673;156035;153341;150884;155685;158138;160212;160212;157731;157731;159473;149773;144868;135059;132598;125439;122099;121472;119916;117334;111989;109431;96610.7;88047;60321.2;45457.3;23496.1$Japan;295394;293109;295692;294931;299246;300771;300771;307739;302395;305892;309603;313365;317425;317972;321052;323510;326712;245813;230004;206499;188151;169606;149405;133039;127941;112178;102600;83115.8;69168.3;50182.9;26942.1;5155.31;0;0$Oceania;442617;398288;411512;429098;416695;470133;364490;302170;256169;228885;219532;213127;213127;206179;206053;207054;207708;429699;379989;377951;349261;286259;316301;197330;184677;167732;144995;139723;134368;134368;122759;120323;114570;108220$C.Europe;548134;531727;543816;535908;559579;604490;583885;542680;504614;473884;451951;472252;497331;515819;534802;545472;555509;501298;454106;422309;380923;351895;328030;289583;238593;191386;152330;112238;79438.7;48285.6;18123.7;0;0;0$China;2644890;2503810;2296710;2218270;1628200;1437720;1192140;1001480;920526;855501;841763;1039900;1224150;1357060;1534660;1674860;1810000;2451960;2308670;2105170;1999100;1376020;1155060;916700;737623;638102;552890;522297;509310;356661;258580;207706;108537;67370.5$E.Africa;338680;323742;256554;238575;235675;238558;242258;246204;280850;231916;219455;195729;186669;198119;224527;254124;266199;175163;14744.6;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0$India;561231;537366;537366;531642;517412;506528;495679;491709;492792;481608;481647;459852;434518;430017;415609;414182;418819;329686;131505;420.715;0;0;0;0;0;0;0;0;0;0;0;0;0;0$Indonesia;1945650;1936620;1955810;1939040;1908640;1908520;1883210;1868510;1860560;1852120;1855180;1859200;1860260;1866900;1870880;1869680;1872610;1894280;1830500;1760360;1676670;1582480;1491260;1382620;1313780;1232630;1195970;1131920;1085550;1038640;1007360;977451;958120;937773$Rest C.Am.;415688;393937;382208;373029;345204;339817;333771;328453;326361;307280;281790;270811;265466;261191;253382;246260;237515;391449;363646;330135;300161;266975;244099;224674;201244;185521;164896;139957;119351;105089;86062.4;73085.5;61935.2;59406.2$Rest S.Am.;3499220;3535510;3433380;3470880;3427730;3426660;3354280;3196760;3067280;2995190;2950220;2909510;2874540;2883290;2921100;2935820;2967680;3416600;3353600;3199420;3114570;3015710;2922180;2816240;2695780;2581360;2484310;2429300;2368600;2311940;2287340;2250070;2218240;2206300$Russia;11747600;11745900;11797400;11809300;11794200;11888100;11738900;11532700;11333100;11340800;11372100;11591300;11771800;11920800;12042800;12204600;12373100;11471600;11323200;11209300;11100000;10963300;10875800;10778600;10660000;10541200;10499600;10453400;10406400;10369700;10363800;10336300;10328800;10333800$S.Africa;212861;171964;165925;165737;171723;179491;177088;178700;194238;149242;129304;98736.5;68959.8;29978.8;27332.3;33452.8;36511.3;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0$SE.Asia;1165880;1141880;1133380;1116690;1102700;1083450;1076850;1081260;1100540;1098070;1092150;1100090;1103190;1107030;1121790;1139720;1152940;1078590;980702;869210;802178;685750;578706;494172;445837;444518;413803;391369;366515;325629;325581;301918;299565;299312$Stan;51394.3;51391.8;51391.8;51388.6;49207.3;51397.3;53810;43798.3;40325.8;38169.3;60544.5;71792.6;80751;80738;80738;80726;88005.5;49369.9;47363.3;44984.2;42976.9;38832.7;36878.5;34586.6;26605.2;20578.8;17943.6;15980.7;16067.4;13624.7;11598.9;9219.79;7236.04;12087.8$Ukraine;255815;255742;277874;277529;279234;294380;274678;223770;170972;125208;80966.2;80940.8;77112;88904;105943;120829;130363;242750;227373;217867;209480;198256;192261;182578;148504;108767;76413.9;41202.2;33484;25999.8;16779.9;7444.13;0;0$W.Africa;2644700;2692660;2581020;2502120;2520340;2534710;2547730;2347270;2244540;2095430;1973700;1797040;1711300;1699460;1730240;1770240;1851660;2366670;2039130;1676720;1275500;865771;429482;144290;0;0;0;0;0;0;0;0;0;0$W.Europe;1577300;1588110;1614750;1625030;1666830;1722090;1736400;1766670;1789160;1762680;1734990;1725650;1727880;1744050;1753240;1760850;1766330;1482050;1421750;1370270;1323880;1262970;1205850;1149680;1109870;1062820;1002920;940227;882726;834984;797853;766130;726656;690560";



data=values.split("$").map(function(line,nb) {
	var lineS=line.split(";");
	var record={name:lineS[0],total:lineS.slice(1,18).map(parseFloat),primary:lineS.slice(18,35).map(parseFloat)};
	//record.color=countries[nb].color;
	record.group=countries[nb].group;
	record.production=d3.range(17).map(function(i) {return record.total[i]-record.primary[i];});
	return record;})

/*data.sort(function(a,b){
    if(a.group<b.group) return -1;
    if(a.group>b.group) return 1;
    return a.total>b.total?1:-1;
})



data.forEach(function(d,i) {
	if(!i) {d.cumTotal=d.total.slice();d.cumPrimary=d.primary.slice();}
	else
	{
		d.cumTotal=data[i-1].cumTotal.map(function(v,j) {return v+d.total[j];});
		d.cumPrimary=data[i-1].cumPrimary.map(function(v,j) {return v+d.primary[j];});
	}
});*/

groups.forEach(function(g) {
	myData=data.filter(function(d) {return d.group==g.name;});
	g.total=d3.range(17).map(function(i) {return d3.sum(myData,function(d) {return d.total[i];})});
	g.primary=d3.range(17).map(function(i) {return d3.sum(myData,function(d) {return d.primary[i];})});
	//g.cumTotal=d3.range(17).map(function(i) {return d3.sum(myData,function(d) {return d.cumTotal[i];})});
	//g.cumPrimary=d3.range(17).map(function(i) {return d3.sum(myData,function(d) {return d.cumPrimary[i];})});
});


var mode=0;

svg=d3.selectAll("#chart").append("svg:svg").attr("height",800).attr("width",800);

var years=16;
var maxA=42000000; // 42 million
var maxB=20000000; // 20 million

var w=600,h=600;

var x=d3.scale.linear().domain([0,years]).range([0,w]);
var y=d3.scale.linear().domain([0,maxA]).range([h,0]);
var y1=d3.scale.linear().domain([0,maxB]).range([h/4,0]);

data1=[[],[]]
data1[0]=groups.map(function(g,j) {return g.total.map(function(d,i) {return {x:i,y:d,g:j};});})
data1[1]=groups.map(function(g,j) {return g.primary.map(function(d,i) {return {x:i,y:d,g:j};});})
dataStacked=data1.map(function(d) {return d3.layout.stack()(d);})



//d3.range(17).forEach(function(i) {var d=dataStacked[0];console.log(d[0][i].y+"\t"+d[1][i].y+"\t"+d[2][i].y);})


var line=d3.svg.area().x(function(d,i) {return x(i);}).y1(function(d) {return y1(d);}).y0(function() {return y1(0);});

/*var lineS=function(myArray) {
	myPath="";
	myArray.forEach(function(point,i) {
		myPath+=(i?"L":"M");
		myPath+=x(point.x)+","+y(point.y+point.y0);
	})
	myArray.reverse().forEach(function(point,i) {
		myPath+="L"+x(point.x)+","+y(point.y0);
	})
	myPath+="Z";
	return myPath;}

//	return d3.svg.line().x(function(d) {return x(d.x);}).y(function(d) {return y(d.y);})(array)+
//	       d3.svg.line().x(function(d) {return x(d.x);}).y(function(d) {return y(d.y);})(array.reverse())+
//	       "Z";}
*/	       
/*	
d3.svg.area().x(function(d) {return x(d.x);}).y1(function(d) {return y(d.y1);}).y0(function(d) {return y(d.y0);});

}*/
var lineS=new Array;
lineS[0]=d3.svg.area().x(function(d) {return x(d.x);}).y1(function(d) {return y(d.y+d.y0);}).y0(function(d) {return y(d.y0);});
lineS[1]=d3.svg.area().x(function(d) {return x(d.x);}).y(function(d) {return y1(d.y);}).y0(function(d) {return y1(0);});
/*
var lineP=function(d) {console.log(d.name+" primary");return line(d.cumPrimary);}
var lineT=function(d) {console.log(d.name+" total");return line(d.total);}

var lineST=function(d) {console.log(d.name+" total");return lineS(d.total);}
*/

var total=svg.append("svg:g").attr("transform","translate(0,100)").selectAll("g.total").data(dataStacked[0]).enter()
	//.append("svg:g").classed("total",1).selectAll("path.total").data(function(d) {return d;}).enter()
	.append("svg:path").classed("total",1)
		.attr("d",function(d) {//console.log(d);
		return lineS[mode](d);})
		.style("fill",function(d) {return palette([d[0].g]);})
		.style("opacity",.8)
		.style("stroke",function(d) {return d3.rgb(d.color).darker();})
			.append("svg:title").text(function(d) {//console.log(d);
			return groups[d[0].g].name;})
		;
		
button=d3.selectAll("#button");
button.on("click",function() {
	mode=1-mode;
	d3.selectAll("path.total").transition()
		.attr("d",function(d) {return lineS[mode](d);})
		.attr("transform",function(d,i) {var myTransform="translate(0,"+mode*(50+200*(2-i))+")"; console.log(myTransform);return myTransform;})
		;
})

//var primary=svg.selectAll(".primary").data(data).enter().append("svg:path").attr("d",lineP).style("fill","white").style("stroke","black");//.style("opacity",.8);

