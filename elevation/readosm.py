import re
import math

#creates nodes, streets and path files from the osm dump

i = open("sf.osm", "r")
sf = i.readlines()
i.close()

nodes = {}
nodesNb = 0
streets = []
nodesInStreet = []
tn = re.compile('k="name"')
tl = re.compile('k="lanes"')

tnv = re.compile('v="([^"]*)"')
nd = re.compile('<nd')


### this is all the kinds of ways that we won't keep
dontkeep = re.compile('k="(natural|historic|railway|waterway|leisure|place|route|tunnel|power|building|shop|landuse|amenity|area)"')
### another way would have been just to keep the "highway" but that might have been too restrictive

ndid = re.compile('ref="([^"]*)"')
inWay = False
wayId = ''
unknownId = 0
notfound = 0
nodeIdIdx = 0
streetIdIdx = 0
streetsWithLanes = 0
R = 6371000

### to compute distance between 2 legs. finally decided to put it in the js code. 
def distance_on_unit_sphere(n0, n1):
	if n0 == n1: 
		return 0
	lat1 = float(nodes[n0]["lat"])
	lat2 = float(nodes[n1]["lat"])
	long1 = float(nodes[n0]["lon"])
	long2 = float(nodes[n1]["lon"])
	degrees_to_radians = math.pi/180.0
	phi1 = (90.0 - lat1)*degrees_to_radians
	phi2 = (90.0 - lat2)*degrees_to_radians
	theta1 = long1*degrees_to_radians
	theta2 = long2*degrees_to_radians
	cos = (math.sin(phi1)*math.sin(phi2)*math.cos(theta1 - theta2) + math.cos(phi1)*math.cos(phi2))
	arc = R * math.acos( cos )
	return arc

ttc = re.compile('k="tiger:county"')

print("data loaded.")

for l in sf:
	if len(re.compile("<node").findall(l))>0:
		### found a node
		ids = re.compile('id="([^"]*)"').findall(l)
		lons = re.compile('lon="([^"]*)"').findall(l)
		lats = re.compile('lat="([^"]*)"').findall(l)
		if len(ids)>0 and len(lons)>0 and len(lats)>0:
			myId = ids[0]
			nodes[myId] = {"id": str(nodeIdIdx), "lon": lons[0], "lat": lats[0], "end": False, "used": 0, "streets": [], "keep": False}
			nodeIdIdx = nodeIdIdx + 1
		nodesNb = nodesNb + 1


	if len(re.compile("<way").findall(l))>0:
		### found a way. we'll be in a way block until we find the closing tag.
		inWay = True
		wayIds = re.compile('id="([^"]*)"').findall(l)
		if len(wayIds) > 0:
			wayId = wayIds[0]
		else:
			wayId = "unknown" + str(unknownId)
			unknownId = unknownId + 1

		nodesInWay = []
		wayName = "unknown street"
		county = "unknown"
		inSF = 0
		keep = 0
		lanes = ""
		prevNode = ""
	if inWay:
		if len(tn.findall(l))>0:
			### name of street
			if len(tnv.findall(l))>0: 
				wayName = tnv.findall(l)[0]

		if len(ttc.findall(l))>0:
			### county
			if len(tnv.findall(l))>0: 
				county = tnv.findall(l)[0]
				if county == "San Francisco, CA":
					inSF = 1
				else:
				### we won't keep streets which are explicitly not in SF county 
					inSF = -1
		if len(tl.findall(l))>0:
			### number of lanes 
			if len(tnv.findall(l))>0: 
				lanes = tnv.findall(l)[0]
				
	 	if len(dontkeep.findall(l))>0:
	 		### any tag which should make us not want to keep the way (ie power line, railways...)
	 		keep = -1
		if len(nd.findall(l))>0:
			### nodes in the way block
			if len(ndid.findall(l))>0:
				nodeid = ndid.findall(l)[0]
				nodesInWay.append(nodeid)
	

	if len(re.compile("</way").findall(l))>0:
		### closing tag for way
		inWay = False
		if (inSF>-1 and keep >-1 and wayName != "unknown street"):
			for idx in range(len(nodesInWay)):
				n = nodesInWay[idx]
				if n in nodes:
					### in the end we'll only keep nodes used by two streets or at the end of one.
					nodes[n]["used"] = nodes[n]["used"] + 1
					### we also record for each node all of the street names it was on, but avoiding duplicates
					if wayName not in nodes[n]["streets"]:
						nodes[n]["streets"].append(wayName)
					if (idx == 0 or idx == len(nodesInWay) - 1):
					### marking nodes as an end node for a street segment
					  nodes[n]["end"] = True
					if n != prevNode:
						nodesInStreet.append([streetIdIdx, n])
					prevNode = n
				else:
					### sometimes a node is specified in a way, but wasn't found in 
					notfound = notfound + 1
			streets.append({"id": str(streetIdIdx), "osmid": str(wayId), "name": wayName, "lanes": lanes})
			streetIdIdx = streetIdIdx + 1

print (str(notfound) + " nodes not found :(")

print ("filtering out nodes:")
crossNodes = 0
endNodes = 0
crossEndNodes = 0
hideNodes = 0

for k in nodes.keys():
	n = nodes[k]
	### we won't keep anything outside SF!  this is a bounding box
	if float(n["lon"])>-122.52 and float(n["lon"])<-122.35 and float(n["lat"])>37.707 and float(n["lat"])<37.8108:
	### also the node has to be used at least twice (cross street) or be at the end of a street segment.
		if n["used"]>1: 
			crossNodes = crossNodes + 1
			n["keep"] = True
			if n["end"]:
				crossEndNodes = crossEndNodes + 1
		else:
			if n["end"]:
				n["keep"] = True
				endNodes = endNodes + 1
	else: 
		n["keep"] = False
	if n["keep"] == False:
		hideNodes = hideNodes + 1

print (str(crossNodes) + " intersections, " + str(endNodes) + " ends (" + str(crossEndNodes) + " both). " + str(hideNodes) + " neither.")

removeStreets = []
lastStreet = -1
lenStreet = 0
used = 0

### here we only keep streets with two distinct nodes at least
for p in nodesInStreet:
	street = p[0]
	if street != lastStreet:
		if lastStreet != -1: 
			if (lenStreet < 1 or used == 1): 
				removeStreets.append(lastStreet)
			streets[lastStreet]["len"] = str(lenStreet)
			streets[lastStreet]["maxUsed"] = str(used)
		lenStreet = 0
		used = 0
	else:
		n = p[1]
		lenStreet = lenStreet + 1
		if float(nodes[n]["used"]) > used:
			used = float(nodes[n]["used"])
	lastStreet = street

streets[street]["len"] = str(lenStreet)
streets[street]["maxUsed"] = str(used)



### writing our results
o = open("streets.csv", "w")
o.write("id,osmid,name,lanes,len,maxUsed\n")
for s in streets:
  if s["id"] not in removeStreets: 
    o.write(s["id"] + "," + s["osmid"] + "," + s["name"] + "," + s["lanes"] + "," + s["len"] + "," + s["maxUsed"] + "\n")
o.close()

o = open("nodes.csv", "w")
o.write("id,lon,lat,streets\n")
for k in nodes.keys():
	n = nodes[k]
	if n["keep"]:
		o.write(n["id"] + "," + n["lon"] + "," + n["lat"] + "," + " & ".join(n["streets"]) + "\n")
o.close()

o = open("path.csv", "w")
lastStreet = -1
lastNode = -1

o.write("streetId,nodeId\n")
for p in nodesInStreet:
	s = p[0]
	if s not in removeStreets:
		k = p[1]
		if nodes[k]["keep"]:
			o.write(str(s) + "," + str(nodes[k]["id"]) + "\n")
o.close()

