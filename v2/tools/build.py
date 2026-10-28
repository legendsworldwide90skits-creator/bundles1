"""Rebuild Wholesale v2 from the live pages.
Run from the repo root:  python3 v2/tools/build.py
1) reads v1/sa.html (South America) and v1/ca.html (Central America) — the old pages, kept only as the stock source
2) writes v2/data/sa.json, v2/data/ca.json, v2/data/meta.json
3) writes the LIVE page ./index.html from v2/tools/template.html, plus redirects at ./ca/, ./v2/ and ./v2/ca/"""
import json,os,sys,datetime
HERE=os.path.dirname(os.path.abspath(__file__));V2=os.path.dirname(HERE);REPO=os.path.dirname(V2)
sys.path.insert(0,HERE);from extract import ex
# Pieces removed from v2 (bad photo, etc.) — kept out on every rebuild
EXCLUDE={'SA-1414'}
meta={'updated':datetime.date.today().isoformat()}
for key,src in [('sa','v1/sa.html'),('ca','v1/ca.html')]:
    d=ex(os.path.join(REPO,src),key,'')
    d['items']=[i for i in d['items'] if i['c'] not in EXCLUDE]
    json.dump(d,open(os.path.join(V2,'data',key+'.json'),'w'),ensure_ascii=False,separators=(',',':'))
    meta[key]=len(d['items'])
json.dump(meta,open(os.path.join(V2,'data','meta.json'),'w'))
tpl=open(os.path.join(HERE,'template.html')).read()
v=dict(ROOT='./',UP='v2/',STOCKNAME='South America & Central America',HERO1='./img/SA-035.jpg',HERO1L='SA–035 / MADRID',HERO2='./img/SA-056.jpg',HERO2L='SA–056 / BARCELONA',HERO2Y='2004/05')
h=tpl.replace('{{STOCK}}','sa')
for a,b2 in v.items():h=h.replace('{{'+a+'}}',b2)
open(os.path.join(REPO,'index.html'),'w').write(h)
def redirect(path,target):
    os.makedirs(os.path.dirname(path),exist_ok=True)
    open(path,'w').write('<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><title>Legends Worldwide — Wholesale</title><script>var q=location.search?location.search.slice(1):"";location.replace("'+target+'"+(q?("'+target+'".indexOf("?")>-1?"&":"?")+q:"")+location.hash)</script><a href="'+target+'">Open the wholesale stock</a>')
redirect(os.path.join(REPO,'ca','index.html'),'../?stock=ca')
redirect(os.path.join(V2,'index.html'),'../')
redirect(os.path.join(V2,'ca','index.html'),'../../?stock=ca')
print(meta)
