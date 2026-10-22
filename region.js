/* Legends Worldwide — stock switcher (South America / Central America), 2026-10-22.
   Shared by ./index.html and ./ca/index.html. Each stock stays a separate page with its
   own selection, bundle pricing and Bundle by budget; this bar only links them. */
(function(){
const here=/\/ca\/?(index\.html)?$/.test(location.pathname)?'ca':'sa';
const base=here==='ca'?'../':'./';
// Simplified Americas outline (viewBox 0 0 100 130)
const NA='M8 12 L30 5 L56 6 L76 12 L81 22 L71 30 L66 40 L59 46 L50 49 L42 49 L35 45 L27 39 L19 33 L13 25 Z';
const CA='M27 39 L35 45 L42 49 L49 51 L47 56 L51 60 L57 64 L61 68 L58 71 L52 67 L46 63 L40 58 L34 52 L30 46 Z';
const SA='M58 71 L66 68 L77 72 L87 78 L89 86 L83 96 L75 104 L69 114 L64 125 L60 123 L60 111 L58 99 L54 87 L54 78 Z';
const map=k=>'<svg class="rg-map" viewBox="0 0 100 130" aria-hidden="true"><path d="'+NA+'" class="rg-land"/><path d="'+CA+'" class="'+(k==='ca'?'rg-on':'rg-land')+'"/><path d="'+SA+'" class="'+(k==='sa'?'rg-on':'rg-land')+'"/></svg>';
const R={
 sa:{name:'South America',tag:'Vintage + 2000s + 2010s',href:base,
  desc:'Vintage store versions from the 1990s, 2000s and 2010s, plus selected match-issue pieces — from the biggest clubs to lesser-known teams with strong resale potential. A stock curated for mid- to high-volume orders.'},
 ca:{name:'Central America',tag:'Modern + Professional stock',href:base+'ca/',
  desc:'Modern professional stock and sportswear, including pieces sourced directly from the Real Madrid kit room, plus selected vintage pieces. Store versions and match issue. Fast delivery to North America and nearby markets — ideal for US and Latin American resellers.'}
};
const css=`.rg{max-width:1180px;margin:0 auto;padding:18px 20px 0}
.rg-h{font-size:11.5px;letter-spacing:.2em;text-transform:uppercase;color:#5f5f5f;margin:0 0 8px}
.rg-tabs{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.rg-tab{display:flex;align-items:center;gap:12px;padding:10px 14px;border:1px solid #d6d6d6;background:#fff;color:#000;text-decoration:none;transition:border-color .15s,background .15s}
.rg-tab:hover{border-color:#000}
.rg-tab.on{border:2px solid #000;padding:9px 13px;background:#fffbea;box-shadow:inset 0 -4px 0 var(--y,#ffc400)}
.rg-map{width:54px;height:70px;flex:none}
.rg-land{fill:#e6e6e6;stroke:#9a9a9a;stroke-width:1.2;stroke-linejoin:round}.rg-on{fill:var(--y,#ffc400);stroke:#000;stroke-width:1.5;stroke-linejoin:round}
.rg-tab:not(.on) .rg-on{fill:#f5dc85;stroke:#7a7a7a;stroke-width:1.2}
.rg-t b{display:block;font:700 15px var(--display,inherit);text-transform:uppercase;letter-spacing:.01em}
.rg-t small{display:block;font-size:12px;color:#5f5f5f;margin-top:2px}
.rg-t em{font-style:normal;font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:#000;background:var(--y,#ffc400);padding:1px 5px;margin-left:6px;vertical-align:2px}
.rg-desc{margin:12px 0 0;padding:12px 14px;border-left:6px solid var(--y,#ffc400);background:#f6f6f6;font-size:14px;line-height:1.55}
.rg-desc b{text-transform:uppercase;font-size:12px;letter-spacing:.08em;display:block;margin-bottom:3px}
.rg-note{margin:8px 0 0;font-size:12.5px;color:#5f5f5f}
.sum .rgb{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#000;background:var(--y,#ffc400);padding:2px 6px}
@media (max-width:640px){.rg{padding:14px 16px 0}.rg-tab{gap:8px;padding:8px 10px}.rg-tab.on{padding:7px 9px}.rg-map{width:38px;height:50px}.rg-t b{font-size:13px}.rg-t small{font-size:11px}.rg-t em{display:none}.rg-desc{font-size:13px}}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const tab=k=>'<a class="rg-tab'+(k===here?' on':'')+'" href="'+R[k].href+'"'+(k===here?' aria-current="page"':'')+'>'+map(k)+'<span class="rg-t"><b>'+R[k].name+(k===here?'<em>You are here</em>':'')+'</b><small>'+R[k].tag+'</small></span></a>';
const box=document.createElement('section');box.className='rg';box.setAttribute('aria-label','Choose a stock');
box.innerHTML='<p class="rg-h">Choose your stock</p><div class="rg-tabs">'+tab('sa')+tab('ca')+'</div>'
 +'<div class="rg-desc"><b>'+R[here].name+' stock</b>'+R[here].desc+'</div>'
 +'<p class="rg-note">Each stock ships separately from its own region. Your selection, bundle pricing and Bundle by budget apply to this stock only.</p>';
const top=document.querySelector('.lw-top');
if(top)top.parentNode.insertBefore(box,top.nextSibling);else document.body.prepend(box);
// Label the running total so it is clear which stock it belongs to
const n=document.querySelector('.sum .n');
if(n){const s=document.createElement('span');s.className='rgb';s.textContent=R[here].name;n.parentNode.insertBefore(s,n)}
})();
