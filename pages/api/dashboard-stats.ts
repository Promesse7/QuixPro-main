'use client'

import type { NextApiRequest, NextApiResponse } from 'next';

// This is a mock response. In a real app, you'd fetch this from a database.
const getDashboardStats = async () => {
  return {
    stats: [
      {
        id: 'xp',
        title: 'Total XP Earned',
        value: '15,620 XP',
        description: '+21.2% vs. last month',
        changeType: 'positive',
      },
      {
        id: 'messages',
        title: 'Unread Messages',
        value: '8',
        description: 'from 2 new chats',
        changeType: 'neutral',
      },
      {
        id: 'quizzes',
        title: 'Quizzes Completed',
        value: '31',
        description: '+7 since last week',
        changeType: 'positive',
      },
      {
        id: 'interactions',
        title: 'Quix Sites Interactions',
        value: '3,450',
        description: 'Comments & reactions',
        changeType: 'positive',
      },
      {
        id: 'shares',
        title: 'Resources Shared',
        value: '72',
        description: 'via Quix Links',
        changeType: 'positive',
      },
    ]
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const data = await getDashboardStats();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
