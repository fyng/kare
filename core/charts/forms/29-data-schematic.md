---
id: form-29
name: Data schematic
kind: schematic
family: schematic
job: ["What data a method takes in: their kinds, extent, counts and the unit it reads"]
kit: [GA.schematic.tracks, GA.schematic.contact, GA.schematic.bracket, GA.schematic.wire]
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

For records that arrive as events over time (a patient's labs, treatments, findings):
a row per kind of record on one axis from diagnosis, each drawn as its data type,
the rows grouped by data type and the end of the record marked across every row,
so the reader sees how irregular, sparse and mixed the record is.

- **One row per kind of record**, named at the left in `label`, rows of a data type
  together with a small gap between types. A right bracket names each data type
  once: continuous, ordinal, multi-category, binary.
- **Colour is the data type**, identity slots in order (`../../color.md`); every
  row of a type takes its colour.
- **Each kind keeps its own shape and sampling.** Labs are measured values at
  irregular times, dense around diagnosis and each new line of therapy, joined only
  across short gaps so missing time stays empty; there is no value axis. An ordinal
  score snaps to its levels and steps between them. Treatments are intervals in
  stacked lanes (`lanes`), overlapping when given together. A mutation is a tick at
  its test. Tumour sites are one lane each: a light bar while the site is present, a
  dot at each mention, so a site can clear on treatment and come back after
  progression. A binary assessment is a hollow circle for no and a filled one for yes.
- **Marks sit centred** between the row's top and its baseline.
- **What holds for the whole record is an annotation, not a track**: demographics
  at diagnosis are a short mark and a `tick` note at the start of the axis, on the
  line of the end mark.
- **The end of the record is a vertical line through every row**: solid with an x
  for death, dotted with a hollow circle for censoring (*Glyphs*); the axis beyond it
  stays empty.
- **Records per patch** is one strip under the rows on the `slate` ramp, empty
  patches blank, with no key: darker is more.
- **The table** gives each row its records and the share of patients with any;
  the records' total sits under a hairline below the last counted row.

![A synthetic patient's record over ten years: two labs and a performance score sampled irregularly, treatments in two lanes, mutations, three tumour sites that clear and return, binary progression assessments, the record ending in death; records per 10-day patch as one strip; records and patients per row, bracketed by data type](out/29-data-schematic.records-over-time.png)

```js figure=records-over-time w=700 h=310
const S = GA.schematic(ga);
const X = 140, W = 306, END = 0.82, P = 10, top = 72, G = 6, rnd = GA.rng(7);
// synthetic labs: dense near diagnosis and each new line of therapy
const t = (segs) => segs.flatMap(([a, b, st]) => { const r = []; for (let u = a + st * rnd(); u < b; u += st * (0.6 + 0.8 * rnd())) r.push(u); return r; });
const lt = t([[0, 0.06, 0.006], [0.06, 0.48, 0.03], [0.48, 0.56, 0.008], [0.56, END, 0.025]]);
const hgb = lt.map((u) => [u, 0.5 + 0.35 * Math.sin(u * 9) + 0.15 * rnd()]);
const cre = lt.filter((_, i) => i % 2).map((u) => [u, 0.2 + 0.7 * u + 0.15 * rnd()]);
const ecog = [[0.02, 1], [0.15, 0], [0.35, 0], [0.5, 1], [0.62, 2], [0.78, 3]];
const tx = [[0.03, 0.18], [0.5, 0.62], [0.67, 0.79]], mut = [0.02, 0.5];
const tx2 = [tx, [[0.03, 0.3], [0.5, 0.58]]];
// three sites: two clear on treatment and come back after progression
const sites = [
  { spans: [[0.02, 0.52], [0.7, END]], at: [0.02, 0.3, 0.7] },
  { spans: [[0.3, 0.56], [0.72, END]], at: [0.3, 0.45, 0.72] },
  { spans: [[0.46, END]], at: [0.46, 0.6, 0.76] },
];
const site = { at: sites.flatMap((l) => l.at) };
const prog = [[0.15, 0], [0.3, 0], [0.45, 1], [0.58, 0], [0.7, 1]];
const NP = 120, all = [...hgb, ...cre, ...ecog, ...prog].map((d) => d[0]).concat(mut, site.at);
const density = Array.from({ length: NP }, (_, j) => { const lo = j / NP, hi = (j + 1) / NP; return all.filter((u) => u >= lo && u < hi).length + tx.filter(([a, b]) => a < hi && b > lo).length; });
const rows = [
  { name: "Haemoglobin", color: "var(--cat-1)", kind: "values", gap: 0.05, data: hgb },
  { name: "Creatinine", color: "var(--cat-1)", kind: "values", gap: 0.08, gapAfter: G, data: cre },
  { name: "ECOG", color: "var(--cat-2)", kind: "values", levels: 4, gap: 0.2, gapAfter: G, data: ecog },
  { name: "Treatments", color: "var(--cat-3)", kind: "spans", lanes: true, pitch: 26, data: tx2 },
  { name: "Mutations", color: "var(--cat-3)", kind: "ticks", data: mut },
  { name: "Tumour sites", color: "var(--cat-3)", kind: "persist", lanes: true, pitch: 30, light: tok("teal-200"), gapAfter: G, data: sites },
  { name: "Progression", color: "var(--cat-4)", kind: "binary", gapAfter: G + 4, data: prog },
  { name: "Records per patch", kind: "density", pitch: 20, data: density },
];
S.bracket({ x0: X, x1: X + W, y: 40, side: "top", label: "Up to 10 years from diagnosis" });
const T = S.tracks({ x: X, y: top, w: W, pitch: 22, patches: P, rows, end: { u: END, kind: "death", label: "death" }, cols: [
  { title: "Records", dx: 54, values: ["5.2M", "2.9M", "0.3M", "0.5M", "0.8M", "1.6M", "0.2M", null] },
  { title: "Patients", dx: 112, values: ["97%", "95%", "62%", "88%", "71%", "90%", "58%", null] },
] });
// one bracket per data type
const types = [["continuous", 0, 1], ["ordinal", 2, 2], ["multi-category", 3, 5], ["binary", 6, 6]];
const bx = T.colX({ dx: 126 });
for (const [name, a, b] of types) S.bracket({ x: bx, y0: T.rowY(a) - 15, y1: T.rowY(b) + 1, side: "right", label: name, size: 13 });
// the total right under the last counted row
const ty = T.rowY(6) + 4;
ga.raw(`<path d="M${T.colX({ dx: 12 })} ${ty}H${T.colX({ dx: 54 })}" stroke="var(--rule)" stroke-width="1.5"/>`);
ga.text("11.5M", { x: T.colX({ dx: 54 }), y: ty + 5, anchor: "end", role: "tick", size: 12, color: "var(--ink)" });
// what holds for the whole record, on the line of the end mark
ga.raw(`<path d="M${X} ${top - 22}V${top - 4}" stroke="var(--ink-2)" stroke-width="1.5"/>`);
ga.text("Diagnosis: age, sex, cancer type", { x: X + 6, y: top - 21, role: "tick", size: 12, color: "var(--muted)" });
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
| Lab value; category row | r 1.8 dot, 1 px join; 16 px row, 12 px name | r 0.6 pt, 0.35 pt; 1.8 mm row, 5 pt name |
| End of record | 1.5 px line, solid with an x (death) or dotted with a hollow circle (censored) | 0.5 pt |
| Field cell | 16 px, 2 px paper gap | 1.6–2 mm, 0.5 pt gap |
