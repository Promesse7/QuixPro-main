import { NextResponse } from 'next/server'
import { groupService } from '@/backend/src/modules/groups/group.service'

export async function GET() {
  const groups = await groupService.listGroups()
  return NextResponse.json({ success: true, groups })
}

export async function POST(request: Request) {
  const body = await request.json()
  const group = await groupService.createGroup(body)
  return NextResponse.json({ success: true, group }, { status: 201 })
}
