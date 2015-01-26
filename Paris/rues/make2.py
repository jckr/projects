from bs4 import BeautifulSoup
#import os
#import lxml.etree
import codecs
import urllib
rows=[]
o=codecs.open("filey.csv","w","utf-8")
i=0
j=0
for i in range(92,100):
	
	if(i<1000):
		code="0"+str(i)
	if(i<100):
		code="00"+str(i)
	if(i<10):
		code="000"+str(i)
	
	if(i>999):
		code=str(i)
	url="http://www.v2asp.paris.fr/commun/v2asp/v2/nomenclature_voies/Voieactu/"+code+".nom.htm"
	print i,j,url
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
		j=j+1
o.close()








