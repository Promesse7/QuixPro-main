import type { NextApiRequest, NextApiResponse } from 'next'

export function requireAuth(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  const token = (req.headers.authorization || '').replace('Bearer ', '') || req.cookies?.qouta_token
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  // minimal validation for scaffold
  try {
    // In real app verify JWT or session here
    (req as any).user = { id: token, email: token }
    next()
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' })
  }
}
