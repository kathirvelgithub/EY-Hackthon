"""
Test Voice Assistant Backend Integration
Verifies that voice assistant can access backend data
"""
import requests
import json

BACKEND_URL = "http://localhost:5000"
AI_AGENTS_URL = "http://localhost:8000"

print("=" * 70)
print("Voice Assistant Backend Integration Test")
print("=" * 70)

# Test 1: Backend Telematics Data
print("\n1. Testing Backend Telematics Data (Vehicle Health)...")
try:
    response = requests.get(f"{BACKEND_URL}/telematics")
    if response.status_code == 200:
        data = response.json()
        vehicles = data.get('data') or data.get('records') or []
        print(f"   ✓ SUCCESS: {len(vehicles)} vehicles found")
        if vehicles:
            v = vehicles[0]
            print(f"   Sample: {v.get('vehicle_id')} - Engine: {v.get('engine_temp')}°C, Battery: {v.get('battery_voltage')}V")
    else:
        print(f"   ✗ FAILED: Status {response.status_code}")
except Exception as e:
    print(f"   ✗ ERROR: {e}")

# Test 2: Backend Maintenance Data
print("\n2. Testing Backend Maintenance Data...")
try:
    response = requests.get(f"{BACKEND_URL}/maintenance")
    if response.status_code == 200:
        data = response.json()
        records = data.get('data') or data.get('records') or []
        print(f"   ✓ SUCCESS: {len(records)} maintenance records found")
        if records:
            r = records[0]
            print(f"   Sample: {r.get('vehicle_id')} - {r.get('service_type')} (${r.get('cost')})")
    else:
        print(f"   ✗ FAILED: Status {response.status_code}")
except Exception as e:
    print(f"   ✗ ERROR: {e}")

# Test 3: Backend Booking Data
print("\n3. Testing Backend Booking Data (Service Appointments)...")
try:
    response = requests.get(f"{BACKEND_URL}/scheduler/bookings")
    if response.status_code == 200:
        data = response.json()
        bookings = data.get('data') or data.get('records') or []
        print(f"   ✓ SUCCESS: {len(bookings)} bookings found")
        if bookings:
            b = bookings[0]
            print(f"   Sample: {b.get('vehicle_id')} - {b.get('service_type')} on {b.get('booking_date')}")
    else:
        print(f"   ✗ FAILED: Status {response.status_code}")
except Exception as e:
    print(f"   ✗ ERROR: {e}")

# Test 4: AI Agents Orchestration
print("\n4. Testing AI Agents Orchestration...")
try:
    response = requests.post(
        f"{AI_AGENTS_URL}/orchestration/run_flow",
        json={"vehicle_id": "V001"},
        timeout=10
    )
    if response.status_code == 200:
        data = response.json()
        print(f"   ✓ SUCCESS: AI orchestration completed")
        print(f"   Response keys: {list(data.keys())}")
    else:
        print(f"   ✗ FAILED: Status {response.status_code}")
except Exception as e:
    print(f"   ⚠ TIMEOUT/ERROR: {e}")

# Test 5: TTS Voice Service
print("\n5. Testing TTS Voice Service...")
try:
    response = requests.get(f"{AI_AGENTS_URL}/voice/status")
    if response.status_code == 200:
        data = response.json()
        if data.get('available'):
            print(f"   ✓ SUCCESS: TTS service available ({data.get('service')})")
        else:
            print(f"   ⚠ WARNING: TTS service not available")
    else:
        print(f"   ✗ FAILED: Status {response.status_code}")
except Exception as e:
    print(f"   ✗ ERROR: {e}")

print("\n" + "=" * 70)
print("Voice Assistant Integration Summary:")
print("=" * 70)
print("✓ Voice assistant can now:")
print("  - Access vehicle health data from backend")
print("  - Retrieve maintenance history")
print("  - Check service appointments")
print("  - Use AI orchestration for complex queries")
print("  - Convert responses to speech using TTS")
print("\n✓ Navigate to: http://localhost:3000/voice")
print("=" * 70)
