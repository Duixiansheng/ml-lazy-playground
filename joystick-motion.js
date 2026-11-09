(() => {
  const home = document.querySelector('.home');
  const knob = document.querySelector('.button-wrapper');
  const base = document.querySelector('.around');
  if (!knob || !base || home.hidden) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0, pointer = null;
  let entering = true;
  knob.style.transition = 'transform 1.15s cubic-bezier(.16,1,.3,1)';
  knob.style.transform = 'translate(0,0) rotateX(0) rotateY(0)';
  try {
    const saved = JSON.parse(sessionStorage.getItem('cover-pointer'));
    sessionStorage.removeItem('cover-pointer');
    if(saved && Date.now()-saved.time<10000) pointer={x:saved.x*innerWidth,y:saved.y*innerHeight};
  } catch {}
  setTimeout(()=>{if(pointer)render();},650);
  setTimeout(()=>{entering=false;knob.style.removeProperty('transition');},1900);
  function reset() {
    pointer = null;
    cancelAnimationFrame(frame);
    frame = 0;
    knob.style.removeProperty('transform');
  }
  function render() {
    frame = 0;
    if (!pointer || reduced.matches) return;
    const box = base.getBoundingClientRect();
    const cx = box.left + box.width / 2, cy = box.top + box.height / 2;
    const x = Math.max(-1, Math.min(1, (pointer.x - cx) / Math.max(1, pointer.x < cx ? cx : innerWidth - cx)));
    const y = Math.max(-1, Math.min(1, (pointer.y - cy) / Math.max(1, pointer.y < cy ? cy : innerHeight - cy)));
    knob.style.transform = 'translate(' + (x * 18) + 'px,' + (y * 18) + 'px) rotateX(' + (-y * 22) + 'deg) rotateY(' + (x * 22) + 'deg)';
  }
  window.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || reduced.matches) return;
    pointer = {x:event.clientX, y:event.clientY};
    if (!entering && !frame) frame = requestAnimationFrame(render);
  }, {passive:true});
  document.documentElement.addEventListener('pointerleave', reset);
  window.addEventListener('blur', reset);
  reduced.addEventListener('change', reset);
})();
