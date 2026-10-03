"use server";

import nodemailer from "nodemailer";
import { assessmentPasses, validateContact } from "@/lib/contact";

export interface ContactState {
  status: "idle" | "ok" | "error";
  message: string;
}

const FALLBACK = "Couldn't send that just now — please reach out on LinkedIn instead.";
// reCAPTCHA Enterprise "create assessment" call (the key was migrated to
// Google Cloud). Fails closed on any missing config, network error or bad score.
async function passesRecaptcha(token: string): Promise<boolean> {
  const { RECAPTCHA_PROJECT_ID, RECAPTCHA_API_KEY, NEXT_PUBLIC_RECAPTCHA_SITE_KEY } = process.env;
  if (!RECAPTCHA_PROJECT_ID || !RECAPTCHA_API_KEY || !NEXT_PUBLIC_RECAPTCHA_SITE_KEY || !token) return false;
  try {
    const res = await fetch(
      `https://recaptchaenterprise.googleapis.com/v1/projects/${encodeURIComponent(RECAPTCHA_PROJECT_ID)}/assessments?key=${encodeURIComponent(RECAPTCHA_API_KEY)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: { token, siteKey: NEXT_PUBLIC_RECAPTCHA_SITE_KEY, expectedAction: "submit" },
        }),
      },
    );
    if (!res.ok) {
      console.error("contact form: reCAPTCHA assessment failed", res.status);
      return false;
    }
    return assessmentPasses(await res.json());
  } catch {
    return false;
  }
}

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: a real visitor never sees this field. Report success so bots don't adapt.
  if (String(formData.get("choices") ?? "") !== "") {
    return { status: "ok", message: "Thanks — message sent." };
  }

  const fields = validateContact({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });
  if (typeof fields === "string") return { status: "error", message: fields };

  if (!(await passesRecaptcha(String(formData.get("g-recaptcha-response") ?? "")))) {
    return { status: "error", message: FALLBACK };
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) {
    console.error("contact form: SMTP env vars are not configured");
    return { status: "error", message: FALLBACK };
  }

  try {
    const port = Number(SMTP_PORT ?? 465);
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    await transport.sendMail({
      from: `"kirkclarke.com" <${SMTP_USER}>`,
      to: CONTACT_TO,
      replyTo: `"${fields.name.replace(/"/g, "")}" <${fields.email}>`,
      subject: `Site contact from ${fields.name}`,
      text: `${fields.message}\n\n—\n${fields.name} <${fields.email}>`,
    });
    return { status: "ok", message: "Thanks — message sent. I'll reply by email." };
  } catch (err) {
    console.error("contact form: send failed", err);
    return { status: "error", message: FALLBACK };
  }
}
