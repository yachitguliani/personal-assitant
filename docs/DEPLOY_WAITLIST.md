# Deploy NEURON OS waitlist

## Live (Vercel)

- **Public waitlist:** https://frontend-mu-sand-39.vercel.app/waitlist
- **Private admin** (password required): https://frontend-mu-sand-39.vercel.app/waitlist/admin

The waitlist registry is never public — only the signup form is. Admin requires your password.

### Welcome emails (Resend)

In [Vercel → Project → Settings → Environment Variables](https://vercel.com/yachitguliani2005-1045s-projects/frontend/settings/environment-variables), add:

| Variable | Value |
|----------|--------|
| `RESEND_API_KEY` | Your key from [resend.com](https://resend.com) |
| `RESEND_FROM_EMAIL` | Verified sender, e.g. `Neuron <you@yourdomain.com>` |
| `WAITLIST_ADMIN_PASSWORD` | Your private admin password |
| `PUBLIC_APP_URL` | `https://frontend-mu-sand-39.vercel.app` |

Redeploy after adding variables. Without `RESEND_API_KEY`, signups work but emails are logged only.

### Persistent storage (Vercel Blob)

Create a Blob store in Vercel (Storage → Blob) so waitlist entries survive redeploys. Without Blob, entries use ephemeral memory on the serverless instance.

---

## Full-stack (Render — optional)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/yachitguliani/personal-assitant)

Sets `BACKEND_URL` on the frontend container to proxy to FastAPI + Postgres.

---

## Local development

```bash
docker-compose up --build
```

Waitlist at `/waitlist`. Admin password defaults to `neuron_admin_secret` (see `.env.example`).
