# Abstract: graphical abstracts

The graphical abstract (the Lamina canvas) states a paper's argument in three panels.
It plays as an animation of about 15 seconds on the web and stands as a still poster for
journals and slides. It builds on `../../core/`; this file adds the canvas, the
arc, its kinds of text, type sizes and motion; the kit that draws them is `../../kit/`.

| File | What |
|---|---|
| `../../kit/` | The kit this format draws with: layout, type roles, motion, lint, charts, biology, icons and the renderer (`../../kit/README.md`) |
| `specimen-type.html` → `out/specimen-type.png` | Type roles and the canvas |

## What a graphical abstract is

A graphical abstract reads like the paper's abstract:

- **The title says what the work is**, in plain words: a statement ("Spot-based spatial
  transcriptomics cell-type deconvolution without a single-cell reference") or, when the
  work answers one, a question ("Can we predict…?").
- **Each panel ends with a finding**, stated as the paper states it, with the
  paper's hedges intact ("predicts propensity", not "reveals").
- **The take-home is one plain sentence** that says why it matters to the field.
- **Schematic is labelled schematic.** A chart that illustrates a shape says so in its
  caption and has no numeric ticks. Real numbers come from the paper.

## The arc

- **One idea per panel, three panels.** Resource → method → finding is the default
  arc, read left to right. Three panels keep the story cut to its core.
- **Motion follows the argument.** Things appear in the order you would explain them
  aloud, then stay put.
- **Checked by the kit.** The lint blocks a render on figures over 20 s, overlaps, margin overflow,
  divider crossings, and arrows or curves running through labels; a clean render is
  the check. `--force` is for drafts.

## Writing

Every word on a figure is one of six kinds of text, each with one job.

| Text | Job | Form | Examples |
|---|---|---|---|
| **Title** | Say what the work is about | The question it answers, or a statement of the work, naming its scope. ≤ 2 lines | "How can we integrate ex vivo drug screens across model systems, cancer types, and drug modalities for treatment insights?" |
| **Panel title** | Say what the panel shows, in the field's terms | A resource, a method, or a finding as a short active claim. ≤ 6 words where possible | Resource: "Pan-cancer drug screen atlas". Method: "Bayesian drug response modeling", "Machine learning risk model". Finding: "Immortalization biases cell line vulnerability", "Topic model infers cell type mixture" |
| **Conclusion** | State the panel's result | One sentence: the paper's claim, with its hedge and its key number | "In 35,669 patients, germline variants predict propensity for immune-related adrenal insufficiency" |
| **Take-home** | Say why it matters | One plain sentence, no styling | "A precision safety paradigm is needed to complement response prediction in personalized medicine." |
| **Label** | Name a mark | 1–3 words, next to the mark | "organoids", "skin tumors" |
| **Note** | Decode what the drawing cannot | 1–3 words, muted, with a leader | "observed gene" |

The core writing rules apply (`../../core/README.md`, *Writing*). Here they mean:
a panel title a reader could search for ("LLM diagnosis extraction") rather than a
stage name ("Harmonize"); a finding title as a claim, with the hedge in the
conclusion underneath; labels that add to the panel title and conclusion.

## Canvas

- **1600 × 900 (16:9)**, white paper, 64 px margins, 8 px spacing grid.
- **Header, y 44–187:** a kicker (`PROJECT · VENUE YEAR`) and a title of at most two
  lines, with white space beneath.
- **Panels, y 204–766:** three columns of 437 px with 80 px gutters, no dividers.
  Each panel has a header, the number in prussian and a title in `head`
  (`01  Pan-cancer drug screen atlas`), wrapping to two lines at most, then the
  visual, and the conclusion at the foot. When any panel title wraps, every panel's
  visual starts below a two-line header, so the panels stay aligned.
- **Take-home, y 812–860:** one plain sentence in `take` type.
- The canvas is always light. On a dark page it sits on its own paper card
  (`../web/README.md`, *Embedding figures*).

## Type sizes

Px on the 1600 × 900 canvas (`GA.ROLE` in `../../kit/ga-kit.js`), as size/line height.
Roles and settings: `../../core/typography.md`.

| Role | Size | Role | Size |
|---|---|---|---|
| `kicker` | 13/17 | `tag` | 13/17 |
| `title` | 38/44 | `axis` | 14/18 |
| `head` | 28/34 | `tick` | 13/16 |
| `body` | 17/24 | `take` | 28/36 |
| `label` | 17/24 | `note` | 14/18 |
| `cap` | 15/20 | `math` | 17/22 |

- **13 px is the smallest size.** Plex holds up at 13 px on the canvas, about 6.5 px
  when the figure is shown 800 px wide.
- **Line length:** body up to 437 px (one column). The title may span the full 1472 px.
- In kit markup, `*…*` sets italic and `{…}` sets the accent colour.

## Motion

Motion lets a viewer follow the argument: each beat shows one step, and each key
message gets a still beat to be taken in. Nothing moves during that beat.

- **A graphic enters as one unit.** All parts of a graphic (a chart frame and its
  axes, a legend and its timeline, a pair of patients) fade in together through
  `ga.scene(at, fn)`. Parts are not staggered.
- **Motion carries the flow.** Arrows draw from input to output, and what they point
  to appears as the head lands. The only marks that move are those whose motion is
  the finding: curves that part as they draw, bars that grow side by side, samples
  that settle into clusters, an inset zooming out of its source. Marks being
  compared move together.
- **Key messages hold still, longer for longer messages.** The title and each
  conclusion hold for `GA.readTime(str)`: 0.3 s plus 0.1 s a word, about 2 s for a
  conclusion. Within 15 s that is a beat to take the message in, not a full read;
  the figure ends on the complete frame, which stays up for reading. The take-home
  enters last and needs no hold of its own. Panel titles and labels enter with their
  graphic.
- **Beats, in order.** Title (hold) → per panel: header and input graphic → flow
  arrows to the method and output → a short look (0.3–0.7 s) → conclusion (hold) →
  take-home. Each panel takes about 4 s.
- **About 15 s, never more than 20.** Pace the figure with `ga.timeline()` and leave
  `duration` out of `GA.build`: the figure ends half a second after its last beat,
  and the poster is the last second. The lint fails a figure longer than 20 s. The
  animation plays once on the web and stops on the poster.
- **Vocabulary:** `in` (rise 12 px and fade) for text; `fade` for graphics and
  scenes; `pop` (a slight scale-up, no overshoot) for single marks that need emphasis;
  `draw` for arrows and curves; `grow` and `rise` for bars; `zoom` for an inset
  growing out of its source; `sweep` for a proportion wedge filling clockwise from
  12 o'clock; `move` for marks travelling into place.
- **Timing:** enter 0.6–0.8 s, arrows 0.5 s, curves 0.8–1.0 s. Arrowheads appear as
  their line finishes. Chart frames come about 0.4 s before the data, and labels
  come after the marks land.
- Reduced-motion users get the poster frame.

```js
const T = ga.timeline();
ga.scene(T.read(TITLE), () => { /* kicker and title */ }, { anim: "in" });
const notes = ga.scene(T.next(0.9), () => { /* panel input */ });       // look
const at = T.next(0.35);
ga.connect(notes, llm, { at, t: 0.5 });                                  // flow
ga.text(CONCLUSION, { ..., at: T.read(CONCLUSION) });                   // hold
```

**Charts in motion.** The frame fades in (0.4 s). Then the marks being compared
arrive together: lines draw left to right (0.8–1.0 s), bars grow from the baseline,
points fade in. Direct labels land at the line ends as the lines finish.

## The kit

The kit lives at the repo root, `../../kit/`, because the core specimens and the chart
forms' figures are drawn with it too. `../../kit/README.md` covers loading it, rendering, `GA.chart` and the
mark for each chart form.

## Deliverables per figure

`out/<slug>.png` (poster, 2×), `out/<slug>.mp4` (H.264), `out/<slug>.webm` (VP9 fallback),
and `out/<slug>.webp` (preview, not committed), written to an `out/` folder beside the
figure's HTML. Render with `node <design-system>/kit/render.cjs <slug>.html` from the
folder that holds the figure; the render fails if lint fails.

Figures live in the project that publishes them; the kit loads by relative path
(*The kit*, above).

## On a website

How a figure is published is up to the consuming site. fyng.github.io, the reference
consumer, does it like this (its `graphical_abstracts/README.md` has the details):

1. A publish script copies the PNG, MP4 and WebM into the site's assets and makes a
   640 px `<slug>-thumb.png`.
2. The paper's bibliography entry names the figure, and the publication list shows the
   thumbnail in the entry's preview slot.
3. The slot shows the static poster, scaled to the column. The animation plays in an
   expanded view sized to fit the viewport (portrait and landscape):
   - on laptops, while hovering the thumbnail; a click opens it as an overlay;
   - on phones, a tap opens the overlay; tap anywhere, the × or Esc closes it.
   The animation plays once, then snaps to the poster (its last frame, aligned
   pixel for pixel), so viewers can zoom into or copy the figure. Closing and
   reopening the view replays it.
   Reduced-motion users get the enlarged poster only. The video loads on first open.
