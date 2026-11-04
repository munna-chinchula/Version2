# ManzilChaser Dashboard

Standalone HTML, CSS, and JavaScript implementation of the ManzilChaser landing dashboard, starting with the [1440 × 900 Figma Hero](https://www.figma.com/design/v71tcRulXEofBHatgjW0he/MANZIL-CHASER-V2?node-id=7017-10978). Each section lives in its own `dashboard/<name>/` folder so it can be changed independently.

## Run locally

Serve this folder with the included Node server (no dependencies):

```powershell
node dev-server.js
```

Open `http://localhost:8000` and compare at a 1440 × 900 browser viewport. The project has no package install or build step. Serve it over HTTP because `dashboard/sections.js` loads the section HTML files with `fetch`.

## Structure

- `index.html` assembles the page in Figma order. The section folders under `dashboard/` are:

  1. `hero/`
  2. `direct-pathways/`
  3. `interactive-recommendation-engine/`
  4. `instruction-models/`
  5. `journey/`
  6. `compare/`
  7. `parent-command-center/`
  8. `why-manzilchaser/`
  9. `doubt-solver/`
  10. `testimonials/`
  11. `need-guidance/`
  12. `faq/`
  13. `footer/`

- Each section folder contains its own HTML, CSS, and `assets/` exports from Figma.
- `dashboard/sections.js` loads the sections and handles section actions. `dashboard/styles/sections.css` holds shared heading, sticker, and button styles.
- `dashboard/styles/tokens.css` holds shared colors and font definitions.
- `dashboard/fonts/` contains local font files and their licenses.

The navigation has the five Figma menu states: Explore, Exams, Degrees & Colleges, Skills & Learning, and Tools. Kids Learning navigates directly. Navigation and section actions dispatch a cancelable `manzil:navigate` event with `event.detail.path`; if no application router handles the event, the URL hash changes. The recommendation form includes its selections in `event.detail.selections`. The newsletter form emits `manzil:newsletter` with the entered email. Destination pages and form backends can be connected later.

Figtree, Inter, and Manrope font files are bundled locally with their licenses. The full logo is an exact SVG export from Figma, so it keeps the original SF Pro Black lettering without requiring that font on the visitor's device.
