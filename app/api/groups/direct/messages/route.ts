import { NextResponse } from 'next/server'
import { chatService } from '@/lib/services/chatService'

export async function GET(req: Request) {
  try {
    // Get user from query params or use fallback
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId') || 'test@example.com' // In production, get from auth context

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
