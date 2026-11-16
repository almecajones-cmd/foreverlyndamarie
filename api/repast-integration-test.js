// One-time synthetic integration check. This file only exists on a preview branch.
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({error:'method'});
  try {
    const response = await fetch('https://zikpbudiofzapoiqaqpm.supabase.co/functions/v1/lynda-repast-rsvp', {
      method:'POST',
      headers:{'Content-Type':'application/json','Origin':'https://www.foreverlyndamarie.com'},
      body:JSON.stringify({
        contactName:'Memorial RSVP Integration Test',
        contactEmail:'lynda-rsvp-preview-test-20261115@example.invalid',
        partyCount:2,
        guestNames:'Memorial RSVP Integration Test\nTest Companion',
        primaryConnection:'City of Gary — Police Department coworker',
        otherConnections:['Church family'],
        seatingNotes:'Automated integration test. Will be deleted.',
        dietaryNotes:'',
        website:'',
        pageLoadedAt:Date.now()-10000
      })
    });
    const result = await response.json().catch(() => ({error:'non-JSON'}));
    return res.status(200).json({apiStatus:response.status, saved:result.ok===true,error:result.error||null});
  } catch(e) {
    return res.status(500).json({error:e instanceof Error?e.message:'network failure'});
  }
}