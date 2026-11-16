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


// Repast RSVPs: compose a consistently structured email for private family seating counts.
// This form does not claim to register an RSVP or store personal information.
document.querySelector('#repast-rsvp-form')?.addEventListener('submit',event=>{
  event.preventDefault();
  const form=event.currentTarget;
  if(!form.reportValidity())return;
  const fd=new FormData(form);
  const val=name=>String(fd.get(name)||'').trim();
  const contact=val('contactName');
  const email=val('contactEmail');
  const count=Number(val('partyCount'));
  const names=val('guestNames');
  const primary=val('primaryConnection');
  const others=fd.getAll('connections').map(v=>String(v)).join(', ')||'None indicated';
  const notes=val('seatingNotes')||'None indicated';
  if(!contact||!email||!names||!primary||!Number.isInteger(count)||count<1||count>20)return;
  const subject='Lynda Marie Jones Repast RSVP | '+primary+' | '+count+' guest'+(count===1?'':'s');
  const body=[
    'REPAST RSVP – LYNDA MARIE JONES',
    'Monday, November 23, 2026',
    'Innsbrook Country Club, Merrillville, Indiana',
    'Repast 1:30–3:30 PM CST | Seated by 1:15 PM CST',
    '',
    'RSVP Contact: '+contact,
    'Email: '+email,
    'Total guests (including contact): '+count,
    'Names of ALL guests:',
    names,
    '',
    'Primary relationship to Lynda: '+primary,
    'Other connections: '+others,
    'Seating or group details: '+notes,
    '',
    'Please confirm our RSVP and seating details. Thank you.'
  ].join('\n');
  const status=document.querySelector('#repast-rsvp-status');
  if(status) status.textContent='Your email application should open. Please press Send to deliver your RSVP. It is not submitted or confirmed on this website.';
  window.location.href='mailto:almecajones@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
});
