"use server";

import nodemailer from "nodemailer";
import { validateContact } from "@/lib/contact";

export interface ContactState {
  status: "idle" | "ok" | "error";
  message: string;
}

const FALLBACK = "Couldn't send that just now — please reach out on LinkedIn instead.";
const MIN_SCORE = 0.5;

async function passesRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET;
  if (!secret || !token) return false;
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const data = (await res.json()) as { success?: boolean; score?: number; action?: string };
    return data.success === true && (data.score ?? 0) >= MIN_SCORE && data.action === "submit";
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
