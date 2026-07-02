# Deploy NEURON OS (public waitlist)

## Fastest: One-click Render deploy

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/yachitguliani/personal-assitant)

1. Click the button above (sign in with GitHub once)
2. Render reads `render.yaml` and creates **database + API + frontend**
3. Optional: add `RESEND_API_KEY` in the Render dashboard for welcome emails
4. Your live URLs will be:
   - `https://neuron-web.onrender.com/waitlist` — public signup
   - `https://neuron-web.onrender.com/waitlist/admin` — admin console

Share the waitlist link anywhere — no repo access needed.

---

## Local development

```bash
docker-compose up --build
```

- Waitlist: http://localhost:3000/waitlist
- Admin: http://localhost:3000/waitlist/admin (password: `neuron_admin_secret` by default)
- API: http://localhost:8000/docs

Waitlist data persists in Postgres (Docker) or SQLite (manual backend run).

---

## Environment variables (backend)

| Variable | Purpose |
|----------|---------|
| `WAITLIST_ADMIN_PASSWORD` | Admin console auth |
| `RESEND_API_KEY` | Welcome / invite emails (optional) |
| `RESEND_FROM_EMAIL` | Sender address for Resend |
| `PUBLIC_APP_URL` | Link in invite emails |

---

## Optional: Supabase SQL

If you prefer Supabase over Render Postgres, run `waitlist.sql` in Supabase SQL Editor. The app now uses the **FastAPI backend** waitlist table (`waitlist_entries`) by default.
