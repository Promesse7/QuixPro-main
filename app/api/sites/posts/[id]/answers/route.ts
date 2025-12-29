import { NextResponse } from 'next/server'
import { postsService } from '@/lib/services/postsService'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    // For now, allow answer creation without authentication
    // TODO: Add proper authentication when user system is integrated
    const body = await request.json()
    
    const answer = await postsService.addAnswer(params.id, { 
      author: body.author || 'Anonymous',
      body: body.body 
    });
    
    return NextResponse.json({ answer });
  } catch (err) {
    console.error('Add answer error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
