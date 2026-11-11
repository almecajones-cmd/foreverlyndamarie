const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
function closeMenu(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
nav.addEventListener('click',event=>{if(event.target.closest('a')){closeMenu();nav.querySelectorAll('details').forEach(d=>d.open=false);}});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeMenu();nav.querySelectorAll('details').forEach(d=>d.open=false);toggle.focus();}});
document.querySelector('#copy-address')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(document.querySelector('#delivery-address').innerText);document.querySelector('#copy-status').textContent='Address copied';}catch{document.querySelector('#copy-status').textContent='Please select and copy the address above.';}});
const sectionObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){document.querySelectorAll('nav a').forEach(a=>{if(a.hash==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}}},{rootMargin:'-15% 0px -65% 0px'});document.querySelectorAll('main section[id]').forEach(s=>sectionObserver.observe(s));

// Contact form composes a private email in the visitor's own email application.
// No message is stored or submitted to this site.
document.querySelector('#family-contact')?.addEventListener('submit',event=>{
  event.preventDefault();
  const form=event.currentTarget;
  if(!form.reportValidity())return;
  const fd=new FormData(form);
  const name=String(fd.get('name')||'').trim();
  const email=String(fd.get('email')||'').trim();
  const question=String(fd.get('question')||'').trim();
  if(!name||!email||!question)return;
  const subject='Question about Lynda Marie Jones memorial service';
  const body='From: '+name+'\\nEmail: '+email+'\\n\\n'+question;
  window.location.href='mailto:almecajones@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body.replaceAll('\\n','\n'));
});
