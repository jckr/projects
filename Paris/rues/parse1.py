from bs4 import BeautifulSoup
import os
import lxml.etree
import urllib

cats=os.listdir("listes")
l=cats[0] # rue du 1er
f=open("listes/"+l,"r")
text=f.read()
f.close()
soup=BeautifulSoup(text)
lis=soup.findAll("li")
li=lis[10]
title=li.find("a")["href"][6:]

#for li in lis:
#	a=li.find("a")["href"]
#	if (a[:5]==u'/wiki'):
#		r=urlopen("fr.wikipedia.org"+a)


params = { "format":"xml", "action":"query", "prop":"revisions", "rvprop":"timestamp|user|comment|content" }
params["titles"] = "API|%s" % urllib.quote(title.encode("utf8"))
qs = "&".join("%s=%s" % (k, v)  for k, v in params.items())
url = "http://fr.wikipedia.org/w/api.php?%s" % qs
tree = lxml.etree.parse(urllib.urlopen(url))
revs = tree.xpath('//rev')

print "The Wikipedia text for", title, "is"
print revs[-1].text