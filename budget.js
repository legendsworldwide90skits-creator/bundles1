/* Legends Worldwide — "Bundle by budget" (2026-10-22)
   The client types a budget in € and the page builds a bundle of the most
   in-demand pieces: big European clubs and national teams first, other
   leagues next, Brazilian clubs only as filler, smallest clubs never.
   Uses the catalog's own tier pricing (T, sel, cards, paint, bar, save). */
(function(){
if(typeof T==='undefined'||typeof cards==='undefined')return;

// Section weight by section title (robust to section renumbering)
const W={
 'Real Madrid':10,'FC Barcelona':10,'Manchester United':10,'Manchester City':9,'Chelsea':9,'Liverpool':10,
 'AC Milan':10,'Inter':9,'Juventus':9,'Bayern Munich':9,'Paris Saint-Germain':9,
 'Brazil national team':10,'National teams':9,
 'Spanish clubs':6,'English clubs':6,'Italian clubs':6,'German clubs':6,'French clubs':5,'Ajax':6,
 'Portuguese clubs':5,'Fiorentina':6,
 'South American clubs':3,'Clubs around the world':3,'Santos':3,'São Paulo':2.5,
 'Flamengo':2.5,'Corinthians':2.5,'Palmeiras':2.5,
 'Mexican clubs':1.5,'MLS':1.5,'Asian clubs':1.5,'Jackets & training tops':1.2,
 'Vasco da Gama':1.2,'Botafogo':1.2,'Fluminense':1.2,'Grêmio':1.2,'Internacional':1.2,
 'Atlético Mineiro':1.2,'Cruzeiro':1.2,'Bahia':1.2
};
const IS_CA=/\/ca\/?(index\.html)?$/.test(location.pathname);
// Central America stock (different section names)
if(IS_CA)Object.assign(W,{'Real Madrid':10,'FC Barcelona':10,'Juventus':9,'European clubs':6,'Argentina':9,'National teams':8,
 'Player issue — European clubs & national teams':8,'Player issue — South American & other clubs':4,'Player issue — Liga MX':3,
 'Boca Juniors':5,'River Plate':5,'Grêmio':2.5,'São Paulo':2.5,'Colo-Colo':2.5,'Argentine clubs':2,'Brazilian clubs':2,
 'Chilean clubs':1.5,'South American clubs':2,'Chivas':3,'Club América':3,'Liga MX clubs':1.5,'Mexico national team':4,
 'MLS, CONCACAF & rest of the world':1.5});
const STOCK=IS_CA?'Central America':'South America';
const info=new Map();
document.querySelectorAll('.season').forEach(s=>{
 const name=(s.querySelector('h2')||{}).textContent||'';const w=W[name.trim()]||0;
 s.querySelectorAll('.card').forEach(c=>{const t=((c.querySelector('h3')||{}).textContent||'').trim();
  let k=1;if(/training|tank|polo|shorts|jacket/i.test(t))k=.6;
  info.set(c,{w:w*k,sec:s.id,t:t.toLowerCase()})})});

const css=`.budget{margin:16px 0 0;max-width:760px;border:1px solid #000;border-left:6px solid var(--y);background:#fff;padding:14px 18px;text-align:left}
.budget h4{margin:0 0 6px;font-family:var(--display);font-size:16px;text-transform:uppercase;letter-spacing:.02em;color:#000}
.budget p{margin:0 0 10px;font-size:14px;line-height:1.6}
.brow{display:flex;gap:8px;flex-wrap:wrap;align-items:stretch}
.bin{display:flex;align-items:center;border:1px solid #000;background:#fff;flex:1 1 160px;max-width:240px}
.bin span{padding:0 4px 0 12px;font-weight:700}
.bin input{border:0;outline:0;font:700 16px var(--body);padding:11px 10px 11px 2px;width:100%;min-width:0;background:transparent;color:#000;-moz-appearance:textfield}
.bin input::-webkit-outer-spin-button,.bin input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
.bin:focus-within{outline:2px solid var(--y)}
.bgo,.bsec{appearance:none;border:1px solid #000;font:700 12px var(--body);text-transform:uppercase;letter-spacing:.04em;padding:11px 16px;cursor:pointer}
.bgo{background:var(--y);color:#000}.bgo:hover{background:#000;color:var(--y)}
.bsec{background:#fff;color:#000}.bsec:hover{background:var(--y)}
.bquick{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
.bquick button{appearance:none;border:1px solid var(--line);background:var(--panel2);font:600 12px var(--body);padding:5px 10px;cursor:pointer;color:#000}
.bquick button:hover{border-color:#000}
.bres{margin:10px 0 0!important;font-size:13.5px!important}.bres b{background:var(--y);padding:0 4px}
.bres.err{color:#b4462f}
.bact{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
body.onlysel .card:not(.on){display:none}
body.onlysel .region{display:none}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

const box=document.createElement('div');box.className='budget';box.id='budget';
box.innerHTML='<h4>Bundle by budget · '+STOCK+' stock</h4><p>Tell us your budget and we will build a bundle from this stock with the most in-demand shirts — big European clubs and national teams first. Bundle pricing is applied automatically. You can then tap any shirt to remove it or add others.</p>'
+'<form class="brow" id="bF" novalidate><label class="bin"><span>€</span><input id="bIn" type="number" inputmode="numeric" min="50" step="10" placeholder="700" aria-label="Your budget in euros"></label><button class="bgo" type="submit">Build my bundle</button></form>'
+'<div class="bquick" id="bQ"></div><p class="bres" id="bRes" aria-live="polite"></p>'
+'<div class="bact" id="bAct" hidden><button class="bsec" type="button" id="bAgain">Try another mix</button><button class="bsec" type="button" id="bView">Show my bundle only</button></div>';
const anchor=document.querySelector('#teams')||document.querySelector('.tiers');
anchor.parentNode.insertBefore(box,anchor.nextSibling);
const g=id=>document.getElementById(id);
[300,500,700,1000,1500,2500].forEach(v=>{const b=document.createElement('button');b.type='button';b.textContent='€'+v.toLocaleString('en-US');b.onclick=()=>{g('bIn').value=v;build(v)};g('bQ').appendChild(b)});

const tierFor=n=>{let t=T[0];for(const x of T)if(n>=x.min)t=x;return t};
function pick(B){
 const cap=Math.max(130,Math.min(320,B*.16));
 const pool=[];cards.forEach(c=>{const i=info.get(c);const p=+c.dataset.p;if(!i||!i.w||!(p>0)||p>cap)return;
  // random mix each time; slight preference for good-value pieces
  pool.push({c,p,i,s:i.w*(.55+Math.random()*.9)*Math.pow(95/Math.max(p,40),.45)})});
 const out=[],secN={},seen={};let sum=0;
 while(out.length<150){const n=out.length+1,off=tierFor(n).off;  let best=null,bs=-1;
  for(const x of pool){if(x.used)continue;const tot=sum+x.p-n*off;if(tot>B)continue;
   const sc=x.s*Math.pow(.82,secN[x.i.sec]||0)*(seen[x.i.t]?.35:1);if(sc>bs){bs=sc;best=x}}
  if(!best)break;best.used=1;out.push(best);sum+=best.p;secN[best.i.sec]=(secN[best.i.sec]||0)+1;seen[best.i.t]=1}
 return out}
function setView(on){document.body.classList.toggle('onlysel',on);
 document.querySelectorAll('.season').forEach(s=>{s.hidden=on&&!s.querySelector('.card.on')});
 g('bView').textContent=on?'Show full catalog':'Show my bundle only'}
let last=0;
function build(B){
 B=Math.round(+B);const r=g('bRes');r.classList.remove('err');
 if(!(B>=50)){r.classList.add('err');r.textContent='Please enter a budget of at least €50.';g('bAct').hidden=true;return}
 last=B;const res=pick(B);
 if(!res.length){r.classList.add('err');r.textContent='That budget is a little low for a bundle — try a higher amount.';g('bAct').hidden=true;return}
 sel=new Set(res.map(x=>x.c.dataset.c));save();cards.forEach(paint);bar();
 const n=res.length,t=tierFor(n),tot=res.reduce((a,x)=>a+Math.max(x.p-t.off,0),0);
 r.innerHTML='<b>'+n+' shirts for €'+tot.toLocaleString('en-US')+'</b> '+(t.off?'(−€'+t.off+' per piece already applied)':'')+' — within your €'+B.toLocaleString('en-US')+' budget. Your selection is marked in the catalog and in the bar below.';
 g('bAct').hidden=false;setView(document.body.classList.contains('onlysel'))}
g('bF').addEventListener('submit',e=>{e.preventDefault();build(g('bIn').value)});
g('bAgain').onclick=()=>{if(last)build(last)};
g('bView').onclick=()=>{const on=!document.body.classList.contains('onlysel');setView(on);if(on)window.scrollTo({top:g('budget').getBoundingClientRect().top+scrollY-10})};
// keep "only my bundle" view in sync when the client taps shirts or clears
document.addEventListener('click',e=>{if(document.body.classList.contains('onlysel')&&(e.target.closest('.card')||e.target.id==='clear'))setTimeout(()=>setView(true),0)});
})();
