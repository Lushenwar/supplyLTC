import { Resend } from "resend";

// Vercel serverless function: emails the admin a summary of a submitted order,
// with the generated .xlsx attached. Keeps the Resend API key off the client.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { wing, nurseName, date, itemCount, items, filename, fileBase64 } = req.body || {};

  if (!wing || !nurseName || !items) {
    return res.status(400).json({ error: "Missing required order details" });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: "Supply LTC <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL,
      subject: `Supply Order – ${wing} – ${date}`,
      text:
        `New order submitted.\n\n` +
        `Wing: ${wing}\n` +
        `Ordered by: ${nurseName}\n` +
        `Date: ${date}\n` +
        `Items: ${itemCount}\n\n` +
        items,
      attachments:
        filename && fileBase64 ? [{ filename, content: fileBase64 }] : [],
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to send email" });
  }
}
