import { NextResponse } from 'next/server';

// In-memory data store for groups
let groups = [
  { id: '1', name: 'React Developers', description: 'A group for React enthusiasts.' },
  { id: '2', name: 'Next.js Fans', description: 'A group for fans of the Next.js framework.' },
];

// GET handler to retrieve all groups
export async function GET() {
  return NextResponse.json({ success: true, data: groups });
}

// POST handler to create a new group
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name || !description) {
      return NextResponse.json({ success: false, message: 'Name and description are required.' }, { status: 400 });
    }

    const newGroup = {
      id: String(groups.length + 1),
      name,
      description,
    };

    groups.push(newGroup);

    return NextResponse.json({ success: true, data: newGroup }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to create group.' }, { status: 500 });
  }
}
