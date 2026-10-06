---
id: form-29
name: Data schematic
kind: schematic
family: schematic
job: ["What data a method takes in: their kinds, extent, counts and the unit it reads"]
kit: [GA.schematic.tracks, GA.schematic.bracket, GA.schematic.cells]
sources: ["Avsec et al., Nature 2026, Fig. 1a", "Linder et al., Nature Genetics 2025, Fig. 1a", "Oh et al., Nature 2025, Fig. 1b"]
see_also: [form-27, form-28, form-17]
---
# 29 · Data schematic

For the data a method takes in: which kinds of record, over what extent, how many,
and the unit the model reads (a patch, a bin, a token). It is a picture of the data's
shape, drawn with synthetic marks; the real values are in the charts.

- **One row per kind of record on a shared axis**, named at the left in `label`
  (14 px, `ink-2`), each on a 1.5 px `rule` baseline. The mark says the kind, as the
  glyph grammar does (`../README.md`, *Glyphs*): dots for measurements, ticks for
  genomic events, bars for intervals, a filled profile for a signal. Each kind takes
  an identity slot in order (`../../color.md`).
- **The extent is a bracket over the axis** ("Up to 10 years", "1 Mb"), not a
  ruled axis: the marks are synthetic, so the axis carries no ticks.
- **Counts sit in a table at the right**, one value per row, `tick` type, titled in
  `muted` above the column ("Records", "Patients"). The table is where the real
  numbers go; give each its denominator in the legend.
- **The unit the model reads** is cut out of the axis by dashed `rule` dividers
  (`3 3`), one unit in `wash`. A zoom (`../../illustration.md`, *Zoom*) opens it
  into what the model sees: cells, one column per item, one row per field, named in
  `tick` at the left.

![Five kinds of patient record on a shared ten-year axis with their counts at right; one ten-day patch opened into its events, each a column of type, value and time](out/29-data-schematic.main.png)

```js figure=main w=640 h=300
const S = GA.schematic(ga);
const X = 120, W = 360, P = 6;
// the patch the zoom opens, in wash under the tracks
const u0 = 2 / P, u1 = 3 / P;
ga.raw(`<rect x="${X + u0 * W}" y="58" width="${(u1 - u0) * W}" height="134" fill="var(--wash)"/>`);
const T = S.tracks({ x: X, y: 62, w: W, pitch: 26, patches: P, rows: [
  { name: "Labs", kind: "events", color: "var(--cat-1)", data: [0.04, 0.12, 0.19, 0.27, 0.36, 0.45, 0.58, 0.66, 0.74, 0.88, 0.95] },
  { name: "Genomics", kind: "ticks", color: "var(--cat-2)", data: [0.07, 0.47, 0.81] },
  { name: "Treatments", kind: "spans", color: "var(--cat-3)", data: [[0.1, 0.3], [0.64, 0.86]] },
  { name: "Tumour sites", kind: "events", color: "var(--cat-4)", data: [0.08, 0.42, 0.7, 0.9] },
  { name: "Progression", kind: "events", color: "var(--cat-5)", data: [0.6, 0.92] },
], cols: [
  { title: "Records", dx: 70, values: ["83M", "812k", "482k", "1.7M", "204k"] },
  { title: "Patients", dx: 140, values: ["95%", "92%", "80%", "97%", "64%"] },
] });
S.bracket({ x0: X, x1: X + W, y: 40, side: "top", label: "Up to 10 years" });
// the zoom: the patch opened into its events, in time order
const ev = ["var(--cat-1)", "var(--cat-4)", "var(--cat-1)", "var(--cat-2)"], C = 16, gap = 8;
const zw = ev.length * (C + gap) - gap, zx = X + ((u0 + u1) / 2) * W - zw / 2, zy = 232;
const lead = (x0, x1) => `<path d="M${x0} ${T.bottom + 2}L${x1} ${zy - 8}" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="1 4" stroke-linecap="round"/>`;
ga.raw(lead(X + u0 * W, zx) + lead(X + u1 * W, zx + zw));
ev.forEach((c, i) => S.cells({ x: zx + i * (C + gap), y: zy, n: 3, cell: C, dir: "v", fill: (j) => [c, "var(--context)", "var(--rule)"][j] }));
["type", "value", "time"].forEach((t, j) => ga.text(t, { x: zx - 10, y: zy + j * C + 1, anchor: "end", role: "tick", size: 12, color: "var(--muted)" }));
ga.text("10-day patch", { x: zx + zw + 14, y: zy + C + 1, role: "tick", size: 12, color: "var(--muted)" });
```

## In each format

| Element | Canvas | Print |
|---|---|---|
| Row pitch, name | 26 px, 14 px | 3 mm, 6–7 pt |
| Event dot / tick / interval | r 3.5 / 2 × 11 px / 7 px tall | r 1 pt / 0.75 pt × 1.2 mm / 0.8 mm |
| Divider | 1.5 px `rule`, `3 3` dash | 0.5 pt, `1 1` dash |
| Field cell | 16 px, 2 px paper gap | 1.6–2 mm, 0.5 pt gap |
