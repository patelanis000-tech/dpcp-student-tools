# Changelog

## 2026-08-05

- Created the `/`, `/timetable/` and `/deadlines/` static route structure.
- Added a student-only landing page with tool cards, privacy, update and reporting information.
- Added shared portal navigation and return links without merging the applications.
- Copied the verified timetable application and dataset unchanged into its route.
- Split the deadline planner into HTML, CSS, application JavaScript and deadline data files.
- Preserved separate local-storage keys for deadline selections and personal cards.
- Added Cloudflare Pages deployment and manual testing instructions.
- Changed portal navigation and tool cards to explicit relative `index.html` paths for local folder previews and Pages routes.