import { Resend } from "resend";

// Vercel serverless function: emails the admin every unit's final order for the
// current cycle as a single message, one .xlsx attached per unit.
//
// This is admin-triggered from the Orders panel, NOT fired by kiosks. Nurses'
// carts autosave to /api/orders instead — previously every "Send to admin"
// click produced another email and the admin had to guess which one was final.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { cycleLabel, units } = req.body || {};

  if (!Array.isArray(units) || !units.length) {
    return res.status(400).json({ error: "No orders to send" });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const summary = units
    .map(
      (u) =>
        `${u.unit} — ${u.itemCount} item${u.itemCount === 1 ? "" : "s"}` +
        (u.contributors ? ` (${u.contributors})` : "") +
        (u.updatedAt ? `, last updated ${u.updatedAt}` : "") +
        `\n${u.items}\n`
    )
    .join("\n");

  try {
    await resend.emails.send({
      from: "Supply LTC <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL,
      subject: `Supply Orders – ${units.length} unit${units.length === 1 ? "" : "s"}${cycleLabel ? " – " + cycleLabel : ""}`,
      text: `Final orders for ${units.length} unit${units.length === 1 ? "" : "s"}.\n\n${summary}`,
      attachments: units
        .filter((u) => u.filename && u.fileBase64)
        .map((u) => ({ filename: u.filename, content: u.fileBase64 })),
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to send email" });
  }
}
