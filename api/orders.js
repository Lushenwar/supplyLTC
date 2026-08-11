import { put, list, del } from "@vercel/blob";

// One order document per unit per ordering cycle — the single source of truth
// for "what has this unit ordered this month".
//
// Kiosks read it when a unit is selected and write it back as the cart changes,
// so a later shift opens the earlier shift's order instead of building a
// parallel one. The admin collects the final state from /api/inventory's admin
// panel; nothing is emailed on save, which is why they no longer get one email
// per click.
//
// Same immutable-blob trick as api/inventory.js: each save writes a new,
// uniquely-named blob and the newest one wins, because overwriting a fixed-URL
// blob is subject to read-after-write staleness.
const PREFIX = "orders/";

// Versions kept per unit per cycle. Old ones are free undo if someone clears a
// cart by accident; the cap keeps a month of autosaves from piling up.
const KEEP = 20;

export const slug = (s) =>
  String(s || "none").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "none";

export const cycleDir = (cycle) => `${PREFIX}${slug(cycle)}/`;
export const unitDir = (cycle, unit) => `${cycleDir(cycle)}${slug(unit)}/`;

// Which path segment of `orders/<cycle>/<unit>/<ts>.json` identifies the unit.
// The GET-all handler groups a flat blob list by this, so it has to stay in
// step with unitDir above — that's what test-orders.js pins down.
export const unitSegment = (pathname) => pathname.split("/")[2];

export const byNewest = (a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1);

// A shift working on the order saves every couple of seconds. Folding a run of
// saves by the same person into one entry is what keeps the history readable as
// "Sarah added 3 things at 2pm" instead of forty keystroke-sized rows.
const COALESCE_MS = 10 * 60 * 1000;
// A month of coalesced entries is nowhere near this; the cap just stops a
// pathological cycle from growing the doc without bound.
const HISTORY_MAX = 100;

// What this save changed, as { itemIndex: [from, to] }. Item indices rather
// than codes: the client already resolves indices against the same inventory to
// draw the cart, and indices are stable within a cycle.
export const appendHistory = (history, prevLines, nextLines, by, now) => {
  const changes = {};
  new Set([...Object.keys(prevLines || {}), ...Object.keys(nextLines || {})]).forEach((k) => {
    const from = Number((prevLines || {})[k]) || 0;
    const to = Number((nextLines || {})[k]) || 0;
    if (from !== to) changes[k] = [from, to];
  });
  // An autosave that changed nothing (a name edit, a re-save) is not history.
  if (!Object.keys(changes).length) return Array.isArray(history) ? history : [];

  const list = Array.isArray(history) ? history.slice() : [];
  const name = String(by || "").trim();
  const last = list[list.length - 1];

  if (last && last.by === name && now - Date.parse(last.at) < COALESCE_MS) {
    // Keep the original "from" so a 0→1→2→3 run reads as one 0→3 change, and
    // drop anything the person ended up putting back the way they found it.
    const merged = { ...last.changes };
    Object.entries(changes).forEach(([k, [from, to]]) => {
      const start = merged[k] ? merged[k][0] : from;
      if (start === to) delete merged[k];
      else merged[k] = [start, to];
    });
    if (!Object.keys(merged).length) {
      list.pop();
      return list;
    }
    list[list.length - 1] = { by: name, at: new Date(now).toISOString(), changes: merged };
    return list;
  }

  list.push({ by: name, at: new Date(now).toISOString(), changes });
  return list.slice(-HISTORY_MAX);
};

export const mergeContributors = (prev, by) => {
  const list = Array.isArray(prev) ? prev.slice() : [];
  const name = String(by || "").trim();
  if (name && !list.includes(name)) list.push(name);
  return list;
};

async function readDoc(blobs) {
  if (!blobs.length) return null;
  const res = await fetch(blobs.slice().sort(byNewest)[0].url, { cache: "no-store" });
  if (!res.ok) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    const { unit, cycle } = req.query || {};
    try {
      // One unit — what a kiosk asks for when a nurse picks their unit.
      if (unit) {
        const { blobs } = await list({ prefix: unitDir(cycle, unit) });
        return res.status(200).json({ order: await readDoc(blobs) });
      }

      // Every unit for this cycle — what the admin panel asks for. Group the
      // flat blob list by its <unit> path segment, then read each unit's newest.
      const { blobs } = await list({ prefix: cycleDir(cycle) });
      const groups = {};
      blobs.forEach((b) => {
        const key = unitSegment(b.pathname);
        if (!key) return;
        (groups[key] = groups[key] || []).push(b);
      });
      const docs = await Promise.all(Object.values(groups).map(readDoc));
      const orders = {};
      docs.forEach((d) => {
        if (d && d.unit) orders[d.unit] = d;
      });
      return res.status(200).json({ orders });
    } catch {
      return res.status(200).json(unit ? { order: null } : { orders: {} });
    }
  }

  if (req.method === "POST") {
    const { unit, cycle, lines, by } = req.body || {};
    if (!unit || typeof unit !== "string") {
      return res.status(400).json({ error: "Missing unit" });
    }
    if (!lines || typeof lines !== "object" || Array.isArray(lines)) {
      return res.status(400).json({ error: "Invalid order lines" });
    }

    try {
      const dir = unitDir(cycle, unit);
      const { blobs } = await list({ prefix: dir });

      // Carry the running list of everyone who has touched this order forward.
      const prev = await readDoc(blobs);
      const contributors = mergeContributors(prev && prev.contributors, by);
      const name = String(by || "").trim();

      const doc = {
        unit,
        cycle: cycle || null,
        lines,
        updatedAt: new Date().toISOString(),
        updatedBy: name || null,
        contributors,
        history: appendHistory(prev && prev.history, prev && prev.lines, lines, by, Date.now()),
      };
      // Random tail so two kiosks saving in the same millisecond can't overwrite
      // each other's version — the timestamp prefix still orders them.
      const name2 = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.json`;
      await put(`${dir}${name2}`, JSON.stringify(doc), {
        access: "public",
        addRandomSuffix: false,
        contentType: "application/json",
      });

      // ponytail: prune on write rather than on a schedule — no cron to own.
      const stale = blobs.sort(byNewest).slice(KEEP - 1);
      await Promise.all(stale.map((b) => del(b.url).catch(() => {})));

      return res.status(200).json({ order: doc });
    } catch (err) {
      return res.status(500).json({ error: err.message || "Failed to save order" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
