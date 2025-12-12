from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os

from app.agents.master import run_predictive_flow
from app.api.voice_tts import VoiceTTSService


class RunFlowRequest(BaseModel):
    vehicle_id: str
    customer_name: str | None = None


class TTSRequest(BaseModel):
    text: str
    language: str = "en"
    slow: bool = False
    filename: str | None = None


# Initialize TTS service
tts_service = VoiceTTSService()


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


# TTS Voice Endpoints
@app.post("/voice/tts")
def text_to_speech(request: TTSRequest):
    """Convert text to speech and return audio file path"""
    try:
        result = tts_service.text_to_speech(
            text=request.text,
            language=request.language,
            slow=request.slow,
            filename=request.filename
        )
        
        if not result.get("success"):
            raise HTTPException(status_code=500, detail=result.get("error", "TTS generation failed"))
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/voice/audio/{filename}")
def get_audio_file(filename: str):
    """Serve generated audio file"""
    try:
        file_path = tts_service.output_dir / filename
        
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="Audio file not found")
        
        return FileResponse(
            path=str(file_path),
            media_type="audio/mpeg",
            filename=filename,
            headers={
                "Accept-Ranges": "bytes",
                "Cache-Control": "no-cache",
                "Access-Control-Allow-Origin": "*"
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/voice/languages")
def get_available_languages():
    """Get list of available TTS languages"""
    try:
        return {
            "success": True,
            "languages": tts_service.get_available_languages()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/voice/status")
def get_tts_status():
    """Check if TTS service is available"""
    try:
        is_available = tts_service.is_available()
        return {
            "success": True,
            "available": is_available,
            "service": "gTTS"
        }
    except Exception as e:
        return {
            "success": False,
            "available": False,
            "error": str(e)
        }

