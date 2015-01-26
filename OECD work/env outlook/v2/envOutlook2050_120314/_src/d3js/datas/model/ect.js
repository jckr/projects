var data = [
{year:1970, scenarios:[{key:"baseline",values:[{key:"emissions",value:26},{key:"concentration",value:326.539}, {key:"temperature",value:0.261718}]},{key:"450 core",values:[{key:"emissions",value:26},{key:"concentration",value:326.539}, {key:"temperature",value:0.261718}]}]},
{year:1975, scenarios:[{key:"baseline",values:[{key:"emissions",value:28},{key:"concentration",value:333.957}, {key:"temperature",value:0.279299}]},{key:"450 core",values:[{key:"emissions",value:28},{key:"concentration",value:333.957}, {key:"temperature",value:0.279299}]}]},
{year:1980, scenarios:[{key:"baseline",values:[{key:"emissions",value:31.5},{key:"concentration",value:342.591}, {key:"temperature",value:0.35816}]},{key:"450 core",values:[{key:"emissions",value:31.5},{key:"concentration",value:342.591}, {key:"temperature",value:0.35816}]}]},
{year:1985, scenarios:[{key:"baseline",values:[{key:"emissions",value:31},{key:"concentration",value:350.797}, {key:"temperature",value:0.458521}]},{key:"450 core",values:[{key:"emissions",value:31},{key:"concentration",value:350.797}, {key:"temperature",value:0.458521}]}]},
{year:1990, scenarios:[{key:"baseline",values:[{key:"emissions",value:33},{key:"concentration",value:359.38}, {key:"temperature",value:0.553264}]},{key:"450 core",values:[{key:"emissions",value:33},{key:"concentration",value:359.38}, {key:"temperature",value:0.553264}]}]},
{year:1995, scenarios:[{key:"baseline",values:[{key:"emissions",value:35.5},{key:"concentration",value:367.69}, {key:"temperature",value:0.659111}]},{key:"450 core",values:[{key:"emissions",value:35.5},{key:"concentration",value:367.69}, {key:"temperature",value:0.659111}]}]},
{year:2000, scenarios:[{key:"baseline",values:[{key:"emissions",value:39},{key:"concentration",value:375.773}, {key:"temperature",value:0.756579}]},{key:"450 core",values:[{key:"emissions",value:39},{key:"concentration",value:375.773}, {key:"temperature",value:0.756579}]}]},
{year:2005, scenarios:[{key:"baseline",values:[{key:"emissions",value:44},{key:"concentration",value:387.041}, {key:"temperature",value:0.865331}]},{key:"450 core",values:[{key:"emissions",value:44},{key:"concentration",value:387.041}, {key:"temperature",value:0.865038}]}]},
{year:2010, scenarios:[{key:"baseline",values:[{key:"emissions",value:48.40939275177},{key:"concentration",value:400.303}, {key:"temperature",value:1.00012}]},{key:"450 core",values:[{key:"emissions",value:48.33485544857},{key:"concentration",value:385.83929}, {key:"temperature",value:0.999001}]}]},
{year:2015, scenarios:[{key:"baseline",values:[{key:"emissions",value:51.741174447934},{key:"concentration",value:414.292}, {key:"temperature",value:1.14271}]},{key:"450 core",values:[{key:"emissions",value:49.677334940499},{key:"concentration",value:401.62703}, {key:"temperature",value:1.13164}]}]},
{year:2020, scenarios:[{key:"baseline",values:[{key:"emissions",value:55.161591174299},{key:"concentration",value:430.748}, {key:"temperature",value:1.30948}]},{key:"450 core",values:[{key:"emissions",value:48.830698657821},{key:"concentration",value:420.98518}, {key:"temperature",value:1.26598}]}]},
{year:2025, scenarios:[{key:"baseline",values:[{key:"emissions",value:58.807066366128},{key:"concentration",value:446.911}, {key:"temperature",value:1.47686}]},{key:"450 core",values:[{key:"emissions",value:46.973367617876},{key:"concentration",value:438.08975}, {key:"temperature",value:1.38369}]}]},
{year:2030, scenarios:[{key:"baseline",values:[{key:"emissions",value:62.491686132535},{key:"concentration",value:463.689}, {key:"temperature",value:1.64711}]},{key:"450 core",values:[{key:"emissions",value:43.108345400732},{key:"concentration",value:454.73069}, {key:"temperature",value:1.48402}]}]},
{year:2035, scenarios:[{key:"baseline",values:[{key:"emissions",value:66.538327493106},{key:"concentration",value:481.48}, {key:"temperature",value:1.82023}]},{key:"450 core",values:[{key:"emissions",value:38.173883579585},{key:"concentration",value:464.2903}, {key:"temperature",value:1.57228}]}]},
{year:2040, scenarios:[{key:"baseline",values:[{key:"emissions",value:70.97366928494},{key:"concentration",value:499.902}, {key:"temperature",value:1.99292}]},{key:"450 core",values:[{key:"emissions",value:33.301561159382},{key:"concentration",value:470.61612}, {key:"temperature",value:1.64557}]}]},
{year:2045, scenarios:[{key:"baseline",values:[{key:"emissions",value:75.68812402846},{key:"concentration",value:519.065}, {key:"temperature",value:2.16781}]},{key:"450 core",values:[{key:"emissions",value:28.791081142824},{key:"concentration",value:474.54253}, {key:"temperature",value:1.69706}]}]},
{year:2050, scenarios:[{key:"baseline",values:[{key:"emissions",value:80.837049756724},{key:"concentration",value:538.866}, {key:"temperature",value:2.34488}]},{key:"450 core",values:[{key:"emissions",value:24.611876157295},{key:"concentration",value:475.21959}, {key:"temperature",value:1.73218}]}]},
{year:2055, scenarios:[{key:"baseline",values:[{key:"emissions",value:85.5747946076597},{key:"concentration",value:559.94}, {key:"temperature",value:2.52519}]},{key:"450 core",values:[{key:"emissions",value:20.280846268946},{key:"concentration",value:474.32269}, {key:"temperature",value:1.75215}]}]},
{year:2060, scenarios:[{key:"baseline",values:[{key:"emissions",value:91.0532957649555},{key:"concentration",value:582.777}, {key:"temperature",value:2.71057}]},{key:"450 core",values:[{key:"emissions",value:16.5274635427132},{key:"concentration",value:473.00627}, {key:"temperature",value:1.76513}]}]},
{year:2065, scenarios:[{key:"baseline",values:[{key:"emissions",value:96.0314505905623},{key:"concentration",value:607.162}, {key:"temperature",value:2.90172}]},{key:"450 core",values:[{key:"emissions",value:12.8543215863787},{key:"concentration",value:471.54223}, {key:"temperature",value:1.76659}]}]},
{year:2070, scenarios:[{key:"baseline",values:[{key:"emissions",value:101.436781937197},{key:"concentration",value:633.236}, {key:"temperature",value:3.10023}]},{key:"450 core",values:[{key:"emissions",value:9.97522504712078},{key:"concentration",value:469.40426}, {key:"temperature",value:1.75526}]}]},
{year:2075, scenarios:[{key:"baseline",values:[{key:"emissions",value:105.649193700242},{key:"concentration",value:660.876}, {key:"temperature",value:3.30601}]},{key:"450 core",values:[{key:"emissions",value:7.25923409009186},{key:"concentration",value:466.93256}, {key:"temperature",value:1.73497}]}]},
{year:2080, scenarios:[{key:"baseline",values:[{key:"emissions",value:108.778578434473},{key:"concentration",value:689.357}, {key:"temperature",value:3.51518}]},{key:"450 core",values:[{key:"emissions",value:4.51821228737679},{key:"concentration",value:463.49662}, {key:"temperature",value:1.7078}]}]},
{year:2085, scenarios:[{key:"baseline",values:[{key:"emissions",value:111.81435116547},{key:"concentration",value:718.776}, {key:"temperature",value:3.72508}]},{key:"450 core",values:[{key:"emissions",value:3.05183220883599},{key:"concentration",value:458.7055}, {key:"temperature",value:1.67475}]}]},
{year:2090, scenarios:[{key:"baseline",values:[{key:"emissions",value:114.700814344407},{key:"concentration",value:749}, {key:"temperature",value:3.93363}]},{key:"450 core",values:[{key:"emissions",value:2.28149228866265},{key:"concentration",value:453.73202}, {key:"temperature",value:1.63732}]}]},
{year:2095, scenarios:[{key:"baseline",values:[{key:"emissions",value:117.689041261102},{key:"concentration",value:780.413}, {key:"temperature",value:4.14183}]},{key:"450 core",values:[{key:"emissions",value:2.14079910969053},{key:"concentration",value:449.24802}, {key:"temperature",value:1.59552}]}]},
{year:2100, scenarios:[{key:"baseline",values:[{key:"emissions",value:119.769054102373},{key:"concentration",value:812.558}, {key:"temperature",value:4.34853}]},{key:"450 core",values:[{key:"emissions",value:1.28906902999096},{key:"concentration",value:444.94046}, {key:"temperature",value:1.55428}]}]}];

var scales = [
	{key:"emissions",domain:[0,120]},
	{key:"concentration",domain:[300,900]},
	{key:"temparature",domain:[0,5]}];

var labels = [
	{key:"emissions",title:"Greenhouse gas emissions",subtitle:"Billion tonnes of CO<sub>2</sub> equivalent"},
	{key:"concentration",title:"CO<sub>2</sub> concentration",subtitle:"Parts per million"},
	{key:"temperature",title:"Temperature increases",subtitle:"Celsius degrees"}]


var w=660, h=350;

var colourRange = ["#9ecae1", "#2973bd", "#7b4173"];

var viewContainer = d3.select("#pages");
var tabs=["Emissions","Concentration","Temperature"];
var views = ["prev",tabs[0],tabs[1],tabs[2],"next"];

var button=d3.select("#changeScenario");
var scenarios=["Switch to baseline scenario","Switch to policy action scenario"];
var dumType = "switch";
