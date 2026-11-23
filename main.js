(function(){
var D=window.FRAIMOUS_DATA,$=function(s){return document.getElementById(s)};
var P=[];D.collections.forEach(function(c,ci){c.pieces.forEach(function(p,pi){p.ci=ci;p.pi=pi;P.push(p)})});
var stage=$('stage'),slides=[$('slideA'),$('slideB')],cur=0,idx=0,mode='splash',timer,infoTimer,gr=0,gc=0;
var LS={get:function(k){try{return localStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
var params={};location.search.replace(/[?&](\w+)=([^&]*)/g,function(_,k,v){params[k]=decodeURIComponent(v)});
var ent={all:false,packs:[]};try{ent=JSON.parse(LS.get('fraimous.ent'))||ent}catch(e){}
function isLocked(p){return !p.free&&!ent.all&&ent.packs.indexOf(D.collections[p.ci].slug)<0}
function setEnt(e){var changed=JSON.stringify(e.packs)!==JSON.stringify(ent.packs)||e.all!==ent.all;ent={all:!!e.all,packs:e.packs||[]};LS.set('fraimous.ent',JSON.stringify(ent));return changed}
function fit(){var s=Math.min(innerWidth/1920,innerHeight/1080);stage.style.transform='scale('+s+')';stage.style.left=((innerWidth-1920*s)/2)+'px';stage.style.top=((innerHeight-1080*s)/2)+'px'}
addEventListener('resize',fit);fit();
function pad(n){return(n<10?'0':'')+n}
function show(n,instant){idx=(n+P.length)%P.length;var p=P[idx],next=slides[1-cur],prev=slides[cur];
 next.querySelector('img').src='art/'+p.file;next.classList.toggle('locked',isLocked(p));next.querySelector('.lock').innerHTML=isLocked(p)?'<div class="lock-glyph"></div><h2>'+p.title+'</h2><p>'+D.collections[p.ci].name+' \u00b7 Members Only</p><div class="cta">Unlock the Full Collection</div>':'';next.classList.remove('kb');void next.offsetWidth;if(D.kenBurns)next.classList.add('kb');
 if(instant){prev.style.transition=next.style.transition='none'}
 next.classList.add('on');prev.classList.remove('on');cur=1-cur;
 if(instant)setTimeout(function(){prev.style.transition=next.style.transition=''},50);
 var nx=new Image();nx.src='art/'+P[(idx+1)%P.length].file;fillInfo();schedule()}
function schedule(){clearTimeout(timer);timer=setTimeout(function(){if(mode==='art'){var n=idx+1;for(var i=0;i<P.length&&isLocked(P[(n+P.length)%P.length]);i++)n++;show(n)}},D.intervalSeconds*1000)}
function fillInfo(){var p=P[idx],c=D.collections[p.ci];$('infoIdx').textContent=pad(p.pi+1)+' / '+pad(c.pieces.length);$('infoCol').textContent=c.name;$('infoTitle').textContent=p.title;$('infoNote').textContent=p.note||''}
var histOpen=false,histT;function hist(on){try{if(on){if(!histOpen){history.pushState({p:Date.now()},'');histOpen=true}}else{clearTimeout(histT);histT=setTimeout(function(){if(mode==='art'&&histOpen){histOpen=false;history.back()}},0)}}catch(e){}}
function info(on){hist(on);$('info').classList.toggle('show',on);stage.classList.toggle('info-open',on);mode=on?'info':'art';clearTimeout(infoTimer);if(on&&!params.hold)infoTimer=setTimeout(function(){info(false)},9000)}
function grid(on){hist(on);$('grid').classList.toggle('show',on);mode=on?'grid':'art';if(on){gr=P[idx].ci;gc=P[idx].pi;focusCard()}else schedule()}
function focusCard(){var rows=document.querySelectorAll('.row');for(var r=0;r<rows.length;r++){rows[r].classList.toggle('active',r===gr);var cs=rows[r].querySelectorAll('.card');for(var c=0;c<cs.length;c++)cs[c].classList.toggle('focus',r===gr&&c===gc)}
 var p=D.collections[gr].pieces[gc];$('gCol').textContent=D.collections[gr].name+' \u00b7 '+pad(gc+1);$('gTitle').textContent=p.title}
function buildGrid(){var h='';D.collections.forEach(function(c){h+='<div class="row"><div class="row-name">'+c.name+'</div><div class="row-cards">';c.pieces.forEach(function(p){h+='<div data-p="'+P.indexOf(p)+'" class="card'+(isLocked(p)?' is-locked':'')+'"><img src="art/thumb-'+p.file+'" alt="">'+(isLocked(p)?'<i class="mini-lock"></i>':'')+'</div>'});h+='</div></div>'});$('rows').innerHTML=h}
function endSplash(){if(mode!=='splash')return;$('splash').classList.add('out');mode='art';schedule()}
function exitApp(){try{tizen.application.getCurrentApplication().exit()}catch(e){}}
document.addEventListener('keydown',function(e){var k=e.keyCode;goFS();e.preventDefault();
 if(mode==='splash'){endSplash();return}
 var back=(k===10009||k===27||k===8||k===461||k===4||e.key==='GoBack'||e.key==='BrowserBack');
 if(mode==='pair'){if(back)pair(false);return}
 if(mode==='grid'){var n=D.collections[gr].pieces.length;
  if(k===37)gc=(gc+n-1)%n;else if(k===39)gc=(gc+1)%n;
  else if(k===38){gr=(gr+D.collections.length-1)%D.collections.length;gc=Math.min(gc,D.collections[gr].pieces.length-1)}
  else if(k===40){gr=(gr+1)%D.collections.length;gc=Math.min(gc,D.collections[gr].pieces.length-1)}
  else if(k===13){var t=D.collections[gr].pieces[gc];grid(false);show(P.indexOf(t));if(isLocked(t))pair(true);return}
  else if(back){grid(false);return}
  focusCard();return}
 if(k===37){show(idx-1);if(mode==='info')info(true)}else if(k===39){show(idx+1);if(mode==='info')info(true)}
 else if(k===13){if(isLocked(P[idx])){info(false);pair(true)}else info(mode!=='info')}else if(k===40){info(false);grid(true)}
 else if(back){if(mode==='info')info(false);else exitApp()}});
var shifts=[[0,0],[3,2],[-2,3],[-3,-2],[2,-3]],si=0;
setInterval(function(){si=(si+1)%shifts.length;stage.style.translate=shifts[si][0]+'px '+shifts[si][1]+'px'},120000);
try{['MediaPlayPause','MediaFastForward','MediaRewind'].forEach(function(n){tizen.tvinputdevice.registerKey(n)})}catch(e){}
var pollT=null;
function api(path,opt){return fetch(D.backendUrl+path,opt).then(function(r){return r.json()})}
function pair(on){hist(on);$('pair').classList.toggle('show',on);clearInterval(pollT);if(!on){mode='art';schedule();return}
 mode='pair';$('pairStatus').innerHTML='<span class="dot"></span>Preparing Your Code';
 api('/api/pair/create',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:LS.get('fraimous.token')||undefined})}).then(function(d){
  LS.set('fraimous.token',d.token);$('pairCode').innerHTML=d.code.split('').map(function(c){return '<span>'+c+'</span>'}).join('');
  $('pairUrl').textContent=d.linkUrl.replace(/^https?:\/\//,'');$('pairQr').src=d.qrUrl;$('pairStatus').innerHTML='<span class="dot"></span>Waiting for Your Phone';
  pollT=setInterval(function(){api('/api/pair/status?token='+d.token).then(function(s){if(setEnt(s))unlock()}).catch(function(){})},3000);
 }).catch(function(){$('pairStatus').textContent='Connect Your TV to the Internet to Unlock'})}
function unlock(){clearInterval(pollT);$('pair').classList.remove('show');mode='art';hist(false);buildGrid();show(idx,true);
 $('toast').querySelector('b').textContent=ent.all?'Welcome to the Full Collection':'Your Pack Is Unlocked';$('toast').classList.add('show');setTimeout(function(){$('toast').classList.remove('show')},6000)}
/* re-verify stored membership on launch */
if(LS.get('fraimous.token'))api('/api/pair/status?token='+LS.get('fraimous.token')).then(function(s){if(setEnt(s)){buildGrid();show(idx,true)}}).catch(function(){});
if(params.member==='1'){ent={all:true,packs:[]}}
buildGrid();show(parseInt(params.start||0,10),true);
if(params.view){$('splash').style.display='none';mode='art';if(params.view==='info')info(true);if(params.view==='pair')pair(true);if(params.view==='toast')$('toast').classList.add('show');if(params.view==='grid'){grid(true);if(params.row){gr=+params.row;gc=+(params.col||0);focusCard()}}}
else setTimeout(endSplash,5200);

/* Fire TV Silk / browsers: Back triggers history; close the open panel */
window.addEventListener('popstate',function(){if(!histOpen)return;histOpen=false;if(mode==='pair')pair(false);else if(mode==='grid')grid(false);else if(mode==='info')info(false)});
/* fullscreen on first interaction (web) */
var fsDone=false;function goFS(){if(fsDone)return;fsDone=true;var el=document.documentElement,f=el.requestFullscreen||el.webkitRequestFullscreen;try{if(f&&!document.fullscreenElement)f.call(el)}catch(e){}}
/* pointer / Silk cursor mode support */
document.addEventListener('click',function(e){goFS();
 var r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width;
 if(mode==='splash'){$('splash').classList.add('out');mode='art';schedule();return}
 if(mode==='pair'){if(e.target.closest('.pair-hints'))history.back();return}
 if(mode==='grid'){var c=e.target.closest('.card');if(c){var t=P[+c.getAttribute('data-p')];grid(false);show(P.indexOf(t));if(isLocked(t))pair(true)}else if(e.target.closest('.hints'))history.back();return}
 if(x<0.22){show(idx-1);return}if(x>0.78){show(idx+1);return}
 if(isLocked(P[idx])){info(false);pair(true);return}
 if(e.clientY-r.top>r.height*0.8){info(false);grid(true);return}
 info(mode!=='info')});

})();
