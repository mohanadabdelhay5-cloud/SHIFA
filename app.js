(function(){
'use strict';
var ROUTES=['home','system','start','questions','contact'];
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var hasG=!!window.gsap&&!reduce;
var $=function(s,c){return (c||document).querySelector(s)}, $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var body=document.body, root=document.documentElement, hdr=$('#hdr'), veil=$('#veil'), current=null, busy=false, ctx=null;
if(hasG){ gsap.registerPlugin(ScrollTrigger); if(window.SplitText) gsap.registerPlugin(SplitText); }

/* ---------- live "Today" screen ---------- */
var ST=['محجوز','في الانتظار','في الكشف','تم'], CL=['s1','s2','s3','s4'];
var DATA=[['09:00','سارة محمود','د. كريم حسن',3],['09:20','أحمد علي','د. كريم حسن',2],['09:40','منى حسن','د. ليلى فؤاد',1],['10:00','كريم سعيد','د. كريم حسن',1],['10:20','هدى إبراهيم','د. ليلى فؤاد',0],['10:40','يوسف عادل','د. كريم حسن',0],['11:00','نور خالد','د. ليلى فؤاد',0]];
var rowsEl=$('#rows'), collected=4350, done=7, rowEls=[];
function paint(i){var d=DATA[i],e=rowEls[i].querySelector('.st'); e.className='st '+CL[d[3]]; e.textContent=ST[d[3]];}
function kpis(){var c=[0,0,0]; DATA.forEach(function(d){if(d[3]<3)c[d[3]]++}); $('#k1').textContent=c[0];$('#k2').textContent=c[1];$('#k3').textContent=c[2];$('#k4').textContent=done;$('#k5').textContent=collected.toLocaleString('en-US');}
if(rowsEl){
  DATA.forEach(function(d,i){var r=document.createElement('div');r.className='rw';r.innerHTML='<span class="num">'+d[0]+'</span><b>'+d[1]+'</b><i>'+d[2]+'</i><span class="st"></span>';rowsEl.appendChild(r);rowEls.push(r);paint(i)});
  kpis();
  if(!reduce) setInterval(function(){
    if(document.hidden||current!=='home') return;
    var idx=-1,k; for(k=0;k<DATA.length;k++){ if(DATA[k][3]<3){ if(DATA[k][3]===2||idx<0||(DATA[idx][3]!==2&&DATA[k][3]>DATA[idx][3])) idx=k; if(DATA[k][3]===2)break; } }
    if(idx<0){ DATA.forEach(function(d,i){d[3]=i<1?2:(i<3?1:0);paint(i)}); kpis(); return; }
    DATA[idx][3]++; if(DATA[idx][3]===3){done++;collected+=[450,600,300,900][done%4]}
    paint(idx); kpis(); var r=rowEls[idx]; r.classList.add('flash'); setTimeout(function(){r.classList.remove('flash')},900);
  },2600);
}

/* ---------- before / after ---------- */
var ba=$('#ba'), baR=$('#baRange');
if(ba&&baR){ var setP=function(){ba.style.setProperty('--p',baR.value+'%')}; baR.addEventListener('input',setP); setP(); }

/* ---------- offline switch ---------- */
var sw=$('#sw');
if(sw) sw.addEventListener('click',function(){
  var off=sw.getAttribute('aria-pressed')!=='true'; sw.setAttribute('aria-pressed',off?'true':'false');
  $('#swLab').textContent=off?'الإنترنت مقطوع، وشفاء ما زال يعمل':'جرّب: اقطع الإنترنت';
  body.classList.toggle('is-off',off); $('#net').textContent=off?'بلا إنترنت · شبكة العيادة تعمل':'متصل بشبكة العيادة';
});

/* ---------- tabs ---------- */
$$('.tab').forEach(function(t){t.addEventListener('click',function(){
  $$('.tab').forEach(function(x){x.setAttribute('aria-selected',x===t?'true':'false')});
  $$('.pane').forEach(function(p){p.classList.toggle('is-on',p.id===t.dataset.tab)});
  var p=$('#'+t.dataset.tab); if(hasG) gsap.from($$('.feat',p),{y:16,autoAlpha:0,duration:.5,stagger:.05,ease:'power3.out'});
  if(hasG) ScrollTrigger.refresh();
})});

/* ---------- mouth chart (demo patient) ---------- */
var TEETH={16:['crown','تاج خزفي، تم',[['علاج عصب','12 مارس 2026'],['تاج خزفي','2 أبريل 2026']]],
  26:['filled','حشو، تم',[['حشو ضوئي','20 يناير 2026']]],
  11:['veneer','قشرة، تمت',[['قشرة خزفية','8 يونيو 2026']]],
  36:['active','علاج عصب، جارٍ',[['الزيارة الأولى','5 نوفمبر 2026'],['أُكمل اليوم، الزيارة الثانية','12 نوفمبر 2026'],['الزيارة القادمة','19 نوفمبر 2026']]],
  46:['problem','تسوّس، لم يُعالج بعد',[['سُجِّل في الفحص','12 نوفمبر 2026']]],
  47:['filled','حشو، تم',[['حشو ضوئي','14 سبتمبر 2025']]],
  18:['missing','مفقود',[['خلع ضرس العقل','3 فبراير 2024']]],
  38:['missing','مفقود',[['خلع ضرس العقل','3 فبراير 2024']]]};
var chart=$('#chart'), rec=$('#rec');
function showTooth(n){
  var t=TEETH[n]||['','سليم',[]];
  $$('.tooth',chart).forEach(function(g){g.classList.toggle('sel',+g.dataset.n===n)});
  var li=t[2].map(function(x){return '<li>'+x[0]+'<small class="num">'+x[1]+'</small></li>'}).join('')||'<li>لا سجلات على هذا السنّ</li>';
  rec.innerHTML='<p class="tag">السنّ</p><div class="rec__no num">'+n+'</div><h3 class="h3">'+t[1]+'</h3><ul>'+li+'</ul>';
  if(hasG) gsap.from(rec.children,{y:12,autoAlpha:0,duration:.4,stagger:.05,ease:'power3.out'});
}
if(chart){
  var up=[18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28], lo=[48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38], s='<svg viewBox="0 0 620 250" role="group">';
  function row(arr,upper){arr.forEach(function(n,i){
    var w=(i<3||i>12)?34:(i<5||i>10?30:26), x=14+i*37+(37-w)/2, c=Math.sin(Math.PI*i/15)*22, y=upper?26+c:160-c, st=(TEETH[n]||[''])[0];
    s+='<g class="tooth '+st+'" data-n="'+n+'" tabindex="0" role="button" aria-label="السن '+n+'"><rect x="'+x+'" y="'+y+'" width="'+w+'" height="46" rx="9"/><text x="'+(x+w/2)+'" y="'+(y+28)+'">'+n+'</text></g>';
  })}
  row(up,true); row(lo,false);
  s+='<line x1="310" y1="14" x2="310" y2="236" stroke="#DAD8CD" stroke-dasharray="3 4"/></svg>'; chart.innerHTML=s;
  chart.addEventListener('click',function(e){var g=e.target.closest('.tooth'); if(g) showTooth(+g.dataset.n)});
  chart.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){var g=e.target.closest('.tooth'); if(g){e.preventDefault();showTooth(+g.dataset.n)}}});
  $$('.tooth',chart).forEach(function(g){g.classList.toggle('sel',+g.dataset.n===36)});
}

/* ---------- contact: prepare a message, never pretend to send ---------- */
var form=$('#form');
if(form){
  var draft=$('#draft'), pre=$('pre',draft), copy=$('#copy');
  form.addEventListener('submit',function(e){e.preventDefault();
    var lines=['طلب عرض لنظام شفاء'];
    $$('input,select,textarea',form).forEach(function(i){if(i.value.trim()) lines.push(i.name+': '+i.value.trim())});
    pre.textContent=lines.join('\n'); draft.classList.add('is-on'); copy.textContent='انسخ الرسالة'; if(hasG) ScrollTrigger.refresh();
  });
  copy.addEventListener('click',function(){
    var ok=function(){copy.textContent='تم النسخ'}, no=function(){var r=document.createRange();r.selectNodeContents(pre);var s=getSelection();s.removeAllRanges();s.addRange(r);copy.textContent='تم التحديد، انسخ يدويًا'};
    try{navigator.clipboard.writeText(pre.textContent).then(ok,no)}catch(err){no()}
  });
}

/* ---------- views ---------- */
function initView(el,intro){
  if(!hasG) return;
  ctx=gsap.context(function(){
    var d=intro?.15:.05;
    $$('[data-split]',el).forEach(function(h){
      if(window.SplitText){var sp=SplitText.create(h,{type:'lines',mask:'lines',linesClass:'ln'}); gsap.from(sp.lines,{yPercent:110,duration:1.1,ease:'power4.out',stagger:.1,delay:d});}
      else gsap.from(h,{y:30,autoAlpha:0,duration:.9,delay:d});
    });
    gsap.from($$('.hero .tag',el),{y:14,autoAlpha:0,duration:.8,ease:'power3.out',delay:d});
    gsap.from($$('.hero [data-rise]',el),{y:24,autoAlpha:0,duration:.95,ease:'power3.out',stagger:.1,delay:d+.3});
    var items=$$('.blk .head,.blk .ba,.blk .leak,.blk .card,.blk .mouth,.blk .tabs,.blk .pane.is-on,.blk .step,.blk .acc details,.blk .panel,.blk .band,.blk .ticks,.blk .sw',el);
    gsap.set(items,{autoAlpha:0,y:30});
    ScrollTrigger.batch(items,{start:'top 92%',once:true,onEnter:function(b){gsap.to(b,{autoAlpha:1,y:0,duration:.9,ease:'power3.out',stagger:.07,overwrite:true})}});
    if(baR&&el.dataset.view==='home'){
      var o={v:50};
      gsap.timeline({scrollTrigger:{trigger:ba,start:'top 70%',once:true}}).to(o,{v:22,duration:.9,ease:'power2.inOut',onUpdate:function(){baR.value=o.v;ba.style.setProperty('--p',o.v+'%')}}).to(o,{v:74,duration:1.3,ease:'power2.inOut',onUpdate:function(){baR.value=o.v;ba.style.setProperty('--p',o.v+'%')}}).to(o,{v:50,duration:.8,ease:'power2.inOut',onUpdate:function(){baR.value=o.v;ba.style.setProperty('--p',o.v+'%')}});
    }
    $$('.band svg',el).forEach(function(m){gsap.fromTo(m,{rotate:-10,yPercent:10},{rotate:6,yPercent:-8,ease:'none',scrollTrigger:{trigger:m.parentNode,start:'top bottom',end:'bottom top',scrub:true}})});
  },el);
  requestAnimationFrame(function(){ScrollTrigger.refresh()});
}
function show(name,intro){
  $$('.view').forEach(function(v){v.classList.toggle('is-active',v.dataset.view===name)});
  $$('[data-go]').forEach(function(a){a.classList.toggle('is-on',a.dataset.go===name)});
  current=name; window.scrollTo(0,0); hdr.classList.remove('is-solid');
  initView($('.view[data-view="'+name+'"]'),intro);
}
function drawLeaf(tl,at){
  $$('.vl',veil).forEach(function(p,i){var L=p.getTotalLength(); tl.fromTo(p,{strokeDasharray:L,strokeDashoffset:L},{strokeDashoffset:0,duration:.55,ease:'power2.inOut'},at+i*.16)});
}
function go(name){
  if(ROUTES.indexOf(name)<0) name='home';
  closeMenu();
  if(name===current){window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});return}
  if(busy) return;
  try{ if(location.hash!=='#'+name) location.hash=name }catch(e){}
  if(!hasG){show(name,false);return}
  busy=true; $('#veilName').textContent=$('.view[data-view="'+name+'"]').dataset.title;
  var tl=gsap.timeline({onComplete:function(){busy=false}});
  tl.set(veil,{visibility:'visible',clipPath:'inset(100% 0% 0% 0%)'}).set('.veil__in',{autoAlpha:1,y:0})
    .to(veil,{clipPath:'inset(0% 0% 0% 0%)',duration:.6,ease:'power4.inOut'},0);
  drawLeaf(tl,.3);
  tl.from('#veilName',{y:16,autoAlpha:0,duration:.4,ease:'power3.out'},.45)
    .add(function(){ if(ctx){ctx.revert();ctx=null} show(name,true) },'+=.1')
    .to(veil,{clipPath:'inset(0% 0% 100% 0%)',duration:.7,ease:'power4.inOut'},'+=.15')
    .set(veil,{visibility:'hidden'});
}
function closeMenu(){ if(body.classList.contains('menu-open')){body.classList.remove('menu-open');$('#burger').setAttribute('aria-expanded','false')} }
$('#burger').addEventListener('click',function(){var o=body.classList.toggle('menu-open');this.setAttribute('aria-expanded',o?'true':'false')});
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-go]'); if(a){e.preventDefault();go(a.dataset.go)}});
window.addEventListener('hashchange',function(){var n=location.hash.replace('#','')||'home'; if(n!==current) go(n)});
var badge=$('#badge'), lf1=$('#lf1'), lf2=$('#lf2');
badge.addEventListener('click',function(){window.scrollTo({top:0,behavior:reduce?'auto':'smooth'})});
window.addEventListener('scroll',function(){
  var y=window.scrollY||root.scrollTop, max=root.scrollHeight-window.innerHeight, p=max>0?Math.min(1,y/max):0;
  hdr.classList.toggle('is-solid',y>20); badge.classList.toggle('is-on',y>300);
  lf1.style.strokeDashoffset=60*(1-Math.min(1,p*2)); lf2.style.strokeDashoffset=60*(1-Math.max(0,Math.min(1,p*2-1)));
},{passive:true});

var first=(location.hash||'').replace('#',''); if(ROUTES.indexOf(first)<0) first='home';
if(hasG){
  show(first,true);
  var it=gsap.timeline({onComplete:function(){root.classList.remove('intro')}});
  it.set(veil,{visibility:'visible',clipPath:'inset(0% 0% 0% 0%)'}); drawLeaf(it,.1);
  it.from('#veilName',{y:16,autoAlpha:0,duration:.4,ease:'power3.out'},.3)
    .to(veil,{clipPath:'inset(0% 0% 100% 0%)',duration:.8,ease:'power4.inOut'},'+=.35').set(veil,{visibility:'hidden'});
} else { root.classList.remove('intro'); show(first,false); }
})();
