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
