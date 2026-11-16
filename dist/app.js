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


// Private repast RSVP: calculated totals, conditional City of Gary count, and secure submission.
// An RSVP is recorded only after the private server returns a success response.
const repastPageLoadedAt = Date.now();
const repastForm = document.querySelector('#repast-rsvp-form');
if (repastForm) {
  const garyValue = 'City of Gary (coworker or colleague)';
  const garyFields = document.querySelector('#rsvp-gary-fields');
  const garyCountField = repastForm.elements.namedItem('garyCount');
  const departmentField = repastForm.elements.namedItem('department');
  const adultsField = repastForm.elements.namedItem('adults');
  const childrenField = repastForm.elements.namedItem('children');
  const totalLabel = document.querySelector('#repast-total');
  const status = document.querySelector('#repast-rsvp-status');
  const button = document.querySelector('#repast-submit');

  const countValue = field => {
    const raw = String(field.value ?? '').trim();
    if (!/^\\d+$/.test(raw)) return NaN;
    const n = Number(raw);
    return Number.isSafeInteger(n) ? n : NaN;
  };
  const selectedConnection = () =>
    repastForm.querySelector('input[name="primaryConnection"]:checked')?.value || '';
  const totalGuests = () => countValue(adultsField) + countValue(childrenField);

  function validateGaryCount() {
    garyCountField.setCustomValidity('');
    if (selectedConnection() !== garyValue) return true;
    const count = countValue(garyCountField);
    const total = totalGuests();
    if (!Number.isSafeInteger(count) || count < 1 ||
        !Number.isSafeInteger(total) || count > total) {
      garyCountField.setCustomValidity('Enter at least 1 City of Gary colleague, not more than your total attending.');
      return false;
    }
    return true;
  }

  function updateTotals() {
    const adults = countValue(adultsField);
    const children = countValue(childrenField);
    if (Number.isSafeInteger(adults) && adults >= 1 &&
        Number.isSafeInteger(children) && children >= 0 &&
        Number.isSafeInteger(adults + children)) {
      totalLabel.textContent = 'Total attending: ' + (adults + children) +
        ' (' + adults + ' adult' + (adults === 1 ? '' : 's') +
        ', ' + children + ' child' + (children === 1 ? '' : 'ren') + ')';
    } else {
      totalLabel.textContent = 'Enter your adult and child counts to calculate your total.';
    }
    validateGaryCount();
  }

  function updateGaryFields() {
    const selected = selectedConnection() === garyValue;
    garyFields.hidden = !selected;
    garyCountField.disabled = !selected;
    garyCountField.required = selected;
    departmentField.disabled = !selected;
    if (!selected) {
      garyCountField.value = '';
      departmentField.value = '';
    }
    updateTotals();
  }

  repastForm.querySelectorAll('input[name="primaryConnection"]').forEach(input => {
    input.addEventListener('change', updateGaryFields);
  });
  for (const field of [adultsField, childrenField, garyCountField]) {
    field.addEventListener('input', updateTotals);
    field.addEventListener('change', updateTotals);
  }
  updateGaryFields();

  repastForm.addEventListener('submit', async event => {
    event.preventDefault();
    updateTotals();
    if (!repastForm.reportValidity() || !validateGaryCount()) {
      status.textContent = 'Please complete the required fields and check your adult, child, and City of Gary counts.';
      return;
    }
    const fd = new FormData(repastForm);
    const val = key => String(fd.get(key) || '').trim();
    const adults = countValue(adultsField);
    const children = countValue(childrenField);
    const total = adults + children;
    const connection = selectedConnection();
    const isGary = connection === garyValue;
    const garyCount = isGary ? countValue(garyCountField) : null;
    if (!val('contactName') || !val('contactEmail') || !connection ||
        !Number.isSafeInteger(adults) || adults < 1 ||
        !Number.isSafeInteger(children) || children < 0 ||
        !Number.isSafeInteger(total) || total > 500 ||
        (isGary && (!Number.isSafeInteger(garyCount) || garyCount < 1 || garyCount > total))) {
      status.textContent = 'Please check the required fields and your headcounts.';
      return;
    }

    const payload = {
      contactName: val('contactName'),
      contactEmail: val('contactEmail'),
      contactPhone: val('contactPhone'),
      primaryConnection: connection,
      garyCount: isGary ? garyCount : null,
      department: isGary ? val('department') : '',
      adults,
      children,
      guestNames: val('guestNames'),
      website: val('website'),
      pageLoadedAt: repastPageLoadedAt
    };

    repastForm.setAttribute('aria-busy', 'true');
    button.disabled = true;
    button.textContent = 'Saving Your RSVP…';
    status.classList.remove('rsvp-confirmed');
    status.textContent = 'Saving your RSVP securely…';

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 18000);
      let response;
      try {
        response = await fetch('https://zikpbudiofzapoiqaqpm.supabase.co/functions/v1/lynda-repast-rsvp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          mode: 'cors',
          cache: 'no-store',
          body: JSON.stringify(payload),
          signal: controller.signal
        });
      } finally {
        clearTimeout(timeout);
      }
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok !== true) {
        throw new Error(result.error || 'We could not save your RSVP. Please try again.');
      }
      const reference = String(result.reference || '').slice(0, 8).toUpperCase();
      status.textContent = 'RSVP RECEIVED — ' + adults +
        ' adult' + (adults === 1 ? '' : 's') + ', ' + children +
        ' child' + (children === 1 ? '' : 'ren') + ' (' + total +
        ' attending). Reference: ' + reference +
        '. Thank you. We will use your response only to plan this event.';
      status.classList.add('rsvp-confirmed');
      button.textContent = 'RSVP Received ✓';
      repastForm.querySelectorAll('input, textarea').forEach(field => field.disabled = true);
      status.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (error) {
      status.textContent = error instanceof Error
        ? error.message : 'Could not save your RSVP. Please try again.';
      button.disabled = false;
      button.textContent = 'Try Submitting Again';
    } finally {
      repastForm.removeAttribute('aria-busy');
    }
  });
}
