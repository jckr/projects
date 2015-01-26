var w=600, h=400;

var data={title:"Biodiversity",subtitle:"Evolution of terrestrial mean species abundance in %",footnote:"Mean species abundance of 100% represents <em>intact ecosystem</em>.", 
tagline:"Without new policies, by 2050 global biodiversity will decline by another 10%",

domain:{x:[2010,2050],y:[20,80],d:[0,10]},
range:{x:[50,w-210],y:[h-20,30],d:[0,250]},
yAxisLabel:"MSA%",
series:[
{name:"North America", values: [{year:2010,value:70.3890337058774},{year:2020,value:68.2319472184648},{year:2030,value:67.5367924594686},{year:2050,value:65.3052124560137}]},
{name:"Europe", values: [{year:2010,value:38.3602531374594},{year:2020,value:34.3415966212002},{year:2030,value:31.9164666257947},{year:2050,value:29.2551974313186}]},
{name:"Japan/Korea", values: [{year:2010,value:43.3615636376302},{year:2020,value:39.4757938941112},{year:2030,value:35.029047630808},{year:2050,value:28.202716091428}]},
{name:"Australia/NZ", values: [{year:2010,value:73.198199873592},{year:2020,value:69.3686096059544},{year:2030,value:68.6099795842163},{year:2050,value:65.1265814979635}]},
{name:"Brazil", values: [{year:2010,value:64.7611811467987},{year:2020,value:62.5761434812855},{year:2030,value:61.8186309236391},{year:2050,value:59.0310702367136}]},
{name:"Russia", values: [{year:2010,value:77.0228678424374},{year:2020,value:75.6598219418891},{year:2030,value:74.640175935654},{year:2050,value:73.1642451362661}]},
{name:"South Asia", values: [{year:2010,value:42.7304272947195},{year:2020,value:41.1615584184808},{year:2030,value:39.9532757154271},{year:2050,value:37.9690328222627}]},
{name:"China", values: [{year:2010,value:60.0158617888509},{year:2020,value:57.3657811591952},{year:2030,value:57.2265303286463},{year:2050,value:53.8124682372498}]},
{name:"Indonesia", values: [{year:2010,value:57.8232701633808},{year:2020,value:54.9148530552782},{year:2030,value:51.6726660026059},{year:2050,value:47.2506711578233}]},
{name:"Southern Africa", values: [{year:2010,value:69.4674608708932},{year:2020,value:63.8697010418926},{year:2030,value:58.8015440709245},{year:2050,value:55.1836994992131}]},
{name:"Rest of the Word", values: [{year:2010,value:71.0799472412164},{year:2020,value:67.7056133507437},{year:2030,value:65.4827439457271},{year:2050,value:62.9362919651613}]},
{name:"World", selected:true,values: [{year:2010,value:67.5245978308309},{year:2020,value:64.645729899535},{year:2030,value:63.0325030776526},{year:2050,value:60.4384588080115}]}]};
