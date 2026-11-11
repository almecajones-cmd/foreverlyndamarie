import json, pathlib, html
p=pathlib.Path(__file__).parent
c=json.loads((p/'event-config.json').read_text())
e=html.escape
out=p/'dist'; out.mkdir(exist_ok=True)
def maps(v):
 from urllib.parse import quote
 q=quote(v['name']+', '+v['address'])
 return f'<div class="map-links"><a href="https://www.google.com/maps/search/?api=1&query={q}" target="_blank" rel="noopener">Google Maps ↗</a><a href="https://maps.apple.com/?q={q}" target="_blank" rel="noopener">Apple Maps ↗</a></div>'
venues=''.join(f'<article class="venue"><img src="{v["source"]}" alt="{e(v["name"])}" loading="lazy"><div class="venue-body"><p class="eyebrow">{e(v["label"])}</p><h3>{e(v["name"])}</h3><p>{e(v["address"])}</p>{maps(v)}</div></article>' for v in c['venues'])
r=c['repast']; repast=f'<h3>{e(r["venue"] or "Location to Be Announced")}</h3>'+ (f'<p>{e(r["address"])}</p>' if r['address'] else '')
if r['venue'] and r['address']: repast+=maps({'name':r['venue'],'address':r['address']})
contact=''
if c['contact']['authorized'] and c['contact']['details']: contact='<details><summary>How can I contact the family?</summary><p>'+e(c['contact']['details'])+'</p></details>'
flowers='<p>'+e(c['flowerDelivery']['instructions'])+'</p>' if c['flowerDelivery']['verified'] and c['flowerDelivery']['instructions'] else ''
story=['Long before we began planning this celebration, our mother shared a special wish.','Like many mothers and daughters, we sometimes had conversations about things neither of us wanted to imagine. Mom had a way of bringing humor into even the most uncomfortable moments.','But one thing she made perfectly clear: when her time came, she wanted to be laid to rest in fuchsia.','Not black. Not white. Fuchsia.','And if you knew our mother, you knew she was a woman who knew what she wanted.','Fuchsia is often associated with vibrancy, confidence, and love. But to our family, its meaning is much more personal. It represents her voice, her individuality, and a wish she entrusted to us.','Throughout her celebration, you’ll notice subtle touches of fuchsia in the floral arrangements and memorial details. Each is an intentional tribute to her.','The color was her choice. Honoring it is ours.']
page=(p/'template.html').read_text()
from datetime import datetime
from zoneinfo import ZoneInfo
def eastern(kind):
 return datetime.fromisoformat(c['date']+'T'+c[kind]['time']).replace(tzinfo=ZoneInfo(c['timezone'])).astimezone(ZoneInfo('America/Indiana/Indianapolis')).strftime('%I:%M %p').lstrip('0')
for k,v in {'META_DATE':e(c['dateLabel'].split(', ',1)[1]),'VIEWING_EASTERN':e(eastern('viewing')),'SERVICE_EASTERN':e(eastern('service')),'CHURCH_NAME':e(c['venues'][0]['name']),'CEMETERY_NAME':e(c['venues'][1]['name']),'ARTWORK':c['artwork'],'DATE':e(c['dateLabel']),'VIEWING':e(c['viewing']['label']),'SERVICE':e(c['service']['label']),'VENUES':venues,'REPAST_NOTE':e(r['note']),'REPAST':repast,'STORY':''.join('<p>'+e(s)+'</p>' for s in story),'CONTACT':contact,'FLOWERS':flowers,'PARKING':('<details><summary>Where should I park?</summary><p>'+e(c['parking'])+'</p></details>') if c['parking'] else '', 'PROCESSION':('<details><summary>What are the procession arrangements?</summary><p>'+e(c['procession'])+'</p></details>') if c['procession'] else ''}.items(): page=page.replace(k,v)
(out/'index.html').write_text(page)
for kind,title in [('viewing','Visitation and Viewing'),('service','Funeral Service')]:
 def esc(s): return s.replace('\\','\\\\').replace(';','\\;').replace(',','\\,').replace('\n','\\n')
 lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Forever Lynda Marie//Memorial//EN','CALSCALE:GREGORIAN','BEGIN:VTIMEZONE','TZID:America/Chicago','BEGIN:STANDARD','DTSTART:19701101T020000','TZOFFSETFROM:-0500','TZOFFSETTO:-0600','TZNAME:CST','RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU','END:STANDARD','BEGIN:DAYLIGHT','DTSTART:19700308T020000','TZOFFSETFROM:-0600','TZOFFSETTO:-0500','TZNAME:CDT','RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU','END:DAYLIGHT','END:VTIMEZONE','BEGIN:VEVENT',f'UID:lynda-marie-{kind}@foreverlyndamarie.com','DTSTAMP:20261111T080000Z',f'DTSTART;TZID=America/Chicago:{c["date"].replace("-","")}T{c[kind]["time"].replace(":","")}00','SUMMARY:'+esc('Lynda Marie Jones — '+title),'LOCATION:'+esc(c['venues'][0]['name']+', '+c['venues'][0]['address']),'DESCRIPTION:'+esc('All times Central Standard Time. No official end time has been announced. Interment follows the funeral service. Repast follows interment; location to be announced.'),'END:VEVENT','END:VCALENDAR']
 folded=[]
 for line in lines:
  current=''
  for ch in line:
   if len((current+ch).encode())>74: folded.append(current);current=' '+ch
   else:current+=ch
  folded.append(current)
 (out/(kind+'.ics')).write_bytes(('\r\n'.join(folded)+'\r\n').encode())
print('Built static site and calendar files.')

exec((p/"update_checklist.py").read_text())
