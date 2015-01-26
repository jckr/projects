import urllib
import simplejson
import math

### input file
i = open("nodes.csv", "r")
lines = i.readlines()[1:]
i.close()



ELEVATION_BASE_URL = 'http://maps.googleapis.com/maps/api/elevation/json?locations='


### output file
o = open("nodes-E.csv", "w")
o.write("id,lon,lat,alt\n")


queryIdx = 0
queryIds = []
queryCoords = []
linenb = 0
for l in lines:
	line = l[:-1].split(",")
	id = line[0]
	lon = line[1]
	lat = line[2]
	queryIdx = queryIdx + 1
	linenb = linenb + 1
	queryIds.append(id)
	queryCoords.append(lat + "," + lon)
	### each query fetches 80 locations to be within the length of acceptable urls. 
	if queryIdx == 80:
		print("getting 80 values (" + str(linenb) + ")\n")
		url = ELEVATION_BASE_URL + "|".join(queryCoords)
		response = simplejson.load(urllib.urlopen(url))
		results = response["results"]
		### now we just read the results and write them to file.
		for i in range(len(results)):
			r = results[i]
			alt = r["elevation"]
			c = queryCoords[i].split(",")
			id = queryIds[i]
			lon = c[1]
			lat = c[0]
			o.write(str(id) + "," + str(lon) + "," + str(lat) + "," + str(alt) + "\n")
		queryIdx = 0
		queryIds = []
		queryCoords = []

### repeat for the last locations which didn't make it to 80 different values.
print("getting the last " + str(queryIdx) + "values.\n")
url = ELEVATION_BASE_URL + "|".join(queryCoords)
response = simplejson.load(urllib.urlopen(url))
results = response["results"]
for i in range(len(results)):
	r = results[i]
	alt = r["elevation"]
	c = queryCoords[i].split(",")
	id = queryIds[i]
	lon = c[1]
	lat = c[0]
	o.write(str(id) + "," + str(lon) + "," + str(lat) + "," + str(alt) + "\n")

o.close()
