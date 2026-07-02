import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const resendApiKey = process.env.RESEND_API_KEY || "";
const adminPassword = process.env.WAITLIST_ADMIN_PASSWORD || "neuron_admin_secret";

const isDbConfigured = !!(supabaseUrl && supabaseServiceKey);
const isEmailConfigured = !!resendApiKey;

const supabase = isDbConfigured ? createClient(supabaseUrl, supabaseServiceKey) : null;
const resend = isEmailConfigured ? new Resend(resendApiKey) : null;

// Mock list fallback
let mockUsersList = [
  { id: "1", email: "builder@neuron.ai", position: 1, created_at: new Date(Date.now() - 86400000 * 5).toISOString(), verified: true, beta_invited: true, launch_notified: false, github_source: true },
  { id: "2", email: "linus@linuxfoundation.org", position: 2, created_at: new Date(Date.now() - 86400000 * 3).toISOString(), verified: true, beta_invited: false, launch_notified: false, github_source: true },
  { id: "3", email: "satya@microsoft.com", position: 3, created_at: new Date(Date.now() - 86400000 * 2).toISOString(), verified: false, beta_invited: false, launch_notified: false, github_source: false },
  { id: "4", email: "sam@openai.com", position: 4, created_at: new Date(Date.now() - 86400000 * 1).toISOString(), verified: true, beta_invited: false, launch_notified: false, github_source: true },
];

export async function GET(request: Request) {
  try {
    const authPass = request.headers.get("X-Admin-Password");
    if (authPass !== adminPassword) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("q") || "";
    const exportCsv = searchParams.get("export") === "csv";

    let users: any[] = [];

    if (supabase) {
      let queryBuilder = supabase
        .from("waitlist")
        .select("*")
        .order("position", { ascending: false });

      if (searchQuery) {
        queryBuilder = queryBuilder.ilike("email", `%${searchQuery}%`);
      }

      const { data, error } = await queryBuilder;
      if (error) throw new Error(error.message);
      users = data || [];
    } else {
      // Mock filtering
      users = [...mockUsersList].sort((a, b) => b.position - a.position);
      if (searchQuery) {
        users = users.filter((u) => u.email.toLowerCase().includes(searchQuery.toLowerCase()));
      }
    }

    if (exportCsv) {
      const csvHeader = "ID,Email,Position,Created At,Beta Invited,Launch Notified,GitHub Source\n";
      const csvRows = users
        .map((u) =>
          [
            u.id,
            u.email,
            u.position,
            u.created_at,
            u.beta_invited ? "TRUE" : "FALSE",
            u.launch_notified ? "TRUE" : "FALSE",
            u.github_source ? "TRUE" : "FALSE",
          ].join(",")
        )
        .join("\n");

      return new Response(csvHeader + csvRows, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=neuron_waitlist.csv",
        },
      });
    }

    // Stats calculations
    const totalCount = supabase
      ? (await supabase.from("waitlist").select("id", { count: "exact", head: true })).count || 0
      : users.length;

    const githubCount = supabase
      ? (await supabase.from("waitlist").select("id", { count: "exact", head: true }).eq("github_source", true)).count || 0
      : users.filter((u) => u.github_source).length;

    const betaInvitedCount = supabase
      ? (await supabase.from("waitlist").select("id", { count: "exact", head: true }).eq("beta_invited", true)).count || 0
      : users.filter((u) => u.beta_invited).length;

    const launchCount = supabase
      ? (await supabase.from("waitlist").select("id", { count: "exact", head: true }).eq("launch_notified", true)).count || 0
      : users.filter((u) => u.launch_notified).length;

    return NextResponse.json({
      users,
      stats: {
        total: totalCount,
        github: githubCount,
        beta_invited: betaInvitedCount,
        launch_notified: launchCount,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authPass = request.headers.get("X-Admin-Password");
    if (authPass !== adminPassword) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const { action, userId, email } = body;

    if (action === "invite_beta") {
      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Neuron Beta Invitation</title>
  <style>
    body {
      background-color: #000000;
      color: #f3f4f6;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      padding: 40px 20px;
      line-height: 1.6;
    }
    .container {
      max-width: 500px;
      margin: 0 auto;
    }
    .header {
      color: #71717a;
      margin-bottom: 24px;
      font-size: 12px;
    }
    .divider {
      border-top: 1px solid #27272a;
      margin: 20px 0;
    }
    .title {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 20px;
      color: #ffffff;
    }
    .content {
      font-size: 13px;
      color: #d4d4d8;
    }
    .btn-link {
      display: inline-block;
      background-color: #ffffff;
      color: #000000;
      text-decoration: none;
      font-size: 12px;
      padding: 10px 20px;
      border-radius: 4px;
      margin: 20px 0;
    }
    .footer {
      color: #52525b;
      font-size: 11px;
      margin-top: 40px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">~/neuron/beta.txt</div>
    <div class="title">Neuron Private Beta</div>
    <div class="content">
      Hello,<br><br>
      You are invited to join the private beta of Neuron.<br><br>
      Use the key below to access your dashboard and configure your initial workspaces:<br><br>
      <a href="http://localhost:3000" class="btn-link">Access Private Beta →</a>
    </div>
    <div class="divider"></div>
    <div class="footer">
      Neuron OS Subsystems<br>
      Built for builders.
    </div>
  </div>
</body>
</html>
      `;

      if (resend) {
        await resend.emails.send({
          from: "Neuron <beta@neuron.ai>",
          to: email,
          subject: "Your Neuron Beta Invitation",
          html: emailHtml,
        });
      } else {
        console.log(`BETA INVITE SIMULATOR to: ${email}`);
      }

      if (supabase) {
        await supabase.from("waitlist").update({ beta_invited: true }).eq("id", userId);
      } else {
        mockUsersList = mockUsersList.map((u) => (u.id === userId ? { ...u, beta_invited: true } : u));
      }
      return NextResponse.json({ success: true });
    }

    if (action === "invite_launch") {
      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Neuron is ready.</title>
  <style>
    body {
      background-color: #000000;
      color: #f3f4f6;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      padding: 40px 20px;
      line-height: 1.6;
    }
    .container {
      max-width: 500px;
      margin: 0 auto;
    }
    .header {
      color: #71717a;
      margin-bottom: 24px;
      font-size: 12px;
    }
    .divider {
      border-top: 1px solid #27272a;
      margin: 20px 0;
    }
    .title {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 20px;
      color: #ffffff;
    }
    .content {
      font-size: 13px;
      color: #d4d4d8;
    }
    .btn-link {
      display: inline-block;
      background-color: #ffffff;
      color: #000000;
      text-decoration: none;
      font-size: 12px;
      padding: 10px 20px;
      border-radius: 4px;
      margin: 20px 0;
    }
    .footer {
      color: #52525b;
      font-size: 11px;
      margin-top: 40px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">~/neuron/launch.txt</div>
    <div class="title">Neuron is ready.</div>
    <div class="content">
      Hello,<br><br>
      Months ago you found Neuron before it officially existed.<br><br>
      Today it's finally ready.<br><br>
      As promised, you're receiving access before the public announcement.<br><br>
      Thank you for believing in the project early.<br><br>
      <a href="http://localhost:3000" class="btn-link">Launch Neuron →</a>
    </div>
    <div class="divider"></div>
    <div class="footer">
      Neuron<br>
      Built for builders.
    </div>
  </div>
</body>
</html>
      `;

      if (resend) {
        await resend.emails.send({
          from: "Neuron <launch@neuron.ai>",
          to: email,
          subject: "Neuron is ready.",
          html: emailHtml,
        });
      } else {
        console.log(`LAUNCH INVITE SIMULATOR to: ${email}`);
      }

      if (supabase) {
        await supabase.from("waitlist").update({ launch_notified: true }).eq("id", userId);
      } else {
        mockUsersList = mockUsersList.map((u) => (u.id === userId ? { ...u, launch_notified: true } : u));
      }
      return NextResponse.json({ success: true });
    }

    if (action === "mark_invited") {
      if (supabase) {
        await supabase.from("waitlist").update({ beta_invited: true }).eq("id", userId);
      } else {
        mockUsersList = mockUsersList.map((u) => (u.id === userId ? { ...u, beta_invited: true } : u));
      }
      return NextResponse.json({ success: true });
    }

    if (action === "delete") {
      if (supabase) {
        await supabase.from("waitlist").delete().eq("id", userId);
      } else {
        mockUsersList = mockUsersList.filter((u) => u.id !== userId);
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action type" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
