var h=400,w=700;

var data={title:"PM<sub>10</sub> concentrations for major cities",subtitle:"µg/m³",footnote:"", 
domain:{x:[2010,2050],y:[0,200],d:[0,20]},
range:{x:[50,w-210],y:[h-20,30],d:[0,250]},
yAxisLabel:"µg/m³",
series:[

{name:"Brazil", values: [{year:2010, value:32.92363}, {year:2030, value:29.26754}, {year:2050, value:29.60245}]},
{name:"Russia", values: [{year:2010, value:42.94084}, {year:2030, value:38.02832}, {year:2050, value:36.27894}]},
{name:"India", values: [{year:2010, value:120.0191}, {year:2030, value:133.2438}, {year:2050, value:145.4993}]},
{name:"Indonesia", values: [{year:2010, value:117.8323}, {year:2030, value:120.2738}, {year:2050, value:122.6018}]},
{name:"China", values: [{year:2010, value:125.5934}, {year:2030, value:125.4388}, {year:2050, value:115.3203}]},
{name:"Africa", values: [{year:2010, value:92.0579043667104}, {year:2030, value:95.7716596482401}, {year:2050, value:103.544519735603}]},
{name:"South Asia", values: [{year:2010, value:142.0938}, {year:2030, value:168.7977}, {year:2050, value:193.3013}]},
{name:"OECD", values: [{year:2010, value:39.05872}, {year:2030, value:34.76732}, {year:2050, value:33.12714}]},
{name:"WHO air quality guideline", selected:true, values:[{year:2010,value:20},{year:2030,value:20},{year:2050,value:20}]}]
};
