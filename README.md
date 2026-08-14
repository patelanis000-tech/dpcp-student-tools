# DP/CP Student Tools

A framework-free static portal containing two separate applications:

- `/` — student tools landing page
- `/timetable/` — School Timetable Studio
- `/deadlines/` — DP/CP Student Deadline Planner 2026

No backend, database, account system, analytics or in-page authentication is included. Cloudflare Access can be configured later outside this codebase.

## Preview locally

The pages use relative paths and can be opened directly. For route-accurate testing from this repository, run:

```powershell
cd student-tools
py -m http.server 8000
```

Then open:

```text
http://localhost:8000/
http://localhost:8000/timetable/
http://localhost:8000/deadlines/
```

## Deploy to Cloudflare Pages

This folder is already the deployable output; there is no build step.

### Direct Upload

1. Open Cloudflare **Workers & Pages**.
2. Choose **Create application → Get started → Drag and drop your files**.
3. Upload the `student-tools` folder and deploy.

Cloudflare's Direct Upload documentation: https://developers.cloudflare.com/pages/get-started/direct-upload/

### Git integration

If this repository is connected to Pages:

- Framework preset: **None**
- Build command: leave blank (or use `exit 0` if the interface requires one)
- Build output directory: `student-tools`

Cloudflare's static HTML guide: https://developers.cloudflare.com/pages/framework-guides/deploy-anything/

### Wrangler

From the repository root:

```powershell
npx wrangler pages deploy student-tools
```

## Privacy and storage

- Timetable names and selections stay on the current page and are not persisted.
- Deadline selections use `dpPlanner2026State` in `localStorage`.
- Personal deadline cards use the separate `dpPersonalCards2026` key.
- Official timetable and deadline datasets contain no personal student records.

## Manual test checklist

### Routes and navigation

- Open `/`, `/timetable/` and `/deadlines/` directly.
- Check all navigation and **Return to Student Tools** links.
- Confirm browser developer tools show no missing CSS or JavaScript assets.

### Timetable

- Check the master timetable, filters, room filter and class-detail dialog.
- Generate DP and CP personal timetables and print each view.
- Confirm subject search, required components and chronological ordering.

### Deadlines

- Generate DP and CP calendars using the shared academic-subject catalogue.
- Confirm programme-specific core components and shared examinations/study break.
- Check calendar/list views, continuous months, month jump and weekday-only assessment bars.
- Add, refresh, edit and delete a personal card.
- Confirm official cards have no edit/delete controls.
- Print one month and all months.

### Responsive and print

- Check the landing page and both builders at desktop and phone widths.
- Confirm navigation wraps cleanly and no controls extend beyond the viewport.
- Confirm navigation and builder controls are hidden in print layouts.

## Unresolved verified-data issues

- No dated Theory of Knowledge entries.
- No dated Personal and Professional Skills entries.
- No dated Language Development entries.

Verified subjects without recorded 2026 deadlines remain selectable and are labelled accordingly. No dates are invented.
