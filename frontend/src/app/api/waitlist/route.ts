import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const resendApiKey = process.env.RESEND_API_KEY || "";

const isDbConfigured = !!(supabaseUrl && supabaseServiceKey);
const isEmailConfigured = !!resendApiKey;

// Instantiate clients if keys are present
const supabase = isDbConfigured ? createClient(supabaseUrl, supabaseServiceKey) : null;
const resend = isEmailConfigured ? new Resend(resendApiKey) : null;

// Fallback in-memory database representation for local mock development
let mockWaitlist: Array<{ email: string; position: number; github_source: boolean }> = [];
let mockPositionCounter = 42;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, github_source } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const emailClean = email.trim().toLowerCase();
    let position = 0;
    let alreadyExists = false;

    if (supabase) {
      // 1. Save to Supabase Waitlist
      const { data, error } = await supabase
        .from("waitlist")
        .insert({
          email: emailClean,
          github_source: !!github_source,
        })
        .select("position")
        .single();

      if (error) {
        // If the email already exists, retrieve the existing position number
        if (error.code === "23505") {
          const { data: existing, error: fetchErr } = await supabase
            .from("waitlist")
            .select("position")
            .eq("email", emailClean)
            .single();

          if (fetchErr || !existing) {
            throw new Error("Unable to retrieve waitlist position.");
          }
          position = existing.position;
          alreadyExists = true;
        } else {
          throw new Error(error.message);
        }
      } else {
        position = data.position;
      }
    } else {
      // Local Mock DB Fallback
      console.warn("Using local memory mock waitlist storage");
      const existing = mockWaitlist.find((u) => u.email === emailClean);
      if (existing) {
        position = existing.position;
        alreadyExists = true;
      } else {
        mockPositionCounter += 1;
        position = mockPositionCounter;
        mockWaitlist.push({ email: emailClean, position, github_source: !!github_source });
      }
    }

    // 2. Dispatch Welcome Confirmation Email
    if (!alreadyExists) {
      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to the Neuron Waitlist</title>
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
    .bullet-list {
      list-style-type: none;
      padding-left: 0;
      margin: 16px 0;
    }
    .bullet-list li {
      margin-bottom: 6px;
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
    <div class="header">~/neuron/welcome.txt</div>
    <div class="title">Neuron</div>
    <div class="content">
      You're officially on the waitlist.<br><br>
      Thanks for finding Neuron this early.<br><br>
      We're building slowly because we care more about getting it right than shipping quickly.<br><br>
      You won't receive marketing emails.<br><br>
      You'll receive one email when Neuron is ready for its earliest users.<br><br>
      As an early supporter you'll receive:<br>
      <ul class="bullet-list">
        <li>• Early access before launch</li>
        <li>• Private beta invitations</li>
        <li>• Feature previews</li>
        <li>• Direct opportunity to influence the product</li>
      </ul>
      Until then—<br>
      Keep building.
    </div>
    <div class="divider"></div>
    <div class="footer">
      Curated by Neuron<br>
      Built for builders.
    </div>
  </div>
</body>
</html>
      `;

      if (resend) {
        await resend.emails.send({
          from: "Neuron <waitlist@neuron.ai>",
          to: emailClean,
          subject: "Welcome to the Neuron Waitlist",
          html: emailHtml,
        });
      } else {
        console.log("-----------------------------------------");
        console.log("RESEND SIMULATION (No API key config)");
        console.log(`To: ${emailClean}`);
        console.log("Subject: Welcome to the Neuron Waitlist");
        console.log("HTML Body Preview:");
        console.log(emailHtml);
        console.log("-----------------------------------------");
      }
    }

    return NextResponse.json({ position, exists: alreadyExists });
  } catch (err: any) {
    console.error("Waitlist submit error:", err);
    return NextResponse.json({ error: err.message || "Internal server error." }, { status: 500 });
  }
}
