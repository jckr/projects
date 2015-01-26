from bs4 import BeautifulSoup
#import os
#import lxml.etree
import codecs
import urllib
rows=[]
o=codecs.open("filez.csv","w","utf-8")
i=0
j=0

codes=["B104",
"B141",
"B145",
"Y790",
"Z002",
"Z003",
"Z004",
"Z011",
"Z023",
"Z060",
"Z062",
"Z070",
"Z110",
"Z113",
"Z114",
"Z122",
"Z125",
"Z126",
"Z130",
"Z153",
"Z156",
"Z180",
"Z192",
"Z199",
"Z210",
"Z516",
"Z519",
"Z530",
"Z533",
"Z555",
"Z571",
"Z574",
"Z583",
"Z633",
"Z636",
"Z665",
"Z668",
"Z673",
"Z690",
"Z704",
"Z712",
"Z716"]

for code in codes:
	
	url="http://www.v2asp.paris.fr/commun/v2asp/v2/nomenclature_voies/Voieactu/"+code+".nom.htm"
	f=urllib.urlopen(url)
	text=f.read()
	f.close()
	soup=BeautifulSoup(text)
	ta=soup.findAll("table")
	if(len(ta)==1): # found one
		record=code+","
		td=ta[0].findAll("td")
		record=record+td[0].find("font").find("font").find("font").contents[0].replace('\n','').replace('\r','')
		record=record+","+td[4].find("center").contents[0].replace('\n','').replace('\r','')
		record=record+","+td[8].find("center").contents[0].replace('\n','').replace('\r','')
		record=record+","+td[10].find("center").contents[0].replace('\n','').replace('\r','').replace(' m','').replace(' ','').replace(',','.')
		record=record+","+td[12].find("center").contents[0].replace('\n','').replace('\r','')
		record=record+","+td[14].find("center").contents[0].replace('\n','').replace('\r','').replace(' m','').replace(' ','').replace(',','.')
		record=record+"\n"
		o.write(record)
o.close()








