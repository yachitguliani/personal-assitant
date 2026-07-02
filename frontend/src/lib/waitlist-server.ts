import { Resend } from "resend";

export interface WaitlistEntry {
  id: number;
  email: string;
  position: number;
  created_at: string;
  beta_invited: boolean;
  launch_notified: boolean;
  github_source: boolean;
}

export interface WaitlistStore {
  entries: WaitlistEntry[];
  nextId: number;
}

const BLOB_PATH = "waitlist/data.json";

function emptyStore(): WaitlistStore {
  return { entries: [], nextId: 1 };
}

async function readStore(): Promise<WaitlistStore> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { list, get } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: BLOB_PATH, limit: 1 });
    if (!blobs.length) return emptyStore();
    const res = await get(blobs[0].url, { access: "private" });
    if (!res || res.statusCode !== 200) return emptyStore();
    const text = await new Response(res.stream).text();
    return JSON.parse(text) as WaitlistStore;
  }

  const globalStore = globalThis as typeof globalThis & {
    __neuronWaitlist?: WaitlistStore;
  };
  if (!globalStore.__neuronWaitlist) {
    globalStore.__neuronWaitlist = emptyStore();
  }
  return globalStore.__neuronWaitlist;
}

async function writeStore(store: WaitlistStore): Promise<void> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    await put(BLOB_PATH, JSON.stringify(store), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }

  const globalStore = globalThis as typeof globalThis & {
    __neuronWaitlist?: WaitlistStore;
  };
  globalStore.__neuronWaitlist = store;
}

export function verifyAdminPassword(header: string | null): boolean {
  const expected = process.env.WAITLIST_ADMIN_PASSWORD || "neuron_admin_secret";
  return Boolean(header && header === expected);
}

export async function joinWaitlist(
  email: string,
  githubSource: boolean
): Promise<{ position: number; exists: boolean }> {
  const normalized = email.trim().toLowerCase();
  const store = await readStore();
  const existing = store.entries.find((e) => e.email === normalized);
  if (existing) {
    return { position: existing.position, exists: true };
  }

  const position =
    store.entries.reduce((max, e) => Math.max(max, e.position), 0) + 1;
  store.entries.push({
    id: store.nextId++,
    email: normalized,
    position,
    created_at: new Date().toISOString(),
    beta_invited: false,
    launch_notified: false,
    github_source: githubSource,
  });
  await writeStore(store);
  await sendWelcomeEmail(normalized);
  return { position, exists: false };
}

export async function listWaitlist(query?: string): Promise<{
  users: WaitlistEntry[];
  stats: {
    total: number;
    github: number;
    beta_invited: number;
    launch_notified: number;
  };
}> {
  const store = await readStore();
  let users = [...store.entries].sort((a, b) => b.position - a.position);
  if (query) {
    const q = query.toLowerCase();
    users = users.filter((u) => u.email.includes(q));
  }
  return {
    users,
    stats: {
      total: store.entries.length,
      github: store.entries.filter((e) => e.github_source).length,
      beta_invited: store.entries.filter((e) => e.beta_invited).length,
      launch_notified: store.entries.filter((e) => e.launch_notified).length,
    },
  };
}

export async function adminAction(
  action: string,
  userId: number,
  email?: string
): Promise<void> {
  const store = await readStore();
  const entry = store.entries.find((e) => e.id === userId);
  if (!entry) throw new Error("User not found");

  if (action === "invite_beta") {
    if (email) await sendBetaInvite(email);
    entry.beta_invited = true;
  } else if (action === "invite_launch") {
    if (email) await sendLaunchInvite(email);
    entry.launch_notified = true;
  } else if (action === "mark_invited") {
    entry.beta_invited = true;
  } else if (action === "delete") {
    store.entries = store.entries.filter((e) => e.id !== userId);
    await writeStore(store);
    return;
  } else {
    throw new Error("Invalid action type");
  }

  await writeStore(store);
}

async function sendResend(to: string, subject: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("RESEND simulation →", to, subject);
    return;
  }
  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "Neuron <onboarding@resend.dev>",
    to,
    subject,
    html,
  });
}

export async function sendWelcomeEmail(email: string): Promise<void> {
  const html = `<!DOCTYPE html><html><body style="background:#000;color:#e4e4e7;font-family:monospace;padding:40px">
<div style="max-width:500px;margin:0 auto">
<div style="color:#71717a;font-size:12px;margin-bottom:24px">~/neuron/welcome.txt</div>
<div style="font-weight:600;font-size:16px;margin-bottom:20px;color:#fff">Neuron</div>
<div style="font-size:13px;color:#d4d4d8;line-height:1.6">
You're officially on the waitlist.<br><br>
You won't receive marketing emails — only one email when Neuron is ready for earliest users.
</div></div></body></html>`;
  await sendResend(email, "Welcome to the Neuron Waitlist", html);
}

async function sendBetaInvite(email: string): Promise<void> {
  const url = process.env.PUBLIC_APP_URL || "https://frontend-mu-sand-39.vercel.app";
  const html = `<!DOCTYPE html><html><body style="background:#000;color:#e4e4e7;font-family:monospace;padding:40px">
<div style="max-width:500px;margin:0 auto">
<p style="color:#d4d4d8;font-size:13px">You are invited to the Neuron private beta.</p>
<a href="${url}" style="display:inline-block;background:#fff;color:#000;padding:10px 20px;border-radius:4px;text-decoration:none;font-size:12px">Access Private Beta →</a>
</div></body></html>`;
  await sendResend(email, "Your Neuron Beta Invitation", html);
}

async function sendLaunchInvite(email: string): Promise<void> {
  const url = process.env.PUBLIC_APP_URL || "https://frontend-mu-sand-39.vercel.app";
  const html = `<!DOCTYPE html><html><body style="background:#000;color:#e4e4e7;font-family:monospace;padding:40px">
<div style="max-width:500px;margin:0 auto">
<p style="color:#d4d4d8;font-size:13px">Neuron is ready. Thank you for believing in the project early.</p>
<a href="${url}" style="display:inline-block;background:#fff;color:#000;padding:10px 20px;border-radius:4px;text-decoration:none;font-size:12px">Launch Neuron →</a>
</div></body></html>`;
  await sendResend(email, "Neuron is ready.", html);
}

export function entriesToCsv(users: WaitlistEntry[]): string {
  const header = "ID,Email,Position,Created At,Beta Invited,Launch Notified,GitHub Source\n";
  const rows = users
    .map(
      (u) =>
        `${u.id},${u.email},${u.position},${u.created_at},${u.beta_invited},${u.launch_notified},${u.github_source}`
    )
    .join("\n");
  return header + rows;
}

export async function proxyToBackend(
  request: Request,
  path: string
): Promise<Response> {
  const backend = process.env.BACKEND_URL?.replace(/\/$/, "");
  if (!backend) {
    return Response.json({ detail: "Backend not configured" }, { status: 503 });
  }

  const url = new URL(request.url);
  const target = `${backend}/api/waitlist/${path}${url.search}`;
  const headers = new Headers(request.headers);
  headers.delete("host");

  const init: RequestInit = {
    method: request.method,
    headers,
  };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  return fetch(target, init);
}
