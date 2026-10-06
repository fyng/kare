---
id: form-28
name: Procedure schematic
kind: schematic
family: schematic
job: ["The steps of a method: what each step does and what passes between them"]
kit: [GA.schematic.block, GA.schematic.cells, GA.schematic.wire, GA.schematic.port, GA.schematic.step, GA.glyph]
sources: ["Avsec et al., Nature 2026, Fig. 1b,c", "Silver et al., Nature 2016, Fig. 3", "Oh et al., Nature 2025, Fig. 1"]
see_also: [form-27, form-29]
---
# 28 · Procedure schematic

For a method's steps: training, inference, a search, an analysis pipeline. Each step
is a block or a small drawing, and the wires between them say what is passed on.
It reads left to right, or top to bottom when the steps are tall.

- **Steps are blocks in their role**: a learned model is a model block, a fixed step
  (augment, sample, score) an op block, and what is handed on is data, drawn as data
  (cells, tracks; *Schematics*, `../../illustration.md`). Name each step with a verb
  or a noun the reader knows, one or two words.
- **The forward path is the main wire**, 2.5 px `prussian`. **What feeds back** (a
  gradient, an update, a target) is a 1.5 px wire, dashed, routed around the
  forward path, above it where there is room, with square corners rounded at 10 px, and named once in `muted`
  beside it ("gradient").
- **Two things compared** (predicted against observed, a policy against the
  clinician) sit one above the other in the same shape, so the comparison is the
  gap between them; predicted takes the model's blue, observed `ink-2`.
- **A loop is drawn once.** Show one pass and let the feedback wire close it. To say
  "repeated over many", stack the block (depth 2–3) or add a bracket with the count.

![One training step: a batch, augmented, passed through the model; the prediction compared with the observed values; the loss's gradient fed back to the model](out/28-procedure-schematic.main.png)

```js figure=main w=660 h=218
const S = GA.schematic(ga);
const batch = S.block({ x: 24, y: 76, w: 88, h: 44, role: "data", label: "Batch" });
const aug = S.block({ x: 152, y: 76, w: 96, h: 44, role: "op", label: "Augment" });
const model = S.block({ x: 288, y: 72, w: 112, h: 52, role: "model", label: "Model" });
const pred = S.cells({ x: 448, y: 90, n: 6, cell: 16, fill: (i) => tok(`blue-${[300, 500, 400, 600, 300, 500][i]}`) });
const obs = S.cells({ x: 448, y: 184, n: 6, cell: 16, fill: (i) => tok(`slate-${[400, 600, 400, 700, 300, 600][i]}`) });
ga.text("Predicted", { x: 448, y: 68, role: "tick", size: 12, color: "var(--muted)" });
ga.text("Observed", { x: 448, y: 162, role: "tick", size: 12, color: "var(--muted)" });
const loss = S.block({ x: 584, y: 118, w: 60, h: 56, role: "op", label: "Loss" });
// the forward path
S.wire([S.port(batch, "r"), S.port(aug, "l")], { from: batch, to: aug });
S.wire([S.port(aug, "r"), S.port(model, "l")], { from: aug, to: model });
S.wire([S.port(model, "r"), S.port(pred, "l")], { from: model, to: pred });
S.wire([S.port(pred, "r"), { x: 566, y: 98 }, { x: 566, y: 138 }, S.port(loss, "l", 20 / 56)], { tone: "minor", from: pred, to: loss });
// the observed values go round the model, straight to the comparison
S.wire([S.port(batch, "b"), { x: 68, y: 192 }, S.port(obs, "l")], { tone: "minor", from: batch, to: obs });
S.wire([S.port(obs, "r"), { x: 566, y: 192 }, { x: 566, y: 154 }, S.port(loss, "l", 36 / 56)], { tone: "minor", from: obs, to: loss });
// the gradient, fed back outside the forward path
S.wire([S.port(loss, "t"), { x: 614, y: 38 }, { x: 344, y: 38 }, S.port(model, "t")], { tone: "minor", color: "var(--prussian)", dash: true, from: loss, to: model });
ga.text("gradient", { x: 456, y: 16, role: "note", size: 13 });
```

## Steps in a row

For a procedure whose steps act on one object (a search tree, a cohort, a record):
draw the object once per step, in a row of columns, and ink only what that step
touches.

- Each column opens with the step's number in `prussian` and its name in `ink`,
  both 500 (`S.step`). The columns share a top line and a width.
- **The same object in every column, in the same place.** What the step acts on is
  `ink` at 2.5 px; the rest of the object is `context` at 1.5 px, so the eye moves
  from step to step along the inked part.
- What a step adds is `prussian` (new nodes, a value, an update running back up).
  Notation (*v*, *Q*) is the `math` role, used where the paper uses it.

![A tree search in four steps: select a path, expand its leaf, evaluate the new leaf, back the value up the path; the part each step touches is inked and the rest is grey](out/28-procedure-schematic.steps-in-a-row.png)

```js figure=steps-in-a-row w=640 h=300
const S = GA.schematic(ga);
const ink = "var(--ink)", ctx = "var(--context)", pru = "var(--prussian)";
// one tree, the same in every column: root, two children, two grandchildren on the right
const nodes = (cx) => ({ r: { x: cx, y: 76 }, a: { x: cx - 34, y: 126 }, b: { x: cx + 34, y: 126 }, c: { x: cx + 12, y: 176 }, d: { x: cx + 56, y: 176 }, e: { x: cx - 6, y: 226 }, f: { x: cx + 30, y: 226 } });
const EDGES = [["r", "a"], ["r", "b"], ["b", "c"], ["b", "d"]];
const shorten = (p, q, k) => { const L = Math.hypot(q.x - p.x, q.y - p.y); return { x: +(q.x - ((q.x - p.x) / L) * k).toFixed(1), y: +(q.y - ((q.y - p.y) / L) * k).toFixed(1) }; };
// per step: the nodes it touches (ink), the nodes it adds or scores (prussian), its inked edges
const STEPS = [
  { name: "Select", ink: "rbc", pru: "", edges: ["r-b", "b-c"] },
  { name: "Expand", ink: "c", pru: "ef", edges: [] },
  { name: "Evaluate", ink: "", pru: "e", edges: [] },
  { name: "Back up", ink: "rbce", pru: "", edges: [] },
];
STEPS.forEach((st, i) => {
  const x0 = 24 + i * 156, cx = x0 + 52, N = nodes(cx);
  S.step(i + 1, st.name, { x: x0, y: 18 });
  const edges = i === 0 ? EDGES : [...EDGES, ["c", "e"], ["c", "f"]];
  let m = "";
  for (const [p, q] of edges) {
    if (i === 3 && ["r-b", "b-c", "c-e"].includes(`${p}-${q}`)) continue; // drawn as the update below
    const on = st.edges.includes(`${p}-${q}`), add = i === 1 && p === "c";
    m += `<path d="M${N[p].x} ${N[p].y}L${N[q].x} ${N[q].y}" stroke="${on ? ink : add ? pru : ctx}" stroke-width="${on || add ? 2.5 : 1.5}"/>`;
  }
  for (const k of i === 0 ? "rabcd" : "rabcdef") m += GA.glyph("circle", N[k].x, N[k].y, { size: 14, fill: st.pru.includes(k) ? pru : st.ink.includes(k) ? ink : ctx });
  ga.raw(m);
  if (i === 2) {
    S.wire([{ x: N.e.x, y: N.e.y + 12 }, { x: N.e.x, y: 262 }], { tone: "minor", color: pru, dash: true });
    ga.text("*v*", { x: N.e.x + 8, y: 250, role: "math", color: pru });
  }
  if (i === 3) {
    // the value runs back up the selected path
    for (const [p, q] of [["e", "c"], ["c", "b"], ["b", "r"]]) S.wire([shorten(N[q], N[p], 10), shorten(N[p], N[q], 11)], { tone: "minor", color: pru, width: 2.5 });
    ga.text("*Q*", { x: N.b.x + 14, y: 84, role: "math", color: pru });
  }
});
```

## In each format

| Element | Canvas | Print |
|---|---|---|
| Block | 1.5 px outline, 6 px radius, 14 px label | 0.5 pt, 0.6 mm radius, 6–7 pt |
| Forward wire / feedback wire | 2.5 px / 1.5 px, `5 5` dash | 1 pt / 0.5 pt, `2 2` dash |
| Step number and name | 16 px, 500 | 7 pt, 500 (the panel's own letter stays the panel letter) |
| Tree node | 14 px | 3 mm |
