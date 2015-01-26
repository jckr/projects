var w=600, h=400;

var data={title:"Biodiversity by biome",subtitle:"Evolution of terrestrial mean species abundance in %",footnote:"Mean species abundance of 100% represents <em>intact ecosystem</em>.", 
domain:{x:[1700,2050],y:[30,100],d:[0,10]},
range:{x:[50,w-210],y:[h-20,30],d:[0,50]},
yAxisLabel:"MSA%",
series:[
{name:"Polar/Tundra", values: [{year:1700, value:99.4917023971482},{year:1800, value:98.8027967347403},{year:1900, value:98.0374592263149},{year:1970, value:95.2373197799519},{year:2000, value:92.2268452135155},{year:2010, value:90.7797880253424},{year:2020, value:88.9939413070746},{year:2030, value:88.5385813383176},{year:2050, value:86.042368827403}]},
{name:"Grassland/steppe", values: [{year:1700, value:96.2530152161244},{year:1800, value:94.6647011656242},{year:1900, value:88.4408713203742},{year:1970, value:67.6218756205392},{year:2000, value:62.8551015829777},{year:2010, value:59.9860166444589},{year:2020, value:56.8357137917983},{year:2030, value:56.029095622348},{year:2050, value:54.2619056488455}]},
{name:"Scrubland/savanna", values: [{year:1700, value:96.4486952009812},{year:1800, value:94.5076468769698},{year:1900, value:89.474548326668},{year:1970, value:69.8484415152949},{year:2000, value:61.2691869256325},{year:2010, value:58.771727157096},{year:2020, value:54.2846092640967},{year:2030, value:51.2657269288644},{year:2050, value:47.5004154533952}]},
{name:"Boreal forests", values: [{year:1700, value:99.5013101866655},{year:1800, value:99.1289650047073},{year:1900, value:97.7334109614883},{year:1970, value:84.4321143118803},{year:2000, value:80.6614742826988},{year:2010, value:77.9797912300563},{year:2020, value:76.1887011479663},{year:2030, value:75.0131112784093},{year:2050, value:72.358766102832}]},
{name:"Temperate forests", values: [{year:1700, value:92.7229489876392},{year:1800, value:90.1548530361798},{year:1900, value:77.233818688883},{year:1970, value:49.715780890794},{year:2000, value:39.8929535085305},{year:2010, value:37.3066348247394},{year:2020, value:34.6493410693693},{year:2030, value:32.7732995958797},{year:2050, value:30.3263841200121}]},
{name:"Tropical forests", values: [{year:1700, value:98.7129509500802},{year:1800, value:98.272314870957},{year:1900, value:96.3770291435382},{year:1970, value:76.3602577379363},{year:2000, value:67.1933284236953},{year:2010, value:65.0792839575799},{year:2020, value:61.441043282996},{year:2030, value:59.0318179390082},{year:2050, value:55.8964347431158}]},
{name:"Hot desert", values: [{year:1700, value:98.9149982299702},{year:1800, value:98.4870939015575},{year:1900, value:95.8198302104747},{year:1970, value:90.984561268105},{year:2000, value:88.8166308256252},{year:2010, value:87.2034379208384},{year:2020, value:85.2900584367336},{year:2030, value:84.4566568069592},{year:2050, value:82.7721998461901}]},
{name:"Total MSA", selected:true,values: [{year:1700, value:97.383510369557},{year:1800, value:96.2165245713934},{year:1900, value:91.7298556717755},{year:1970, value:75.7900122591164},{year:2000, value:69.8335387979709},{year:2010, value:67.5245978308309},{year:2020, value:64.645729899535},{year:2030, value:63.0325030776526},{year:2050, value:60.4384588080115}]}]};



var colourRange = ["#9edae5","#98C10F","#E25C13"];
nbItem = (data.series).length-2;
var palette = d3.scale.linear().domain([0, nbItem/2, nbItem ]).range(colourRange);
