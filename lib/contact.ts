export const MAX_NAME = 100;
export const MAX_EMAIL = 254;
export const MAX_MESSAGE = 5000;

export interface ContactFields {
  name: string;
  email: string;
  message: string;
}

const MIN_SCORE = 0.5;

// Shape of a reCAPTCHA Enterprise assessment response. The key's own domain
// list already restricts which sites can mint tokens, so no hostname check here.
export function assessmentPasses(data: unknown): boolean {
  const a = data as {
    tokenProperties?: { valid?: boolean; action?: string };
    riskAnalysis?: { score?: number };
  };
  return (
    a?.tokenProperties?.valid === true &&
    a.tokenProperties.action === "submit" &&
    (a.riskAnalysis?.score ?? 0) >= MIN_SCORE
  );
}

// Header-injection guard: newlines/control chars have no business in a name.
const stripControl = (s: string) => s.replace(/[\u0000-\u001f\u007f]/g, " ").trim();

// Returns the cleaned fields, or a user-facing error string.
export function validateContact(input: {
  name: unknown;
  email: unknown;
  message: unknown;
}): ContactFields | string {
  const name = stripControl(String(input.name ?? ""));
  const email = String(input.email ?? "").trim();
  const message = String(input.message ?? "").trim();

  if (!name) return "Please add your name.";
  if (name.length > MAX_NAME) return "That name is too long.";
  if (!email) return "Please add your email so I can reply.";
  if (email.length > MAX_EMAIL || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "That email address doesn't look right.";
  }
  if (!message) return "Please write a message.";
  if (message.length > MAX_MESSAGE) return `Please keep the message under ${MAX_MESSAGE} characters.`;

  return { name, email, message };
}
