"""Smoke test for Life OS API."""
import asyncio
from datetime import date, timedelta

import httpx

from app.main import app


async def main():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app), base_url="http://test"
    ) as client:
        r = await client.post(
            "/api/auth/login", json={"email": "demo@neuron.net", "password": "test1234"}
        )
        assert r.status_code == 200, r.text
        token = r.json()["access_token"]
        h = {"Authorization": f"Bearer {token}"}

        for i in range(7):
            d = (date.today() - timedelta(days=6 - i)).isoformat()
            r = await client.post(
                "/api/metrics/log",
                json={
                    "log_date": d,
                    "sleep_hours": 6.0 - i * 0.3,
                    "deep_work_minutes": 180 - i * 25,
                    "screen_time_minutes": 200 + i * 30,
                    "energy_level": max(1, 8 - i),
                    "mood": max(1, 7 - i),
                },
                headers=h,
            )
            assert r.status_code == 200, r.text

        r = await client.get("/api/burnout/risk-score", headers=h)
        assert r.status_code == 200, r.text
        data = r.json()
        print(f"Risk: {data['risk_score']}  Warning: {data['warning_triggered']}")
        assert data["risk_score"] > 0

        r = await client.post(
            "/api/goals",
            json={"title": "Ship Life OS", "category": "work", "progress": 40},
            headers=h,
        )
        assert r.status_code == 201, r.text
        print(f"Goal: {r.json()['title']}")

        r = await client.get("/api/metrics/history?days=7", headers=h)
        assert len(r.json()) == 7

        r = await client.get("/api/burnout/weekly-report", headers=h)
        assert r.status_code == 200
        print(f"Recommendation: {r.json()['recommendation'][:80]}...")

        print("ALL TESTS PASSED")


if __name__ == "__main__":
    asyncio.run(main())
