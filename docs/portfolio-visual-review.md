# Portfolio visual review — 16 October 2026

Baseline: main `cb2a4c56f37fbf6e75cb5c357b9aa3ae9f72d3d2` after a fresh fetch.
The previous dirty checkout and all untracked images were left intact; review
uses a separate worktree. GitHub's open PR list contained only draft PR21 at
`4d58a4f1efb4faec6cf84e364b4aaec6ee72f333`.

## Evidence and corrections

All 122 rendered image assets were decoded and visually reviewed in labelled
contact sheets against the current catalogue. This is a source review, not a
claim that every view received individual browser visual signoff. Live browser
review covered the initial project cards and the Choco, LATAKIA, OWN and AFRIN
galleries; Choco's seven views were individually inspected. Rapid close/reopen
can deliver an old native close event after another gallery opens. Ignore a
close event while the dialog is open; a component regression covers both states.

| Source evidence | Correction |
| --- | --- |
| archive-35 visibly says Shahba, formerly labelled Elatta | Move into Shahba's existing gallery; no asset deleted |
| archive-37 visibly says Dr. foody, formerly labelled Der Beck | Correct all three displayed titles and descriptions; keep stable internal ID |
| archive-22 cap says LATAKIA, whereas the illustrated sweatshirt says LATARIA | Move cap into LATAKIA; retain separate LATARIA card with its own sweatshirt |
| archive-33 is a Legend Cut poster | Classify as design/print and label as a design presentation |

Result: 34 cards, 122 distinct image paths/views, with all prior image paths
retained exactly once. No raster content, logos, pricing or originals changed.
New attachments 159337.jpg–159341.jpg were retrieved and inspected: they are
mobile screenshots of the existing site, not five new portfolio source images.
They directly support the incorrect Dr. foody name finding.

## Remaining image work

- Choco view3 (batch-choco-night.webp) cuts through the upper lettering in
  its supplied screenshot fragment. OWN logo view4 also contains an incomplete
  logo crop. Do not invent missing pixels or call these complete documentation.
- Several mug/textile extracts are small in the actual source despite the
  prepared 1200×800 canvas. A larger canvas does not restore detail.
- Sahiten before/after, trailer before/after and production-sheet views still
  contain multiple panels. Preserve them until exact safe separation is reviewed.
- Apparent repeated views in Sammont, embroidery and Oregano need comparison
  against originals before removing anything. No assets were deleted here.

## Validation boundaries

All122 public portfolio image URLs returned HTTP200 and matched repository
bytes exactly.65 tests passed, including identity conservation and the native
close-event regression; TypeScript, targeted ESLint and production build passed.
The initial local build failed because Turbopack rejects a node_modules symlink
outside its root; copying the existing dependency directory resolved this
environment issue without dependency or configuration changes.

Vercel's authenticated deployment page shows Production/Ready, main cb2a4c5,
and www.carobara.com on the previous deployment EpjHBQoUYURtMUo9EdGvJV6CLhU9.
Its API connector still returns scope403; the browser session works.
Administration redirects to the login page, so authenticated visual testing,
save/error/empty cases and the 360/390/768/1024/1440, tablet orientation and
200% zoom matrix remain open. The browser surface used here does not expose
a viewport resizing API. No production test booking, email, customer write,
database migration or €80 activation was performed during this review.
