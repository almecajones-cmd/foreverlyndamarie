const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
function closeMenu(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
nav.addEventListener('click',event=>{if(event.target.closest('a')){closeMenu();nav.querySelectorAll('details').forEach(d=>d.open=false);}});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeMenu();nav.querySelectorAll('details').forEach(d=>d.open=false);toggle.focus();}});
