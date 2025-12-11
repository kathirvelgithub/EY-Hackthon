import os

from dotenv import load_dotenv
from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI

from app.agents.state import AgentState
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

def feedback_node(state: AgentState) -> AgentState:
    print("⭐ [Feedback] Service completed. Requesting customer review...")
    
    # Only run if a booking was actually made
    if state.get("customer_decision") != "BOOKED":
        return state

    llm = _get_llm()
    owner = state["vehicle_metadata"].get("owner")
    
    prompt = f"""
    You are a Customer Experience AI.
    The customer {owner} just had their truck serviced after our urgent alert.
    
    Write a short, warm 'Post-Service Follow-up' script (Voice Style).
    Ask if the vehicle is running smoothly and request a satisfaction rating (1-5).
    """

    response = llm.invoke([HumanMessage(content=prompt)])
    
    # Store this in state (we will display it in UI)
    state["feedback_request"] = response.content
    print("✅ [Feedback] Follow-up sent.")
    
    return state