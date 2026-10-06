---
id: form-29
name: Data schematic
kind: schematic
family: schematic
job: ["What data a method takes in: their kinds, extent, counts and the unit it reads"]
kit: [GA.schematic.tracks, GA.schematic.contact, GA.schematic.bracket, GA.schematic.wire, GA.schematic.cells]
sources: ["Avsec et al., Nature 2026, Fig. 1a", "Linder et al., Nature Genetics 2025, Fig. 1a"]
see_also: [form-27, form-28, form-17]
---
# 29 · Data schematic

For the data a method takes in: which kinds of track, over what extent, how many,
at what resolution, and the unit the model reads (an interval, a patch, a token). It
is a picture of the data's shape, drawn with synthetic marks; the real values go in
the table beside it and in the charts.

- **One row per kind of track on a shared axis**, named at the left in `label`
  (14 px, `ink-2`), each on a 1.5 px `rule` baseline. The mark says the kind: bars
  for coverage, a smooth profile for a broad signal, arcs for links between two
  positions (splice junctions), ticks for single events, dots for measurements,
  intervals for spans (*Glyphs*, `../README.md`). Tracks that are all of one kind are
  `ink-2`; colour is kept for a job (a kind of record, `../../color.md`).
- **Make the profiles look like the data.** Peaks narrow or broad, dense or sparse,
  as the assay gives them, so each row is recognisable before its name is read.
- **The input is on top**: the sequence or the time span as a line, its extent on a
  bracket ("1 Mb", "Up to 10 years"), the axis carrying no ticks.
- **The unit the model reads** cuts the axis with dashed `rule` dividers (`3 3`),
  every other unit in `wash`, with a short `prussian` arrow from the input line into
  each unit.
- **Pairwise data sit under the tracks** as a contact map: the matrix turned 45° so
  each cell lies under the midpoint of its two positions, on the quantity ramp,
  only as many diagonals as the data hold.
- **The table at the right** gives each row its counts (`tick`, right-aligned,
  titled in `muted`) and its resolution in a pill, steps of one ramp from fine to
  coarse. A total sits under a hairline.

![A 1 Mb sequence cut into four intervals over seven kinds of genomic track and a contact map, with track counts per species and each row's resolution in a pill](out/29-data-schematic.main.png)

```js figure=main w=700 h=380
const S = GA.schematic(ga);
const X = 150, W = 350, P = 4, N = 140, rnd = GA.rng(29);
// synthetic profiles: peaks of a given width and density, plus a little noise
const prof = (k, wid, floor = 0) => {
  const at = Array.from({ length: k }, () => [rnd() * N, 0.35 + 0.65 * rnd()]);
  return Array.from({ length: N }, (_, j) => Math.min(1, Math.max(floor * rnd(), ...at.map(([c, a]) => a * Math.exp(-(((j - c) / wid) ** 2))))));
};
const exons = Array.from({ length: N }, (_, j) => ((j > 18 && j < 46) || (j > 96 && j < 124)) && rnd() < 0.35 ? 0.3 + 0.7 * rnd() : 0);
S.bracket({ x0: X, x1: X + W, y: 44, side: "top", label: "DNA sequence (1 Mb)" });
ga.raw(`<path d="M${X} 56H${X + W}" stroke="var(--ink-2)" stroke-width="1.5"/>`);
for (let k = 0; k < P; k++) S.wire([{ x: X + ((k + 0.5) / P) * W, y: 62 }, { x: X + ((k + 0.5) / P) * W, y: 80 }], { tone: "minor", color: "var(--prussian)" });
const rows = [
  { name: "RNA-seq", kind: "peaks", data: exons },
  { name: "CAGE", kind: "peaks", data: prof(4, 0.6) },
  { name: "DNase", kind: "peaks", data: prof(14, 1.2, 0.08) },
  { name: "ATAC", kind: "peaks", data: prof(10, 1, 0.06) },
  { name: "Histone marks", kind: "signal", data: prof(7, 6, 0.05) },
  { name: "TF binding", kind: "peaks", data: prof(5, 0.8) },
  { name: "Splice junctions", kind: "arcs", data: [[0.14, 0.2], [0.2, 0.31], [0.14, 0.31], [0.7, 0.76], [0.76, 0.86]] },
];
const res = ["1 bp", "1 bp", "1 bp", "1 bp", "128 bp", "128 bp", "1 bp"], step = { "1 bp": 100, "128 bp": 200, "2 kb": 300 };
const T = S.tracks({ x: X, y: 94, w: W, pitch: 26, patches: P, stripes: true, rows, cols: [
  { title: "Human", dx: 50, values: ["640", "520", "300", "170", "1,100", "1,600", "730"] },
  { title: "Mouse", dx: 100, values: ["170", "190", "70", "20", "180", "130", "180"] },
  { title: "Resolution", dx: 170, w: 56, values: res, pill: (i) => tok(`moss-${step[res[i]]}`) },
] });
// pairwise contacts under the tracks
const n = 28, band = 7, cy = T.bottom + 6;
// contacts fall off with distance and stay high inside a domain
const dom = [0, 5, 13, 18, 28], domOf = (i) => dom.findIndex((d, k) => i >= d && i < dom[k + 1]);
const contact = (i, j) => Math.exp(-(j - i) / 2.5) * (domOf(i) === domOf(j) ? 1 : 0.3) * (0.85 + 0.3 * rnd());
const C = S.contact({ x: X, y: cy, w: W, n, band, fill: (i, j) => tok(`teal-${Math.max(1, Math.min(7, Math.round(contact(i, j) * 7)))}00`) });
const mid = cy + (C.bottom - cy) / 2 - 9;
ga.text("Contact map", { x: X - 10, y: mid, anchor: "end", role: "label", size: 14, color: "var(--ink-2)" });
ga.text("30", { x: T.colX({ dx: 50 }), y: mid + 1, anchor: "end", role: "tick", size: 12, color: "var(--ink-2)" });
ga.text("8", { x: T.colX({ dx: 100 }), y: mid + 1, anchor: "end", role: "tick", size: 12, color: "var(--ink-2)" });
ga.pill("2 kb", { cx: T.colX({ dx: 170 }) - 28, cy: mid + 8, w: 56, h: 18, role: "tick", size: 12, fill: tok("moss-300"), color: "var(--ink)" });
// totals under a hairline
const ty = C.bottom + 10;
ga.raw(`<path d="M${T.colX({ dx: 0 }) + 12} ${ty}H${T.colX({ dx: 100 })}" stroke="var(--rule)" stroke-width="1.5"/>`);
ga.text("5,090", { x: T.colX({ dx: 50 }), y: ty + 6, anchor: "end", role: "tick", size: 12, color: "var(--ink)" });
ga.text("948", { x: T.colX({ dx: 100 }), y: ty + 6, anchor: "end", role: "tick", size: 12, color: "var(--ink)" });
```

## Records over time

For a patient's record from diagnosis on: the same layout as the genomic tracks, with
the complexities that make clinical time series hard to model drawn in, not smoothed
away. Drawn from synthetic data.

- **Each kind of record keeps its own shape and sampling.** Labs are measured values
  at irregular times: dense around diagnosis and each new line of therapy, sparse
  between, joined only across short gaps so missing time stays empty, and some stop
  being measured. Each value row spans its own range; there is no value axis.
  Treatments are concurrent intervals in lanes, one per drug, in steps of the
  treatment hue. Genomic findings come several at a time, stacked at the test. Sites
  recur in lanes, one per site. Demographics are one value at entry.
- **Colour is the kind of record**, identity slots in order (`../../color.md`);
  shades within a kind tell its items apart.
- **The record ends** on a follow-up line, `ink-2` from the first record to the
  last contact, closed by an x for death or a tick for censoring (*Glyphs*); the
  axis beyond it is empty.
- **The table** gives each kind the share of patients who have it, its records,
  and what one value is, in a `slate-100` pill ("binned", "370 drugs").
- **The unit the model reads opens beneath**: two years in wash, a busy one and a
  quiet one, each as a row of its 10-day patches, cells on a neutral ramp (`slate`)
  by the number of records in each and an empty patch as paper in a `rule`
  outline, so the reader sees how unevenly the record fills its patches.

![A synthetic patient's record over ten years: three labs sampled irregularly, concurrent treatments in lanes, stacked genomic findings, recurring sites, progression and death; a table of coverage, records and value types; years 1 and 5 opened into 36 ten-day patches each, shaded by records per patch](out/29-data-schematic.records-over-time.png)

```js figure=records-over-time w=700 h=440
const S = GA.schematic(ga);
const X = 140, W = 360, rnd = GA.rng(17);
// --- synthetic record (no patient data): times are fractions of ten years
const times = (segs) => segs.flatMap(([a, b, st]) => { const t = []; for (let u = a + st * rnd(); u < b; u += st * (0.6 + 0.8 * rnd())) t.push(u); return t; });
const onTx = (u) => (u > 0.02 && u < 0.18) || (u > 0.55 && u < 0.72);
const hgbT = times([[0, 0.06, 0.004], [0.06, 0.5, 0.024], [0.5, 0.62, 0.006], [0.62, 0.86, 0.02]]);
const clip = (v) => Math.max(0, Math.min(1, v));
const hgb = hgbT.map((u) => [u, clip(0.7 - (onTx(u) ? 0.35 : 0) - (u > 0.74 ? 0.35 * (u - 0.74) / 0.12 : 0) + 0.3 * (rnd() - 0.5))]);
const cre = hgbT.filter((_, i) => i % 2 === 0).map((u) => [u, clip(0.15 + 0.6 * u + (onTx(u) ? 0.2 : 0) + 0.25 * (rnd() - 0.5))]);
const cea = times([[0, 0.05, 0.008], [0.05, 0.42, 0.035]]).map((u) => [u, clip((u < 0.2 ? 0.95 - 3.5 * u : 0.25 + 2.5 * (u - 0.2)) + 0.15 * (rnd() - 0.5))]);
const tc = (k) => tok(`teal-${k}`);
const tx = [[0.02, 0.18, 0, tc(500)], [0.02, 0.18, 1, tc(700)], [0.18, 0.42, 0, tc(300)], [0.55, 0.72, 0, tc(500)], [0.55, 0.64, 1, tc(700)], [0.6, 0.605, 2, tc(300)], [0.76, 0.84, 0, tc(700)]];
const gen = [[0.012, 4], [0.53, 2]];
const sites = [[0, 0], [0.06, 0], [0.3, 0], [0.5, 1], [0.56, 1], [0.62, 1], [0.7, 1], [0.75, 2], [0.8, 2], [0.84, 1]];
const prog = [0.48, 0.74], end = 0.86;
// --- two years opened beneath, in wash under the tracks: a busy one and a quiet one
const Y0 = 94, pitch = 26, rowsN = 9, bottom = Y0 + rowsN * pitch, YEARS = [0, 4];
for (const yr of YEARS) {
  ga.raw(`<rect x="${X + (yr * W) / 10}" y="${Y0 - 4}" width="${W / 10}" height="${bottom - Y0 + 4}" fill="var(--wash)"/>`);
  ga.text(`Year ${yr + 1}`, { x: X + ((yr + 0.5) * W) / 10, y: Y0 - 22, anchor: "middle", role: "tick", size: 12, color: "var(--muted)" });
}
S.bracket({ x0: X, x1: X + W, y: 44, side: "top", label: "Up to 10 years from diagnosis" });
const T = S.tracks({ x: X, y: Y0, w: W, pitch, rows: [
  { name: "Demographics", kind: "spans", color: "var(--ink-2)", data: [[0, 0.012]] },
  { name: "Haemoglobin", kind: "values", color: "var(--cat-1)", data: hgb },
  { name: "Creatinine", kind: "values", color: "var(--cat-1)", data: cre },
  { name: "CEA", kind: "values", color: "var(--cat-1)", data: cea },
  { name: "Genomics", kind: "stacks", color: "var(--cat-2)", data: gen },
  { name: "Treatments", kind: "lanes", color: "var(--cat-3)", data: tx },
  { name: "Tumour sites", kind: "events", lanes: 3, color: "var(--cat-4)", data: sites },
  { name: "Progression", kind: "events", color: "var(--cat-5)", data: prog },
  { name: "Follow-up", kind: "follow", data: { from: 0, to: end, end: "death" } },
], cols: [
  { title: "Patients", dx: 48, values: ["100%", "93%", "93%", "40%", "90%", "78%", "96%", "62%", "100%"] },
  { title: "Records", dx: 100, values: ["4", "3.0M", "2.8M", "0.4M", "0.8M", "0.5M", "1.6M", "0.2M", "–"] },
  { title: "One value", dx: 180, w: 70, values: ["static", "binned", "binned", "binned", "734 genes", "370 drugs", "11 sites", "event", "outcome"], pill: () => tok("slate-100") },
] });
// --- each opened year in 10-day patches, shaded by records per patch
const P = 36, cell = W / P;
// an empty patch is paper in a rule outline; a filled one a step of the slate ramp
const shade = (n) => tok(`slate-${[200, 300, 400, 500, 600, 700][Math.min(5, n - 1)]}`);
const patch = (x, y, s, n) => n ? `<rect x="${x + 1}" y="${y + 1}" width="${s - 2}" height="${s - 2}" fill="${shade(n)}"/>`
  : `<rect x="${x + 1.5}" y="${y + 1.5}" width="${s - 3}" height="${s - 3}" fill="var(--paper)" stroke="var(--rule)" stroke-width="1"/>`;
let py = bottom + 30;
for (const yr of YEARS) {
  const lo = (j) => yr / 10 + (j / P) * 0.1, hi = (j) => lo(j + 1), inP = (u, j) => u >= lo(j) && u < hi(j);
  const count = (j) => [...hgb, ...cre, ...cea].filter(([u]) => inP(u, j)).length + gen.filter(([u]) => inP(u, j)).reduce((n, [, k]) => n + k, 0)
    + sites.filter(([u]) => inP(u, j)).length + prog.filter((u) => inP(u, j)).length + tx.filter(([a, b]) => a < hi(j) && b > lo(j)).length + (yr === 0 && j === 0 ? 1 : 0);
  ga.raw(Array.from({ length: P }, (_, j) => patch(X + j * cell, py, cell, count(j))).join(""));
  ga.text(`Year ${yr + 1}`, { x: X - 10, y: py - 2, anchor: "end", role: "label", size: 14, color: "var(--ink-2)" });
  py += cell + 12;
}
ga.text("10-day patches", { x: X + W + 10, y: bottom + 30 + cell / 2 + 3, role: "tick", size: 12, color: "var(--muted)" });
// key: records per patch
const ky = py + 4;
ga.text("Records per patch", { x: X, y: ky, role: "tick", size: 12, color: "var(--muted)" });
["0", "1", "2", "3", "4", "5", "6+"].forEach((t, k) => {
  const kx = X + 112 + k * 30;
  ga.raw(patch(kx - 1, ky, 14, k));
  ga.text(t, { x: kx + 16, y: ky, role: "tick", size: 12, color: "var(--ink-2)" });
});
```

## In each format

| Element | Canvas | Print |
|---|---|---|
| Row pitch, name | 26 px, 14 px | 3 mm, 6–7 pt |
| Event dot / tick / interval | r 3.5 / 2 × 11 px / 7 px tall | r 1 pt / 0.75 pt × 1.2 mm / 0.8 mm |
| Divider | 1.5 px `rule`, `3 3` dash | 0.5 pt, `1 1` dash |
| Coverage bar, profile | row pitch 26 px, peak 16 px | 3 mm pitch, peak 1.8 mm |
| Contact cell | 12–13 px across | 1.2–1.5 mm |
| Resolution or value pill | 18 px tall, 12 px text | 2 mm, 5–6 pt |
| Lab value / lane | r 1.8 dot, 1 px join / 4 px lane, 6 px pitch | r 0.6 pt, 0.35 pt / 0.5 mm, 0.7 mm pitch |
| Field cell | 16 px, 2 px paper gap | 1.6–2 mm, 0.5 pt gap |
