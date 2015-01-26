import json
from urllib2 import *
key="AI39si4m__UkE0BaJ4ttC2H2vDuH5ymMiRPXIirx8rYk_xSq6U4HORaWeL86OyFSINexcXjYDao2bX8c70JQqPnquazOE8g4Mw"
input=open("khan.txt","r")
output=open("data.txt","w")
for video in input.readlines():
    info=video.split("\t")
    output.write(video[:-1]+"\t")
    id=info[4]
    url="http://gdata.youtube.com/feeds/api/videos/"+id+"?alt=json&key="+key
    try:
        html=urlopen(url).read()
        print id,
        html=json.loads(html)['entry']
        try:
            output.write(str(html['yt$statistics']['viewCount']))
        except KeyError:
            print "(no viewers)",
        output.write("\t")
        try:
            output.write(str(html['gd$comments']['gd$feedLink']['countHint']))
        except KeyError:
            print "(no comments)",
        output.write("\t")
        try:
            output.write(str(html['published']['$t']))
        except KeyError:
            print "(no time)",
        output.write("\t")
        try:
            output.write(str(html['gd$rating']['average'])+"\t")
            output.write(str(html['gd$rating']['numRaters']))
            print ""
        except KeyError:
            print "(no ratings)"
    except HTTPError:
        print "couldn't get "+str(id)
    output.write("\n")
input.close()
output.close()

    
    