"use client"

import { useState, useRef, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2, Play, Pause, MessageSquare, Sparkles, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { backendApi, aiAgentsApi } from "@/lib/api-client"

export function VoicePanel() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState<string[]>([
    "Hello! I'm your AI assistant. How can I help you with your vehicle today?",
  ])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [vehicleData, setVehicleData] = useState<any>(null)
  const [maintenanceData, setMaintenanceData] = useState<any>(null)
  const [bookingData, setBookingData] = useState<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Load backend data on mount
  useEffect(() => {
    loadBackendData()
  }, [])

  const loadBackendData = async () => {
    try {
      // Fetch vehicle telemetry data
      const vehicles = await backendApi.getAllTelemetrics()
      setVehicleData(vehicles?.data || vehicles?.records || [])

      // Fetch maintenance records
      const maintenance = await backendApi.getAllMaintenanceRecords()
      setMaintenanceData(maintenance?.data || maintenance?.records || [])

      // Fetch bookings
      const bookings = await backendApi.getAllBookings()
      setBookingData(bookings?.data || bookings?.records || [])

      console.log('Voice Assistant - Backend data loaded:', { 
        vehicles: vehicles?.data?.length || 0,
        maintenance: maintenance?.data?.length || 0,
        bookings: bookings?.data?.length || 0
      })
    } catch (error) {
      console.error('Failed to load backend data for voice assistant:', error)
    }
  }

  const speakText = async (text: string) => {
    try {
      setIsSpeaking(true)
      console.log('TTS: Generating speech for:', text.substring(0, 50) + '...')
      
      // Call TTS API
      const response = await fetch('http://localhost:8000/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: text,
          language: 'en',
          slow: false
        })
      })
      
      if (!response.ok) {
        console.error('TTS API Error:', response.status, response.statusText)
        throw new Error('TTS service unavailable')
      }
      
      const data = await response.json()
      console.log('TTS Response:', data)
      
      if (!data.success || !data.filename) {
        throw new Error('TTS failed to generate audio')
      }
      
      // Construct audio URL with cache buster
      const audioUrl = `http://localhost:8000/voice/audio/${data.filename}?t=${Date.now()}`
      console.log('Audio URL:', audioUrl)
      
      // Load and play using Audio API (more reliable than audio element)
      const audio = new Audio(audioUrl)
      audio.crossOrigin = 'anonymous'
      
      audio.addEventListener('loadeddata', () => {
        console.log('Audio loaded successfully, duration:', audio.duration)
      })
      
      audio.addEventListener('error', (e) => {
        const error = audio.error
        console.error('Audio playback error:', {
          code: error?.code,
          message: error?.message,
          MEDIA_ERR_ABORTED: error?.code === 1,
          MEDIA_ERR_NETWORK: error?.code === 2,
          MEDIA_ERR_DECODE: error?.code === 3,
          MEDIA_ERR_SRC_NOT_SUPPORTED: error?.code === 4
        })
      })
      
      audio.addEventListener('play', () => {
        console.log('Audio playing')
        setIsPlaying(true)
      })
      
      audio.addEventListener('ended', () => {
        console.log('Audio ended')
        setIsPlaying(false)
      })
      
      audio.addEventListener('pause', () => {
        setIsPlaying(false)
      })
      
      // Store reference for controls
      audioRef.current = audio
      
      // Attempt to play
      try {
        await audio.play()
        console.log('Audio playing successfully')
      } catch (playError) {
        console.error('Play failed:', playError)
        throw new Error(`Playback failed: ${playError instanceof Error ? playError.message : 'Unknown error'}`)
      }
      
    } catch (error) {
      console.error('TTS Error:', error)
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      
      // Show error in transcript instead of alert
      setTranscript((prev) => [...prev, `⚠️ Voice Error: ${errorMsg}`])
    } finally {
      setIsSpeaking(false)
    }
  }

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      // Analyze user intent and generate response based on backend data
      const lowerMessage = userMessage.toLowerCase()

      // Check for vehicle health queries
      if (lowerMessage.includes('health') || lowerMessage.includes('status') || lowerMessage.includes('condition')) {
        if (vehicleData && vehicleData.length > 0) {
          const vehicle = vehicleData[0]
          const health = vehicle.engine_temp < 90 ? 'excellent' : vehicle.engine_temp < 100 ? 'good' : 'needs attention'
          const fuelStatus = vehicle.fuel_level > 50 ? 'good' : vehicle.fuel_level > 20 ? 'moderate' : 'low'
          const brakeStatus = vehicle.brake_wear < 50 ? 'excellent' : vehicle.brake_wear < 75 ? 'good' : 'needs replacement soon'
          
          return `Your vehicle ${vehicle.vehicle_name || vehicle.vehicle_id} is in ${health} condition. Engine temperature is ${vehicle.engine_temp} degrees celsius, battery voltage is ${vehicle.battery_voltage} volts. Brake wear is at ${vehicle.brake_wear} percent - ${brakeStatus}. Fuel level is ${vehicle.fuel_level} percent - ${fuelStatus}. Current odometer reading is ${vehicle.odometer} kilometers.`
        }
        return "I'm currently unable to retrieve your vehicle health data. Please try again."
      }

      // Check for fuel level queries
      if (lowerMessage.includes('fuel') || lowerMessage.includes('gas') || lowerMessage.includes('petrol')) {
        if (vehicleData && vehicleData.length > 0) {
          const vehicle = vehicleData[0]
          const fuelStatus = vehicle.fuel_level > 50 ? 'You have plenty of fuel' : vehicle.fuel_level > 20 ? 'Consider refueling soon' : 'Your fuel is running low, please refuel'
          return `${fuelStatus}. Current fuel level is ${vehicle.fuel_level} percent for ${vehicle.vehicle_name || vehicle.vehicle_id}.`
        }
        return "I cannot access fuel level data right now."
      }

      // Check for brake queries
      if (lowerMessage.includes('brake') || lowerMessage.includes('brakes')) {
        if (vehicleData && vehicleData.length > 0) {
          const vehicle = vehicleData[0]
          if (vehicle.brake_wear > 80) {
            return `Your brake pads are at ${vehicle.brake_wear} percent wear. I strongly recommend scheduling brake replacement soon for safety.`
          } else if (vehicle.brake_wear > 60) {
            return `Your brake pads are at ${vehicle.brake_wear} percent wear. Consider scheduling brake service within the next month.`
          }
          return `Your brakes are in good condition with ${vehicle.brake_wear} percent wear.`
        }
        return "I cannot check brake status at this time."
      }

      // Check for engine queries
      if (lowerMessage.includes('engine') || lowerMessage.includes('temperature') || lowerMessage.includes('temp')) {
        if (vehicleData && vehicleData.length > 0) {
          const vehicle = vehicleData[0]
          if (vehicle.engine_temp > 100) {
            return `Warning! Your engine temperature is ${vehicle.engine_temp} degrees celsius, which is above normal. Please have it checked immediately.`
          } else if (vehicle.engine_temp > 95) {
            return `Your engine temperature is ${vehicle.engine_temp} degrees celsius. It's slightly elevated but within acceptable range. Monitor it closely.`
          }
          return `Your engine temperature is ${vehicle.engine_temp} degrees celsius. Operating normally.`
        }
        return "I cannot retrieve engine data right now."
      }

      // Check for battery queries
      if (lowerMessage.includes('battery')) {
        if (vehicleData && vehicleData.length > 0) {
          const vehicle = vehicleData[0]
          if (vehicle.battery_voltage < 12.0) {
            return `Your battery voltage is ${vehicle.battery_voltage} volts, which is critically low. Battery replacement recommended.`
          } else if (vehicle.battery_voltage < 12.4) {
            return `Your battery voltage is ${vehicle.battery_voltage} volts. It's slightly low. Consider having it tested.`
          }
          return `Your battery voltage is ${vehicle.battery_voltage} volts. Battery health is good.`
        }
        return "I cannot check battery status right now."
      }

      // Check for error codes / diagnostic queries
      if (lowerMessage.includes('error') || lowerMessage.includes('code') || lowerMessage.includes('diagnostic') || lowerMessage.includes('dtc')) {
        if (vehicleData && vehicleData.length > 0) {
          const vehicle = vehicleData[0]
          if (vehicle.dtc_codes && vehicle.dtc_codes.length > 0) {
            return `I've detected ${vehicle.dtc_codes.length} diagnostic trouble code${vehicle.dtc_codes.length > 1 ? 's' : ''}: ${vehicle.dtc_codes.join(', ')}. I recommend scheduling a diagnostic service to address these issues.`
          }
          return `Good news! No diagnostic trouble codes detected. Your vehicle's systems are functioning normally.`
        }
        return "I cannot access diagnostic data at this time."
      }

      // Check for service/booking queries
      if (lowerMessage.includes('service') || lowerMessage.includes('appointment') || lowerMessage.includes('booking')) {
        if (bookingData && bookingData.length > 0) {
          const nextBooking = bookingData.find((b: any) => b.status === 'scheduled')
          if (nextBooking) {
            return `Your next service is scheduled for ${new Date(nextBooking.booking_date).toLocaleDateString()} at ${nextBooking.service_center}. Service type: ${nextBooking.service_type}.`
          }
        }
        return "You don't have any upcoming service appointments. Would you like me to help you schedule one?"
      }

      // Check for maintenance history queries
      if (lowerMessage.includes('maintenance') || lowerMessage.includes('history') || lowerMessage.includes('repair')) {
        if (maintenanceData && maintenanceData.length > 0) {
          const recentMaintenance = maintenanceData[0]
          return `Your most recent maintenance was ${recentMaintenance.service_type} on ${new Date(recentMaintenance.service_date).toLocaleDateString()}. Cost: $${recentMaintenance.cost}. Current odometer: ${recentMaintenance.odometer_reading} miles.`
        }
        return "I don't have any maintenance history records for your vehicle yet."
      }

      // Check for issues/problems queries
      if (lowerMessage.includes('issue') || lowerMessage.includes('problem') || lowerMessage.includes('alert')) {
        if (vehicleData && vehicleData.length > 0) {
          const vehicle = vehicleData[0]
          const issues = []
          if (vehicle.engine_temp > 95) issues.push('high engine temperature')
          if (vehicle.battery_voltage < 12.4) issues.push('low battery voltage')
          if (vehicle.tire_pressure < 30) issues.push('low tire pressure')
          
          if (issues.length > 0) {
            return `I've detected ${issues.length} issue(s): ${issues.join(', ')}. I recommend scheduling a service appointment soon.`
          }
          return "No issues detected. Your vehicle is running smoothly!"
        }
      }

      // Default response - use AI orchestration
      try {
        const orchestrationResult = await aiAgentsApi.runAgentFlow(
          vehicleData?.[0]?.vehicle_id || 'V001'
        )
        
        if (orchestrationResult?.data) {
          // Extract meaningful response from orchestration result
          const data = orchestrationResult.data
          if (data.predicted_issues && data.predicted_issues.length > 0) {
            const issue = data.predicted_issues[0]
            return `AI analysis detected: ${issue.component} requires attention. ${issue.recommendation || 'Recommend service soon.'}`
          }
          if (data.diagnosis) {
            return data.diagnosis
          }
          return "AI analysis complete. Your vehicle appears to be in good condition."
        }
      } catch (error) {
        console.error('Orchestration error:', error)
      }

      // Fallback response
      return "I'm here to help with vehicle health, service appointments, maintenance history, and any issues. What would you like to know?"
    } catch (error) {
      console.error('Error generating AI response:', error)
      return "I'm having trouble processing your request. Please try again."
    }
  }

  const handleMicClick = async () => {
    setIsListening(!isListening)
    if (!isListening) {
      // Simulate voice input after 2 seconds
      setTimeout(async () => {
        // Simulate different user queries based on available telematics data
        const queries = [
          "What's my vehicle health status?",
          "When is my next service due?",
          "How are my brakes?",
          "What's my engine temperature?",
          "Check my battery voltage",
          "Are there any error codes?",
          "What's my fuel level?",
          "Show me my maintenance history"
        ]
        const userMessage = queries[Math.floor(Math.random() * queries.length)]
        
        setTranscript([...transcript, `You: ${userMessage}`])
        setIsListening(false)
        
        // Generate AI response from backend data
        const aiResponse = await generateAIResponse(userMessage)
        setTranscript((prev) => [...prev, `AI: ${aiResponse}`])
        
        // Speak the AI response
        speakText(aiResponse)
      }, 2000)
    }
  }

  const handleAudioEnd = () => {
    setIsPlaying(false)
  }

  const handlePlayPause = () => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch(err => {
        console.error('Playback error:', err)
        setTranscript((prev) => [...prev, `⚠️ Playback failed: ${err.message}`])
      })
      setIsPlaying(true)
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <GlassCard className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-2">Voice Assistant</h3>
          <p className="text-sm text-muted-foreground">Press and hold to speak</p>
        </div>

        <button
          onClick={handleMicClick}
          className={cn(
            "relative w-32 h-32 rounded-full transition-all duration-300",
            isListening ? "bg-primary glow-blue scale-110" : "bg-secondary hover:bg-secondary/80",
          )}
        >
          {isListening ? (
            <Mic className="w-12 h-12 mx-auto text-primary-foreground animate-pulse" />
          ) : (
            <MicOff className="w-12 h-12 mx-auto text-muted-foreground" />
          )}

          {isListening && (
            <>
              <span className="absolute inset-0 rounded-full border-4 border-primary animate-ping" />
              <span className="absolute inset-0 rounded-full border-2 border-primary/50" />
            </>
          )}
        </button>

        <div className="mt-8 flex items-center gap-4">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Volume2 className="w-4 h-4" />
            Audio Settings
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 bg-transparent"
            onClick={handlePlayPause}
            disabled={!audioRef.current?.src}
          >
            {isSpeaking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isSpeaking ? 'Generating...' : 'Playback'}
          </Button>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Conversation</h3>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {transcript.map((message, index) => {
            const isUser = index % 2 === 1
            return (
              <div
                key={index}
                className={cn(
                  "p-4 rounded-lg",
                  isUser ? "bg-primary/10 ml-8 border border-primary/20" : "bg-secondary/50 mr-8",
                )}
              >
                <div className="flex items-start gap-3">
                  {!isUser && <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />}
                  <p className="text-sm text-foreground">{message}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Voice recordings are retained for 30 days for quality improvement
          </p>
        </div>
      </GlassCard>
    </div>
  )
}
