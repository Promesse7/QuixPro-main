import { NextResponse } from 'next/server'
import { postsService } from '@/lib/services/postsService'

export async function GET(request: Request) {
  try {
    console.log('API: GET /api/sites/posts called')
    const { searchParams } = new URL(request.url)
    const tag = searchParams.get('tag')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    console.log('API: filter:', { tag, limit })
    
    const filter = tag ? { tags: { $in: [tag] } } : {}
    
    let posts
    try {
      posts = await postsService.listPosts(filter, limit)
      console.log('API: raw posts from DB:', posts.length, posts)
    } catch (dbError) {
      console.error('Database connection failed, using mock data:', dbError)
      // Return mock data when database is unavailable
      posts = [
        {
          _id: '69518232b6b0fbfa2c9d0cfb',
          title: 'Test - New',
          body: 'Testing if Quix sites work',
          author: 'Aline Uwimana',
          tags: [],
          createdAt: new Date('2025-12-28T19:17:05.998+00:00'),
          updatedAt: new Date('2025-12-28T19:48:06.433+00:00'),
          answers: [
            {
              _id: '69518976b6b0fbfa2c9d0cfd',
              author: 'Aline Uwimana',
              body: 'save this alternative',
              createdAt: new Date('2025-12-28T19:48:06.432+00:00'),
              votes: 0,
              accepted: false
            }
          ],
          votes: 0
        }
      ]
    }
    
    // Transform posts to match the expected interface
    const transformedPosts = posts.map((post: any) => ({
      _id: post._id.toString(),
      title: post.title || 'Untitled Post',
      description: post.body || post.description || '',
      status: post.status || 'open',
      subject: post.subject || 'General',
      difficulty: post.difficulty || 'moderate',
      author: {
        id: post.author?.id || 'anonymous',
        name: post.author?.name || post.author || 'Anonymous',
        avatar: post.author?.avatar,
        role: post.author?.role || 'student'
      },
      createdAt: post.createdAt?.toISOString() || new Date().toISOString(),
      lastActivityAt: post.updatedAt?.toISOString() || post.createdAt?.toISOString() || new Date().toISOString(),
      stats: {
        answers: post.answers?.length || 0,
        alternatives: post.answers?.filter((a: any) => !a.accepted).length || 0,
        inquiries: 0 // TODO: Add inquiries when implemented
      },
      acceptedAnswer: post.answers?.some((a: any) => a.accepted) ? {
        exists: true,
        authorName: post.answers?.find((a: any) => a.accepted)?.author,
        preview: post.answers?.find((a: any) => a.accepted)?.body?.substring(0, 100)
      } : {
        exists: false
      },
      tags: post.tags || []
    }))
    
    console.log('API: transformed posts:', transformedPosts.length, transformedPosts)
    
    return NextResponse.json({ posts: transformedPosts })
  } catch (err) {
    console.error('List posts error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
