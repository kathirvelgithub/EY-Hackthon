import { backendApi } from '@/lib/api-client'
import { mockServiceCenters, mockAppointments } from '@/lib/mock-data'
import type { ServiceCenter, ServiceAppointment } from '@/lib/types'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

export const schedulerService = {
  async getServiceCenters(): Promise<ServiceCenter[]> {
    if (USE_MOCK) {
      return mockServiceCenters
    }

    // Backend doesn't have service centers endpoint yet
    return mockServiceCenters
  },

  async getAvailableSlots(centerId: string, date: string) {
    if (USE_MOCK) {
      return {
        slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
        center: mockServiceCenters[0],
      }
    }

    try {
      const response: any = await backendApi.getAvailableSlots(centerId, date)
      const data = response.data || response
      return data
    } catch (error) {
      console.error('Failed to fetch available slots:', error)
      return {
        slots: [],
        center: mockServiceCenters[0],
      }
    }
  },

  async bookAppointment(data: {
    vehicleId: string
    slotId: string
    centerId: string
    customerName: string
    date: string
    time: string
  }): Promise<ServiceAppointment> {
    if (USE_MOCK) {
      return {
        id: Math.random().toString(36),
        vehicleId: data.vehicleId,
        date: data.date,
        time: data.time,
        serviceCenter: mockServiceCenters[0].name,
        status: 'confirmed',
        services: ['Scheduled Service'],
        estimatedDuration: 120,
      }
    }

    try {
      const response: any = await backendApi.bookAppointment({
        vehicle_id: data.vehicleId,
        slot_id: data.slotId,
        center_id: data.centerId,
        customer_name: data.customerName,
      })
      const result = response.data || response

      return {
        id: result.booking_id || result.id,
        vehicleId: data.vehicleId,
        date: data.date,
        time: data.time,
        serviceCenter: mockServiceCenters.find((c) => c.id === data.centerId)?.name || 'Service Center',
        status: result.status || 'confirmed',
        services: result.services || ['Scheduled Service'],
        estimatedDuration: result.estimated_duration || 120,
      }
    } catch (error) {
      console.error('Failed to book appointment:', error)
      throw error
    }
  },

  async getAppointments(vehicleId?: string): Promise<ServiceAppointment[]> {
    if (USE_MOCK) {
      return mockAppointments
    }

    try {
      const data = vehicleId 
        ? await backendApi.getVehicleBookings(vehicleId)
        : await backendApi.getAllBookings()
      
      if (Array.isArray(data)) {
        return data.map((booking: any) => ({
          id: booking.booking_id || booking.id,
          vehicleId: booking.vehicle_id || vehicleId || '',
          date: booking.date || booking.scheduled_date,
          time: booking.time || booking.slot_id,
          serviceCenter: booking.center_id || 'Service Center',
          status: booking.status || 'confirmed',
          services: booking.services || ['Scheduled Service'],
          estimatedDuration: booking.estimated_duration || 120,
        }))
      }
      return []
    } catch (error) {
      console.error('Failed to fetch appointments:', error)
      return mockAppointments
    }
  },
}
