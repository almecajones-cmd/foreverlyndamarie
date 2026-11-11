from pathlib import Path
import json,re
from datetime import datetime
from zoneinfo import ZoneInfo
from bs4 import BeautifulSoup
p=Path(__file__).parent;c=json.loads((p/'event-config.json').read_text());out=p/'dist'
s=BeautifulSoup((out/'index.html').read_text(),'html.parser')
for t in s.find_all(string=True):
 if t.__class__.__name__ in ('Doctype','Comment'): continue
 t.replace_with(str(t).replace('Central Standard Time','Central Time').replace('CST','CT').replace('EST','ET'))
def fragment(markup):return BeautifulSoup(markup,'html.parser')
attire=c['attire']
s.select_one('.attire').clear();s.select_one('.attire').append(fragment('<h3>Attire &amp; Color Guidance</h3><p>'+attire+'</p>'))
nav=s.select_one('nav');nav.select_one('.more').decompose()
for href,label in [('fuchsia','A Touch of Fuchsia'),('sympathy','Expressions of Sympathy')]:nav.append(fragment(f'<a href="#{href}">{label}</a>'))
s.select_one('.menu-toggle').string='Menu';s.select_one('.skip').string='Skip to main content';s.select_one('main')['tabindex']='-1'
church=c['venues'][0];cem=c['venues'][1]
from urllib.parse import quote
churchmap='https://www.google.com/maps/search/?api=1&query='+quote(church['name']+', '+church['address'])
cemmap='https://www.google.com/maps/search/?api=1&query='+quote(cem['name']+', '+cem['address'])
button=s.select_one('.hero .outline');button.clear();button.string='Directions to the Service';button['href']=churchmap
s.select_one('.hero .legacy').insert_after(fragment(f'<p class="essentials">{c["dateLabel"]} · Visitation {c["viewing"]["label"]} CT · Service {c["service"]["label"]} CT · Embassies of Christ, Gary, IN</p>'))
s.select_one('.date-label span').string='Gary is on Central Time, one hour behind Indianapolis.'
for n,k in enumerate(['viewing','service']):
 dt=datetime.fromisoformat(c['date']+'T'+c[k]['time']).replace(tzinfo=ZoneInfo('America/Chicago'))
 s.select('.schedule .time')[n].string=c[k]['label']+' CT ('+dt.astimezone(ZoneInfo('America/Indiana/Indianapolis')).strftime('%I:%M %p').lstrip('0')+' ET)'
for target in [s.select('.schedule article')[2],s.select('.venue-body')[1]]:target.append(fragment('<p>Open to family and friends</p><p>About a 12-minute drive from the church.</p>'))
s.select('.schedule article')[2].append(fragment(f'<a href="{cemmap}">Directions to the cemetery</a>'))
for a in s.select('a[href="#repast"]'):a.decompose()
rep=s.select_one('#repast');rep.clear();rep.append(fragment('<p class="eyebrow">Repast · Following Interment</p><p>'+c['repast']['note']+'</p>'))
if c['repast']['venue']:rep.append(fragment('<h3>'+c['repast']['venue']+'</h3><p>'+str(c['repast']['address'] or '')+'</p>'))
s.select_one('.calendar-note').clear();s.select_one('.calendar-note').append(fragment('End times are estimates. <a class="calendar-button" href="all-events.ics" download>Add all to calendar</a>'))
s.select_one('.schedule').insert_after(fragment('<div class="attire-row"><h3>Attire</h3><p>'+attire+'</p><a href="#fuchsia">Why?</a></div>'))
faqs=s.select_one('.faqs');faqs.clear()
answers=[('When should I arrive?',f'Visitation and viewing begin at {c["viewing"]["label"]} CT. The funeral service begins at {c["service"]["label"]} CT. Please allow time to arrive and be seated.'),('What time zone should I use?','Gary is on Central Time, one hour behind Indianapolis. Visitation is 10:00 AM CT (11:00 AM ET); the funeral service is 11:00 AM CT (12:00 PM ET).'),('What should I wear?',attire),('Where do I park?','The church has an open parking lot.'),('Is the graveside open to everyone?','Yes, to family and friends.'),('How far is the cemetery from the church?','About a 12-minute drive. Directions are in <a href="#locations">Locations</a>.'),('Will the service be livestreamed or recorded?','No. We hope you can join us in person.'),('Where do I send flowers, cards, or letters?','To the church, at the address in <a href="#sympathy">Expressions of Sympathy</a>.'),('What should I expect at the cemetery?','The graveside is outdoors in late November. Dress warmly and wear sturdy shoes.')]
for q,a in answers:faqs.append(fragment(f'<details open><summary>{q}</summary><p>{a}</p></details>'))
s.select_one('#sympathy').append(fragment(f'<article class="delivery"><h3>Send flowers, cards, or letters</h3><p>Flowers, letters, and cards all go to the church.</p><address id="delivery-address">Lynda Jones Memorial Service<br>Embassies of Christ<br>4285 Cleveland Street<br>Gary, IN 46408</address><button id="copy-address" type="button">Copy address</button> <a href="{churchmap}">Church map</a><p id="copy-status" role="status" aria-live="polite"></p></article>'))
s.footer.insert_before(fragment('<p class="updated">Last updated: '+c['lastUpdated']+'</p>'))
s.head.append(fragment('<link rel="icon" href="favicon.svg" type="image/svg+xml">'))
s.select_one('meta[property="og:description"]')['content']='Service Monday, Nov 23, 2026 · Gary, Indiana. Details, directions, guest information.'
(out/'index.html').write_text(str(s))
base=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Forever Lynda Marie//Memorial//EN','CALSCALE:GREGORIAN'];events=[]
for k,title in [('viewing','Visitation and Viewing'),('service','Funeral Service')]:
 def utc(time):return datetime.fromisoformat(c['date']+'T'+time).replace(tzinfo=ZoneInfo('America/Chicago')).astimezone(ZoneInfo('UTC')).strftime('%Y%m%dT%H%M%SZ')
 lines=['BEGIN:VEVENT','UID:lynda-'+k+'@foreverlyndamarie.com','DTSTAMP:20261111T120000Z','DTSTART:'+utc(c[k]['time']),'DTEND:'+utc(c[k]['estimatedEnd']),'SUMMARY:Lynda Marie Jones - '+title,'LOCATION:Embassies of Christ\\, 4285 Cleveland Street\\, Gary\\, IN 46408','DESCRIPTION:End time is estimated. Details: https://foreverlyndamarie.vercel.app','END:VEVENT']
 def save(name,lines):
  folded=[]
  for line in lines:
   while len(line)>73:folded.append(line[:73]);line=' '+line[73:]
   folded.append(line)
  (out/name).write_bytes(('\r\n'.join(folded)+'\r\n').encode())
 save(k+'.ics',base+lines+['END:VCALENDAR']);events+=lines
save('all-events.ics',base+events+['END:VCALENDAR'])
