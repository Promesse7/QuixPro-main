// app/calendar/page.tsx
"use client"

import { CalendarView } from '@/components/calendar/CalendarView'

export default function CalendarPage() {
  // Mock data - replace with real data from your API
  const calendarEvents = [
    {
      id: '1',
      title: 'Physics Quiz',
      date: new Date(),
      type: 'quiz' as const
    },
    // Add more events...
  ]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Calendar</h1>
      <div className="max-w-4xl mx-auto">
        <CalendarView events={calendarEvents} />
      </div>
    </div>
  )
}