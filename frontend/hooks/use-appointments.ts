import { useState } from 'react'
import { schedulerService } from '@/lib/services'
import type { ServiceAppointment } from '@/lib/types'

/**
 * Custom hook for booking appointments
 */
export function useAppointmentBooking() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [bookedAppointment, setBookedAppointment] = useState<ServiceAppointment | null>(null)

  const bookAppointment = async (data: {
    vehicleId: string
    slotId: string
    centerId: string
    customerName: string
    date: string
    time: string
  }) => {
    try {
      setLoading(true)
      setError(null)
      const appointment = await schedulerService.bookAppointment(data)
      setBookedAppointment(appointment)
      return appointment
    } catch (err) {
      setError(err as Error)
      console.error('Appointment booking error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { bookAppointment, loading, error, bookedAppointment }
}
