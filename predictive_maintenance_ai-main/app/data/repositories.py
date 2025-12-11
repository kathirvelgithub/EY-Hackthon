"""Repositories that proxy all agent data access to the backend REST API."""

from typing import Any, Dict, Optional

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from app.config.settings import get_settings


settings = get_settings()


def _build_session() -> requests.Session:
    session = requests.Session()
    retry = Retry(
        total=settings.max_retries,
        backoff_factor=settings.retry_backoff,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods={"GET", "POST"},
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    return session


session = _build_session()


def _request(method: str, path: str, **kwargs) -> Any:
    url = f"{settings.backend_api_url.rstrip('/')}{path}"
    resp = session.request(method, url, timeout=settings.request_timeout, **kwargs)
    resp.raise_for_status()
    data = resp.json()
    # Backend wraps payload in { success, data }
    if isinstance(data, dict) and "data" in data:
        return data.get("data")
    return data


class TelematicsRepo:
    @staticmethod
    def get_latest_telematics(vehicle_id: str) -> Optional[Dict[str, Any]]:
        return _request("GET", f"/telematics/{vehicle_id}")


class MaintenanceRepo:
    @staticmethod
    def get_maintenance_history(vehicle_id: str, limit: int = 5) -> Optional[Dict[str, Any]]:
        return _request("GET", f"/maintenance/{vehicle_id}", params={"limit": limit})


class VehicleRepo:
    @staticmethod
    def get_vehicle_details(vehicle_id: str) -> Optional[Dict[str, Any]]:
        # Vehicle metadata can be inferred from the telematics response
        data = _request("GET", f"/telematics/{vehicle_id}")
        if not data:
            return None
        metadata = data.copy()
        metadata["vehicle_id"] = vehicle_id
        return metadata


class SchedulerRepo:
    @staticmethod
    def get_available_slots(center_id: str = "CENTER_001", date: Optional[str] = None) -> Dict[str, Any]:
        from datetime import datetime
        params = {"center_id": center_id}
        # Always provide a date - use today if not specified
        params["date"] = date or datetime.now().strftime("%Y-%m-%d")
        return _request("GET", "/scheduler/slots", params=params)

    @staticmethod
    def book_appointment(vehicle_id: str, slot_id: str, center_id: str, customer_name: str) -> Dict[str, Any]:
        payload = {
            "vehicle_id": vehicle_id,
            "slot_id": slot_id,
            "center_id": center_id,
            "customer_name": customer_name,
        }
        return _request("POST", "/scheduler/book", json=payload)


class NotificationRepo:
    @staticmethod
    def push_notification(vehicle_id: str, message: str, channel: str = "app", metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        payload = {
            "vehicle_id": vehicle_id,
            "message": message,
            "channel": channel,
            "metadata": metadata or {},
        }
        return _request("POST", "/notifications/push", json=payload)


class UebaRepo:
    @staticmethod
    def log_event(agent_name: str, service_name: str, status: str, details: str = "") -> None:
        if not settings.log_to_backend:
            return
        payload = {
            "agent_name": agent_name,
            "service_name": service_name,
            "status": status,
            "details": details,
        }
        try:
            _request("POST", "/ueba/event", json=payload)
        except Exception as exc:  # noqa: BLE001
            # Fallback to console log; avoid hard-failing the agent flow
            print(f"⚠️ UEBA log failed: {exc}")