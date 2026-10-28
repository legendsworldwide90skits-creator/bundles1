"""Rebuild Wholesale v2 from the live pages.
Run from the repo root:  python3 v2/tools/build.py
1) reads ./index.html (South America) and ./ca/index.html (Central America)
2) writes v2/data/sa.json, v2/data/ca.json, v2/data/meta.json
3) writes v2/index.html and v2/ca/index.html from v2/tools/template.html"""
import json,os,sys,datetime
HERE=os.path.dirname(os.path.abspath(__file__));V2=os.path.dirname(HERE);REPO=os.path.dirname(V2)
sys.path.insert(0,HERE);from extract import ex
meta={'updated':datetime.date.today().isoformat()}
for key,src in [('sa','index.html'),('ca','ca/index.html')]:
    d=ex(os.path.join(REPO,src),key,'')
    json.dump(d,open(os.path.join(V2,'data',key+'.json'),'w'),ensure_ascii=False,separators=(',',':'))
    meta[key]=len(d['items'])
json.dump(meta,open(os.path.join(V2,'data','meta.json'),'w'))
tpl=open(os.path.join(HERE,'template.html')).read()
pages={
 'sa':dict(out='index.html',ROOT='../',UP='./',STOCKNAME='South America',HERO1='../img/SA-035.jpg',HERO1L='SA–035 / MADRID',HERO2='../img/SA-056.jpg',HERO2L='SA–056 / BARCELONA',HERO2Y='2004/05'),
 'ca':dict(out='ca/index.html',ROOT='../../',UP='../',STOCKNAME='Central America',HERO1='../../ca/img/CA-004-0.webp',HERO1L='CA–004 / MADRID',HERO2='../../ca/img/CA-005-0.webp',HERO2L='CA–005 / MADRID',HERO2Y='MODRIC'),
}
for k,v in pages.items():
    h=tpl.replace('{{STOCK}}',k)
    for a,b in v.items():h=h.replace('{{'+a+'}}',b)
    os.makedirs(os.path.dirname(os.path.join(V2,v['out'])) or V2,exist_ok=True)
    open(os.path.join(V2,v['out']),'w').write(h)
print(meta)
