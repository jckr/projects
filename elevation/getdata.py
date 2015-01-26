import urllib
import simplejson
import math

ELEVATION_BASE_URL = 'http://maps.googleapis.com/maps/api/elevation/json'
NLat = 37.8334
SLat = 37.7053
WLon = -122.5178
ELon = -122.3558


cols = 96
rows = 415

cols = int(math.ceil(.9 * cols))


o = open("results-" + (str(cols)) + "-" + (str(rows)) + ".csv", "w")
o.write("x,y,z\n")

for x in range(cols):
  if x > 0 and x < cols:
	  lon = WLon + x * (ELon - WLon) / 96
	  url = ELEVATION_BASE_URL + "?path=" + str(NLat) + "," + str(lon) + "|" + str(SLat) + "," + str(lon) + "&samples=" + str(rows)
	  response = simplejson.load(urllib.urlopen(url))
	  results = response["results"]
	  for y in range(len(results)):
	    r = results[y]
	    z = r["elevation"]
	    o.write(str(x) + "," + str(y) + "," + str(z) + "\n")

o.close()
