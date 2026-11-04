# ManzilChaser Dashboard

Standalone HTML, CSS, and JavaScript implementation of the [1440 × 900 Figma Hero](https://www.figma.com/design/v71tcRulXEofBHatgjW0he/MANZIL-CHASER-V2?node-id=7017-10978) and the [Direct Pathways section](https://www.figma.com/design/v71tcRulXEofBHatgjW0he/MANZIL-CHASER-V2?node-id=7032-12418). Dashboard sections live in their own `dashboard/<name>/` folders.

## Run locally

Serve this folder with the included Node server (no dependencies):

```powershell
node dev-server.js
```

Open `http://localhost:8000` and compare at a 1440 × 900 browser viewport. The project has no package install or build step. It can be pushed to GitHub as-is and hosted with GitHub Pages.

## Structure

- `index.html` assembles the page, with Direct Pathways immediately after the Hero.
- `dashboard/hero/` contains the Hero layout, interactions, and Figma assets.
- `dashboard/direct-pathways/` contains the five pathway cards, interaction, and Figma SVG assets.
- `dashboard/styles/tokens.css` holds shared colors and font definitions.
- `dashboard/fonts/` contains local font files and their licenses.

The navigation has the five Figma menu states: Explore, Exams, Degrees & Colleges, Skills & Learning, and Tools. Kids Learning navigates directly. Navigation choices dispatch a cancelable `manzil:navigate` event with `event.detail.path`; if no application router handles the event, the URL hash changes. This keeps the UI interactive until destination pages are built.

Figtree, Inter, and Manrope font files are bundled locally with their licenses. The full logo is an exact SVG export from Figma, so it keeps the original SF Pro Black lettering without requiring that font on the visitor's device.
