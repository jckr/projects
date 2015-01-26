

	//    http://www.JSON.org/json2.js

	//    2009-06-29

	//    Minified

	var JSON=JSON||{};(function(){function f(n){return n<10?'0'+n:n;}if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+f(this.getUTCMonth()+1)+'-'+f(this.getUTCDate())+'T'+f(this.getUTCHours())+':'+f(this.getUTCMinutes())+':'+f(this.getUTCSeconds())+'Z':null;};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();};}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}if(typeof rep==='function'){value=rep.call(holder,key,value);}switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}v=partial.length===0?'[]':gap?'[\n'+gap+partial.join(',\n'+gap)+'\n'+mind+']':'['+partial.join(',')+']';gap=mind;return v;}if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==='string'){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}return str('',{'':value});};}if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}return reviver.call(holder,key,value);}cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}throw new SyntaxError('JSON.parse');};}}());

	String.prototype.visualLength = function(fontFamily)
	{
	    var ruler = document.getElementById("ruler");
	    ruler.style.font = fontFamily;
	    ruler.innerHTML = this;
	    return ruler.offsetWidth;
	}

	function encode(text){
		var repl=[["À","&#192;"],["Á","&#193;"],["Â","&#194;"],["Ã","&#195;"],["Ä","&#196;"],["Å","&#197;"],["Æ","&#198;"],["Ç","&#199;"],["È","&#200;"],["É","&#201;"],["Ê","&#202;"],["Ë","&#203;"],["Ì","&#204;"],["Í","&#205;"],["Î","&#206;"],["Ï","&#207;"],["Ð","&#208;"],["Ñ","&#209;"],["Ò","&#210;"],["Ó","&#211;"],["Ô","&#212;"],["Õ","&#213;"],["Ö","&#214;"],["Ø","&#216;"],["Ù","&#217;"],["Ú","&#218;"],["Û","&#219;"],["Ü","&#220;"],["Ý","&#221;"],["Þ","&#222;"],["ß","&#223;"],["à","&#224;"],["á","&#225;"],["â","&#226;"],["ã","&#227;"],["ä","&#228;"],["å","&#229;"],["æ","&#230;"],["ç","&#231;"],["è","&#232;"],["é","&#233;"],["ê","&#234;"],["ë","&#235;"],["ì","&#236;"],["í","&#237;"],["î","&#238;"],["ï","&#239;"],["ð","&#240;"],["ñ","&#241;"],["ò","&#242;"],["ó","&#243;"],["ô","&#244;"],["õ","&#245;"],["ö","&#246;"],["ø","&#248;"],["ù","&#249;"],["ú","&#250;"],["û","&#251;"],["ü","&#252;"],["ý","&#253;"],["þ","&#254;"],["ÿ","&#255;"]];
		repl.forEach(function(c) {text=text.replace(eval("/" + c[0] + "/g"), c[1]);})
		return text;
	}










var doctype='<?xml version="1.0" standalone="no"?> <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
var code="";

var data =[{category:"",value0:0,value1:0,value2:0}];
var attr={};

//var colorsFB=["#0087b0", "#ff9108", "#954b16", "#488fbc", "#cf0f16", "#9abc29", "#762953", "#005e9a", "#419748", "#f76114", "#5b528f", "#003a73"];
var colors=["#0078ba","#b2b2b2","#af418e","#97bf0d","#ed4e70","#ffdd00","#e5352d","#009036","#e15c12","#009ee0"];
var sColor,chartType,vis,myMin,myMax,fontTitle, fontSubtitle, fontLabel, fontUnit, cUrl, cw,ch, hTitle, myMin, myMax;
var stdFont="'Helvetica Neue', Arial, Helvetica, sans-serif"
var titleRows=[];
var legends=[];
var myColors=[];
var csvRows = [];
var objArr = [];
var dots =0;
var chevron=[
{x:0.0167, y:0.0167},
{x:0.4667, y:0.3833},
{x:0.4667, y:0.6167},
{x:0.0167, y:0.9833},
{x:0.0167, y:0.75},
{x:0.3333, y:0.5},
{x:0.0167, y:0.25}
];
var digits=0;
var blueTitle=1;
var lAngle =0,hTicks =1,vTicks =0,mX=-1,vertical = false,properCode="",fullCode="";
var serializer=new XMLSerializer;
function setMessage (message, error)

{	document.getElementById("message").innerHTML = '<p>' + message + '</p>';
	if (error)
		document.getElementById("message").className = "error";
	else
		document.getElementById("message").className = "";
}

function parseCSVLine (line)

{
	line = line.split(/[\t,]/g)
	// check for splits performed inside quoted strings and correct if needed
	for (var i = 0; i < line.length; i++)
	{
		var chunk = line[i].replace(/^[\s]*|[\s]*$/g, "");
		var quote = "";
		if (chunk.charAt(0) == '"' || chunk.charAt(0) == "'") quote = chunk.charAt(0);
		if (quote != "" && chunk.charAt(chunk.length - 1) == quote) quote = "";
		if (quote != "")
		{
			var j = i + 1;
			if (j < line.length) chunk = line[j].replace(/^[\s]*|[\s]*$/g, "");
			while (j < line.length && chunk.charAt(chunk.length - 1) != quote)
			{
				line[i] += ',' + line[j];
				line.splice(j, 1);
				chunk = line[j].replace(/[\s]*$/g, "");
			}
			if (j < line.length)
			{
				line[i] += ',' + line[j];
				line.splice(j, 1);
			}
		}
	}
	for (var i = 0; i < line.length; i++)
	{
		// remove leading/trailing whitespace
		line[i] = line[i].replace(/^[\s]*|[\s]*$/g, "");

		// remove leading/trailing quotes
		if (line[i].charAt(0) == '"') line[i] = line[i].replace(/^"|"$/g, "");
		else if (line[i].charAt(0) == "'") line[i] = line[i].replace(/^'|'$/g, "");
	}
	return line;
}

function csvToJson () {
	var message = "";
	var error = false;
	var f = document.forms["convertForm"];
	var csvText = f.elements["csv"].value;
	if(f.elements["size"].value==0){
	
			w=800;h=533;
			if(f.elements["ffTitle"].value==""||f.elements["ffTitle"].value=="auto") {fontTitle="bold 32px "+stdFont;f.elements["ffTitle"].value=fontTitle} else {fontTitle=f.elements["ffTitle"].value;}
			if(f.elements["ffsTitle"].value==""||f.elements["ffsTitle"].value=="auto") {fontSubtitle="24px "+stdFont;f.elements["ffsTitle"].value=fontSubtitle} else {fontSubtitle=f.elements["ffsTitle"].value;}
			if(f.elements["ffLabel"].value==""||f.elements["ffLabel"].value=="auto") {fontLabel="16px "+stdFont;f.elements["ffLabel"].value=fontLabel} else {fontLabel=f.elements["ffLabel"].value;}
			if(f.elements["ffUnit"].value==""||f.elements["ffUnit"].value=="auto") {fontUnit="16px "+stdFont;f.elements["ffUnit"].value=fontUnit} else {fontUnit=f.elements["ffUnit"].value;}

			lMargin=46;cUrl="chevrons/large.png";hTitle=87; cw=40; ch=80;
			vertical=false;
	}
	else if(f.elements["size"].value==1){
	
		w=600;h=400;
		if(f.elements["ffTitle"].value==""||f.elements["ffTitle"].value=="auto") {fontTitle="bold 24px "+stdFont;f.elements["ffTitle"].value=fontTitle} else {fontTitle=f.elements["ffTitle"].value;}
		if(f.elements["ffsTitle"].value==""||f.elements["ffsTitle"].value=="auto") {fontSubtitle="24px "+stdFont;f.elements["ffsTitle"].value=fontSubtitle} else {fontSubtitle=f.elements["ffsTitle"].value;}
		if(f.elements["ffLabel"].value==""||f.elements["ffLabel"].value=="auto") {fontLabel="12px "+stdFont;f.elements["ffLabel"].value=fontLabel} else {fontLabel=f.elements["ffLabel"].value;}
		if(f.elements["ffUnit"].value==""||f.elements["ffUnit"].value=="auto") {fontUnit="12px "+stdFont;f.elements["ffUnit"].value=fontUnit} else {fontUnit=f.elements["ffUnit"].value;}

		lMargin=35;cUrl="chevrons/large.png";hTitle=65; cw=30; ch=60;
		vertical=false;
	} else if(f.elements["size"].value==2){
	
		w=330;h=220;
		if(f.elements["ffTitle"].value==""||f.elements["ffTitle"].value=="auto") {fontTitle="bold 14px "+stdFont;f.elements["ffTitle"].value=fontTitle} else {fontTitle=f.elements["ffTitle"].value;}
		if(f.elements["ffsTitle"].value==""||f.elements["ffsTitle"].value=="auto") {fontSubtitle="12px "+stdFont;f.elements["ffsTitle"].value=fontSubtitle} else {fontSubtitle=f.elements["ffsTitle"].value;}
		if(f.elements["ffLabel"].value==""||f.elements["ffLabel"].value=="auto") {fontLabel="10px "+stdFont;f.elements["ffLabel"].value=fontLabel} else {fontLabel=f.elements["ffLabel"].value;}
		if(f.elements["ffUnit"].value==""||f.elements["ffUnit"].value=="auto") {fontUnit="10px "+stdFont;f.elements["ffUnit"].value=fontUnit} else {fontUnit=f.elements["ffUnit"].value;}


		lMargin=20;cUrl="chevrons/medium.png";hTitle=40; cw=15;ch=30;
		vertical=false;
	} else if(f.elements["size"].value==3){
		w=260;h=195;

		if(f.elements["ffTitle"].value==""||f.elements["ffTitle"].value=="auto") {fontTitle="bold 12px "+stdFont;f.elements["ffTitle"].value=fontTitle} else {fontTitle=f.elements["ffTitle"].value;}
		if(f.elements["ffsTitle"].value==""||f.elements["ffsTitle"].value=="auto") {fontSubtitle="12px "+stdFont;f.elements["ffsTitle"].value=fontSubtitle} else {fontSubtitle=f.elements["ffsTitle"].value;}
		if(f.elements["ffLabel"].value==""||f.elements["ffLabel"].value=="auto") {fontLabel="9px "+stdFont;f.elements["ffLabel"].value=fontLabel} else {fontLabel=f.elements["ffLabel"].value;}
		if(f.elements["ffUnit"].value==""||f.elements["ffUnit"].value=="auto") {fontUnit="9px "+stdFont;f.elements["ffUnit"].value=fontUnit} else {fontUnit=f.elements["ffUnit"].value;}

		lMargin=20;cUrl="chevrons/medium.png";hTitle=40;cw=15;ch=30;
		vertical=false;
	} else if(f.elements["size"].value==4){
		w=250;h=200;
		if(f.elements["ffTitle"].value==""||f.elements["ffTitle"].value=="auto") {fontTitle="bold 12px "+stdFont;f.elements["ffTitle"].value=fontTitle} else {fontTitle=f.elements["ffTitle"].value;}
		if(f.elements["ffsTitle"].value==""||f.elements["ffsTitle"].value=="auto") {fontSubtitle="12px "+stdFont;f.elements["ffsTitle"].value=fontSubtitle} else {fontSubtitle=f.elements["ffsTitle"].value;}
		if(f.elements["ffLabel"].value==""||f.elements["ffLabel"].value=="auto") {fontLabel="9px "+stdFont;f.elements["ffLabel"].value=fontLabel} else {fontLabel=f.elements["ffLabel"].value;}
		if(f.elements["ffUnit"].value==""||f.elements["ffUnit"].value=="auto") {fontUnit="9px "+stdFont;f.elements["ffUnit"].value=fontUnit} else {fontUnit=f.elements["ffUnit"].value;}


		lMargin=20;cUrl="chevrons/medium.png";hTitle=35;cw=15;ch=30;
		vertical=false;
	} else {
		w=130;h=250;

		if(f.elements["ffTitle"].value==""||f.elements["ffTitle"].value=="auto") {fontTitle="bold 10px Helvetica";f.elements["ffTitle"].value=fontTitle} else {fontTitle=f.elements["ffTitle"].value;}
		if(f.elements["ffsTitle"].value==""||f.elements["ffsTitle"].value=="auto") {fontSubtitle="10px Helvetica";f.elements["ffsTitle"].value=fontSubtitle} else {fontSubtitle=f.elements["ffsTitle"].value;}
		if(f.elements["ffLabel"].value==""||f.elements["ffLabel"].value=="auto") {fontLabel="9px Helvetica";f.elements["ffLabel"].value=fontLabel} else {fontLabel=f.elements["ffLabel"].value;}
		if(f.elements["ffUnit"].value==""||f.elements["ffUnit"].value=="auto") {fontUnit="9px Helvetica";f.elements["ffUnit"].value=fontTitle} else {fontUnit=f.elements["ffUnit"].value;}

		lMargin=15;cUrl="chevrons/small.png";hTitle=25;cw=10;ch=20;
		vertical=true;
	}
	
	
	
	for(var i=0;i<4;i++){
		if(f.elements["chartType"][i].checked){
			chartType=i;
		}
	}
	if(chartType==3){dots=1;chartType=2;}else{dots=0;}
	
	if(f.elements["blue"].checked){blueTitle=1;}else{blueTitle=0;}
	if(f.elements["logo"].checked){logoTitle=1;}else{logoTitle=0;}
	
	
	
	if(f.elements["lAngle"].value==0){lAngle=0;}
	if(f.elements["lAngle"].value==1){lAngle=-Math.PI/6;}
	if(f.elements["lAngle"].value==2){lAngle=-Math.PI/4;}
	if(f.elements["lAngle"].value==3){lAngle=-Math.PI/2;}
	

	// colors

	for(var i=0;i<10;i++){
		if(f.elements["sColor"][i].checked){
			sColor=i;
			myColors[0]=colors[sColor];		// main color
			myColors[1]=colors[(sColor+1) % 10];	// color of series #2
			myColors[2]=colors[(sColor+2) % 10];	// color of series #3
			myColors[3]=colors[(sColor+3) % 10];	// highlight color
		}
	}
	


	titleRows = f.elements["title"].value.split(/[\r\n]/g);
	source = f.elements["source"].value;
	
	

	hTicks=(f.elements["hTicks"].value)?parseFloat(f.elements["hTicks"].value):0;
	vTicks=parseFloat(f.elements["vTicks"].value)?parseFloat(f.elements["vTicks"].value):0;

	
	digits=(f.elements["digits"].value)?parseFloat(f.elements["digits"].value):0;

	var jsonText = "";

	setMessage(message, error);

	if (csvText == "") { error = true; message = "Enter CSV text below."; }

	if (!error) {
		csvRows = csvText.split(/[\r\n]/g); // split into rows
		// get rid of empty rows
		for (var i = 0; i < csvRows.length; i++)
		{
			if (csvRows[i].replace(/^[\s]*|[\s]*$/g, '') == "")
			{
				csvRows.splice(i, 1);
				i--;
			}
		}

		if (csvRows.length < 2) { error = true; message = "The CSV text MUST have a header row!"; }
		else
		{	var startAt=0;
			objArr = [];
			legends=[];
			for (var i = 0; i < csvRows.length; i++)
			{
				csvRows[i] = parseCSVLine(csvRows[i]);
			}
			if(f.elements["legends"].checked){
				legends=csvRows[0];
				startAt=1;
			}
			
			for (var i = 0; i+startAt < csvRows.length; i++)
			{
				if (csvRows[i+startAt].length > 0) objArr.push({});
				var cat=objArr[i]["category"]=csvRows[i+startAt][0];
				if (cat[cat.length-1]=="*"){objArr[i]["category"]=cat.substring(0,cat.length-1);objArr[i]["important"]=true;}
				
				objArr[i]["values"]=csvRows[i+startAt].slice(1);
				//for (var j = 1; j < csvRows[i].length; j++) {
				for (var j = 1; j < 4; j++) { // now all lines have 3 reliable values.
					objArr[i]["value"+(j-1)] = (j<csvRows[i+startAt].length)?parseFloat(csvRows[i+startAt][j]):0;
				}
			}

			data = objArr;

			if(chartType==1){
				myMin=d3.min(data, function(d) {return d.value0+d.value1+d.value2;});
				myMax=d3.max(data, function(d) {return d.value0+d.value1+d.value2;});
			} else {
				var myMin0=d3.min(data, function(d) {return d.value0;});var myMax0=d3.max(data, function(d) {return d.value0;});
				var myMin1=d3.min(data, function(d) {return d.value1;});var myMax1=d3.max(data, function(d) {return d.value1;});
				var myMin2=d3.min(data, function(d) {return d.value2;});var myMax2=d3.max(data, function(d) {return d.value2;});
				myMin=myMin0;
				if(myMin1<myMin){
					myMin=myMin1;
				}
				if(myMin2<myMin){
					myMin=myMin2;
				}
				myMax=myMax0;
				if(myMax1>myMax){
					myMax=myMax1;
				}
				if(myMax2>myMax){
					myMax=myMax2;
				}
			}
			if (myMin>0){myMin=0;}
		}
		nbSeries=d3.max(data,function(d) {return d.values.length;})
		if(f.elements["fMin"].value!="auto"){myMin=parseFloat(f.elements["fMin"].value);}
		if(f.elements["fMax"].value!="auto"){myMax=parseFloat(f.elements["fMax"].value);}

		// define header, margin, axis and footer

		if(f.elements["header"].value=="auto"){
			if(f.elements["size"].value==1){header=30+hTitle;}
			if(f.elements["size"].value==2){header=20+hTitle;}
			if(f.elements["size"].value==3){header=20+hTitle;}
			if(f.elements["size"].value==4){header=20+hTitle;}
			if(f.elements["size"].value==5){header=10+hTitle;}
		}else{header=parseFloat(f.elements["header"].value);}

		if(f.elements["margin"].value=="auto"){
			if(f.elements["size"].value==1){margin=30;}
			if(f.elements["size"].value==2){margin=20;}
			if(f.elements["size"].value==3){margin=20;}
			if(f.elements["size"].value==4){margin=20;}
			if(f.elements["size"].value==5){margin=10;}
		} else {margin=parseFloat(f.elements["margin"].value);}

		if(f.elements["axis"].value=="auto"){
			axis=(myMax+'').visualLength(fontLabel)+5;
		} else {
			axis=parseFloat(f.elements["axis"].value);
		}

		if(f.elements["footer"].value=="auto"){
			if(f.elements["size"].value==1){footer=65;}
			if(f.elements["size"].value==2){footer=50;}
			if(f.elements["size"].value==3){footer=50;}
			if(f.elements["size"].value==4){footer=50;}
			if(f.elements["size"].value==5){footer=30;}
			if (lAngle!=0) {
				footer += d3.max(data, function(d) {return (12*Math.cos(lAngle)-d.category.visualLength(fontLabel)*Math.sin(lAngle));})-12;
			}
		}
		else {
			footer=parseFloat(f.elements["footer"].value);
		}


		//header=20;
		//footer=20;
		//margin=20;
		//axis=20;


		attr["size"]=f.elements["size"].value;
		attr["blue"]=blueTitle;
		delete attr["height"];delete attr["width"];delete attr["header"];delete attr["footer"];
		attr["chartType"]=chartType;
		attr["dots"]=dots;
		attr["logo"]=logoTitle
		attr["lAngle"]=(180/Math.PI)*lAngle;
		attr["sColor"]=sColor;
		attr["title"]=titleRows[0];
		if(titleRows.length>1){attr["subtitle"]=titleRows[1];}
		attr["hTicks"]=hTicks;
		attr["vTicks"]=vTicks;
		attr["digits"]=digits;
		attr["legends"]=legends;
		attr["data"]=data;
		attr["nbSeries"]=nbSeries;
		attr["min"]=myMin;
		attr["max"]=myMax;
		attr["header"]=header;
		attr["footer"]=footer;
		attr["axis"]=axis;
		attr["margin"]=margin;
		attr["sColor"]=sColor;
		attr["source"]=source;
		
		code=createAwesomeCode(attr);

		attr["div"]="#chart";
		chart(attr);
		addStyle();
		if(attr["data"].filter(function(d){return d.important}).length) {
			addImportant(attr);
		}

		d3.selectAll("#output").style("display","block");

		
		d3.select("#download-html").on("click", function() {downloadCode(code);});
		d3.select("#download-svg").on("click", downloadSVG);
		//document.forms["svg"].elements["svgoutput"].value=makeSVG(attr);
		//document.forms["result"].elements["code"].value=code;//fullCode;
	}
	
	
	


}


function createAwesomeCode(attr) {
	var imgFilename=d3.selectAll("#svgName").property("value").replace(".svg",".png");
	var code="";
	var lb="\n",ender=";\n",t="\t";
	code+="<html>"+lb;
	
	code+="<!--[if IE]>"+lb;
	code+=t+"<head></head><body style=\"margin:'0px';\">"+lb;
	code+=t+"<img style=\"border:1px solid #0078ba;border-top:none;border-left:none;\" src=\""+imgFilename+"\" alt=\"chart\" title=\"use Chrome or Firefox for an interactive version\" width=\""+attr["width"]+"\" height=\""+attr["height"]+"\" />"+lb;
	code+=t+"</body>"+lb;
	code+="<![endif]-->"+lb;
	
	code+="<!--[if !IE]> -->"+lb;
	
	code+=t+"<head>"+lb;
	code+=t+t+"<script type=\"text/javascript\" src=\"http://oecdfactblog.org/charter/d3.js\"></script>"+lb;
	code+=t+t+"<script type=\"text/javascript\" src=\"https://www.google.com/jsapi?key=oTcss7ZQFHKW+iZGWOcMDFOHvZ+CmEQY\"></script>"+lb;
	code+=t+t+"<script type=\"text/javascript\">"+lb;
	code+=t+t+t+"google.load(\"jquery\", \"1.6.4\");"+lb;
	code+=t+t+"</script>"+lb;
	code+=t+t+"<script type=\"text/javascript\" src=\"http://blog.oecdfactblog.org/wp-includes/js/jquery/jquery.tipsy.js\"></script>"+lb;
	code+=t+t+"<link rel=\"stylesheet\" type=\"text/css\" href=\"http://blog.oecdfactblog.org/wp-includes/js/jquery/tipsy.css\">"+lb;
	code+=t+t+"<script type=\"text/javascript\" src=\"http://oecdfactblog.org/charter/chartfunctions.js\"></script>"+lb;
	code+=t+t+"<link type=\"text/css\" rel=\"stylesheet\" href=\"http://oecdfactblog.org/charter/bootstrap.css\" />"+lb;
	code+=t+t+"<link type=\"text/css\" rel=\"stylesheet\" href=\"http://oecdfactblog.org/charter/charter.css\" />"+lb;
	code+=t+"</head>"+lb;
	
	code+=t+"<body>"+lb;

	code+=t+t+"<div id=\"chart\">"+lb;
	code+=t+t+"</div>"+lb;
	
	code+=t+t+"<script type=\"text/javascript\">"+lb;
	code+=t+t+t+"var attr="+JSON.stringify(attr)+ender;
	code+=t+t+t+"attr.div=\"#chart\""+ender;
	code+=t+t+t+"chart(attr)"+ender;

	if(attr["data"].filter(function(d){return d.important}).length) {
		code+=t+t+t+"addImportant(attr)"+ender;
	}


	code+=t+t+"</script>"+lb;
	
	code+=t+"</body>"+lb;
	
	code+="<!-- <![endif]-->"+lb;
	code+="</html>"

	return code;

}



function addStyle() {

	var style=".c0{color:#0078ba;}.c9{color:#b2b2b2;}.c1{color:#af418e;}.c8{color:#97bf0d;}.c6{color:#ed4e70;}.c3{color:#ffdd00;}.c2{color:#e5352d;}.c4{color:#009036;}.c7{color:#e15c12;}.c5{color:#009ee0;}";
	style+=".v0{fill:#0078ba;}.v9{fill:#b2b2b2;}.v1{fill:#af418e;}.v8{fill:#97bf0d;}.v6{fill:#ed4e70;}.v3{fill:#ffdd00;}.v2{fill:#e5352d;}.v4{fill:#009036;}.v7{fill:#e15c12;}.v5{fill:#009ee0;}";
	style+=".l0{stroke:#0078ba;}.l9{stroke:#b2b2b2;}.l1{stroke:#af418e;}.l8{stroke:#97bf0d;}.l6{stroke:#ed4e70;}.l3{stroke:#ffdd00;}.l2{stroke:#e5352d;}.l4{stroke:#009036;}.l7{stroke:#e15c12;}.l5{stroke:#009ee0;}";
	
	style+=".highlighted {fill:#b2b2b2;}.gridline {stroke:#ddd;stroke-opacity:.5;stroke-width:1;}.chartBkg {fill:white;stroke:#0078ba;}"

	style+=".titleBox.blue text {fill:white;}.titleBox.blue path {fill:white;}.titleBox.blue rect {fill:#0078ba;}"
	style=[style];
	
	var defs=d3.selectAll("svg").selectAll("defs").data(style).enter().append("svg:defs");
	defs.append("svg:style").attr("type","text/css").text(String);
}

function downloadCode(code) {
	filename=d3.selectAll("#htmlName").property("value");
	d3.selectAll("#download-html").attr("href", "data:text/html;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(code))))
	.attr("download",filename);
}

function downloadSVG() {
  filename=d3.selectAll("#svgName").property("value");
  
  var buttonTxt='<a style="bottom: 10px; right: 10px; position: absolute; " class="button btn small" href="#">show more</a>'
  
  d3.selectAll("#download-svg").attr("href", "data:image/svg+xml;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(
    d3.selectAll("svg").attr("version", "1.1")
       .attr("xmlns", "http://www.w3.org/2000/svg")
     .node().parentNode.innerHTML.replace(buttonTxt,'')))))
     .attr("download",filename);
}

