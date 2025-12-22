import { NextResponse } from 'next/server';
// import { getDashboardData } from '@/lib/getDashboardData';
// import { getServerSession } from "next-auth/next"
// import { authOptions } from "@/lib/auth"

export async function GET() {
  // const session = await getServerSession(authOptions)
  // if (!session || !session.user || !session.user.id) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }
  // const userId = session.user.id;

  try {
    // For now, let's return a simple JSON object to test the route.
    console.log("API route /api/dashboard-data was hit successfully.");
    return NextResponse.json({ message: "API route is working!" });
  } catch (error) {
    console.error('Error in dashboard-data API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
