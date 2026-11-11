# Forever Lynda Marie

Family-review build for www.foreverlyndamarie.com. No public website deployment or domain activation is authorized yet.

## Stack
Static HTML, CSS, and JavaScript, generated with Python 3 and Beautiful Soup (build-time only). Approved images are loaded from their exact original Cloudinary URLs without transformations. No database, analytics, form, guestbook, audio, or third-party JavaScript is included. Supabase is unnecessary for this scope.

## Build and preview
Run `python3 -m pip install -r requirements.txt`, then `python3 build.py`, then serve `dist/` with any static HTTP server (for example `python3 -m http.server 8000 --directory dist`). Open http://localhost:8000. Commit generated `dist/` after updates.

## Update information
Edit `event-config.json`, then rebuild:
- Repast: set `repast.venue`, `repast.address`, and replace `repast.note` with confirmed details. Directions appear only when venue and address are both set. No repast time is assumed.
- Contact: set `contact.authorized` to true and add approved text in `contact.details`. Do not commit private contact information before authorization. The repository is public.
- Service: update `date`, `dateLabel`, `viewing.time`, `viewing.label`, `service.time`, and `service.label`. Time values are 24-hour local America/Chicago times. Calendar exports use UTC and estimated end times from `estimatedEnd`; update the estimates once confirmed. The combined download includes both events.
- Locations: update the two `venues` entries. Preserve the supplied asset URLs.
- Parking and procession: populate only after confirmed. Null values omit the FAQs.
- Flowers: keep `flowerDelivery.verified` false until arrangements with Powell-Coleman Funeral Home are verified. Set true and supply verified delivery text to show guidance.

Never place passwords, API keys, or private notes in configuration. Configuration is maintained in source, not served in dist.

## Vercel deployment after approval
Import `almecajones-cmd/foreverlyndamarie` as a new Vercel project. Use Other framework, build command `python3 -m pip install -r requirements.txt && python3 build.py`, output directory `dist`. No environment variables or package installation are required. Keep preview authentication enabled. Before any preview deployment, verify access protection. The Vercel project should not deploy automatically to production before family approval.

After approval, connect www.foreverlyndamarie.com in Vercel Domains and use the exact DNS records Vercel supplies at your registrar. Add foreverlyndamarie.com and redirect it to www. Verify HTTPS, redirects, and maps/calendar on actual phones. Add canonical and og:url metadata only once the approved production domain is active. Remove noindex from HTML and the X-Robots-Tag header only if the family wants search indexing. Noindex is not access protection.

## Family verification checklist
- [ ] Approve overall design and exact memorial artwork presentation.
- [ ] Confirm November 23, 2026; viewing 10 AM CST; service 11 AM CST.
- [ ] Confirm Embassies of Christ address: 4285 Cleveland Street, Gary, IN 46408.
- [ ] Confirm cemetery address: 2305 W. 73rd Avenue, Merrillville, IN 46410.
- [ ] Supply repast venue/address and any additional approved details.
- [ ] Confirm parking and procession instructions if they should be published.
- [ ] Verify flower delivery instructions directly with Powell-Coleman Funeral Home.
- [ ] Authorize any family contact details before publication.
- [ ] Import calendar on Apple/Google/Outlook devices; check Central/Eastern display.
- [ ] Approve public deployment and domain activation.

The complete personal fuchsia narrative and attire guidance are preserved in build.py. All guest-facing content is rendered without requiring JavaScript. JavaScript only controls the mobile navigation.

## November 11 checklist update
`update_checklist.py` applies the latest family checklist after the base template render. `attire` is rendered in three locations; `lastUpdated` is shown above the footer. Calendar end times are estimates. See CHECKLIST-STATUS.md for unresolved items. The protected review origin is https://foreverlyndamarie.vercel.app.
