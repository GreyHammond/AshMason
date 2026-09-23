const nav = document.querySelector('.nav');
let last = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.style.background = y > 40 ? 'rgba(5,6,8,.9)' : 'rgba(5,6,8,.72)';
  last = y;
}, {passive:true});
