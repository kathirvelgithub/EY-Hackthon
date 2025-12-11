import time
from typing import Dict, List

from app.data.repositories import UebaRepo

# Lightweight in-memory buffer for quick inspection
EVENT_LOG: List[Dict] = []


def log_event(agent_name: str, action: str, status: str, details: str = ""):
    event = {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "agent": agent_name,
        "action": action,
        "status": status,
        "details": details,
    }
    EVENT_LOG.append(event)

    icon = "🛡️" if status == "ALLOWED" else "⛔"
    print(f"{icon} [UEBA] {agent_name} -> {action}: {status}")

    # Forward to backend for durable audit trail
    try:
        UebaRepo.log_event(agent_name, action, status, details)
    except Exception as exc:  # noqa: BLE001
        print(f"⚠️ Failed to persist UEBA event: {exc}")


def get_recent_events(limit: int = 10):
    return EVENT_LOG[-limit:]