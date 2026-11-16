/* FIND MY HEART — photos: assets/images/photo1.jpg … photo6.jpg */
const $=id=>document.getElementById(id),show=id=>$(id).classList.remove('hide'),hide=id=>$(id).classList.add('hide');
const FB='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="#ffc2dc"/><stop offset="1" stop-color="#c9b3ff"/></linearGradient></defs><rect width="300" height="300" fill="url(#g)"/><text x="150" y="190" font-size="120" text-anchor="middle">❤️</text></svg>');
const IM=i=>`<img src="assets/images/photo${i}.jpg" onerror="this.onerror=null;this.src=FB" alt="">`;
const CAP=['Where it all began','Every memory with you','My favorite moment','A thousand more to come','Always you','Together forever'];
let save={u:1};try{save=JSON.parse(localStorage.getItem('fmh'))||save}catch(e){}
const store=()=>{try{localStorage.setItem('fmh',JSON.stringify(save))}catch(e){}};
const T={l:0,r:0,j:0};let SC=null,game=null,tt;
function toast(s){const e=$('toast');e.textContent=s;e.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('on'),2600)}
function modal(h,b,cb){const m=$('modal');m.innerHTML=`<div class="card">${h}<button class="big">${b}</button></div>`;show('modal');m.querySelector('button').onclick=()=>{hide('modal');cb&&cb()}}
const polHtml=(i,msg)=>`<figure class="pol">${IM(i)}<figcaption>${CAP[i-1]}</figcaption></figure><p class="note">${msg}</p>`;

/* ---------- AUDIO (synthesised, starts only after first click) ---------- */
const A={ctx:null,music:true,sf:true,mode:0,step:0,timer:null,
init(){if(!this.ctx){this.ctx=new(window.AudioContext||window.webkitAudioContext)();this.loop()}if(this.ctx.state=='suspended')this.ctx.resume()},
tone(f,d,v,t='triangle',at=0){if(!this.ctx)return;const c=this.ctx,o=c.createOscillator(),g=c.createGain(),s=c.currentTime+at;o.type=t;o.frequency.value=f;g.gain.setValueAtTime(v,s);g.gain.exponentialRampToValueAtTime(.0001,s+d);o.connect(g);g.connect(c.destination);o.start(s);o.stop(s+d)},
loop(){clearInterval(this.timer);const ch=[[261,329,392,523],[220,261,329,440],[174,220,261,349],[196,246,293,392]];
this.timer=setInterval(()=>{if(!this.music)return;const c=ch[Math.floor(this.step/4)%4];this.tone(c[this.step%4]*(this.mode?2:1),1.8,.07);if(this.step%4==0)this.tone(c[0]/2,2.4,.06);this.step++},this.mode?700:430)},
setMode(m){this.mode=m;if(this.ctx)this.loop()},
fx(n){if(!this.sf||!this.ctx)return;const t=this.tone.bind(this);
if(n=='heart'){t(880,.2,.14,'sine');t(1320,.25,.1,'sine',.08)}
else if(n=='jump')t(420,.18,.08,'square');
else if(n=='hurt'){t(200,.3,.12,'sawtooth')}
else{[523,659,784,1047].forEach((f,i)=>t(f,.5,.12,'sine',i*.12))}}};
document.addEventListener('pointerdown',()=>A.init());
document.querySelectorAll('.bm').forEach(b=>b.onclick=()=>{A.init();A.music=!A.music;document.querySelectorAll('.bm').forEach(x=>x.style.opacity=A.music?1:.4)});
document.querySelectorAll('.bs').forEach(b=>b.onclick=()=>{A.sf=!A.sf;document.querySelectorAll('.bs').forEach(x=>x.style.opacity=A.sf?1:.4)});

/* ---------- LEVELS ---------- */
// P platforms [x,top,w]; T thorns [x] on ground; M moving [x,y,w,range,speed]; B orbs [x,y,range]; photos [x,y,idx,msg]
const LV=[
{n:'Level 1 · The Beginning 🌸',sky:['#ff9ec4','#ffcf9a'],gt:0xff8fc0,sun:1,H:10,W:2500,e:2380,dec:['🌸','🌷','🌼'],tree:1,
P:[[0,500,700],[800,500,500],[1400,500,600],[2100,500,400],[1000,400,150],[1700,390,150]],T:[500,1150,1900],M:[],B:[],ph:[]},
{n:'Level 2 · Our Memories 💕',sky:['#1a1040','#5b2a86','#c76db0'],gt:0x9b7bff,H:15,W:3000,e:2900,dec:['✨','🌷','🌺'],
P:[[0,500,500],[650,430,160],[900,360,160],[1150,430,160],[1400,500,300],[1800,420,150],[2050,340,150],[2300,420,150],[2550,500,500]],T:[300,1500,2750],M:[[1700,430,90,100,70]],B:[[1450,470,150]],
ph:[[980,320,2,'One of my favorite moments with you.'],[2125,300,3,'I wish I could relive this moment a thousand times.'],[2620,460,4,'Every memory with you is special.']]},
{n:'Level 3 · Together Forever ❤️',sky:['#0d0828','#3b1a66','#ff7fb5'],gt:0xff6fa8,H:20,W:3400,e:3320,dec:['🌹','🌹','💗'],boy:1,
P:[[0,500,400],[520,440,140],[740,380,140],[960,320,140],[1180,380,140],[1400,440,140],[1620,500,300],[2000,430,130],[2200,360,130],[2400,430,130],[2600,500,800]],T:[300,1800,2900,3100],M:[],B:[[1650,470,250],[2750,470,350]],ph:[]}];

/* ---------- GAME SCENE ---------- */
class G extends Phaser.Scene{
constructor(){super('G')}
init(d){this.li=d.l||0}
tex(){const g=this.add.graphics(),m=(k,w,h,f)=>{if(this.textures.exists(k))return;g.clear();f(g);g.generateTexture(k,w,h)};
m('heart',30,30,g=>{g.fillStyle(0xff3d7f,.25);g.fillCircle(15,15,15);g.fillStyle(0xff3d7f);g.fillCircle(10,11,6);g.fillCircle(20,11,6);g.fillTriangle(4,14,26,14,15,27)});
m('girl',32,48,g=>{g.fillStyle(0x6b3a2a);g.fillCircle(16,11,10);g.fillCircle(27,15,5);g.fillStyle(0xffd9bf);g.fillCircle(16,13,8);g.fillRect(11,43,4,5);g.fillRect(17,43,4,5);g.fillStyle(0xff7eb6);g.fillTriangle(16,21,3,45,29,45);g.fillStyle(0xff3d7f);g.fillCircle(8,5,3);g.fillCircle(14,3,3);g.fillStyle(0x333333);g.fillRect(17,12,2,3);g.fillRect(22,12,2,3)});
m('boy',32,48,g=>{g.fillStyle(0x3b2a22);g.fillCircle(16,9,10);g.fillStyle(0xffd9bf);g.fillCircle(16,14,8);g.fillStyle(0x6fa8ff);g.fillRoundedRect(7,22,18,17,4);g.fillStyle(0x4a5a9a);g.fillRect(9,39,6,9);g.fillRect(17,39,6,9);g.fillStyle(0x333333);g.fillRect(17,13,2,3);g.fillRect(22,13,2,3)});
m('orb',28,28,g=>{g.fillStyle(0x7a3cc9);g.fillCircle(14,14,12);g.fillStyle(0xe0c8ff);g.fillCircle(14,14,5)});
m('thorn',28,24,g=>{g.fillStyle(0x9b2d5e);g.fillTriangle(0,24,7,3,14,24);g.fillTriangle(14,24,21,3,28,24)});
m('ground',40,40,g=>{g.fillStyle(0xffffff);g.fillRect(0,0,40,8);g.fillStyle(0xaaaaaa);g.fillRect(0,8,40,32)});
m('mp',100,20,g=>{g.fillStyle(0xffffff);g.fillRoundedRect(0,0,100,20,8)});
m('pol',28,34,g=>{g.fillStyle(0xffffff);g.fillRect(0,0,28,34);g.fillStyle(0xffa6c9);g.fillRect(3,3,22,22);g.fillStyle(0xff3d7f);g.fillCircle(14,14,5)});
m('spark',8,8,g=>{g.fillStyle(0xffffff);g.fillCircle(4,4,4)});
m('gate',70,110,g=>{g.fillStyle(0xffe9a8,.35);g.fillEllipse(35,55,70,110);g.fillStyle(0xffe9a8,.7);g.fillEllipse(35,60,44,86)});g.destroy()}
create(){SC=this;this.tex();const L=this.L=LV[this.li],W=L.W;
this.cnt=0;this.frozen=false;this.over=false;this.gateOn=false;this.inv=0;this.ride=null;this.coy=0;this.safe={x:60,y:440};
this.physics.world.setBounds(0,0,W,1200);
const k='sky'+this.li;if(!this.textures.exists(k)){const c=this.textures.createCanvas(k,960,540),x=c.context,g=x.createLinearGradient(0,0,0,540);L.sky.forEach((s,i)=>g.addColorStop(i/(L.sky.length-1),s));x.fillStyle=g;x.fillRect(0,0,960,540);if(!L.sun){x.fillStyle='#fff';for(let i=0;i<100;i++){x.globalAlpha=Math.random();x.fillRect(Math.random()*960,Math.random()*360,2,2)}}c.refresh()}
this.add.image(0,0,k).setOrigin(0).setScrollFactor(0);
const o=this.add.graphics().setScrollFactor(0);o.fillStyle(L.sun?0xffe9a8:0xfff2c2,.25);o.fillCircle(720,L.sun?330:110,L.sun?110:80);o.fillStyle(L.sun?0xffd27a:0xfff7dc);o.fillCircle(720,L.sun?330:110,L.sun?60:42);
const h=this.add.graphics().setScrollFactor(.25);h.fillStyle(L.sun?0xd96fa6:0x3a1d66,.7);for(let i=0;i<(W*.25+960)/240;i++)h.fillEllipse(i*240,540,420,200+(i%3)*50);
this.add.particles(0,0,'heart',{x:{min:0,max:960},y:560,lifespan:7000,speedY:{min:-50,max:-90},speedX:{min:-15,max:15},scale:{start:.5,end:.15},alpha:{start:.5,end:0},frequency:500}).setScrollFactor(0);
// platforms
this.plats=this.physics.add.staticGroup();
L.P.forEach(p=>{const hh=p[1]>=500?80:22,t=this.add.tileSprite(p[0]+p[2]/2,p[1]+hh/2,p[2],hh,'ground').setTint(L.gt);this.plats.add(t);
if(p[1]>=500)for(let x=p[0]+30;x<p[0]+p[2]-20;x+=64){const f=this.add.text(x+Math.random()*20,p[1]+3,Phaser.Utils.Array.GetRandom(L.dec),{fontSize:'22px'}).setOrigin(.5,1);this.tweens.add({targets:f,angle:{from:-8,to:8},duration:1200+Math.random()*800,yoyo:true,repeat:-1,ease:'Sine.inOut'})}
if(L.tree&&p[1]>=500)for(let x=p[0]+250;x<p[0]+p[2]-60;x+=420)this.add.text(x,p[1],'🌳',{fontSize:'64px'}).setOrigin(.5,1).setDepth(-1)});
// thorns
this.thorns=this.physics.add.staticGroup();L.T.forEach(x=>{this.thorns.create(x,500,'thorn').setOrigin(.5,1).refreshBody()});
// moving platforms & orbs
this.movs=this.physics.add.group({allowGravity:false,immovable:true});
L.M.forEach(m=>{const s=this.movs.create(m[0]+m[2]/2,m[1],'mp').setDisplaySize(m[2],20).setTint(L.gt);s.a=m[0]+m[2]/2;s.b=s.a+m[3];s.s=m[4];s.setVelocityX(m[4])});
this.orbs=this.physics.add.group({allowGravity:false});
L.B.forEach(b=>{const s=this.orbs.create(b[0],b[1],'orb');s.a=b[0];s.b=b[0]+b[2];s.s=70;s.setVelocityX(70);this.tweens.add({targets:s,angle:360,duration:2000,repeat:-1})});
// hearts spread over platforms
this.hearts=this.physics.add.group({allowGravity:false});
const n=L.H,np=L.P.length,per=Math.ceil(n/np);
for(let i=0;i<n;i++){const p=L.P[i%np],j=Math.floor(i/np)+1,x=p[0]+p[2]*j/(per+1),hh=this.hearts.create(x,p[1]-62,'heart');this.tweens.add({targets:hh,y:hh.y-8,scale:1.15,yoyo:true,repeat:-1,duration:800+i*30,ease:'Sine.inOut'})}
// photos
this.phs=this.physics.add.group({allowGravity:false});
L.ph.forEach(p=>{const s=this.phs.create(p[0],p[1],'pol');s.d=p;this.tweens.add({targets:s,angle:{from:-8,to:8},y:s.y-8,yoyo:true,repeat:-1,duration:1000})});
// gate / boy
this.gate=this.add.image(L.e,500,'gate').setOrigin(.5,1).setAlpha(.25);
this.add.text(L.e,420,'❤️',{fontSize:'34px'}).setOrigin(.5);
if(L.boy){this.boy=this.add.image(L.e,476,'boy').setFlipX(true);this.gate.setVisible(false)}
// player
this.pl=this.physics.add.sprite(60,440,'girl').setDepth(5);this.pl.body.setSize(22,44).setOffset(5,4);this.pl.setCollideWorldBounds(true);
this.physics.add.collider(this.pl,this.plats);
this.physics.add.collider(this.pl,this.movs,(p,m)=>{if(p.body.touching.down)this.ride=m});
this.physics.add.overlap(this.pl,this.hearts,(p,h)=>this.collect(h));
this.physics.add.overlap(this.pl,this.phs,(p,s)=>{const d=s.d;s.destroy();this.photo(d[2],d[3],'CONTINUE')});
this.physics.add.overlap(this.pl,this.thorns,()=>this.hurt());
this.physics.add.overlap(this.pl,this.orbs,()=>this.hurt());
const c=this.cameras.main;c.setBounds(0,0,W,540);c.startFollow(this.pl,true,.1,.1);c.fadeIn(600);
this.k=this.input.keyboard.addKeys({A:'A',D:'D',W:'W',sp:'SPACE',up:'UP',left:'LEFT',right:'RIGHT'});
this.upd();toast(L.n);A.setMode(0)}
upd(){$('lv').textContent=this.L.n;$('hc').textContent=`❤️ ${this.cnt}/${this.L.H}`}
burst(x,y,tx='heart',q=10){const e=this.add.particles(x,y,tx,{speed:{min:60,max:180},lifespan:700,scale:{start:.6,end:0},quantity:q,emitting:false});e.explode(q);this.time.delayedCall(900,()=>e.destroy())}
collect(h){this.burst(h.x,h.y);h.destroy();this.cnt++;A.fx('heart');this.upd();
if(this.cnt>=this.L.H){this.gateOn=true;this.gate.setAlpha(1);this.tweens.add({targets:this.gate,alpha:.6,yoyo:true,repeat:-1,duration:700});
if(this.li==0)this.photo(1,'Every beautiful story has a beginning. And I\'m so happy ours started.','CONTINUE',()=>toast('Walk to the glowing heart ➜'));
else toast(this.L.boy?'All hearts! Go find him ❤️':'All hearts! Reach the glowing heart ➜')}}
freeze(f){this.frozen=f;f?this.physics.pause():this.physics.resume()}
photo(i,msg,b,cb){this.freeze(true);A.fx('win');modal(polHtml(i,msg),b,()=>{this.freeze(false);cb&&cb()})}
hurt(){if(this.time.now<this.inv||this.over)return;this.inv=this.time.now+1300;A.fx('hurt');toast('Oops! Try again 💕');this.pl.setPosition(this.safe.x,this.safe.y).setVelocity(0,0);this.tweens.add({targets:this.pl,alpha:.3,yoyo:true,repeat:5,duration:100,onComplete:()=>this.pl.setAlpha(1)})}
finish(){this.over=true;this.pl.setVelocity(0,0);
if(this.li==2)return this.photo(5,'You are my favorite person, today and always.','CONTINUE',()=>this.cine());
A.fx('win');save.u=Math.max(save.u,this.li+2);store();this.freeze(true);
modal(`<h2>Level complete! ✨</h2><p class="note">${this.li==0?'Our story is just getting started…':'Almost there, my love…'}</p>`,'NEXT LEVEL →',()=>this.scene.start('G',{l:this.li+1}))}
cine(){this.frozen=true;this.over=true;const p=this.pl,b=this.boy,c=this.cameras.main;A.setMode(1);
p.body.enable=false;p.y=476;const mx=(p.x+b.x)/2;c.stopFollow();c.pan(mx,400,2500,'Sine.easeInOut');c.zoomTo(1.7,2800);
this.add.particles(mx,440,'spark',{speed:{min:20,max:80},lifespan:2500,scale:{start:1.2,end:0},alpha:{start:1,end:0},tint:0xffe9a8,frequency:60}).setDepth(9);
this.tweens.add({targets:p,x:mx-14,duration:2800});this.tweens.add({targets:b,x:mx+14,duration:2800,onComplete:()=>{
this.add.particles(mx,430,'heart',{speed:{min:30,max:100},angle:{min:240,max:300},lifespan:2500,scale:{start:.8,end:.1},alpha:{start:1,end:0},frequency:120}).setDepth(9);
this.add.text(mx,390,'💞',{fontSize:'44px'}).setOrigin(.5).setDepth(9);
this.time.delayedCall(4200,()=>{c.fadeOut(1200);this.time.delayedCall(1300,()=>{save.u=3;store();hide('hud');hide('touch');showEnd()})})}})}
update(t,dt){if(this.frozen||this.over)return;const p=this.pl,b=p.body,k=this.k;
if(this.ride){p.x+=this.ride.body.deltaX();this.ride=null}
this.movs.children.each(m=>{if(m.x>=m.b)m.setVelocityX(-m.s);else if(m.x<=m.a)m.setVelocityX(m.s)});
this.orbs.children.each(m=>{if(m.x>=m.b)m.setVelocityX(-m.s);else if(m.x<=m.a)m.setVelocityX(m.s)});
const l=k.left.isDown||k.A.isDown||T.l,r=k.right.isDown||k.D.isDown||T.r,j=k.up.isDown||k.W.isDown||k.sp.isDown||T.j,fl=b.blocked.down||b.touching.down;
b.setVelocityX(l?-230:r?230:0);if(l)p.setFlipX(true);else if(r)p.setFlipX(false);
this.coy=fl?120:this.coy-dt;
if(j&&!this.jh&&this.coy>0){b.setVelocityY(-590);this.coy=0;A.fx('jump');this.burst(p.x,p.y+24,'spark',4)}
if(!j&&b.velocity.y<-250)b.setVelocityY(b.velocity.y*.7);this.jh=j;
if(fl&&this.air){this.burst(p.x,p.y+24,'spark',5)}this.air=!fl;
p.angle=(l||r)&&fl?Math.sin(t/60)*6:0;
if(fl&&!this.ride&&b.velocity.y==0&&this.time.now-(this.st||0)>300){this.st=this.time.now;this.safe={x:p.x-(r?30:l?-30:0),y:p.y-6}}
if(p.y>600)this.hurt();
if(Math.abs(p.x-this.L.e)<70){if(this.gateOn)this.finish();else if(this.time.now-(this.ht||0)>3000){this.ht=this.time.now;toast('Collect all the hearts first! ❤️')}}}}

/* ---------- UI ---------- */
function pols(el){el.innerHTML=CAP.map((c,i)=>`<figure class="pol" onclick="zoom(${i+1})">${IM(i+1)}<figcaption>${c}</figcaption></figure>`).join('')}
function zoom(i){$('lb').innerHTML=`${IM(i)}<p class="note">${CAP[i-1]}</p>`;show('lb')}
$('lb').onclick=()=>hide('lb');
function showEnd(){document.body.classList.remove('playing');pols($('egrid'));hide('gal');show('end');$('end').scrollTop=0;A.setMode(1)}
async function enterImmersive(){
  // Fullscreen is available on most Android browsers and desktop browsers after a user tap.
  try{if(!document.fullscreenElement&&document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen({navigationUI:'hide'});}catch(e){}
  // Best effort: supported mainly by Android Chrome; iOS may ignore this request.
  try{if(screen.orientation&&screen.orientation.lock)await screen.orientation.lock('landscape');}catch(e){}
}
$('full').onclick=async()=>{if(document.fullscreenElement){try{await document.exitFullscreen()}catch(e){}}else{await enterImmersive()}};
window.addEventListener('resize',()=>{if(game&&game.scale)game.scale.refresh()});
window.addEventListener('orientationchange',()=>setTimeout(()=>{if(game&&game.scale)game.scale.refresh()},250));
function play(l){document.body.classList.add('playing');hide('menu');hide('end');hide('gal');show('hud');if(('ontouchstart' in window)||navigator.maxTouchPoints>0)show('touch');
const cfg=game;if(!cfg){game=new Phaser.Game({type:Phaser.AUTO,parent:'game',width:960,height:540,backgroundColor:'#1a1030',scale:{mode:Phaser.Scale.ENVELOP,autoCenter:Phaser.Scale.CENTER_BOTH},physics:{default:'arcade',arcade:{gravity:{y:1100}}},scene:[]});game.scene.add('G',G,true,{l})}else game.scene.start('G',{l})}
// Always begin a fresh adventure at Level 1; saved unlocks no longer skip the story.
$('start').onclick=()=>{A.init();enterImmersive();play(0)};
$('levelsBtn').onclick=()=>{hide('menu');show('levelsScreen')};
$('levelsBack').onclick=()=>{hide('levelsScreen');show('menu')};
document.querySelectorAll('.levelChoice').forEach(b=>b.onclick=()=>{A.init();enterImmersive();play(Number(b.dataset.level))});
$('mem').onclick=()=>{pols($('grid'));hide('menu');show('gal')};
$('gback').onclick=()=>{hide('gal');show('menu')};
$('again').onclick=()=>{save.u=1;store();enterImmersive();play(0)};
$('bp').onclick=()=>{if(SC&&!SC.frozen){game.scene.pause('G');show('pause')}};
$('res').onclick=()=>{hide('pause');game.scene.resume('G')};
$('br').onclick=()=>{if(SC)game.scene.start('G',{l:SC.li})};
$('rst').onclick=()=>{hide('pause');game.scene.start('G',{l:SC.li})};
$('restartStory').onclick=()=>{hide('pause');save.u=1;store();play(0)};
$('home').onclick=()=>{document.body.classList.remove('playing');hide('pause');game.scene.stop('G');hide('hud');hide('touch');show('menu')};
[['tl','l'],['tr','r'],['tj','j']].forEach(([id,f])=>{const e=$(id);e.addEventListener('pointerdown',ev=>{ev.preventDefault();T[f]=1;try{e.setPointerCapture(ev.pointerId)}catch(_){}});['pointerup','pointerleave','pointercancel','lostpointercapture'].forEach(n=>e.addEventListener(n,()=>T[f]=0))});
window.addEventListener('blur',()=>{T.l=0;T.r=0;T.j=0});
document.addEventListener('contextmenu',e=>{if(e.target.closest('#touch'))e.preventDefault()});
for(let i=0;i<18;i++){const s=document.createElement('span');s.textContent='❤';s.style.cssText=`left:${Math.random()*100}%;font-size:${14+Math.random()*26}px;animation-duration:${6+Math.random()*8}s;animation-delay:-${Math.random()*10}s`;$('fl').appendChild(s)}
window.addEventListener('load',()=>setTimeout(()=>$('load').classList.add('off'),900));
