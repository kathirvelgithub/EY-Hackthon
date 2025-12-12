"""
Voice TTS Service using gTTS (Google Text-to-Speech)
Provides text-to-speech conversion for voice assistant functionality
"""

import os
import logging
from pathlib import Path
from typing import Optional, Dict, Any
from gtts import gTTS
import tempfile
import time

logger = logging.getLogger(__name__)

class VoiceTTSService:
    """Service for converting text to speech using gTTS"""
    
    def __init__(self, output_dir: Optional[str] = None):
        """
        Initialize the TTS service
        
        Args:
            output_dir: Directory to store generated audio files (default: temp directory)
        """
        if output_dir:
            self.output_dir = Path(output_dir)
        else:
            self.output_dir = Path("app/data/voice_outputs")
        
        self.output_dir.mkdir(parents=True, exist_ok=True)
        logger.info(f"VoiceTTSService initialized with output directory: {self.output_dir}")
    
    def text_to_speech(
        self,
        text: str,
        language: str = "en",
        slow: bool = False,
        filename: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Convert text to speech and save as audio file
        
        Args:
            text: Text to convert to speech
            language: Language code (default: 'en' for English)
            slow: Whether to speak slowly (default: False)
            filename: Custom filename (without extension). Auto-generated if None.
        
        Returns:
            Dictionary with audio file path and metadata
        """
        try:
            # Generate filename if not provided
            if not filename:
                filename = f"tts_{int(time.time() * 1000)}"
            
            # Ensure .mp3 extension
            if not filename.endswith('.mp3'):
                filename = f"{filename}.mp3"
            
            output_path = self.output_dir / filename
            
            # Create TTS object
            tts = gTTS(text=text, lang=language, slow=slow)
            
            # Save to file
            tts.save(str(output_path))
            
            logger.info(f"Generated TTS audio: {output_path}")
            
            return {
                "success": True,
                "audio_path": str(output_path),
                "filename": filename,
                "language": language,
                "text_length": len(text)
            }
            
        except Exception as e:
            logger.error(f"TTS generation failed: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_available_languages(self) -> Dict[str, str]:
        """
        Get available language codes
        
        Returns:
            Dictionary of language codes and names
        """
        # Common languages supported by gTTS
        return {
            "en": "English",
            "es": "Spanish",
            "fr": "French",
            "de": "German",
            "it": "Italian",
            "pt": "Portuguese",
            "ru": "Russian",
            "ja": "Japanese",
            "ko": "Korean",
            "zh-CN": "Chinese (Simplified)",
            "zh-TW": "Chinese (Traditional)",
            "ar": "Arabic",
            "hi": "Hindi",
            "nl": "Dutch",
            "pl": "Polish",
            "tr": "Turkish"
        }
    
    def is_available(self) -> bool:
        """
        Check if TTS service is available
        
        Returns:
            True if service is available
        """
        try:
            # Try to create a simple TTS object
            test_tts = gTTS(text="test", lang="en")
            return True
        except Exception as e:
            logger.error(f"TTS service not available: {str(e)}")
            return False
    
    def cleanup_old_files(self, max_age_hours: int = 24):
        """
        Clean up old audio files
        
        Args:
            max_age_hours: Maximum age of files to keep (in hours)
        """
        current_time = time.time()
        max_age_seconds = max_age_hours * 3600
        
        cleaned_count = 0
        for file_path in self.output_dir.glob("tts_*.mp3"):
            if (current_time - file_path.stat().st_mtime) > max_age_seconds:
                try:
                    file_path.unlink()
                    cleaned_count += 1
                except Exception as e:
                    logger.error(f"Failed to delete {file_path}: {str(e)}")
        
        logger.info(f"Cleaned up {cleaned_count} old TTS files")
        return cleaned_count
