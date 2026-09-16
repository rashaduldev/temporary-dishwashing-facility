# Service navigation, model content and coverage revision

Date: 2026-09-12 (Asia/Singapore)

The Services disclosure now opens on activation and retains the selected category across pointer movement. Clicking outside or pressing Escape closes it. The 22ft and 26ft dishwashing destinations were tested through the actual menu.

All 34 model destinations have original descriptions, equipment details, application guidance, site-planning questions, related sizes and a source reference. Category pages provide readable model summaries and a direct telephone option. Titles and descriptions reflect the selected equipment.

Published reference pages do not provide machine counts, output ratings or utility loads consistently. These are identified as items to confirm. The 12ft restroom reference has a 14ft body description: this inconsistency is disclosed rather than treated as a verified specification. Model photography is labeled representative. No search-volume data was available, so there is no claim that terms are the highest-volume Google queries.

The blurry handwashing asset was replaced with the original 1900 by 950 drawing from Temporary 123, resized to 480 and 960 pixel WebP assets. This is a technical drawing, not a generated photograph.

Coverage uses geographic state boundaries from us-atlas 3 (U.S. Census Bureau), an extruded SVG appearance, all 50 full state names and an enlarged scrollable map. The old tile layout and inline positioning were removed. A separate link opens Google Maps. The embedded graphic is a custom geographic map, not Google's 3D rendering engine. The projection places Alaska and Hawaii in insets.

The Contact Us tab and navbar phone button have a gentle repeating outline glow, with steady text and unchanged control dimensions. Reduced-motion users receive no animation; hover and keyboard focus pause it.

## Public guidance used

- [W3C disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/): keyboard activation and expanded state.
- [W3C fly-out menu guidance](https://www.w3.org/WAI/tutorials/menus/flyout/): usable pointer and keyboard interactions.
- [Google helpful-content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content): useful original content and clear sourcing.
- [us-atlas source and projection](https://github.com/topojson/us-atlas): Census state boundaries. License retained in us-atlas-LICENSE.txt.
- Individual equipment references are recorded in content/service-details.json and linked from the model pages. Both Fire Damage Kitchen Contractor and Temporary 123 were used.

## Verification

- Build and TypeScript checks pass.
- 44 Playwright browser tests pass, including actual menu navigation, all model destinations, responsive layouts, image loading, outside/Escape close, map enlargement, state service modals and reduced motion.
- 21 unit/route/import tests pass.
- Static SEO audit: 666 HTML documents including 404; 76,290 local links; 1,247 image references; 666 unique titles and descriptions; zero reported problems.
- Pattern secret scan: 823 files, no findings.
- Local static preview now applies Vercel's global response headers, including CSP, so rendering checks reproduce deployment restrictions.
- Desktop and mobile screenshots visually reviewed. Live verification follows the GitHub main deployment.

## Existing release limits

The revision hostname stays noindex. Migration remains 625 recovered source pages out of the previously reported 98,253, and this revision does not establish full-site migration or Google indexing. Online inquiry intake remains disabled pending the separate backend activation checks.

## Final client naming and interaction follow-up

Navigation now reads Home, Services, Service Areas, About Us, Articles and Contact Us. Existing /service-areas/ and /blog/ URLs remain available.

The final service order is Mobile Kitchens, Dishwashing, Refrigeration, Shower, Restroom, Shower and Restroom Combination Trailers, Sleeper, Laundry, Handwashing Trailers. All nine appear in the desktop menu, mobile menu and homepage cards. On wide screens the cards form a balanced three-column layout. Service Areas hero line-height and paragraph spacing were adjusted. The contact attention glow is now green.

Live testing exposed an early-click race in the first disclosure enhancement. Native details/summary elements now open the menu and select categories before JavaScript loads. The regression test checks this with JavaScript disabled, while the enhanced version retains outside-click and Escape handling.

## State service inquiry flow

Each of the 50 state shapes in both map views now opens a native modal with the state name, nine approved service categories, linked category pages, Contact Us and a telephone fallback. A state selector provides an easier target for small states on mobile. Keyboard activation, Escape, outside dismissal and focus return are supported.

Contact Us opens the existing contact drawer without leaving Service Areas, prefills the selected state in Project location, and closes both map dialogs. The selection survives delayed React hydration. Browser tests cover desktop pointer activation, mobile state selection, keyboard use in the enlarged map, state changes and contact focus restoration. Online submission remains disabled; this UI change does not activate backend intake.
