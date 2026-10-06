// Schematic layer for the kit: architecture, procedure and data schematics
// (core/illustration.md, *Schematics*; chart forms 27–29).
//
//   const S = GA.schematic(ga);
//   S.block({ x, y, w, h, label, role, depth });   // a module: role "model" | "op" | "data"; tone "context"
//   S.cells({ x, y, n, cell, fill, dir, depth });  // a vector or feature map: square cells, 2 px paper gaps
//   S.op({ cx, cy, sym });                         // an operator node: "+" or "×" on a paper disc
//   S.port(item, side, f);                         // a point just off one side of an item, for wires
//   S.wire([p0, p1, …], { tone, dash, head });     // a connector through the points, corners rounded
//   S.flow([p0, p1, …], { w });                    // the wide band that carries the main data path
//   S.bracket({ x, y0, y1, side, label });         // a square bracket: repeats (4×), spans, groups
//   S.step("1", "Encode", { x, y });               // a step's number and name
//   S.tracks({ x, y, w, rows, cols, patches });    // records on a shared axis, a table at right
//   S.contact({ x, y, w, n, band, fill });         // a pairwise map under the axis, turned 45°
//   S.grid({ x, y, rows, cols, cell, fill });      // a matrix (a pair representation)
//   S.panel({ x, y, w, h, label });                // one block opened, its parts inside
//   S.state({ cx, cy, rows, tone });               // a cartoon of a state (a mini record)
//   S.fn(item, "v", { color });                    // a function of a state: v( … )
//
// Text goes through the kit and blocks register as solids, so the lint covers both.
(function () {
  const box = (x0, y0, x1, y1) => ({ x0, y0, x1, y1, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 });
  const f1 = (v) => +v.toFixed(1);
  const anchors = (it, b) => Object.assign(it, { box: b, l: b.x0, r: b.x1, t: b.y0, b: b.y1, cx: b.cx, cy: b.cy, w: b.w, h: b.h });

  // A block's look follows its role. A model is learned (prussian outline, blue wash);
  // an op is a fixed step (wash, no outline), as the method box of core/illustration.md;
  // data are what flows (paper, context outline). Tone "context" greys any of them
  // out: the parts of a procedure that are not the step being shown.
  const ROLES = {
    model: { fill: "var(--blue-100)", stroke: "var(--prussian)" },
    op: { fill: "var(--wash)", stroke: "none" },
    data: { fill: "var(--paper)", stroke: "var(--context)" },
  };
  const DEPTH = 5; // offset of each copy in a stack, up and to the right
  const LABEL = 14; // block and track label size

  GA.schematic = function (ga) {
    const S = {};

    // ---- block: a module, a step or a data object; depth n stacks n copies
    S.block = (o) => {
      const role = ROLES[o.role || "model"], dim = o.tone === "context";
      const fill = o.fill || (dim ? "var(--paper)" : role.fill);
      const stroke = o.stroke || (dim ? "var(--context)" : role.stroke);
      const r = o.r ?? 6, n = o.depth || 1;
      let m = "";
      for (let k = n - 1; k >= 0; k--)
        m += `<rect x="${f1(o.x + k * DEPTH)}" y="${f1(o.y - k * DEPTH)}" width="${o.w}" height="${o.h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"${o.dash ? ` stroke-dasharray="4 4"` : ""}/>`;
      const it = ga.raw(m, { at: o.at, anim: "pop" });
      anchors(it, box(o.x, o.y - (n - 1) * DEPTH, o.x + o.w + (n - 1) * DEPTH, o.y + o.h));
      Object.assign(it, { kind: "rect", lint: o.lint !== false, face: box(o.x, o.y, o.x + o.w, o.y + o.h) });
      if (o.label) {
        const size = o.size || LABEL, lh = 1.3 * size, lines = String(o.label).split("\n").length;
        const th = (lines - 1) * lh + 1.05 * size;
        it.label = ga.text(o.label, {
          x: o.x + o.w / 2, y: o.y + o.h / 2 - th / 2, anchor: "middle", role: o.math ? "math" : "label", size,
          weight: o.weight, color: dim ? "var(--muted)" : o.color || "var(--ink)", at: o.at,
        });
      }
      return it;
    };

    // ---- cells: a vector (a token, a bin, a state) as square cells, 2 px paper gaps;
    // fill is a colour or (i, layer) => colour; depth stacks channels behind
    S.cells = (o) => {
      const c = o.cell || 14, n = o.n, horiz = (o.dir || "h") === "h", layers = o.depth || 1;
      const W = horiz ? n * c : c, H = horiz ? c : n * c;
      let m = "";
      for (let k = layers - 1; k >= 0; k--) {
        // a paper backing, so each layer hides the one behind it
        if (layers > 1) m += `<rect x="${o.x + k * DEPTH}" y="${o.y - k * DEPTH}" width="${W}" height="${H}" fill="var(--paper)"/>`;
        for (let i = 0; i < n; i++) {
          const fill = typeof o.fill === "function" ? o.fill(i, k) : o.fill || "var(--blue-200)";
          if (!fill) continue;
          const x = o.x + (horiz ? i * c : 0) + k * DEPTH, y = o.y + (horiz ? 0 : i * c) - k * DEPTH;
          m += `<rect x="${f1(x + 1)}" y="${f1(y + 1)}" width="${c - 2}" height="${c - 2}" fill="${fill}"/>`;
        }
      }
      const it = ga.raw(m, { at: o.at, anim: "fade", t: 0.4 });
      anchors(it, box(o.x, o.y - (layers - 1) * DEPTH, o.x + W + (layers - 1) * DEPTH, o.y + H));
      Object.assign(it, { kind: "rect", lint: o.lint !== false, face: box(o.x, o.y, o.x + W, o.y + H) });
      return it;
    };

    // ---- op: an operator where two paths meet (sum, product)
    S.op = (o) => {
      const r = o.r || 9, k = r * 0.5, { cx, cy } = o, col = o.color || "var(--prussian)";
      const sym = o.sym === "×"
        ? `M${f1(cx - k * 0.8)} ${f1(cy - k * 0.8)}L${f1(cx + k * 0.8)} ${f1(cy + k * 0.8)}M${f1(cx + k * 0.8)} ${f1(cy - k * 0.8)}L${f1(cx - k * 0.8)} ${f1(cy + k * 0.8)}`
        : `M${f1(cx - k)} ${cy}H${f1(cx + k)}M${cx} ${f1(cy - k)}V${f1(cy + k)}`;
      const it = ga.raw(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--paper)" stroke="${col}" stroke-width="1.5"/><path d="${sym}" stroke="${col}" stroke-width="1.5" stroke-linecap="round"/>`, { at: o.at, anim: "pop" });
      anchors(it, box(cx - r, cy - r, cx + r, cy + r));
      Object.assign(it, { kind: "rect", lint: o.lint !== false, face: it.box });
      return it;
    };

    // ---- port: a point gap px off one side of an item's face, f along that side
    S.port = (it, side, f = 0.5, gap = 6) => {
      const B = it.face || it.box;
      if (side === "r") return { x: f1(B.x1 + gap), y: f1(B.y0 + f * B.h) };
      if (side === "l") return { x: f1(B.x0 - gap), y: f1(B.y0 + f * B.h) };
      if (side === "t") return { x: f1(B.x0 + f * B.w), y: f1(B.y0 - gap) };
      return { x: f1(B.x0 + f * B.w), y: f1(B.y1 + gap) };
    };

    // ---- wire: a connector through the points, corners rounded (radius r), an open
    // chevron at the end. tone "main": 2.5 px prussian, the path the data take;
    // "minor": 1.5 px ink-2, side paths (skips, targets, conditioning).
    // dash: a path no gradient flows along, or a sampled one.
    S.wire = (pts, o = {}) => {
      const main = (o.tone || "main") === "main";
      const col = o.color || (main ? "var(--prussian)" : "var(--ink-2)"), sw = o.width || (main ? 2.5 : 1.5);
      const rad = o.r ?? 10;
      let d = `M${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length - 1; i++) {
        const p = pts[i - 1], q = pts[i], s = pts[i + 1];
        const l1 = Math.hypot(q.x - p.x, q.y - p.y), l2 = Math.hypot(s.x - q.x, s.y - q.y);
        const k = Math.min(rad, l1 / 2, l2 / 2);
        const a = { x: q.x - ((q.x - p.x) / l1) * k, y: q.y - ((q.y - p.y) / l1) * k };
        const b = { x: q.x + ((s.x - q.x) / l2) * k, y: q.y + ((s.y - q.y) / l2) * k };
        d += `L${f1(a.x)} ${f1(a.y)}Q${q.x} ${q.y} ${f1(b.x)} ${f1(b.y)}`;
      }
      const e = pts.at(-1), p = pts.at(-2);
      d += `L${e.x} ${e.y}`;
      const g = ga.raw(`<path d="${d}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${o.dash ? ` stroke-dasharray="5 5"` : ""}/>`, { at: o.at, anim: "fade", t: 0.4 });
      if (o.head !== false) {
        const ang = Math.atan2(e.y - p.y, e.x - p.x), L = o.headSize || (main ? 8 : 6.5);
        const hx = (a2) => f1(e.x + L * Math.cos(ang + a2)), hy = (a2) => f1(e.y + L * Math.sin(ang + a2));
        g.node.insertAdjacentHTML("beforeend", `<path d="M${hx(Math.PI * 0.78)} ${hy(Math.PI * 0.78)}L${e.x} ${e.y}L${hx(-Math.PI * 0.78)} ${hy(-Math.PI * 0.78)}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`);
      }
      const xs = pts.map((q) => q.x), ys = pts.map((q) => q.y);
      anchors(g, box(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)));
      Object.assign(g, { kind: "arrow", path: g.node.querySelector("path"), ends: [o.from, o.to].filter(Boolean), lint: o.lint !== false });
      return g;
    };

    // ---- flow: a wide rule band with a broad head, drawn first, under the marks it
    // carries. It shows the overview path of the data (into the encoder, out of the
    // decoder) where a wire would be lost among the module's own connectors.
    S.flow = (pts, o = {}) => {
      const w = o.w || 24, col = o.color || "var(--rule)", e = pts.at(-1), p = pts.at(-2);
      const ang = Math.atan2(e.y - p.y, e.x - p.x), L = w * 0.85, hw = w * 0.95;
      const base = { x: e.x - L * Math.cos(ang), y: e.y - L * Math.sin(ang) };
      const body = [...pts.slice(0, -1), base].map((q, i) => `${i ? "L" : "M"}${f1(q.x)} ${f1(q.y)}`).join("");
      const px = -Math.sin(ang), py = Math.cos(ang);
      const head = `M${f1(base.x + px * hw)} ${f1(base.y + py * hw)}L${e.x} ${e.y}L${f1(base.x - px * hw)} ${f1(base.y - py * hw)}Z`;
      return ga.raw(`<path d="${body}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linejoin="round"/><path d="${head}" fill="${col}"/>`, { at: o.at, anim: "fade", t: 0.5 });
    };

    // ---- bracket: square, 1.5 px ink-2, ticks 6 px. Vertical { x, y0, y1, side }
    // ("right": the bracket closes over items to its left, the label to its right);
    // horizontal { x0, x1, y, side } ("top": over items below it, the label above).
    S.bracket = (o) => {
      const t = o.tick ?? 6, side = o.side || "right", size = o.size || 13;
      const lab = { role: "label", size, color: "var(--ink-2)", at: o.at };
      let d, label = null;
      if (side === "right" || side === "left") {
        const s = side === "right" ? -1 : 1;
        d = `M${o.x + s * t} ${o.y0}H${o.x}V${o.y1}H${o.x + s * t}`;
        if (o.label) {
          const lines = String(o.label).split("\n").length, th = (lines - 1) * 1.3 * size + 1.05 * size;
          label = ga.text(o.label, { ...lab, x: o.x - s * 8, y: (o.y0 + o.y1) / 2 - th / 2, anchor: side === "right" ? "start" : "end" });
        }
      } else {
        const s = side === "top" ? 1 : -1;
        d = `M${o.x0} ${o.y + s * t}V${o.y}H${o.x1}V${o.y + s * t}`;
        if (o.label) label = ga.text(o.label, { ...lab, x: (o.x0 + o.x1) / 2, y: side === "top" ? o.y - size * 1.05 - 5 : o.y + 5, anchor: "middle" });
      }
      ga.raw(`<path d="${d}" fill="none" stroke="var(--ink-2)" stroke-width="1.5"/>`, { at: o.at, anim: "fade", t: 0.4 });
      return label;
    };

    // ---- step: a step's number in prussian and its name in ink, both 500
    S.step = (num, name, o) => {
      const size = o.size || 16, at = o.at;
      const a = ga.text(String(num), { x: o.x, y: o.y, role: "label", size, weight: 500, color: "var(--prussian)", at });
      const b = ga.text(name, { x: a.r + 0.5 * size, y: o.y, role: "label", size, weight: 500, color: o.dim ? "var(--muted)" : "var(--ink)", at });
      return ga.union(a, b);
    };

    // ---- state: a cartoon of the object a step acts on (a record, a board), small
    // enough to repeat in a tree. A card (paper, 1.5 px outline, 4 px radius) holding
    // mini tracks: rows [{ kind: "spans" | "events", data, colors? }], data as in
    // S.tracks (spans may carry a colour: [a, b, colour]). tone "ink" draws the marks
    // in their colours with an ink-2 outline; "context" greys the whole card out;
    // "add" outlines it in prussian (a state a step creates).
    S.state = (o) => {
      const w = o.w || 60, h = o.h || 38, x = o.cx - w / 2, y = o.cy - h / 2, tone = o.tone || "ink";
      const grey = tone === "context", edge = grey ? "var(--context)" : tone === "add" ? "var(--prussian)" : "var(--ink-2)";
      const rows = o.rows || [], pitch = (h - 6) / Math.max(1, rows.length), X = (u) => f1(x + 5 + u * (w - 10));
      let m = `<rect x="${f1(x)}" y="${f1(y)}" width="${w}" height="${h}" rx="4" fill="var(--paper)" stroke="${edge}" stroke-width="${tone === "add" ? 2 : 1.5}"/>`;
      rows.forEach((r, i) => {
        const by = f1(y + 3 + (i + 1) * pitch - 2);
        m += `<path d="M${X(0)} ${by}H${X(1)}" stroke="var(--rule)" stroke-width="1"/>`;
        const col = (c) => (grey ? "var(--context)" : c || r.color || "var(--ink-2)");
        if (r.kind === "spans") for (const [a, b, c] of r.data) m += `<rect x="${X(a)}" y="${f1(by - 6)}" width="${f1((b - a) * (w - 10))}" height="5" fill="${col(c)}"/>`;
        else for (const u of r.data) m += `<circle cx="${X(u)}" cy="${f1(by - 3.5)}" r="2.4" fill="${col()}"/>`;
      });
      const it = ga.raw(m, { at: o.at, anim: "pop" });
      anchors(it, box(x, y, x + w, y + h));
      Object.assign(it, { kind: "rect", lint: o.lint !== false, face: it.box });
      return it;
    };

    // ---- fn: a function applied to a state, written as the paper writes it,
    // name(state): the name in math to the left, thin parentheses around the item
    S.fn = (it, name, o = {}) => {
      const col = o.color || "var(--ink)", B = it.face || it.box, y0 = B.y0 - 3, y1 = B.y1 + 3, l = B.x0 - 5, r = B.x1 + 5;
      ga.raw(`<path d="M${l} ${y0}Q${l - 6} ${B.cy} ${l} ${y1}M${r} ${y0}Q${r + 6} ${B.cy} ${r} ${y1}" fill="none" stroke="${col}" stroke-width="1.5" stroke-linecap="round"/>`, { at: o.at, anim: "fade" });
      return ga.text(`*${name}*`, { x: l - 6, y: B.cy - 0.5 * GA.ROLE.math.size - 2, anchor: "end", role: "math", color: col, at: o.at });
    };

    // ---- tracks: one row per kind of record on a shared axis from x to x + w.
    //   rows: [{ name, kind, data, color }], kind:
    //     events: positions 0..1 (dots); ticks: positions 0..1 (genomic marks);
    //     spans: [[a, b], …] (intervals); signal: values 0..1 at even steps (a smooth
    //     profile); peaks: values 0..1 per bin (coverage, as bars); arcs: [[a, b], …]
    //     (junctions, contacts between two positions); values: [[u, v], …] (measurements,
    //     joined across gaps ≤ row.gap); lanes: [[a, b, lane, colour?], …] (concurrent
    //     intervals); stacks: [[u, n], …] (n findings at one time); events may take
    //     [u, lane] with row.lanes; follow: { from, to, end: "death" | "censor" }
    //   patches: n dashed dividers that cut the axis into n equal patches;
    //   stripes: every other patch in wash; dividers: false drops the dashed lines
    //   cols: [{ title, values, dx, pill }]: a table at right, one value per row, its
    //     right edge dx from the axis end; pill: (i) => fill sets each value in a pill
    // Returns { rowY(i): baseline, x0, x1, top, bottom, patchX(k), colX(c) }.
    S.tracks = (o) => {
      const pitch = o.pitch || 26, n = o.rows.length, x0 = o.x, x1 = o.x + o.w, top = o.y, bottom = o.y + n * pitch;
      const X = (u) => f1(x0 + u * o.w), base = (i) => top + (i + 1) * pitch - 6, P = o.patches || 1;
      let back = "", marks = "";
      if (o.stripes) for (let k = 1; k < P; k += 2) back += `<rect x="${X(k / P)}" y="${top - 4}" width="${f1(o.w / P)}" height="${bottom - top + 4}" fill="var(--wash)"/>`;
      if (o.patches && o.dividers !== false) for (let k = 1; k < P; k++) back += `<path d="M${X(k / P)} ${top - 4}V${bottom}" stroke="var(--rule)" stroke-width="1.5" stroke-dasharray="3 3"/>`;
      o.rows.forEach((row, i) => {
        const y = base(i), col = row.color || "var(--ink-2)", H = pitch - 10;
        back += `<path d="M${x0} ${y}H${x1}" stroke="var(--rule)" stroke-width="1.5"/>`;
        const lane = (k) => y - 6 - (k || 0) * 6; // lanes stack upward, 6 px apart
        if (row.kind === "events") for (const d of row.data) { const [u, k] = [].concat(d); marks += `<circle cx="${X(u)}" cy="${row.lanes ? lane(k) + 2 : y - 6}" r="${row.lanes ? 2.5 : 3.5}" fill="${col}"/>`; }
        else if (row.kind === "lanes") for (const [a, b, k, c] of row.data) marks += `<rect x="${X(a)}" y="${lane(k) - 1}" width="${f1(Math.max(2, (b - a) * o.w))}" height="4" fill="${c || col}"/>`;
        else if (row.kind === "stacks") for (const [u, k] of row.data) for (let j = 0; j < k; j++) marks += `<rect x="${f1(+X(u) - 2)}" y="${y - 5 - j * 5}" width="4" height="4" fill="${col}"/>`;
        else if (row.kind === "values") {
          // measured values: dots, joined only across short gaps, so missing time stays empty
          // the row spans the values' own range: a schematic has no value axis
          const vs = row.data.map((d) => d[1]), lo = Math.min(...vs), hi = Math.max(...vs), Hv = pitch - 8;
          const gap = row.gap ?? 0.06, P2 = row.data.map(([u, v]) => [+X(u), f1(y - 2 - ((v - lo) / (hi - lo || 1)) * Hv)]);
          let d = "";
          P2.forEach(([px, py], j) => { d += (j && row.data[j][0] - row.data[j - 1][0] <= gap ? "L" : "M") + `${f1(px)} ${py}`; });
          marks += `<path d="${d}" fill="none" stroke="${col}" stroke-width="1" stroke-linejoin="round" opacity=".55"/>` + P2.map(([px, py]) => `<circle cx="${f1(px)}" cy="${py}" r="1.8" fill="${col}"/>`).join("");
        } else if (row.kind === "follow") {
          // follow-up from the record's start to its end: an x for death, a tick for censoring
          const { from, to, end } = row.data, ex = +X(to), cy = y - 6;
          marks += `<path d="M${X(from)} ${cy}H${ex}" stroke="var(--ink-2)" stroke-width="1.5"/>` + GA.glyph(end === "death" ? "x" : "tick", ex, cy, { size: 10 });
        }
        else if (row.kind === "ticks") for (const u of row.data) marks += `<path d="M${X(u)} ${y - 12}V${y - 1}" stroke="${col}" stroke-width="2"/>`;
        else if (row.kind === "spans") for (const [a, b] of row.data) marks += `<rect x="${X(a)}" y="${y - 10}" width="${f1((b - a) * o.w)}" height="7" fill="${col}"/>`;
        else if (row.kind === "signal") {
          const step = o.w / (row.data.length - 1);
          marks += `<path d="M${x0} ${y}${row.data.map((v, j) => `L${f1(x0 + j * step)} ${f1(y - v * H)}`).join("")}L${x1} ${y}Z" fill="${col}"/>`;
        } else if (row.kind === "peaks") {
          const bw = o.w / row.data.length;
          row.data.forEach((v, j) => { if (v > 0.02) marks += `<rect x="${f1(x0 + j * bw)}" y="${f1(y - v * H)}" width="${f1(bw)}" height="${f1(v * H)}" fill="${col}"/>`; });
        } else if (row.kind === "arcs")
          for (const [a, b] of row.data) marks += `<path d="M${X(a)} ${y}Q${f1((+X(a) + +X(b)) / 2)} ${f1(y - Math.min(2 * H, (b - a) * o.w * 0.6))} ${X(b)} ${y}" fill="none" stroke="${col}" stroke-width="1.5"/>`;
        if (row.name) ga.text(row.name, { x: x0 - 10, y: y - 6 - LABEL * 0.6, anchor: "end", role: "label", size: o.size || LABEL, color: "var(--ink-2)", at: o.at });
      });
      ga.raw(back, { at: o.at, anim: "fade", t: 0.4 });
      ga.raw(marks, { at: o.at, anim: "fade", t: 0.5 });
      const colX = (c) => x1 + c.dx;
      for (const c of o.cols || []) {
        ga.text(c.title, { x: colX(c), y: top - 20, anchor: "end", role: "tick", size: 12, color: "var(--muted)", at: o.at });
        c.values.forEach((v, i) => {
          if (v === null || v === undefined) return;
          const cy = base(i) - 6;
          if (c.pill) ga.pill(String(v), { cx: colX(c) - (c.w || 50) / 2, cy, w: c.w || 50, h: 18, role: "tick", size: 12, fill: c.pill(i), color: "var(--ink)", at: o.at });
          else ga.text(String(v), { x: colX(c), y: cy - 12 * 0.6, anchor: "end", role: "tick", size: 12, color: "var(--ink-2)", at: o.at });
        });
      }
      return { rowY: base, x0, x1, top, bottom, patchX: (k) => X(k / P), colX };
    };

    // ---- contact: a pairwise map under an axis, as the upper triangle of an n × n
    // matrix turned 45° so each cell sits under the midpoint of its two positions;
    // band keeps cells with j − i < band. fill: (i, j) => colour or null.
    S.contact = (o) => {
      const s = o.w / o.n, band = o.band || o.n;
      let m = "";
      for (let i = 0; i < o.n; i++)
        for (let j = i; j < Math.min(o.n, i + band); j++) {
          const f = o.fill(i, j);
          if (!f) continue;
          const cx = o.x + ((i + j + 1) / 2) * s, cy = o.y + ((j - i) + 0.5) * (s / 2), h = s / 2 - 0.6;
          m += `<path d="M${f1(cx)} ${f1(cy - h)}L${f1(cx + h)} ${f1(cy)}L${f1(cx)} ${f1(cy + h)}L${f1(cx - h)} ${f1(cy)}Z" fill="${f}"/>`;
        }
      ga.raw(m, { at: o.at, anim: "fade", t: 0.5 });
      return { bottom: o.y + band * (s / 2) + s / 4 };
    };

    // ---- grid: a matrix as square cells, 2 px paper gaps; fill: (i, j) => colour
    S.grid = (o) => {
      const c = o.cell || 10;
      let m = "";
      for (let i = 0; i < o.rows; i++)
        for (let j = 0; j < o.cols; j++) m += `<rect x="${f1(o.x + j * c + 1)}" y="${f1(o.y + i * c + 1)}" width="${c - 2}" height="${c - 2}" fill="${o.fill(i, j)}"/>`;
      const it = ga.raw(m, { at: o.at, anim: "fade", t: 0.4 });
      anchors(it, box(o.x, o.y, o.x + o.cols * c, o.y + o.rows * c));
      Object.assign(it, { kind: "rect", lint: o.lint !== false, face: it.box });
      return it;
    };

    // ---- panel: one block opened, its parts drawn inside; wash, 10 px radius, its
    // name under it. Not a solid for the lint, so wires may run inside it.
    S.panel = (o) => {
      const it = ga.raw(`<rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" rx="10" fill="var(--wash)"/>`, { at: o.at, anim: "fade", t: 0.5 });
      anchors(it, box(o.x, o.y, o.x + o.w, o.y + o.h));
      it.face = it.box;
      if (o.label) it.label = ga.text(o.label, { x: o.x + o.w / 2, y: o.y + o.h + 6, anchor: "middle", role: "label", size: LABEL, color: "var(--ink-2)", at: o.at });
      return it;
    };

    return S;
  };
})();
