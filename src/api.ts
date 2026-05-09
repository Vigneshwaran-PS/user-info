import { APPS_SCRIPT_URL } from "./config";
import type { UserFormData } from "./types";

export interface SubmissionPayload extends UserFormData {
  submittedAt: string;
}

function toDDMMYYYY(iso: string): string {
  // Input is YYYY-MM-DD from <input type="date">. Output: DDMMYYYY.
  const [y, m, d] = iso.split("-");
  return `${d}${m}${y}`;
}

export async function submitToSheet(data: UserFormData): Promise<void> {
  if (
    !APPS_SCRIPT_URL ||
    APPS_SCRIPT_URL === "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE"
  ) {
    throw new Error(
      "Apps Script URL is not configured. Update src/config.ts with your deployed Web App URL."
    );
  }

  const payload: SubmissionPayload = {
    ...data,
    dateOfBirth: toDDMMYYYY(data.dateOfBirth),
    submittedAt: new Date().toISOString(),
  };

  // Apps Script Web Apps reject preflighted requests, so we use a simple
  // text/plain POST. Apps Script reads the body via e.postData.contents.
  const response = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Submission failed: ${response.status}`);
  }

  const result = await response.json().catch(() => ({ ok: false }));
  if (!result.ok) {
    throw new Error(result.error || "Submission rejected by server");
  }
}
