# Deploy NEURON OS (Public Waitlist)

The waitlist lives in the **Next.js frontend** (`frontend/`). It needs Vercel (or similar) because `/api/waitlist` uses serverless API routes.

## One-time setup (≈10 minutes)

### 1. Supabase database

1. Create a project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** → paste contents of [`waitlist.sql`](../waitlist.sql) → Run
3. Copy **Project URL** and **service_role** key (Settings → API)

### 2. Resend (welcome emails)

1. Create account at [resend.com](https://resend.com)
2. Add and verify your sending domain (or use Resend sandbox for testing)
3. Copy API key

### 3. Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import repo: `yachitguliani/personal-assitant`
3. Set **Root Directory** → `frontend`
4. Add **Environment Variables**:

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role key |
| `RESEND_API_KEY` | Resend API key |
| `WAITLIST_ADMIN_PASSWORD` | Strong password for `/waitlist/admin` |

5. Click **Deploy**

Your public URLs:
- **Waitlist:** `https://YOUR-PROJECT.vercel.app/waitlist`
- **Admin:** `https://YOUR-PROJECT.vercel.app/waitlist/admin`

### 4. Update README badge (optional)

Replace `personal-assitant.vercel.app` in README with your real Vercel domain.

---

## CLI deploy (after `vercel login`)

```bash
cd frontend
vercel --prod
```

---

## Local development

```bash
cd frontend
cp ../.env.example .env.local
# Fill in Supabase + Resend keys (or leave empty for in-memory mock)
npm run dev
```

Open http://localhost:3000/waitlist

Without Supabase keys, signups use an **in-memory mock** (resets on server restart).

---

## GitHub contributors

Share this link — no repo clone needed:

```
https://YOUR-PROJECT.vercel.app/waitlist?ref=github
```

The `?ref=github` flag tags signups from GitHub in the admin dashboard.
