from app.agents.state import AgentState
from app.data.repositories import NotificationRepo, SchedulerRepo
from app.ueba.middleware import secure_call


def _choose_slot(slot_payload):
    slots = slot_payload.get("slots") if isinstance(slot_payload, dict) else None
    if slots:
        return slots[0]
    return None


def scheduling_node(state: AgentState) -> AgentState:
    print("🗓️ [Scheduler] Finding repair slot...")

    if state.get("customer_decision") != "BOOKED":
        print("⏸️ Booking skipped by customer.")
        return state

    agent_name = "Scheduling"
    v_id = state["vehicle_id"]

    try:
        slots = secure_call(agent_name, "SchedulerRepo", SchedulerRepo.get_available_slots)
        selected_slot = _choose_slot(slots)
        if not selected_slot:
            state["error_message"] = "No available slots"
            return state

        booking = secure_call(
            agent_name,
            "SchedulerRepo",
            SchedulerRepo.book_appointment,
            v_id,
            selected_slot.get("slot_id"),
            selected_slot.get("center_id"),
            state["vehicle_metadata"].get("owner", "Customer"),
        )

        state["booking_id"] = booking.get("booking", {}).get("booking_id") or booking.get("booking_id")
        state["selected_slot"] = selected_slot.get("time") or selected_slot
        print(f"✅ [Scheduler] CONFIRMED! ID: {state['booking_id']}")

        # Notify customer about booking
        secure_call(
            agent_name,
            "NotificationRepo",
            NotificationRepo.push_notification,
            v_id,
            f"Your service is booked for {state['selected_slot']}",
            "app",
            {"booking_id": state.get("booking_id")},
        )

    except PermissionError as e:
        state["error_message"] = str(e)
        print(f"⛔ [UEBA] BLOCKED: {e}")
    except Exception as exc:  # noqa: BLE001
        state["error_message"] = str(exc)
        print(f"⚠️ [Scheduler] Failed: {exc}")

    return state