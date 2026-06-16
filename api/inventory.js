import { put, list, del } from "@vercel/blob";

// Shared inventory overrides (stock counts, hidden items, admin-added items),
// stored as a JSON blob so every kiosk reads the same admin-updated data on load.
//
// Each save uploads a brand-new, uniquely-named blob rather than overwriting the
// same one — overwriting a fixed-URL blob is subject to read-after-write
// staleness (the old content can still be served for a bit), which made hides
// and stock edits take "two saves" to show up. New blobs are immutable, so the
// latest one (by uploadedAt) is always correct, and old ones are deleted after.
const BLOB_PREFIX = "inventory-overrides/";
const ADMIN_PASSCODE = "Sthaa123!";

const EMPTY = { stock: {}, hidden: [], added: [], images: {}, baseline: null, baselineDate: null, baselineLabel: null };

async function readOverrides() {
  const { blobs } = await list({ prefix: BLOB_PREFIX });
  if (!blobs.length) return EMPTY;
  const latest = blobs.reduce((a, b) => (a.uploadedAt > b.uploadedAt ? a : b));
  const res = await fetch(latest.url, { cache: "no-store" });
  if (!res.ok) return EMPTY;
  const data = await res.json();
  return {
    stock: data.stock || {},
    hidden: data.hidden || [],
    added: data.added || [],
    images: data.images || {},
    baseline: Array.isArray(data.baseline) ? data.baseline : null,
    baselineDate: data.baselineDate || null,
    baselineLabel: data.baselineLabel || null,
  };
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    try {
      const data = await readOverrides();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(200).json(EMPTY);
    }
  }

  if (req.method === "POST") {
    const { passcode, stock, hidden, added, images, baseline, baselineDate, baselineLabel } = req.body || {};
    if (passcode !== ADMIN_PASSCODE) {
      return res.status(401).json({ error: "Invalid passcode" });
    }
    if (!stock || typeof stock !== "object" || !Array.isArray(hidden) || !Array.isArray(added)) {
      return res.status(400).json({ error: "Missing or invalid inventory data" });
    }
    if (images !== undefined && (typeof images !== "object" || images === null || Array.isArray(images))) {
      return res.status(400).json({ error: "Invalid image overrides" });
    }
    if (baseline !== undefined && baseline !== null && !Array.isArray(baseline)) {
      return res.status(400).json({ error: "Invalid baseline inventory" });
    }
    try {
      const { blobs: old } = await list({ prefix: BLOB_PREFIX });
      await put(
        `${BLOB_PREFIX}${Date.now()}.json`,
        JSON.stringify({
          stock,
          hidden,
          added,
          images: images || {},
          baseline: baseline ?? null,
          baselineDate: baselineDate ?? null,
          baselineLabel: baselineLabel ?? null,
        }),
        {
          access: "public",
          addRandomSuffix: false,
          contentType: "application/json",
        }
      );
      await Promise.all(old.map((b) => del(b.url)));
      return res.status(200).json({ ok: true });
    } catch (err) {
      return res.status(500).json({ error: err.message || "Failed to save" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
