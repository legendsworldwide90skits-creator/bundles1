import re,json,html,sys
def ex(path,stock,imgbase):
    s=open(path).read()
    tokens=re.finditer(r'<div class="region">(.*?)</div>|<section class="season" id="(s\d+)"><div class="shead"><h2>(.*?)</h2>',s)
    secs=[];region=None;pos=[]
    for m in tokens:
        if m.group(1) is not None: region=html.unescape(m.group(1)).strip()
        else:
            secs.append({'id':m.group(2),'name':html.unescape(m.group(3)),'region':region}); pos.append(m.start())
    pos.append(len(s)); items=[]
    for i,sec in enumerate(secs):
        chunk=s[pos[i]:pos[i+1]]
        for a in re.findall(r'<article class="card".*?</article>',chunk,re.S):
            c=re.search(r'data-c="([^"]+)"',a).group(1); p=int(re.search(r'data-p="(\d+)"',a).group(1))
            n=html.unescape(re.search(r'<h3>(.*?)</h3>',a).group(1))
            meta=dict((k,html.unescape(v).strip()) for k,v in re.findall(r'<span><b>([^<]+)</b>([^<]*)</span>',a))
            tags=[html.unescape(t) for t in re.findall(r'<span class="tag">(.*?)</span>',a)]
            im=re.search(r"data-imgs='([^']+)'",a)
            imgs=json.loads(html.unescape(im.group(1))) if im else [re.search(r'<img src="([^"]+)"',a).group(1)]
            it={'c':c,'p':p,'n':n,'s':sec['id']}
            if meta.get('Size'):it['z']=meta['Size']
            if meta.get('Meas.'):it['m']=meta['Meas.']
            if meta.get('Condition'):it['q']=meta['Condition']
            if tags:it['t']=tags
            it['i']=[im.replace('img/','') for im in imgs]
            items.append(it)
    return {'stock':stock,'img':imgbase,'sections':secs,'items':items}
if __name__=='__main__':
    import subprocess,os
    subprocess.run(['python3',os.path.join(os.path.dirname(os.path.abspath(__file__)),'build.py')])
