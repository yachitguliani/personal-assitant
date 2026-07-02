import {
  adminAction,
  entriesToCsv,
  listWaitlist,
  proxyToBackend,
  verifyAdminPassword,
} from "@/lib/waitlist-server";

export async function GET(request: Request) {
  if (process.env.BACKEND_URL) {
    return proxyToBackend(request, "admin");
  }

  const password = request.headers.get("x-admin-password");
  if (!verifyAdminPassword(password)) {
    return Response.json({ detail: "Unauthorized access" }, { status: 401 });
  }

  const url = new URL(request.url);
  const q = url.searchParams.get("q") || undefined;
  const exportCsv = url.searchParams.get("export");

  const data = await listWaitlist(q);
  if (exportCsv === "csv") {
    return new Response(entriesToCsv(data.users), {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=neuron_waitlist.csv",
      },
    });
  }

  return Response.json({
    users: data.users.map((u) => ({ ...u, id: String(u.id) })),
    stats: data.stats,
  });
}

export async function POST(request: Request) {
  if (process.env.BACKEND_URL) {
    return proxyToBackend(request, "admin");
  }

  const password = request.headers.get("x-admin-password");
  if (!verifyAdminPassword(password)) {
    return Response.json({ detail: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    await adminAction(body.action, Number(body.userId), body.email);
    return Response.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Action failed";
    const status = message === "User not found" ? 404 : 400;
    return Response.json({ detail: message }, { status });
  }
}
