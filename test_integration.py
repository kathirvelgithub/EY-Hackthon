"""
Quick Test Script for Backend-AI Agent Integration
Run this to verify the integration is working
"""
import requests
import json
from datetime import datetime

BACKEND_URL = "http://localhost:5000"
AI_AGENT_URL = "http://localhost:8000"

def test_backend():
    """Test if backend is running"""
    print("🔍 Testing Backend Connection...")
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=5)
        if response.status_code == 200:
            print(f"✅ Backend is running: {response.json()}")
            return True
        else:
            print(f"❌ Backend returned status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Backend not accessible: {e}")
        print("   👉 Start backend with: cd automotive-maintenance-backend && npm start")
        return False

def test_ai_agents():
    """Test if AI agents are running"""
    print("\n🤖 Testing AI Agents Connection...")
    try:
        response = requests.get(f"{AI_AGENT_URL}/health", timeout=5)
        if response.status_code == 200:
            print(f"✅ AI Agents are running: {response.json()}")
            return True
        else:
            print(f"❌ AI Agents returned status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ AI Agents not accessible: {e}")
        print("   👉 Start agents with: cd predictive_maintenance_ai-main && uvicorn app.api.main:app --port 8000")
        return False

def test_integration():
    """Test the full integration"""
    print("\n🔗 Testing Backend-AI Integration...")
    try:
        # Test orchestration flow
        response = requests.post(
            f"{AI_AGENT_URL}/orchestration/run_flow",
            json={"vehicle_id": "VEH_001"},
            timeout=30
        )
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Integration successful!")
            print(f"   Status: {result.get('status')}")
            print(f"   Message: {result.get('message')}")
            return True
        else:
            print(f"❌ Integration failed: {response.status_code}")
            print(f"   {response.text}")
            return False
    except Exception as e:
        print(f"❌ Integration test failed: {e}")
        return False

def main():
    print("=" * 60)
    print("🚀 BACKEND-AI AGENT INTEGRATION TEST")
    print("=" * 60)
    
    backend_ok = test_backend()
    agents_ok = test_ai_agents()
    
    if backend_ok and agents_ok:
        test_integration()
    else:
        print("\n⚠️  Prerequisites not met. Please start the required services.")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    main()
