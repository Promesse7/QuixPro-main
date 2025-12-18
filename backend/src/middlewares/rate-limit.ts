import type { NextApiRequest, NextApiResponse } from 'next'

const WINDOW_MS = 60_000
const MAX_REQUESTS = 60
const clients: Map<string, { count: number; reset: number }> = new Map()

export function rateLimit(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  const key = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || 'anon'
  const now = Date.now()
  const entry = clients.get(key) || { count: 0, reset: now + WINDOW_MS }
  if (now > entry.reset) {
    entry.count = 0
    entry.reset = now + WINDOW_MS
  }
  entry.count += 1
  clients.set(key, entry)
  if (entry.count > MAX_REQUESTS) {
    res.status(429).json({ error: 'Too many requests' })
    return
  }
  next()
}
