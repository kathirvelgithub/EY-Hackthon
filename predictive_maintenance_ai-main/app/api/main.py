from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.agents.master import run_predictive_flow


class RunFlowRequest(BaseModel):
    vehicle_id: str
    customer_name: str | None = None


app = FastAPI(title="Predictive Maintenance AI Agents", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "OK"}


@app.get("/agents")
def list_agents():
    return {
        "agents": [
            "DataAnalysis",
            "Diagnosis",
            "CustomerEngagement",
            "Scheduling",
            "Feedback",
            "Manufacturing",
        ]
    }


@app.get("/status")
def status():
    return {"status": "ready", "service": "ai-agents"}


@app.post("/orchestration/run_flow")
def run_flow(req: RunFlowRequest):
    try:
        state = run_predictive_flow(req.vehicle_id)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    success = not state.get("error_message")
    return {
        "success": success,
        "vehicle_id": req.vehicle_id,
        "customer_name": req.customer_name,
        "data": state,
    }
