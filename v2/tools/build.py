"""Rebuild Wholesale v2 from the live pages.
Run from the repo root:  python3 v2/tools/build.py
1) reads ./index.html (South America) and ./ca/index.html (Central America)
2) writes v2/data/sa.json, v2/data/ca.json, v2/data/meta.json
3) writes v2/index.html and v2/ca/index.html from v2/tools/template.html"""
import json,os,sys,datetime
HERE=os.path.dirname(os.path.abspath(__file__));V2=os.path.dirname(HERE);REPO=os.path.dirname(V2)
sys.path.insert(0,HERE);from extract import ex
# Pieces removed from v2 (bad photo, etc.) — kept out on every rebuild
EXCLUDE={'SA-1414'}
meta={'updated':datetime.date.today().isoformat()}
for key,src in [('sa','index.html'),('ca','ca/index.html')]:
    d=ex(os.path.join(REPO,src),key,'')
    d['items']=[i for i in d['items'] if i['c'] not in EXCLUDE]
    json.dump(d,open(os.path.join(V2,'data',key+'.json'),'w'),ensure_ascii=False,separators=(',',':'))
    meta[key]=len(d['items'])
json.dump(meta,open(os.path.join(V2,'data','meta.json'),'w'))
tpl=open(os.path.join(HERE,'template.html')).read()
v=dict(ROOT='../',UP='./',STOCKNAME='South America & Central America',HERO1='../img/SA-035.jpg',HERO1L='SA–035 / MADRID',HERO2='../img/SA-056.jpg',HERO2L='SA–056 / BARCELONA',HERO2Y='2004/05')
h=tpl.replace('{{STOCK}}','sa')
for a,b in v.items():h=h.replace('{{'+a+'}}',b)
open(os.path.join(V2,'index.html'),'w').write(h)
# Old /v2/ca/ link now opens the single page on the Central America stock
os.makedirs(os.path.join(V2,'ca'),exist_ok=True)
open(os.path.join(V2,'ca','index.html'),'w').write('<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><title>Legends Worldwide — Wholesale</title><script>location.replace("../?stock=ca"+(location.search?"&"+location.search.slice(1):"")+location.hash)</script><a href="../?stock=ca">Open the wholesale stock</a>')
print(meta)
