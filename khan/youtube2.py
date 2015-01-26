import codecs
import json
from urllib2 import *
key="AI39si4m__UkE0BaJ4ttC2H2vDuH5ymMiRPXIirx8rYk_xSq6U4HORaWeL86OyFSINexcXjYDao2bX8c70JQqPnquazOE8g4Mw"
input=open("playlists.txt","r")
output=codecs.open("videos.txt","w","utf-8")
for playlist in input.readlines():
    url="http://www.youtube.com"+playlist
    try:
        html=urlopen(url).read()
        print id
        mySoup=BeautifulSoup(html)
        for a in mySoup.findAll("a",attrs={"class":"tile-link-block video-tile"}):
            s=a.findAll("span","video-title")
            output.write(s[0].contents[0]+"\t"+a.attrs[0][1].split('&')[0][9:]+"\n")
    except HTTPError:
        print "couldn't get "+playlist
    output.write("\n")
input.close()
output.close()