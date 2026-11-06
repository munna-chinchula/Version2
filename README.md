# ManzilChaser Website Prototype

Section-based static HTML, CSS, and JavaScript implementation of the ManzilChaser Figma website. The repository contains the main dashboard and three destination pages. Each page is assembled from independently editable section folders, so sections can be revised without replacing an entire page.

## Pages

Run the included local server and open any route below:

| Page | Local route |
| --- | --- |
| Main dashboard | `http://localhost:8000/` |
| Offline Colleges | `http://localhost:8000/offline-colleges/index.html` |
| Online Degrees | `http://localhost:8000/online-degrees/index.html` |
| Kids Learning | `http://localhost:8000/kids-learning/index.html` |

Dashboard navigation links to Offline Colleges, Online Degrees, and Kids Learning. The destination pages include their page-specific sections and share the appropriate FAQ, testimonials, and footer sections where the Figma layouts call for them.

## Run locally

Requires Node.js. No npm dependencies or build step are needed.

```powershell
node dev-server.js
```

Open `http://localhost:8000/`. Use an HTTP server because page sections are loaded with `fetch`; opening HTML files directly with `file://` will not work correctly. The design reference viewport for the main dashboard hero is 1440 × 900. The pages are responsive at narrower widths as well.

## Section structure

- `dashboard/` contains the main landing page sections: hero, direct pathways, interactive recommendation engine, instruction models, journey, compare, parent command center, why ManzilChaser, doubt solver, testimonials, need guidance, FAQ, and footer.
- `offline-colleges/` contains the Offline Colleges page, including its hero, trusted institutions, next chapter, recommendation engine, college listing, compare, career and skills sections, guidance, testimonials, FAQ, and footer.
- `online-degrees/` contains the Online Degrees page, including its hero, trusted institutions, next step, recommendation engine, online programs, compare, learning format, career and skills sections, guidance, testimonials, FAQ, and footer.
- `kids-learning/` contains the Kids Learning page, including its hero, learning areas, instruction models, learning finder, recommended courses, compare, reasons to choose ManzilChaser, learning journey, parent command center, ready-to-start section, testimonials, FAQ, and footer.
- Each page has a page entry file and loader/controller JavaScript. Section HTML, CSS, and exported assets are grouped in section-specific folders. Shared styles and design tokens are kept separate where practical.
- The dashboard and destination pages bundle Lenis scrolling and the locally supplied fonts/assets. Third-party font licenses are included alongside the font files.

## Interactions and prototype scope

Search, sorting, topic selection, sample filters, comparison selection, detail dialogs, in-page navigation, and FAQ interactions are client-side prototype behaviors. The catalogue cards are illustrative Figma examples: the Offline Colleges and Online Degrees pages each currently show three featured entries, and Kids Learning shows three featured courses. Counts reflect the entries present in this prototype; there is no connected production catalogue or API.

Navigation and section actions dispatch a cancelable `manzil:navigate` event with `event.detail.path`; without a host router, the page falls back to a URL hash. The recommendation forms currently guide users to the relevant on-page listings. Newsletter forms dispatch `manzil:newsletter` with the email in `event.detail.email`. Connect these events to the client’s router, forms, CRM, and backend before production use. Detail dialogs use the information available in the local sample data; production detail pages and destinations are not part of this static prototype.

## Handover notes

- Keep each section’s HTML, CSS, and assets together when changing the design.
- Update each page loader when adding, removing, or reordering a section.
- Start the server from the repository root so all relative section and asset paths resolve.
- This repository is the front-end prototype. Production hosting, domain configuration, backend services, live content, analytics, and form integrations must be supplied and configured by the client.
