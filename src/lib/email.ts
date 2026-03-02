// ─── Notification Email (stub) ───────────────────────────────────────
// TODO: Configurer un vrai service SMTP (Resend, SendGrid, Nodemailer, etc.)
// Variables d'env nécessaires:
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  // ─── STUB: log en console ──────────────────
  console.log("────────────────────────────────────────");
  console.log("📧 EMAIL NOTIFICATION (stub)");
  console.log(`  To: ${payload.to}`);
  console.log(`  Subject: ${payload.subject}`);
  console.log(`  Body: ${payload.html.substring(0, 200)}...`);
  console.log("────────────────────────────────────────");

  // TODO: Implémenter avec un vrai provider:
  // import nodemailer from 'nodemailer';
  // const transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  //   port: Number(process.env.SMTP_PORT),
  //   auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  // });
  // await transporter.sendMail({
  //   from: process.env.SMTP_FROM,
  //   ...payload,
  // });

  return true;
}

export function buildLeadNotificationEmail(lead: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: string;
  message?: string | null;
}): EmailPayload {
  return {
    to: process.env.NOTIFICATION_EMAIL || "contact@tm-auto-service.fr",
    subject: `[TM AUTO] Nouveau lead ${lead.source} - ${lead.firstName} ${lead.lastName}`,
    html: `
      <h2>Nouveau lead reçu</h2>
      <p><strong>Source:</strong> ${lead.source}</p>
      <p><strong>Nom:</strong> ${lead.firstName} ${lead.lastName}</p>
      <p><strong>Email:</strong> ${lead.email}</p>
      <p><strong>Téléphone:</strong> ${lead.phone}</p>
      ${lead.message ? `<p><strong>Message:</strong> ${lead.message}</p>` : ""}
      <hr>
      <p><a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/admin/leads">Voir dans l'admin</a></p>
    `,
  };
}
