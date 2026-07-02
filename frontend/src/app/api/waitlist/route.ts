import { joinWaitlist, proxyToBackend } from "@/lib/waitlist-server";

export async function POST(request: Request) {
  if (process.env.BACKEND_URL) {
    return proxyToBackend(request, "");
  }

  try {
    const body = await request.json();
    const email = String(body.email || "");
    const githubSource = Boolean(body.github_source);
    if (!email) {
      return Response.json({ detail: "Email is required." }, { status: 400 });
    }
    const result = await joinWaitlist(email, githubSource);
    return Response.json(result);
  } catch (err) {
    console.error("waitlist join failed", err);
    return Response.json({ detail: "Failed to join waitlist." }, { status: 500 });
  }
}
