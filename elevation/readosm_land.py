import re
import math

i = open("sf.osm", "r")
sf = i.readlines()
i.close()

nodes = {}
nodesNb = 0
streets = []
nodesInStreet = []
tc = re.compile('k="natural" v="land"')

tnv = re.compile('v="([^"]*)"')
nd = re.compile('<nd')
ndid = re.compile('ref="([^"]*)"')

inWay = False

wayId = ''
unknownId = 0
notfound = 0
nodeIdIdx = 0
streetIdIdx = 0
streetsWithLanes = 0
R = 6371000

###    <tag k="natural" v="coastline"/>



print("data loaded.")
### first pass for nodes
i = 0
for l in sf:
	i = i + 1
	if (i % 100000 == 0):
		print ".",
	if len(re.compile("<node").findall(l))>0:
		ids = re.compile('id="([^"]*)"').findall(l)
		lons = re.compile('lon="([^"]*)"').findall(l)
		lats = re.compile('lat="([^"]*)"').findall(l)
		if len(ids)>0 and len(lons)>0 and len(lats)>0:
			myId = ids[0]
			nodes[myId] = {"id": str(nodeIdIdx), "lon": lons[0], "lat": lats[0], "end": False, "used": 0, "streets": [], "keep": False}
			nodeIdIdx = nodeIdIdx + 1
		nodesNb = nodesNb + 1


	if len(re.compile("<way").findall(l))>0:
		inWay = True
		wayIds = re.compile('id="([^"]*)"').findall(l)
		if len(wayIds) > 0:
			wayId = wayIds[0]
		else:
			wayId = "unknown" + str(unknownId)
			unknownId = unknownId + 1

		nodesInWay = []
		
		inSF = 0
		keep = 0
		
		prevNode = ""
	if inWay:
		if len(tc.findall(l))>0:
			keep = 1

		if len(nd.findall(l))>0:
			if len(ndid.findall(l))>0:
				nodeid = ndid.findall(l)[0]
				nodesInWay.append(nodeid)
	

	if len(re.compile("</way").findall(l))>0:
		inWay = False
		if keep == 1:
			for idx in range(len(nodesInWay)):
				n = nodesInWay[idx]
				if n in nodes:
					nodes[n]["used"] = nodes[n]["used"] + 1
					if (idx == 0 or idx == len(nodesInWay) - 1):
					  nodes[n]["end"] = True
					if n != prevNode:
						nodesInStreet.append([streetIdIdx, n])
					prevNode = n
				else:
					###print ("node " + n + " not found in street " + wayId + ".")
					notfound = notfound + 1
			streets.append({"id": str(streetIdIdx), "osmid": str(wayId)})
			streetIdIdx = streetIdIdx + 1

print (str(notfound) + " nodes not found :(")

print ("filtering out nodes:")

inMap = 0
outMap = 0

for k in nodes.keys():
	n = nodes[k]
	if float(n["lon"])>-122.52 and float(n["lon"])<-122.35 and float(n["lat"])>37.707 and float(n["lat"])<37.8108:
		n["keep"] = True
		inMap = inMap + 1
	else: 
		n["keep"] = False
		outMap = outMap + 1

print (str(inMap) + " in map, " + str(outMap) + " outside of map.")

removeStreets = []
lastStreet = -1
lenStreet = 0
used = 0

o = open("nodes-land.csv", "w")
o.write("id,lon,lat\n")
for k in nodes.keys():
	n = nodes[k]
	if n["keep"]:
		o.write(n["id"] + "," + n["lon"] + "," + n["lat"] + "\n")
o.close()

o = open("path-land.csv", "w")
lastStreet = -1
lastNode = -1
###o.write("streetId, nodeId, dist\n")

o.write("streetId,nodeId\n")
for p in nodesInStreet:
	s = p[0]
	k = p[1]
	if nodes[k]["keep"]:
		o.write(str(s) + "," + str(nodes[k]["id"]) + "\n")

o.close()

