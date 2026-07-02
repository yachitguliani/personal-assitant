import nodemailer from "nodemailer";
import { Resend } from "resend";

function smtpConfig() {
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASSWORD?.trim();
  if (!user || !password) return null;

  const host =
    process.env.SMTP_HOST?.trim() ||
    (user.endsWith("@gmail.com") ? "smtp.gmail.com" : undefined);
  if (!host) return null;

  const port = Number(process.env.SMTP_PORT || (host.includes("gmail") ? 587 : 587));
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  return {
    host,
    port,
    secure,
    auth: { user, pass: password },
    from: process.env.SMTP_FROM?.trim() || `Neuron <${user}>`,
  };
}

async function sendViaSmtp(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  const config = smtpConfig();
  if (!config) return false;

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
  });

  await transporter.sendMail({
    from: config.from,
    to,
    subject,
    html,
  });
  return true;
}

async function sendViaResend(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return false;

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "Neuron <onboarding@resend.dev>",
    to,
    subject,
    html,
  });
  return true;
}

/** SMTP (Gmail, Outlook, etc.) first, then Resend, else log only. */
export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (await sendViaSmtp(to, subject, html)) return;
  if (await sendViaResend(to, subject, html)) return;
  console.log("EMAIL simulation (set SMTP_USER + SMTP_PASSWORD) →", to, subject);
}
