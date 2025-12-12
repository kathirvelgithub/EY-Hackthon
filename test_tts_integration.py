"""
Quick test for TTS voice service integration
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_tts_status():
    """Test if TTS service is available"""
    print("\n1. Testing TTS Status...")
    response = requests.get(f"{BASE_URL}/voice/status")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_tts_languages():
    """Test getting available languages"""
    print("\n2. Testing Available Languages...")
    response = requests.get(f"{BASE_URL}/voice/languages")
    print(f"Status Code: {response.status_code}")
    data = response.json()
    print(f"Available Languages: {len(data.get('languages', {}))} languages")
    # Print first 5 languages
    for lang_code, lang_name in list(data.get('languages', {}).items())[:5]:
        print(f"  - {lang_code}: {lang_name}")
    return response.status_code == 200

def test_text_to_speech():
    """Test text to speech conversion"""
    print("\n3. Testing Text-to-Speech Conversion...")
    
    test_text = "Hello! Welcome to the automotive maintenance system. Your vehicle is in good health."
    
    payload = {
        "text": test_text,
        "language": "en",
        "slow": False
    }
    
    response = requests.post(f"{BASE_URL}/voice/tts", json=payload)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
        
        # Try to get the audio file
        if data.get("success") and data.get("filename"):
            print("\n4. Testing Audio File Retrieval...")
            audio_response = requests.get(f"{BASE_URL}/voice/audio/{data['filename']}")
            print(f"Audio Status Code: {audio_response.status_code}")
            print(f"Audio Content Type: {audio_response.headers.get('content-type')}")
            print(f"Audio Size: {len(audio_response.content)} bytes")
            return audio_response.status_code == 200
    else:
        print(f"Error: {response.text}")
    
    return response.status_code == 200

def main():
    print("=" * 60)
    print("TTS Voice Service Integration Test")
    print("=" * 60)
    
    tests = [
        ("TTS Status", test_tts_status),
        ("Available Languages", test_tts_languages),
        ("Text-to-Speech", test_text_to_speech),
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, "✓ PASSED" if result else "✗ FAILED"))
        except Exception as e:
            print(f"Error in {test_name}: {str(e)}")
            results.append((test_name, "✗ ERROR"))
    
    print("\n" + "=" * 60)
    print("Test Results Summary")
    print("=" * 60)
    for test_name, result in results:
        print(f"{test_name}: {result}")
    print("=" * 60)

if __name__ == "__main__":
    main()
