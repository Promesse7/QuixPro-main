import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { postsService } from '@/lib/services/postsService';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await request.json();
    const post = await postsService.createPost({
      title: body.title,
      body: body.body,
      author: session.user.email,
      tags: body.tags || []
    });

    return NextResponse.json({ post });
  } catch (err) {
    console.error('Create post error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const tag = url.searchParams.get('tag');
    const filter: any = {};
    if (tag) filter.tags = tag;
    const posts = await postsService.listPosts(filter, 50);
    return NextResponse.json({ posts });
  } catch (err) {
    console.error('List posts error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
