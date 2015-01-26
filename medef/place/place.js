var data=[
{key:"Création d'entreprises",abs:[14156589.1830399,1608029.21778808,129444.107255634],pct:[1,0.113588746342555,0.00914373551298026]},
{key:"Émissions de CO2 ",abs:[32082583,3906818.133,376985.935],pct:[1,0.121773802720311,0.0117504857698023]},
{key:"Exportations de biens et de services",abs:[18700550092695.1,6580297599264.88,662123163001.238],pct:[1,0.351877221078931,0.0354066142289515]},
{key:"Nombre d'immigrés",abs:[213397410,46911347,6684842],pct:[1,0.21983091078753,0.0313257878809307]},
{key:"Nombre d'internautes",abs:[2014028387.89359,356151718.646649,50290226.3829472],pct:[1,0.176835500823867,0.0249699689861592]},
{key:"PIB",abs:[63123887517709.3,16222783027519.7,2560002000000],pct:[1,0.256999111833351,0.040555201852576]},
{key:"Population",abs:[6840507002.5393,502087670.433712,64876618.4337123],pct:[1,0.0733991895991525,0.00948418273815509]},
{key:"Population active",abs:[3176421598.67464,241976424.943161,29558828.1903788],pct:[1,0.0761789382883322,0.00930570054136144]},
{key:"superficie",abs:[129710719,4181730,547660],pct:[1,0.0322388930709728,0.00422216455372512]}
];

var arc, arcTween,
  innerRads = [160, 145, 130],
  outerRads = [169, 154, 139];

arc = innerRads.map(function(d, i) {
  return d3.svg.arc()
    .innerRadius(d)
    .outerRadius(outerRads[i])
    .startAngle(0)
    .endAngle(function(d) {return d * 2 * Math.PI})
});

arcTween = arc.map(function(d) {
  return function(b) {
    var i = d3.interpolate({value: b.previous}, b);
    return function(t) {
      return d(i(t));
    }
  }
})
    
var svg = d3.select("#chart").append("svg:svg").attr("width", 1024).attr("height", 800);
var classes = ["monde","europe","france"];
var series = 0;
var arcs = svg.selectAll("path").data(classes).enter().append("svg:path")
	.attr("transform", "translate(536,376)")
	.attr("class", String)
	.transition()
	.attrTween("d", function(d,i) {return arcTween[i](0);})
	.transition().duration(1000)
	.attrTween("d", function(d,i) {return arcTween[i](data[series].pct[i]);})
	