// this will try to generate a list of links for neighboring countries
var u=d3.select("body").append("ul");
var frontiers=0;
countries.forEach(function(country,i) {
	country.borders.forEach(function(block) {
		block.forEach(function(point) {
			countries.slice(i+1).some(function(c2) {
				return c2.borders.some(function(b2) {
					return b2.some(function(p2) {
						if ((p2.lat==point.lat)&&(p2.lng==point.lng)) {
							u.append("li").text(country.code+":"+c2.code);
							frontiers++;
							return true;
						}
					})
				})
			})
		})
	})
})