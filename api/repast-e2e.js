// Disposable private preview-only end-to-end test; remove after verification.
export default async function handler(req,res) {
  if (req.method !== 'GET') return res.status(405).json({error:'method'});
  if (req.query.run !== 'headcounts') return res.status(403).json({error:'not-available'});
  const endpoint='https://zikpbudiofzapoiqaqpm.supabase.co/functions/v1/lynda-repast-rsvp';
  const base={
    contactName:'Lynda RSVP Synthetic Test',
    contactEmail:'lynda-v3-gary-integration-20261115@example.invalid',
    contactPhone:'',
    primaryConnection:'City of Gary (coworker or colleague)',
    adults:2,children:2,garyCount:1,department:'Police',
    guestNames:'',website:'',pageLoadedAt:Date.now()-60000
  };
  try {
    const send=async data=>{
      const r=await fetch(endpoint,{method:'POST',
        headers:{'Content-Type':'application/json','Origin':'https://www.foreverlyndamarie.com'},
        body:JSON.stringify(data)});
      return {status:r.status,result:await r.json()};
    };
    const valid=await send(base);
    const invalid=await send({...base,contactEmail:'lynda-v3-invalid-integration-20261115@example.invalid',garyCount:5});
    return res.status(200).json({
      mixedParty:{status:valid.status,saved:valid.result.ok===true,
        adultMeals:valid.result.adults,childMeals:valid.result.children,total:valid.result.guests},
      impossibleGary:{status:invalid.status,rejected:invalid.result.ok!==true},
    });
  } catch(e) {
    return res.status(500).json({error:e instanceof Error?e.message:'connection'});
  }
}