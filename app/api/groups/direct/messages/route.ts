import { NextResponse } from 'next/server'
import { chatService } from '@/lib/services/chatService'

export async function GET(req: Request) {
  try {
    // For now, we'll use a simple approach without proper authentication
    const userId = 'test@example.com' // In production, get from auth context

    const conversations = await chatService.getDirectConversations(userId)
    
    // Ensure conversations is always an array
    const safeConversations = Array.isArray(conversations) ? conversations : []
    
    return NextResponse.json({ conversations: safeConversations })
  } catch (error) {
    console.error('Error fetching direct messages:', error)
    // Return empty array on error to prevent undefined.map() errors
    return NextResponse.json({ 
      conversations: [],
      error: 'Failed to fetch messages' 
    })
  }
}
