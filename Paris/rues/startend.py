from bs4 import BeautifulSoup
import codecs
import urllib
s=codecs.open("streets.csv","r","utf-8")
streets=s.readlines()
s.close()
o=codecs.open("streets-full.csv","w","utf-8")
for street in streets:
	sdc=street.split(",")
	code=sdc[0]
	print code
	url="http://www.v2asp.paris.fr/commun/v2asp/v2/nomenclature_voies/Voieactu/"+code+".nom.htm"
	f=urllib.urlopen(url)
	t=f.read()
	f.close()
	soup=BeautifulSoup(t)
	ta=soup.findAll("table")
	td=ta[0].findAll("td")
	st=street[:-1]+","
	for d in td[15].contents[1:]:
		st=st+unicode(d)
	st=st.replace('\n','').replace('\r','')
	st="\""+st+"\","
	for d in td[16].contents[1:]:
		st=st+unicode(d)
	st=st.replace('\n','').replace('\r','')
	st=st+"\n"
	o.write(st)
o.close()
