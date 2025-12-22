import { NextResponse } from 'next/server';
import { getDashboardData } from '@/lib/getDashboardData';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  // const session = await getServerSession(authOptions)
  // if (!session || !session.user || !session.user.id) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }
  // const userId = session.user.id;

  // Using a hardcoded user ID for now, as per the mock auth system
  const userId = "1";

  try {
    const dashboardData = await getDashboardData(userId);
    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
