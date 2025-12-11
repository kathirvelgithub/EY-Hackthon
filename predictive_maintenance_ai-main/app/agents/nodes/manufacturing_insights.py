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

def manufacturing_node(state: AgentState) -> AgentState:
    print("🏭 [Manufacturing] Analyzing failure for fleet-wide patterns...")
    
    # Only run if there is a real issue
    if state["risk_score"] < 40:
        state["manufacturing_recommendations"] = "No design changes needed."
        return state

    llm = _get_llm()
    diagnosis = state["diagnosis_report"]
    model = state["vehicle_metadata"].get("model")

    prompt = f"""
    You are a Quality Engineering AI at the {model} factory.
    A vehicle has failed in the field.
    
    Diagnosis: {diagnosis}
    
    TASK:
    Suggest a 'Root Cause Design Improvement' to prevent this in future models.
    Focus on material changes, sensor placement, or software logic.
    
    Output format:
    Design Flaw: [What failed]
    Engineering Fix: [Technical solution]
    """

    response = llm.invoke([HumanMessage(content=prompt)])
    state["manufacturing_recommendations"] = response.content
    
    print("✅ [Manufacturing] CAPA Report Generated.")
    return state