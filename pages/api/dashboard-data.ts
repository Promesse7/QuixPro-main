import type { NextApiRequest, NextApiResponse } from 'next';
import { getDashboardData } from '@/lib/getDashboardData';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// This API route follows the Pages Router structure, which appears to be
// what your project is primarily using for its API.

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user || !session.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const userId = session.user.id;
    const dashboardData = await getDashboardData(userId);
    
    return res.status(200).json(dashboardData);

  } catch (error) {
    console.error('Error in /api/dashboard-data route:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
