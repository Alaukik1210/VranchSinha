// Eye film: the canvas composition behind the loader and hero, ported from
// eye_film_comp.html (1920x1080 design space, 60 fps, 30 s, fully seeded).
// Only the canvas wiring changed: the caller supplies the context and a base
// transform that places the 1920x1080 stage on any canvas size, and the
// ground is cleared rather than painted, so the page shows through (the eye
// whites are still filled, so they cover whatever sits behind the canvas).
//   0 → 8.2 s   eye grid converging to the dot (the loader)
//   8.2 → 29.3 s the eye cycle, which closes back to the same dot (the loop)

/* Eye film: self-contained canvas composition, 1920x1080, 60 fps, 30 s.
   All randomness is seeded (mulberry32 'mb'); no Math.random, no network, no external files.
   API: window.COMP (metadata), window.renderFrame(t_seconds), window.READY (true when ready). */
const W=1920,H=1080,CX=960,CY=540,GROUND='#FFFEFC',INK='#0B0B0B';
const ACC={red:'#F2362B',mag:'#B83DF0',org:'#FF7A1A',grn:'#1FCB6A',yel:'#FFC81F',pink:'#F5338F',blue:'#2F6BFF'};
function mb(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const cl=(x,a=0,b=1)=>x<a?a:x>b?b:x;
const back=s=>u=>{const x=u-1;return 1+(s+1)*x*x*x+s*x*x};
const E={io3:u=>u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2,io5:u=>u<.5?16*u**5:1-Math.pow(-2*u+2,5)/2,
 o3:u=>1-Math.pow(1-u,3),o5:u=>1-Math.pow(1-u,5),i3:u=>u*u*u,i5:u=>u**5,
 oE:u=>u>=1?1:1-Math.pow(2,-10*u),ob:back(1.3),ob8:back(1.5),ob5:back(1.0)};
const ee=(n,u)=>E[n](cl(u));
function K(t,keys){if(t<=keys[0][0])return keys[0][1];for(let i=1;i<keys.length;i++){if(t<keys[i][0]){const a=keys[i-1],b=keys[i];const u=(t-a[0])/(b[0]-a[0]);return a[1]+(b[1]-a[1])*E[b[2]||'io3'](u)}}return keys[keys.length-1][1]}
// damped spring step response (elastic)
function sp(tau,z=0.5,w=16){if(tau<=0)return 0;const wd=w*Math.sqrt(1-z*z);return 1-Math.exp(-z*w*tau)*(Math.cos(wd*tau)+z/Math.sqrt(1-z*z)*Math.sin(wd*tau))}
const BASE={x:960,y:540,w:250,htR:0,hbS:1,k:0,rot:0,gx:0,gy:0,pr:1,cat:0,c:0,rcO:26,sc:1,cv:0,bl:0,seed:1};

// ---------- eye ----------
function eyeGeo(p){
  const w=p.w,rx=w/2,hbU=w/2.1,lw=Math.max(2.4,0.04*w),c=cl(p.c),bl=cl(p.bl);
  const hb=hbU*Math.max(0,p.hbS)*(1-0.93*bl),ht=hbU*Math.max(0,p.htR)*(1-bl),oy=(hb-ht)/2;
  const rc=Math.max(0.5,p.rcO-lw/2);const r=mb(p.seed*7919),f1=r()*6.28,f2=r()*6.28;
  const N=96,pts=[];
  for(let i=0;i<N;i++){const th=2*Math.PI*i/N,s=Math.sin(th),co=Math.cos(th);
    const m=1+0.016*Math.sin(2*th+f1)+0.010*Math.sin(3*th+f2);
    // x strictly monotone along each lid (no wobble on x); y wobble vanishes at corners; ht,hb>=0 so lids never cross
    const dx=rx*co;let dy=(s>0?hb*s:ht*s)*m-oy;dy+=0.012*rx*co*(p.seed%2?1:-1);
    const cx=rc*co,cy=rc*s;let x=dx+(cx-dx)*c,y=dy+(cy-dy)*c;y+=p.k*x*(1-c);pts.push(x,y)}
  if(false){let bad=0;const half=N/2;for(let i=half;i<N;i++){const j=(i+1)%N;if(pts[2*j]<pts[2*i]-1e-9)bad++}
    for(let i=1;i<half;i++){if(pts[2*(i+1)]>pts[2*i]+1e-9&&i+1<half+1&&i+1!=half)bad++}
    for(let i=1;i<half;i++){const u=N-i;if(pts[2*i+1]<pts[2*u+1]-1e-6)bad++}
    if(bad){globalThis.VIOL=(globalThis.VIOL||0)+1;globalThis.VL=(globalThis.VL||[]);if(globalThis.VL.length<5)globalThis.VL.push([globalThis.FR,p.seed,bad])}}
  return{pts,N,lw,ht,hb,oy,c,w,hbU}}
function lidWorld(p){const g=eyeGeo(p),N=g.N,cs=Math.cos(p.rot),sn=Math.sin(p.rot),out=[],idx=[];
  for(let i=N/2;i<N;i++)idx.push(i);idx.push(0);
  for(const i of idx){const x=g.pts[2*i],y=g.pts[2*i+1];out.push([p.x+p.sc*(cs*x-sn*y),p.y+p.sc*(sn*x+cs*y)])}return out}
function drawEye(ctx,p){
  if(p.sc<0.002)return;
  if(p.c>=0.9999){ctx.fillStyle=INK;ctx.beginPath();ctx.arc(p.x,p.y,p.rcO*p.sc,0,2*Math.PI);ctx.fill();return}
  const g=eyeGeo(p),{pts,N,lw,ht,hb,oy,c,w,hbU}=g;
  ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.scale(p.sc,p.sc);
  const path=()=>{ctx.beginPath();ctx.moveTo(pts[0],pts[1]);for(let i=1;i<N;i++)ctx.lineTo(pts[2*i],pts[2*i+1]);ctx.closePath()};
  path();ctx.fillStyle=GROUND;ctx.fill();
  ctx.save();ctx.clip();
  const R0=0.275*w*p.pr,Rbig=2.4*w,R=R0*Math.pow(Rbig/R0,p.cv);
  const px=p.gx*0.2*w,py=p.gy*0.12*w-ht*0.25-oy+p.k*p.gx*0.2*w;
  ctx.fillStyle=INK;ctx.beginPath();ctx.arc(px,py,R,0,2*Math.PI);ctx.fill();
  if(p.cat>0.01&&p.cv<0.5){ctx.fillStyle=GROUND;ctx.beginPath();ctx.arc(px-0.36*R0,py-0.36*R0,0.17*R0*p.cat,0,2*Math.PI);ctx.fill()}
  ctx.restore();
  const lf=cl(1-ht/(0.25*hbU))*cl(1-c*2);
  path();ctx.strokeStyle=INK;ctx.lineWidth=lw*(1+0.32*lf);ctx.lineJoin='round';ctx.lineCap='round';ctx.stroke();
  ctx.restore();
}
function drawDot(ctx,r){ctx.fillStyle=INK;ctx.beginPath();ctx.arc(CX,CY,r,0,2*Math.PI);ctx.fill()}

// ---------- ACT 1 ----------
const GRID=[];{const r=mb(2929);for(let row=0;row<11;row++){const n=row%2?10:11;for(let i=0;i<n;i++){
  GRID.push({x:960+(i-(n-1)/2)*185+(r()-.5)*6,y:540+(row-5)*100+(r()-.5)*6,w:(168*(0.97+0.06*r()))-6.5,rot:(r()<.5?-1:1)*(0.03+0.145*r()),seed:1+Math.floor(r()*1e5)})}}}
const NG=GRID.length;
// farthest-point order
const ORDER=(()=>{const r=mb(77);let cur=Math.floor(r()*NG);const used=new Array(NG).fill(false),ord=[cur];used[cur]=true;
  const md=GRID.map(g=>Math.hypot(g.x-GRID[cur].x,g.y-GRID[cur].y));
  while(ord.length<NG){let b=-1,bv=-1;for(let i=0;i<NG;i++)if(!used[i]&&md[i]>bv){bv=md[i];b=i}
    used[b]=true;ord.push(b);for(let i=0;i<NG;i++)md[i]=Math.min(md[i],Math.hypot(GRID[i].x-GRID[b].x,GRID[i].y-GRID[b].y))}return ord})();
const DIRS=[[-1,0],[1,0],[0,-1],[0,1],[.7,.7],[-.7,.7],[.7,-.7],[-.7,-.7]];
{const T=1.9,a=3*3.8;ORDER.forEach((gi,idx)=>{const n=idx+0.5,A=NG-a;const u=(-a+Math.sqrt(a*a+4*A*n))/(2*A);GRID[gi].tp=0.35+T*u});
 const r=mb(555);
 GRID.forEach(g=>{g.ts=[];g.tg=[];let t=g.tp-0.1;g.tg.push(DIRS[Math.floor(r()*8)]);g.ts.push(-1e9);
   for(let k=0;k<14;k++){t+=0.17+0.26*r();g.ts.push(t);g.tg.push(DIRS[Math.floor(r()*8)].map(v=>v*0.95))}
   g.sg=0.15*r();const dd=Math.hypot(g.x-960,g.y-540)/1130;g.dd=dd;g.ps=3.30+0.18*(1-dd);g.pe=g.ps+0.5;
   g.pw=Math.floor(r()*2)?1:-1})}
function sacc(g,t){let k=0;while(k+1<g.ts.length&&g.ts[k+1]<=t)k++;if(k==0)return g.tg[0];
  const u=ee('io3',(t-g.ts[k])/0.15),a=g.tg[k-1],b=g.tg[k];return[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u]}
const PO={};
function act1(ctx,t){
  const list=[];
  const bump=cl((t-3.9)/0.2);
  for(const g of GRID){
    if(t<g.tp)continue;
    const o=Object.assign({},BASE,{x:g.x,y:g.y,w:g.w,rot:g.rot,seed:g.seed});
    const up=(t-g.tp)/0.32;
    o.sc=ee('ob8',up);o.bl=1-ee('o3',(t-g.tp)/0.30);
    const ts=2.30+g.sg;const sg=sacc(g,Math.min(t,ts)),m=ee('io3',(t-ts)/0.45);
    o.gx=sg[0]*(1-m);o.gy=sg[1]*(1-m);
    o.sc*=1+0.006*(1-Math.cos(2*Math.PI*cl(t-2.3,0,1)/0.5));
    const bu=cl((t-2.92)/0.26);o.bl=Math.max(o.bl,Math.pow(Math.sin(Math.PI*bu),2)*(t>2.5?1:0));
    if(t>g.ps){const u=cl((t-g.ps)/0.5),f=E.i3(u);
      o.x=g.x+(960-g.x)*f;o.y=g.y+(540-g.y)*f;o.sc*= (1-f);o.rot+=g.pw*0.6*f;
      const cc=ee('io3',u/0.55);o.c=cc;o.cv=cc;o.rcO=34}
    list.push([g.dd,o]);
  }
  list.sort((a,b)=>b[0]-a[0]);for(const[,o]of list)drawEye(ctx,o);
  if(t>=3.30){let f=0;for(const g of GRID)f+=ee('io3',(t-(g.pe-0.14))/0.14);f/=NG;
    let r=26*Math.sqrt(f)*(1+0.16*Math.sin(Math.PI*bump)*Math.pow(1-bump,1.5));
    if(f>0)drawDot(ctx,r)}
}

// ---------- ACT 2 tracks ----------
const TA={x:[[0,960],[4.6,960],[5.25,825.75,'io5'],[5.6,825.75],[6.15,960,'io5']],
 w:[[0,52],[4.1,52],[4.65,250,'ob']],c:[[0,1],[4.1,1],[4.6,0,'io3']],cv:[[0,1],[4.1,1],[4.2,1],[4.6,0,'io3']],
 sc:[[0,1],[5.6,1],[6.1,0.85,'io3']],
 gx:[[0,0],[5.3,0],[5.58,0.85,'io3'],[5.95,0.85],[6.3,0.05,'io3']],gy:[[0,0],[5.3,0],[5.58,-0.6,'io3'],[5.95,-0.6],[6.3,-0.7,'io3']]};
const TB={x:[[0,1094.25],[5.6,1094.25],[6.15,960,'io5'],[9.42,960],[9.92,755,'ob'],[10.1,755],[10.62,960,'io5']],
 y:[[0,590],[4.75,590],[5.25,537,'o5'],[5.6,537],[6.15,540,'io5'],[9.42,540],[9.92,460,'ob'],[10.1,460],[10.62,540,'io5']],
 w:[[0,250],[9.42,250],[9.92,215,'io3'],[10.1,215],[10.62,250,'io3']],
 sc:[[0,0],[4.75,0],[5.25,1,'ob']],bl:[[0,1],[4.75,1],[5.15,0,'o3']],
 htR:[[0,0],[5.35,0],[5.65,0.40,'io3'],[6.2,0.40],[6.62,0.88,'io3'],[7.95,0.88],[8.12,0,'o5'],[9.8,0],[9.92,0.3,'io3'],[10.1,0.3],[10.62,0,'io3'],[11.15,0],[11.55,0.3,'io3'],[12.2,0.3],[12.6,0,'io3'],[13.3,0],[13.8,0.2,'io3'],[13.95,0.2],[14.3,0,'io3']],
 hbS:[[0,1],[10.1,1],[10.62,0.62,'io3'],[11.15,0.62],[11.55,1,'io3'],[12.2,1],[12.6,0.78,'io3'],[13.3,0.78],[13.8,1,'io3'],[14.05,1],[14.33,0.05,'io3']],
 k:[[0,0],[8.0,0],[8.2,-0.40,'ob'],[8.95,-0.40],[9.35,0,'io3'],[11.15,0],[11.55,0.34,'io3'],[12.2,0.34],[12.6,0.05,'io3'],[13.3,0.05],[13.8,0,'io3']],
 rot:[[0,0],[8.0,0],[8.15,-0.06,'o3'],[8.7,0,'io3'],[9.42,0],[9.92,-0.2,'io3'],[10.1,-0.2],[10.62,0,'io3']],
 gx:[[0,0],[5.3,0],[5.58,0.85,'io3'],[5.95,0.85],[6.3,0.05,'io3'],[8.05,0.05],[8.2,0.1,'o3'],[9.42,0.1],[9.92,-0.5,'io3'],[10.4,-0.5],[10.62,0,'io3'],[10.8,-0.85,'io3'],[10.98,-0.85],[11.14,0.85,'io3'],[11.35,0.85],[11.7,0.1,'io3'],[12.6,0.1],[13.0,-0.65,'io3'],[13.4,0.65,'io3'],[13.85,0,'io3']],
 gy:[[0,0],[5.3,0],[5.58,-0.6,'io3'],[5.95,-0.6],[6.3,-0.7,'io3'],[8.05,-0.7],[8.2,0.35,'o3'],[9.42,0.35],[9.92,-0.2,'io3'],[10.4,-0.2],[10.7,0,'io3'],[11.3,0],[11.7,-0.4,'io3'],[12.6,-0.4],[12.95,0,'io3'],[13.4,0],[13.85,0.6,'io3']],
 pr:[[0,1],[6.2,1],[6.62,1.12,'io3'],[7.95,1.12],[8.2,0.6,'o3'],[8.9,0.6],[9.3,1,'io3'],[10.1,1],[10.62,0.72,'io3'],[11.15,0.72],[11.55,1.35,'io3'],[12.2,1.35],[12.6,1,'io3']],
 cat:[[0,0],[6.4,0],[6.7,1,'o3'],[7.95,1],[8.1,0,'i3'],[11.3,0],[11.6,1,'o3'],[12.2,1],[12.4,0,'i3']],
 c:[[0,0],[9.0,0],[9.35,1,'io3'],[9.45,1],[9.95,0,'io3'],[14.33,0],[14.6,1,'io3']],
 cv:[[0,0],[9.0,0],[9.3,1,'io3'],[9.45,1],[9.95,0,'io3'],[14.3,0],[14.52,1,'io3']],
 rcO:[[0,64],[14.33,64],[14.6,26,'io3']]};
function mkE(x1,y1,wf,rot,gx,gy,ht,dl){return {
 x:[[0,960],[9.42+dl,960],[9.92+dl,x1,'ob'],[10.1,x1],[10.58+dl*0.3,960,'io5']],
 y:[[0,540],[9.42+dl,540],[9.92+dl,y1,'ob'],[10.1,y1],[10.58+dl*0.3,540,'io5']],
 w:[[0,250],[9.42+dl,250],[9.92+dl,wf,'io3'],[10.1,wf],[10.58+dl*0.3,225,'io3']],
 c:[[0,1],[9.42+dl,1],[9.92+dl,0,'io3']],cv:[[0,1],[9.42+dl,1],[9.92+dl,0,'io3']],
 rcO:[[0,64],[20,64]],
 htR:[[0,0],[9.6,0],[9.98,ht,'io3'],[10.1,ht],[10.58,0,'io3']],hbS:[[0,1],[10.1,1],[10.58,0.62,'io3']],
 rot:[[0,0],[9.42+dl,0],[9.92+dl,rot,'io3'],[10.1,rot],[10.58,0,'io3']],
 gx:[[0,0],[9.6,0],[9.98,gx,'io3'],[10.1,gx],[10.58,0,'io3']],gy:[[0,0],[9.6,0],[9.98,gy,'io3'],[10.1,gy],[10.58,0,'io3']],
 pr:[[0,1],[10.1,1],[10.58,0.72,'io3']]}}
const TE2=mkE(1175,505,185,0.12,0.7,0.1,0.25,0.06),TE3=mkE(945,680,240,0.26,0.1,-0.5,0.2,0.12);
function ev(tr,t,seed,extra){const o=Object.assign({},BASE,{seed},extra||{});for(const k in tr)o[k]=K(t,tr[k]);return o}
const BLINKS=[[7.45,0.24],[11.95,0.26],[13.6,0.34]];
function pw(t){return E.io3(cl((t-5.8)/0.4))*(1-E.io3(cl((t-14.0)/0.2)))}
function breath(t){return 1+0.010*Math.sin(2*Math.PI*t/2.7)*pw(t)}

// ---------- accents ----------
function spike(ctx,a,r0,L,d,cf){const c=Math.cos,s=Math.sin,rb=r0*0.9,rm=r0+(L-r0)*0.38;
  ctx.moveTo(rb*c(a-d),rb*s(a-d));ctx.quadraticCurveTo(rm*c(a-d*cf),rm*s(a-d*cf),L*c(a),L*s(a));ctx.quadraticCurveTo(rm*c(a+d*cf),rm*s(a+d*cf),rb*c(a+d),rb*s(a+d));ctx.closePath()}
// red 5-star
const RS=(()=>{const r=mb(29);const sp=[];const L=[205,268,222,252,180];for(let j=0;j<5;j++)sp.push({a:-Math.PI/2+j*1.2566+(r()-.5)*0.2,L:L[j],v:(r()-.5)*0.25,rv:0.9+0.25*r()});return sp})();
function drawRedStar(ctx,t,cx,cy){const ts=5.30,col=1-E.i3(cl((t-6.20)/0.30));if(t<ts||col<0.003)return;
  const grow=ee('o3',(t-ts)/0.28);ctx.save();ctx.translate(cx,cy);ctx.rotate(0.03*Math.sin(2*Math.PI*t/1.9)+0.5*E.i3(cl((t-6.2)/0.3)));ctx.scale(col,col);
  const rin=96,v=[];for(let j=0;j<5;j++){const s=RS[j],n=RS[(j+1)%5];const u=ee('ob',(t-ts-0.08*j)/0.30);const R=rin*0.8+(s.L-rin*0.8)*u;
    v.push([R*Math.cos(s.a),R*Math.sin(s.a)]);let a2=n.a+(j==4?2*Math.PI:0);const am=(s.a+a2)/2+s.v,rr=rin*s.rv*grow;v.push([rr*Math.cos(am),rr*Math.sin(am)])}
  ctx.beginPath();v.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=ACC.red;ctx.lineJoin='miter';ctx.fill();ctx.restore()}
// magenta fire
const FT=(()=>{const r=mb(30);const bx=[-98,-62,-30,0,32,66,100],Hh=[180,265,225,390,300,235,165],Wd=[40,46,52,62,52,46,38];
  return bx.map((b,i)=>({bx:b*0.6,H:Hh[i],W:Wd[i]*0.85,ph:r()*6.28,fq:0.8+r()*0.5,am:0.10+0.07*r(),lean:(b/100)*0.12+(r()-.5)*0.08,nk:r()<.5?1:-1,nk2:0.30+0.25*r()}))})();
function tongue(t,f,s,gr){const sw=Math.sin(2*Math.PI*f.fq*t*0.55+f.ph+s*3.4)*0.8+Math.sin(2*Math.PI*f.fq*t*1.13+f.ph*2.1-s*5.1)*0.35;
  const H=f.H*(1+0.06*Math.sin(2*Math.PI*0.9*t+f.ph));return[f.bx+f.am*H*sw*Math.pow(s,1.3)*gr+f.lean*H*s*s,-H*s*gr]}
function drawFire(ctx,t,cx,cy){const tf=6.55,ec=1-E.i3(cl((t-7.90)/0.25));if(t<tf||ec<0.003)return;
  ctx.save();ctx.translate(cx,cy);ctx.fillStyle=ACC.mag;
  const nicks=[];
  FT.forEach((f,i)=>{const gr=ee('ob',(t-tf-0.05*i)/0.5)*ec;if(gr<0.003)return;const n=22,L=[],R=[];
    for(let k=0;k<=n;k++){const s=k/n;const[x,y]=tongue(t,f,s,gr);const hw=f.W*(1-s)*(1+0.6*s)*(0.4+0.6*Math.sqrt(gr))*(1+0.07*Math.sin(s*9+t*3+f.ph));
      L.push([x-hw,y]);R.push([x+hw,y])}
    ctx.beginPath();L.forEach((p,k)=>k?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));for(let k=n;k>=0;k--)ctx.lineTo(R[k][0],R[k][1]);ctx.closePath();ctx.fill();
    if(f.H>200&&gr>0.6){const sn=f.nk2+0.04*Math.sin(t*1.7+f.ph);const sg=[sn-0.05,sn+0.025,sn+0.10].map(s=>{const[x,y]=tongue(t,f,s,gr);const hw=f.W*(1-s)*(1+0.6*s)*(0.4+0.6*Math.sqrt(gr));return[x,y,hw]});
      nicks.push([sg,f.nk])}});
  ctx.fillStyle=GROUND;nicks.forEach(([sg,sd])=>{ctx.beginPath();ctx.moveTo(sg[0][0]+sd*(sg[0][2]+10),sg[0][1]);ctx.lineTo(sg[1][0]+sd*sg[1][2]*0.30,sg[1][1]);ctx.lineTo(sg[2][0]+sd*(sg[2][2]+10),sg[2][1]);ctx.closePath();ctx.fill()});
  // embers
  ctx.fillStyle=ACC.mag;const er=mb(31);
  for(let j=0;j<7;j++){const per=1.7+er()*0.9,off=er(),xo=(er()-.5)*230,Hh=300+er()*220,ph=er()*6.28,len=34+er()*26;
    const p=((t/per+off)%1+1)%1;const size=ee('o3',p/0.14)*(1-E.i3(p))*ee('io3',(t-tf-0.5)/0.3)*ec;if(size<0.02)continue;
    const x=xo+26*Math.sin(2*Math.PI*(p*1.2)+ph),y=-(150+p*Hh),tilt=0.35*Math.cos(2*Math.PI*(p*1.2)+ph);
    ctx.save();ctx.translate(x,y);ctx.rotate(tilt);ctx.scale(size,size);ctx.beginPath();
    const m=14;for(let k=0;k<=m;k++){const s=k/m;const hw=7*Math.pow(Math.sin(Math.PI*s),0.9);const xx=-hw+3*Math.sin(s*5+ph)*Math.sin(Math.PI*s);k?ctx.lineTo(xx,-s*len):ctx.moveTo(xx,0)}
    for(let k=m;k>=0;k--){const s=k/m;const hw=7*Math.pow(Math.sin(Math.PI*s),0.9);ctx.lineTo(hw+3*Math.sin(s*5+ph)*Math.sin(Math.PI*s),-s*len)}ctx.closePath();ctx.fill();ctx.restore()}
  ctx.restore()}
// orange shape-shifting star
const SL5=[0,3,6,10,13],SL7=[0,2,5,7,9,12,14];
const OS=(()=>{const r=mb(32);return Array.from({length:16},(_,j)=>({ja:(r()-.5)*0.08,jl:0.88+0.24*r(),
  l5:SL5.includes(j)?[262,290,250,270,240][SL5.indexOf(j)]:0,l7:SL7.includes(j)?[270,255,285,250,275,260,245][SL7.indexOf(j)]:0,l16:(j%2?255:315)}))})();
function drawOrange(ctx,t,cx,cy){const tb=8.10,col=1-E.i3(cl((t-9.0)/0.22));if(t<tb||col<0.003)return;
  const m57=ee('io3',(t-8.48)/0.20),m716=ee('io3',(t-8.72)/0.24);
  ctx.save();ctx.translate(cx,cy);
  const rot=K(t,[[8.1,-0.5],[8.4,0,'ob'],[8.48,0],[8.62,0.12,'ob'],[8.72,0.12],[8.92,-0.06,'ob']])+0.02*Math.sin(2*Math.PI*t/1.7);ctx.rotate(rot);ctx.scale(col,col);
  const bloom=ee('ob',(t-tb)/0.3);const dd=0.5+(0.36-0.5)*m57+(0.17-0.36)*m716,cf=0.62+(0.42-0.62)*m57+(0.18-0.42)*m716;
  const r0=106*bloom;ctx.fillStyle=ACC.org;ctx.beginPath();ctx.arc(0,0,r0,0,2*Math.PI);ctx.fill();
  ctx.beginPath();for(let j=0;j<16;j++){const o=OS[j];let L=o.l5+(o.l7-o.l5)*m57;L=L+(o.l16-L)*m716;L*=o.jl*1.22;
    const gu=ee('ob8',(t-tb-0.02*((j*7)%16))/0.3);L*=gu;if(L<r0+3)continue;spike(ctx,j*Math.PI/8+o.ja,r0,L,dd,cf)}
  ctx.fill();ctx.restore()}
// green needle spikes around eyes
const GS=[0,1,2].map(e=>{const r=mb(40+e);return Array.from({length:14},(_,j)=>({a:2*Math.PI*j/14+(r()-.5)*0.25,L:0.62+0.75*r(),d:0.075+0.05*r(),dl:r()*0.28}))});
function drawGreen(ctx,t,eyes){const col=1-E.i3(cl((t-10.10)/0.25));if(t<9.45||col<0.003)return;ctx.fillStyle=ACC.grn;
  eyes.forEach((e,i)=>{const ts=9.5+0.07*i;ctx.save();ctx.translate(e.x,e.y);ctx.rotate(0.08*Math.sin(t*1.1+i)+i*0.3);ctx.scale(col,col);
    const w=e.w;const sock=0.46*w*cl(sp(t-ts,0.7,14),0,1.1);ctx.beginPath();ctx.arc(0,0,sock,0,2*Math.PI);ctx.fill();ctx.beginPath();
    GS[i].forEach(s=>{const g=Math.max(0,sp(t-ts-s.dl,0.45,17));const L=s.L*w*g;if(L<sock+2)return;spike(ctx,s.a,sock*0.95,L+0.2*w,s.d,0.25)});ctx.fill();ctx.restore()})}
// ripple bands
const TAU=(()=>{const a=[];let s=0;for(let i=0;i<=15*600;i++){const t=i/600;a.push(s);const v=t<13.2?1:1-0.8*E.io3((t-13.2)/0.5);s+=v/600}return a})();
const tauB=t=>TAU[Math.min(TAU.length-1,Math.round(t*600))];
function drawBands(ctx,t,cx,cy,o){const col=1-E.i3(cl((t-o.t1)/o.d1));if(t<o.t0||col<0.003)return;
  const tau=o.tau?o.tau(t):tauB(t);ctx.save();ctx.translate(cx,cy);
  for(let m=o.M-1;m>=0;m--){const g=ee('ob',(t-o.t0-0.07*m)/0.5)*col;if(g<0.003)continue;
    const Wm=(o.W+o.dW*m)*g,Hm=(o.H+o.dH*m)*g,amp=o.amp(t),dr=o.droop?o.droop(t):0,ph=tau*2.1-m*0.9;
    const n=48,top=[],bot=[];
    for(let i=0;i<=n;i++){const x=-1+2*i/n,ax=Math.abs(x),f=1-Math.pow(ax,1.8),e=1-x*x,dp=dr*Hm*0.95*Math.pow(ax,1.6);
      top.push([x*Wm,-Hm*f+amp*Hm*Math.sin(2*Math.PI*1.3*x+ph)*e+dp]);bot.push([x*Wm,Hm*0.8*f+amp*Hm*0.8*Math.sin(2*Math.PI*1.1*x-ph*0.8+1)*e+dp])}
    ctx.beginPath();top.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));for(let i=n;i>=0;i--)ctx.lineTo(bot[i][0],bot[i][1]);ctx.closePath();
    ctx.fillStyle=(m%2==1)?o.col:GROUND;ctx.fill()}
  ctx.restore()}
const YEL={M:6,W:150,dW:44,H:62,dH:30,col:ACC.yel,t0:10.40,t1:11.08,d1:0.22,amp:t=>0.13};
const PNK={M:4,W:150,dW:46,H:95,dH:34,col:ACC.pink,t0:11.34,t1:12.12,d1:0.22,amp:t=>0.12-0.07*E.io3(cl((t-11.6)/0.6)),droop:t=>E.io3(cl((t-11.55)/0.7))};
const BLU={M:8,W:145,dW:40,H:70,dH:34,col:ACC.blue,t0:12.38,t1:13.95,d1:0.35,amp:t=>0.15*(1-0.72*E.io3(cl((t-13.2)/0.5)))};
// drips
const DR=(()=>{const r=mb(61);return Array.from({length:5},(_,j)=>({x:[-78,-22,34,86,6][j],per:2.5+r()*0.9,off:j*0.21+r()*0.1,len:60+r()*28}))})();
function drawDrips(ctx,t,cx,cy,eyeBot,s0=11.8,s1=12.12){const col=1-E.i3(cl((t-s1)/0.2));if(t<s0||col<0.003)return;ctx.fillStyle=ACC.pink;
  DR.forEach(d=>{const p=(((t-s0)/d.per+d.off)%1+1)%1;const sz=ee('o3',p/0.18)*(1-E.i3(cl((p-0.7)/0.3)))*ee('io3',(t-s0)/0.4)*col;if(sz<0.02)return;
    const y=eyeBot-26+16*ee('o3',p/0.3)+230*(0.5-0.5*Math.cos(Math.PI*p))*p;const r=8*sz,L=d.len*sz*(0.5+0.5*ee('o3',p/0.3));
    ctx.save();ctx.translate(cx+d.x,y);ctx.beginPath();ctx.moveTo(0,-L);ctx.quadraticCurveTo(r,-L*0.35,r,0);ctx.arc(0,0,r,0,Math.PI);ctx.quadraticCurveTo(-r,-L*0.35,0,-L);ctx.closePath();ctx.fill();ctx.restore()})}
// creases
function drawCreases(ctx,t,p){const g=ee('io3',(t-12.55)/0.4)*(1-ee('io3',(t-13.3)/0.3));if(g<0.01)return;
  const hbU=p.w/2.1,hb=hbU*p.hbS,yb=p.y+(hb+0)/2;ctx.fillStyle=INK;
  [[26,0.62,0],[52,0.44,0.1]].forEach(([dy,lf,dl],i)=>{const gg=ee('io3',(t-12.55-dl)/0.4)*(1-ee('io3',(t-13.3-dl)/0.3));if(gg<0.01)return;
    const Lh=p.w*lf*gg,th=0.034*p.w*0.8;ctx.beginPath();const n=24;
    for(let k=0;k<=n;k++){const x=-Lh+2*Lh*k/n,u=x/Math.max(Lh,1e-3);const y=yb+dy+12*(1-u*u)-th*Math.pow(1-u*u,0.6);k?ctx.lineTo(p.x+x,y):ctx.moveTo(p.x+x,y)}
    for(let k=n;k>=0;k--){const x=-Lh+2*Lh*k/n,u=x/Math.max(Lh,1e-3);ctx.lineTo(p.x+x,yb+dy+12*(1-u*u)+th*Math.pow(1-u*u,0.6))}ctx.closePath();ctx.fill()})}

function act2(ctx,t){
  const A=ev(TA,t,11),B=ev(TB,t,29),E2=ev(TE2,t,37),E3=ev(TE3,t,53);
  const br=breath(t);B.sc*=br;E2.sc*=br;E3.sc*=br;A.sc*=br;
  let bl=0;for(const[b0,d]of BLINKS){const u=(t-b0)/d;if(u>0&&u<1)bl=Math.max(bl,Math.pow(Math.sin(Math.PI*u),2))}B.bl=Math.max(B.bl,bl);
  const dr=(o,s)=>{o.gx+=0.05*Math.sin(2*Math.PI*t*0.37+s)*pw(t);o.gy+=0.04*Math.sin(2*Math.PI*t*0.29+s*2)*pw(t)};dr(B,1);dr(A,2);dr(E2,3);dr(E3,4);
  // accents (behind)
  drawRedStar(ctx,t,B.x+58,B.y-62);
  {const L=lidWorld(B);ctx.save();ctx.beginPath();ctx.moveTo(-4000,L[0][1]);L.forEach(q=>ctx.lineTo(q[0],q[1]));ctx.lineTo(4000,L[L.length-1][1]);ctx.lineTo(4000,-4000);ctx.lineTo(-4000,-4000);ctx.closePath();ctx.clip();drawFire(ctx,t,B.x,B.y-25);ctx.restore()}
  drawOrange(ctx,t,B.x,B.y-12);
  drawGreen(ctx,t,[B,E2,E3]);
  drawBands(ctx,t,B.x,B.y+4,YEL);drawBands(ctx,t,B.x,B.y+8,PNK);drawBands(ctx,t,B.x,B.y+6,BLU);
  drawDrips(ctx,t,B.x,B.y,B.y+B.w/2.1*B.hbS/2);
  // eyes
  if(t>=9.35&&t<10.70){drawEye(ctx,E2);drawEye(ctx,E3)}
  if(t<6.25)drawEye(ctx,A);
  drawEye(ctx,B);
}

// ---------- time warp (new time T -> original time t) ----------
const SEGS=[[8.20,[[4.10,4.65,1.0],[4.65,4.75,0.2],[4.75,5.25,0.95],[5.25,5.30,0.1],[5.30,6.15,1.45],[6.15,6.20,0.5],
 [6.20,6.65,1.0],[6.65,7.10,0.9],[7.10,7.90,1.5],
 [7.90,8.30,0.7],[8.30,8.48,0.45],[8.48,8.68,0.35],[8.68,8.72,0.2],[8.72,8.96,0.4],[8.96,9.00,0.1],
 [9.00,9.42,0.8],[9.42,9.92,0.8],[9.92,10.10,0.6],
 [10.10,10.62,0.9],[10.62,11.15,1.2],[11.15,11.60,0.9],[11.60,12.20,1.3],
 [12.20,12.60,0.7],[12.60,13.30,1.2],[13.30,13.80,0.9],[13.80,13.95,0.6],
 [13.95,14.33,0.8],[14.33,14.60,0.5],[14.60,15.0,0.8]]]];
const AN=[[0,0],[0.7,0.35],[4.6,2.30],[5.8,2.90],[6.6,3.30],[8.2,4.10]];
{let T=8.2;for(const sg of SEGS[0][1]){T+=sg[2];AN.push([T,sg[1]])}}
const NT=30*600+1,WT=new Float64Array(NT);
{const v=new Float64Array(NT);let k=0;for(let i=0;i<NT;i++){const T=i/600;while(k<AN.length-2&&T>=AN[k+1][0])k++;v[i]=(AN[k+1][1]-AN[k][1])/(AN[k+1][0]-AN[k][0])}
 const sig=0.07*600,hw=Math.ceil(sig*3),ker=[];let ks=0;for(let j=-hw;j<=hw;j++){const g=Math.exp(-j*j/(2*sig*sig));ker.push(g);ks+=g}
 const vs=new Float64Array(NT);for(let i=0;i<NT;i++){let a=0;for(let j=-hw;j<=hw;j++){const ii=Math.min(NT-1,Math.max(0,i+j));a+=ker[j+hw]*v[ii]}vs[i]=a/ks}
 let acc=0;for(let i=0;i<NT;i++){WT[i]=acc;acc+=vs[i]/600}
 const res=AN.map(a=>a[1]-WT[Math.min(NT-1,Math.round(a[0]*600))]);
 let m=0;for(let i=0;i<NT;i++){const T=i/600;while(m<AN.length-2&&T>=AN[m+1][0])m++;const u=(T-AN[m][0])/(AN[m+1][0]-AN[m][0]);WT[i]+=res[m]+(res[m+1]-res[m])*u}}
const warp=T=>{const x=T*600,i=Math.min(NT-2,Math.floor(x));return WT[i]+(WT[i+1]-WT[i])*(x-i)};
// ================= ACT 3 (T>=15.8), re-ordered =================
const ex=(o,tr,T)=>{for(const k in tr)o[k]=K(T,tr[k]);return o};
function blinkAt(T,list){let b=0;for(const[b0,d]of list){const u=(T-b0)/d;if(u>0&&u<1)b=Math.max(b,Math.pow(Math.sin(Math.PI*u),2))}return b}
const T0=15.8,SH=2.25,tS=warp(T0);
const HB={
x:[[0,960],[16.2,960],[16.7,905,'io3'],[17.2,1010,'io3'],[17.65,960,'io3'],[22.75,960],[23.3,755,'ob'],[24.75,755],[25.35,960,'io5']],
y:[[0,540],[22.75,540],[23.3,460,'ob'],[24.75,460],[25.35,540,'io5']],
w:[[0,250],[22.75,250],[23.3,215,'io3'],[24.75,215],[25.35,250,'io3']],
htR:[[0,0.88],[16.05,0.88],[16.6,0.3,'io3'],[17.78,0.3],[17.97,0,'o5'],[20.15,0],[20.85,0.5,'io3'],[22.1,0.5],[22.6,0.3,'io3'],[25.35,0.3],[25.95,0.28,'io3'],[27.2,0.28],[27.9,0.42,'io3'],[30,0.42]],
hbS:[[0,1],[16.05,1],[16.6,0.62,'io3'],[17.4,0.62],[17.97,1,'io3'],[22.1,1],[22.6,0.62,'io3'],[24.75,0.62],[25.35,1,'io3'],[30,1]],
k:[[0,0],[16.05,0],[16.6,0.05,'io3'],[17.78,0.05],[18.0,-0.40,'ob'],[20.15,-0.40],[20.85,0.34,'io3'],[22.1,0.34],[22.6,0,'io3'],[30,0]],
rot:[[0,0],[17.78,0],[17.93,-0.06,'o3'],[18.5,0,'io3'],[22.75,0],[23.3,-0.2,'io3'],[24.75,-0.2],[25.35,0,'io3']],
gx:[[0,0.05],[16.05,0.05],[16.55,0.9,'io3'],[16.8,0.9],[17.0,-0.85,'io3'],[17.4,-0.85],[17.6,0,'io3'],[17.78,0],[18.0,0.1,'o3'],[22.1,0.1],[22.6,0,'io3'],[23.3,0],[23.65,-0.5,'io3'],[24.75,-0.5],[25.35,0,'io3'],[25.95,0.3,'io3'],[26.5,-0.6,'io3'],[27.1,-0.6],[27.6,0.5,'io3'],[27.9,0,'io3'],[30,0]],
gy:[[0,-0.7],[16.05,-0.7],[16.55,-0.1,'io3'],[17.6,-0.1],[18.0,0.35,'o3'],[20.15,0.35],[20.85,-0.5,'io3'],[22.1,-0.5],[22.6,-0.1,'io3'],[25.35,-0.1],[25.95,0,'io3'],[27,0.1,'io3'],[27.9,0.55,'io3'],[30,0.55]],
pr:[[0,1.12],[16.05,1.12],[16.55,0.72,'io3'],[17.6,0.72],[18.0,0.6,'o3'],[20.15,0.6],[20.85,1.3,'io3'],[22.1,1.3],[22.6,0.72,'io3'],[24.75,0.72],[25.35,1.0,'io3'],[25.95,0.85,'io3'],[27.9,0.8,'io3'],[30,0.8]],
cat:[[0,1],[16.05,1],[16.3,0,'i3'],[20.5,0],[21.0,1,'o3'],[22.0,1],[22.25,0,'i3'],[30,0]],
c:[[0,0],[22.1,0],[22.6,1,'io3'],[22.8,1],[23.3,0,'io3'],[29.05,0],[29.3,1,'io3']],
cv:[[0,0],[22.1,0],[22.6,1,'io3'],[22.8,1],[23.3,0,'io3'],[29.05,0],[29.3,1,'io3']],
rcO:[[0,64],[28.9,64],[29.3,26,'io3']],
bl:[[0,0],[28.95,0],[29.12,1,'io3']]};
function mkE2(x1,y1,wf,rot,gx,gy,ht,dl){const a=20.5+dl,b=21.05+dl;return{
x:[[0,960],[a,960],[b,x1,'ob'],[22.5,x1],[23.1,960,'io5']],y:[[0,540],[a,540],[b,y1,'ob'],[22.5,y1],[23.1,540,'io5']],
w:[[0,250],[a,250],[b,wf,'io3'],[22.5,wf],[23.1,250,'io3']],
c:[[0,1],[a,1],[b,0,'io3'],[30,0]],cv:[[0,1],[a,1],[b,0,'io3'],[30,0]],rcO:[[0,64],[30,64]],
htR:[[0,0],[20.9,0],[21.3+dl,ht,'io3'],[22.5,ht],[23.1,0.3,'io3']],hbS:[[0,1],[a,1],[b,0.62,'io3'],[22.5,0.62],[23.1,1,'io3']],
rot:[[0,0],[a,0],[b,rot,'io3'],[22.5,rot],[23.1,0,'io3']],
gx:[[0,0],[21.0,0],[21.4+dl,gx,'io3'],[22.5,gx],[23.1,0,'io3']],gy:[[0,0],[21.0,0],[21.4+dl,gy,'io3'],[22.5,gy],[23.1,-0.1,'io3']],
pr:[[0,1],[a,1],[b,0.72,'io3'],[22.5,0.72],[23.1,1,'io3']]}}
const HE2=mkE2(1175,505,185,0.12,0.7,0.1,0.25,0.06),HE3=mkE2(945,680,240,0.26,0.1,-0.5,0.2,0.12);
const YEL3={M:6,W:150,dW:44,H:62,dH:30,col:ACC.yel,t0:16.20,t1:17.55,d1:0.25,amp:t=>0.13,tau:T=>T*1.1};
function drawGreen2(ctx,T,eyes){const rt=1-E.io3(cl((T-22.5)/0.5));if(T<20.55||rt<0.003)return;ctx.fillStyle=ACC.grn;
  eyes.forEach((e,i)=>{const ts=20.55+0.07*i;ctx.save();ctx.translate(e.x,e.y);ctx.rotate(0.08*Math.sin(T*1.1+i)+i*0.3);
    const w=e.w;const sock=0.46*w*cl(sp(T-ts,0.7,14),0,1.1)*rt;ctx.beginPath();ctx.arc(0,0,sock,0,2*Math.PI);ctx.fill();ctx.beginPath();
    GS[i].forEach(s=>{const g=Math.max(0,sp(T-ts-s.dl,0.45,17));const L=s.L*w*g*rt;if(L<sock+2)return;spike(ctx,s.a,sock*0.95,L+0.2*w*rt,s.d,0.25)});ctx.fill();ctx.restore()})}
const PSH=2.7;
const PNK3={M:5,W:150,dW:42,H:64,dH:28,col:ACC.pink,t0:23.0,t1:24.5,d1:0.22,amp:T=>0.12-0.07*E.io3(cl((T-23.25)/0.6)),droop:T=>0.4*E.io3(cl((T-23.3)/1.7)),tau:T=>T*1.1};
const rl=T=>E.io3(cl((T-26.9)/0.9));
const TBL=(()=>{const a=[];let s=0;for(let i=0;i<=30*600;i++){const T=i/600;a.push(s);s+=(1-0.78*rl(T))*0.8/600}return a})();
const tauBl=T=>TBL[Math.min(TBL.length-1,Math.round(T*600))];
const BLU2={M:8,W:145,dW:40,H:70,dH:34,col:ACC.blue,t0:25.30,t1:28.2,d1:0.65,amp:T=>(0.15+0.04*Math.sin(2*Math.PI*(T-25.3)/1.9)*(1-rl(T)))*(1-0.72*rl(T)),tau:tauBl};
const tO=T=>K(T,[[18.0,8.10],[19.85,9.0,'io3'],[20.15,9.22,'o3']]);
function act3(ctx,T){
  const B=ex(Object.assign({},BASE,{seed:29}),HB,T);
  const A1=1-E.io3(cl((T-T0)/0.6)),A2=E.io3(cl((T-25.75)/0.5))*(1-E.io3(cl((T-28.2)/0.4)));
  B.sc=1+0.010*Math.sin(2*Math.PI*(tS+(T-T0)*0.55)/2.7)*A1+0.010*Math.sin(2*Math.PI*T/2.7)*A2;
  B.gx+=0.05*Math.sin(2*Math.PI*tS*0.37+1)*A1;B.gy+=0.04*Math.sin(2*Math.PI*tS*0.29+2)*A1;
  B.bl=Math.max(B.bl,blinkAt(T,[[24.15,0.26],[26.8,0.34]]));
  const Tg=T-SH;
  const E2=ex(Object.assign({},BASE,{seed:37}),HE2,Tg),E3=ex(Object.assign({},BASE,{seed:53}),HE3,Tg);
  E2.sc=E3.sc=K(Tg,[[0,1],[22.95,1],[23.1,0.9]]);E2.bl=E3.bl=blinkAt(Tg,[[21.9,0.26]]);
  // fire collapsing behind the eye (clipped to above the lid line)
  if(T<16.35){const t=warp(T);const L=lidWorld(B);ctx.save();ctx.beginPath();ctx.moveTo(-4000,L[0][1]);L.forEach(q=>ctx.lineTo(q[0],q[1]));ctx.lineTo(4000,L[L.length-1][1]);ctx.lineTo(4000,-4000);ctx.lineTo(-4000,-4000);ctx.closePath();ctx.clip();drawFire(ctx,t,B.x,B.y-25);ctx.restore()}
  drawBands(ctx,T,B.x,B.y+4,YEL3);
  if(T>=18&&T<20.4)drawOrange(ctx,tO(T),B.x,B.y-12);
  drawBands(ctx,T+PSH,B.x,B.y+8,PNK3);
  drawDrips(ctx,T+PSH,B.x,B.y,B.y+B.w/2.1*B.hbS/2,23.4,24.5);
  drawGreen2(ctx,Tg,[B,E2,E3]);
  {const pz=1+0.02*Math.sin(2*Math.PI*(T-25.3)/1.9)*(1-rl(T))*cl((T-25.3)/0.5);ctx.save();ctx.translate(B.x,B.y+6);ctx.scale(pz,pz);ctx.translate(-B.x,-(B.y+6));drawBands(ctx,T,B.x,B.y+6,BLU2);ctx.restore()}
  if(T>=22.6&&T<25.37){drawEye(ctx,E3);drawEye(ctx,E2)}
  drawEye(ctx,B);
}
let ctx=null,BT=[1,0,0,1,0,0],CW=W,CH=H;
const c0=(()=>{const u0=(tS-4.1)/10.5,e0=Math.pow(Math.sin(Math.PI*u0),3);return 1+0.018*e0*(0.65+0.35*Math.sin(2*Math.PI*tS/3.3))})();
function render(frame){
  const T=frame/60,t=warp(T);
  ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,CW,CH);ctx.setTransform(...BT);
  if(frame===492||frame>=1758){drawDot(ctx,26);return}
  if(T>=T0){const cam=1+(c0-1)*(1-E.io3(cl((T-T0)/1.2)));
    ctx.translate(CX,CY);ctx.scale(cam,cam);ctx.translate(-CX,-CY);act3(ctx,T);return}
  let cam=1;
  if(t<4.1){const u=cl((t-0.35)/3.75);cam=1+0.012*Math.pow(Math.sin(Math.PI*u),2)}
  else{const u=cl((t-4.1)/10.5),env=Math.pow(Math.sin(Math.PI*u),3);cam=1+0.018*env*(0.65+0.35*Math.sin(2*Math.PI*t/3.3))}
  ctx.translate(CX,CY);ctx.scale(cam,cam);ctx.translate(-CX,-CY);
  if(t<0.35)return;
  if(t<4.1)act1(ctx,t);else act2(ctx,t);
}


export const STAGE = { W, H, CX, CY, GROUND, INK, ACC };
export const LOADER_END = 492 / 60; // frame 492 is the dot
export const LOOP_END = 1758 / 60; // from frame 1758 on, the same dot again

/** Draw frame `frame` (0-1799) to `context`; `base` maps stage units to canvas pixels. */
export function drawEyeFrame(context, frame, base, width, height) {
  ctx = context;
  BT = base;
  CW = width;
  CH = height;
  render(Math.max(0, Math.min(1799, Math.round(frame))));
}
