### makes the osm file smaller by removing unncessary tags for scrapping

import re
i = open("san-francisco.osm", "r")
sf = i.readlines()
i.close()
o = open("sf.osm", "w")

props = ('timestamp', 'user', 'changeset', 'version')
tags = ('source', 'ref')

p_props = []

ignore_lines = []


for p in props: 
	p_props.append(re.compile(p + '="[^"]*"'))
for t in tags: 
	ignore_lines.append(re.compile('k="' + t + "'"))

for l in sf:
	will_write = True
	for t in ignore_lines:
		if t.match(l):
			will_write = False
	if will_write:
		for p in p_props:
			l = p.sub('', l)
		o.write(l)

o.close()
