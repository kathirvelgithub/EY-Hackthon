import os

from dotenv import load_dotenv
from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI

from app.agents.state import AgentState
from app.data.repositories import NotificationRepo
from app.ueba.middleware import secure_call
from app.config.settings import get_settings

load_dotenv()


def _get_llm():
    settings = get_settings()
    if settings.llm_provider == "google":
        return ChatGoogleGenerativeAI(
            model=settings.llm_model,
            google_api_key=settings.google_api_key,
            api_version=settings.llm_api_version,
        )
    else:
        return ChatOpenAI(
            model=settings.llm_model,
            base_url="https://openrouter.ai/api/v1",
            api_key=settings.openai_api_key,
        )

def customer_node(state: AgentState) -> AgentState:
    print("🗣️ [Customer] Drafting notification...")
    
    # Get details
    owner = state["vehicle_metadata"].get("owner", "Customer")
    model = state["vehicle_metadata"].get("model", "Vehicle")
    diagnosis = state["diagnosis_report"]
    priority = state["priority_level"]

    llm = _get_llm()

    # Prompt the AI to write a message
    prompt = f"""
    You are a Service Advisor at a Truck Dealership.
    Write a short, professional text message to {owner}.
    
    Topic: Their {model} needs urgent repair.
    Diagnosis Summary: {diagnosis}
    Priority: {priority}
    
    Ask them to confirm a booking for tomorrow.
    """

    response = llm.invoke([HumanMessage(content=prompt)])
    state["customer_script"] = response.content

    agent_name = "CustomerEngagement"
    try:
        secure_call(
            agent_name,
            "NotificationRepo",
            NotificationRepo.push_notification,
            state["vehicle_id"],
            state["customer_script"],
            "app",
            {"priority": priority},
        )
    except Exception as exc:  # noqa: BLE001
        print(f"⚠️ [Customer] Notification failed: {exc}")

    print(f"📞 [Customer] Message sent to {owner}. Waiting for reply...")
    state["customer_decision"] = "BOOKED"

    return state