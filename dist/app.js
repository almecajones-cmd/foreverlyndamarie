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


// Private repast RSVP submission. Only a successful server response counts as saved.
const repastPageLoadedAt = Date.now();
document.querySelector('#repast-rsvp-form')?.addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.querySelector('#repast-rsvp-status');
  const button = document.querySelector('#repast-submit');
  if (!form.reportValidity()) {
    if (status) status.textContent = 'Please complete the required fields before submitting.';
    return;
  }
  const fd = new FormData(form);
  const val = name => String(fd.get(name) || '').trim();
  const count = Number(val('partyCount'));
  const payload = {
    contactName: val('contactName'),
    contactEmail: val('contactEmail'),
    contactPhone: val('contactPhone'),
    partyCount: count,
    guestNames: val('guestNames'),
    primaryConnection: val('primaryConnection'),
    otherConnections: fd.getAll('connections').map(String),
    seatingNotes: val('seatingNotes'),
    dietaryNotes: val('dietaryNotes'),
    website: val('website'),
    pageLoadedAt: repastPageLoadedAt
  };
  if (!payload.contactName || !payload.contactEmail || !payload.guestNames ||
      !payload.primaryConnection || !Number.isInteger(count) || count < 1 || count > 20) {
    if (status) status.textContent = 'Please check your name, email, party size, guest names, and connection to Lynda.';
    return;
  }
  form.setAttribute('aria-busy', 'true');
  button.disabled = true;
  button.textContent = 'Saving Your RSVP…';
  if (status) status.textContent = 'Saving your RSVP securely…';
  try {
    const ctrl = new AbortController();
    const timeoutId = setTimeout(() => ctrl.abort(), 18000);
    let response;
    try {
      response = await fetch('https://zikpbudiofzapoiqaqpm.supabase.co/functions/v1/lynda-repast-rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        cache: 'no-store',
        body: JSON.stringify(payload),
        signal: ctrl.signal
      });
    } finally {
      clearTimeout(timeoutId);
    }
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.ok !== true) {
      throw new Error(result.error || 'We could not save your RSVP. Please try again.');
    }
    const reference = String(result.reference || '').slice(0, 8).toUpperCase();
    if (status) {
      status.textContent = 'RSVP RECEIVED — ' + count + ' guest' + (count === 1 ? '' : 's') +
        ' saved for repast planning. Reference: ' + reference +
        '. Thank you. The family will use your response for seating and meal counts. This is not a table assignment.';
      status.classList.add('rsvp-confirmed');
    }
    button.textContent = 'RSVP Received ✓';
    form.querySelectorAll('input, select, textarea').forEach(field => field.disabled = true);
    status?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (error) {
    if (status) status.textContent = error instanceof Error ? error.message : 'Could not save RSVP. Please try again.';
    button.disabled = false;
    button.textContent = 'Try Submitting Again';
  } finally {
    form.removeAttribute('aria-busy');
  }
});
