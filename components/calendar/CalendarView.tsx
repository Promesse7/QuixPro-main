// components/calendar/CalendarView.tsx
"use client"

import { useState } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CalendarViewProps {
  events?: Array<{
    id: string
    title: string
    date: Date
    type: 'quiz' | 'deadline' | 'event'
  }>
}

export function CalendarView({ events = [] }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), day))
  }

  return (
    <div className="bg-card rounded-xl border border-border/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-semibold">{format(currentMonth, 'MMMM yyyy')}</h3>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((day, i) => {
          const dayEvents = getEventsForDay(day)
          const isCurrentMonth = isSameMonth(day, currentMonth)
          
          return (
            <div 
              key={i} 
              className={`
                aspect-square p-1 border rounded-md text-sm
                ${isCurrentMonth ? 'bg-background' : 'bg-muted/20 text-muted-foreground'}
                ${isSameDay(day, new Date()) ? 'border-primary' : 'border-border'}
              `}
            >
              <div className="text-right">{format(day, 'd')}</div>
              <div className="space-y-0.5 mt-1">
                {dayEvents.slice(0, 2).map(event => (
                  <div 
                    key={event.id} 
                    className={`
                      text-xs truncate px-1 rounded 
                      ${event.type === 'quiz' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200' : 
                        event.type === 'deadline' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200' :
                        'bg-muted text-foreground'}
                    `}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-muted-foreground text-center">+{dayEvents.length - 2} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}