(()=>{
if(document.querySelector('.home').hidden)return;
const canvas=document.createElement('canvas');canvas.className='edge-waves';canvas.setAttribute('aria-hidden','true');document.body.prepend(canvas);const ctx=canvas.getContext('2d');if(!ctx)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let w=0,h=0,mouse=null,frame=0;
function draw(){frame=0;ctx.clearRect(0,0,w,h);ctx.lineWidth=1;ctx.strokeStyle='rgba(89,125,115,.22)';
for(let side=0;side<4;side++){const len=side<2?h:w;for(let line=0;line<7;line++){ctx.beginPath();for(let t=-10;t<=len+10;t+=5){const depth=8+line*7+Math.sin(t/75+line*.38)*8+Math.sin(t/170)*5;let x,y;if(side===0){x=depth;y=t}else if(side===1){x=w-depth;y=t}else if(side===2){x=t;y=depth}else{x=t;y=h-depth}if(t===-10)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.stroke();}}
if(mouse&&!reduced.matches){ctx.globalCompositeOperation='destination-out';const g=ctx.createRadialGradient(mouse.x,mouse.y,35,mouse.x,mouse.y,180);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(.45,'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);ctx.globalCompositeOperation='source-over';}}
function schedule(){if(!frame)frame=requestAnimationFrame(draw)}
function resize(){w=innerWidth;h=innerHeight;const d=Math.min(devicePixelRatio,2);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);schedule()}
window.addEventListener('resize',resize);window.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;mouse={x:e.clientX,y:e.clientY};schedule()},{passive:true});document.documentElement.addEventListener('pointerleave',()=>{mouse=null;schedule()});window.addEventListener('blur',()=>{mouse=null;schedule()});reduced.addEventListener('change',schedule);resize();
})();