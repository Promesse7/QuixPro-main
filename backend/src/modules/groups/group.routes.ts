import { createGroupHandler, listGroupsHandler } from './group.controller'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') return createGroupHandler(req, res)
  if (req.method === 'GET') return listGroupsHandler(req, res)
  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end('Method Not Allowed')
}
