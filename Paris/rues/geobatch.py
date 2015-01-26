from geopy import geocoders 
import codecs
f=codecs.open("minmaxaddr.txt","r","utf-8")
addr=f.readlines()
f.close
o=codecs.open("lonlat.txt","w","utf-8")
#g = geocoders.Yahoo('UKfhk7HV34Er2xpERG9UBoIAM8pEbG1Ev6c8I2Z4M5ZaGEFf_YnqVC6BCXqF')
g=geocoders.GeocoderDotUS()
#for i in range(2500):
i=0
for a in addr:
	print a
	#a=addr[i]
	i=i+1
	place, (lat, lng) = g.geocode(a)
	print "%f %s: %.5f, %.5f" % (i,place, lat, lng)
	o.write(place+"\t"+str(lat)+"\t"+str(lng)+"\n")
o.close()

