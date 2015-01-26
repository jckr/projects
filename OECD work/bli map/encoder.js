for(var x=0;x<w;x+=10) {
   for(var y=0;y<h;y+=10) {var d,id;
      if (d=document.elementFromPoint(x,y)) {
         if(id=d.id) {
          // console.log(id+" found at ("+x+","+y+");");
           if (!(id in countryPoints)) {countryPoints[id]=[];}
           countryPoints[id].push([x/10,y/10]);
           coords.push({country:id,x:x/10,y:y/10});
         }
      }
   }
}