# Deploy NEURON OS waitlist

## Live (Vercel)

- **Public waitlist:** https://frontend-mu-sand-39.vercel.app/waitlist
- **Private admin** (password required): https://frontend-mu-sand-39.vercel.app/waitlist/admin

### Welcome emails (Gmail SMTP — recommended)

No Resend account needed. Use your **Gmail** (or Outlook) with an app password:

1. Turn on [2-Step Verification](https://myaccount.google.com/security) for your Google account
2. Create an [App Password](https://myaccount.google.com/apppasswords) (16 characters)
3. In [Vercel → Environment Variables](https://vercel.com/yachitguliani2005-1045s-projects/frontend/settings/environment-variables), add:

| Variable | Example |
|----------|---------|
| `SMTP_USER` | `you@gmail.com` |
| `SMTP_PASSWORD` | `abcd efgh ijkl mnop` (app password) |
| `SMTP_FROM` | `Neuron <you@gmail.com>` |

`SMTP_HOST` is auto-set to `smtp.gmail.com` for Gmail addresses. Redeploy after saving.

**Outlook:** `SMTP_HOST=smtp-mail.outlook.com`, `SMTP_PORT=587`, plus your Microsoft account email and password/app password.

**Optional:** `RESEND_API_KEY` still works as a fallback if SMTP is not configured.

### Other settings

| Variable | Purpose |
|----------|---------|
| `WAITLIST_ADMIN_PASSWORD` | Private admin console |
| `PUBLIC_APP_URL` | `https://frontend-mu-sand-39.vercel.app` |

---

## Local development

```bash
docker-compose up --build
```

Copy `.env.example` → `.env` and fill in `SMTP_USER` / `SMTP_PASSWORD` to test thank-you emails locally.
