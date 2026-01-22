import { NextResponse } from 'next/server'
import { getPublicGroups } from '@/lib/auth-db'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const subject = searchParams.get('subject') || 'all'
        const level = searchParams.get('level') || 'all'
        const limit = parseInt(searchParams.get('limit') || '20')

        const groups = await getPublicGroups({
            subject,
            level,
            limit
        })

        return NextResponse.json({ groups })
    } catch (error) {
        console.error('Error fetching public groups:', error)
        return NextResponse.json(
            { error: 'Failed to fetch public groups' },
            { status: 500 }
        )
    }
}
