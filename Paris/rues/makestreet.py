from bs4 import BeautifulSoup
#import os
#import lxml.etree
import urllib
rows=[]

i=0
for i in range(10000):
	print i,len(rows)
	if(i<10):
		code="000"+str(i)
	if(i<100):
		code="00"+str(i)
	if(i<1000):
		code="0"+str(i)
	if(i>999):
		code=str(i)
	url="http://www.v2asp.paris.fr/commun/v2asp/v2/nomenclature_voies/Voieactu/"+code+".nom.htm"
	f=urllib.urlopen(url)
	text=f.read()
	f.close()
	soup=BeautifulSoup(text)
	ta=soup.findAll("table")
	if(len(ta)==1): # found one
		record={}
		td=ta[0].findAll("td")
		record["title"]=td[0].find("font").find("font").find("font").contents[0].replace('\n','').replace('\r','')
		record["code"]=td[4].find("center").contents[0].replace('\n','').replace('\r','')
		record["dgi"]=td[8].find("center").contents[0].replace('\n','').replace('\r','')
		record["length"]=td[10].find("center").contents[0].replace('\n','').replace('\r','').replace(' m','').replace(' ','').replace(',','.')
		record["parcel"]=td[12].find("center").contents[0].replace('\n','').replace('\r','')
		record["width"]=td[14].find("center").contents[0].replace('\n','').replace('\r','').replace(' m','').replace(' ','').replace(',','.')
		rows.append(record)








