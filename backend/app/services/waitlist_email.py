import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import httpx

from app.core.config import settings

logger = logging.getLogger("neuron-os")


def _smtp_config():
    user = (settings.SMTP_USER or "").strip()
    password = (settings.SMTP_PASSWORD or "").strip()
    if not user or not password:
        return None

    host = (settings.SMTP_HOST or "").strip()
    if not host and user.endswith("@gmail.com"):
        host = "smtp.gmail.com"
    if not host:
        return None

    port = settings.SMTP_PORT or 587
    from_addr = (settings.SMTP_FROM or "").strip() or f"Neuron <{user}>"
    return host, port, user, password, from_addr


def _send_smtp(to: str, subject: str, html: str) -> bool:
    config = _smtp_config()
    if not config:
        return False

    host, port, user, password, from_addr = config
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = from_addr
    msg["To"] = to
    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP(host, port, timeout=15) as server:
        server.starttls()
        server.login(user, password)
        server.sendmail(user, [to], msg.as_string())
    return True


def _send_resend(to: str, subject: str, html: str) -> bool:
    if not settings.RESEND_API_KEY:
        return False
    httpx.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {settings.RESEND_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "from": settings.RESEND_FROM_EMAIL,
            "to": [to],
            "subject": subject,
            "html": html,
        },
        timeout=15.0,
    ).raise_for_status()
    return True


def _send_email(to: str, subject: str, html: str) -> None:
    if _send_smtp(to, subject, html):
        return
    if _send_resend(to, subject, html):
        return
    logger.info("EMAIL simulation (set SMTP_USER + SMTP_PASSWORD) → %s | %s", to, subject)


def send_welcome_email(email: str, position: int) -> None:
    html = f"""<!DOCTYPE html><html><body style="background:#000;color:#e4e4e7;font-family:monospace;padding:40px">
<div style="max-width:500px;margin:0 auto">
<div style="color:#71717a;font-size:12px;margin-bottom:24px">~/neuron/welcome.txt</div>
<div style="font-weight:600;font-size:16px;margin-bottom:20px;color:#fff">Neuron</div>
<div style="font-size:13px;color:#d4d4d8;line-height:1.6">
Thank you for joining the Neuron waitlist.<br><br>
You're officially in — your position is <strong style="color:#fff">#{position}</strong>.<br><br>
We're building something worth waiting for, and we're grateful you're here early.<br><br>
No spam, no newsletters — we'll only email you again when Neuron is ready for you.
</div>
<div style="margin-top:28px;padding-top:20px;border-top:1px solid #27272a;font-size:11px;color:#71717a">
— The Neuron team
</div></div></body></html>"""
    _send_email(email, "You're on the Neuron waitlist — thank you!", html)


def send_beta_invite(email: str) -> None:
    url = settings.PUBLIC_APP_URL
    html = f"""<!DOCTYPE html><html><body style="background:#000;color:#e4e4e7;font-family:monospace;padding:40px">
<div style="max-width:500px;margin:0 auto">
<div style="color:#71717a;font-size:12px">~/neuron/beta.txt</div>
<p style="color:#d4d4d8;font-size:13px">You are invited to the Neuron private beta.</p>
<a href="{url}" style="display:inline-block;background:#fff;color:#000;padding:10px 20px;border-radius:4px;text-decoration:none;font-size:12px;margin-top:16px">Access Private Beta →</a>
</div></body></html>"""
    _send_email(email, "Your Neuron Beta Invitation", html)


def send_launch_invite(email: str) -> None:
    url = settings.PUBLIC_APP_URL
    html = f"""<!DOCTYPE html><html><body style="background:#000;color:#e4e4e7;font-family:monospace;padding:40px">
<div style="max-width:500px;margin:0 auto">
<div style="color:#71717a;font-size:12px">~/neuron/launch.txt</div>
<p style="color:#d4d4d8;font-size:13px">Neuron is ready. Thank you for believing in the project early.</p>
<a href="{url}" style="display:inline-block;background:#fff;color:#000;padding:10px 20px;border-radius:4px;text-decoration:none;font-size:12px;margin-top:16px">Launch Neuron →</a>
</div></body></html>"""
    _send_email(email, "Neuron is ready.", html)
