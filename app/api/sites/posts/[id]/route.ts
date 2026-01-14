import { NextResponse } from 'next/server'
import { postsService } from '@/lib/services/postsService'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const post = await postsService.getPost(params.id)
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    
    return NextResponse.json({ post })
  } catch (err) {
    console.error('Get post error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
