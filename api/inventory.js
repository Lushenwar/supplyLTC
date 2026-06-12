import { put, list } from "@vercel/blob";

// Shared inventory overrides (currently just stock counts), stored as a single
// JSON blob so every kiosk reads the same admin-updated numbers on load.
const BLOB_PATH = "inventory-overrides.json";
const ADMIN_PASSCODE = "Sthaa123!";

async function readOverrides() {
  const { blobs } = await list({ prefix: BLOB_PATH });
  const match = blobs.find((b) => b.pathname === BLOB_PATH);
  if (!match) return { stock: {} };
  const res = await fetch(match.url);
  if (!res.ok) return { stock: {} };
  return res.json();
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const data = await readOverrides();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(200).json({ stock: {} });
    }
  }

  if (req.method === "POST") {
    const { passcode, stock } = req.body || {};
    if (passcode !== ADMIN_PASSCODE) {
      return res.status(401).json({ error: "Invalid passcode" });
    }
    if (!stock || typeof stock !== "object") {
      return res.status(400).json({ error: "Missing stock data" });
    }
    try {
      await put(BLOB_PATH, JSON.stringify({ stock }), {
        access: "public",
        addRandomSuffix: false,
        contentType: "application/json",
        allowOverwrite: true,
      });
      return res.status(200).json({ ok: true });
    } catch (err) {
      return res.status(500).json({ error: err.message || "Failed to save" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
