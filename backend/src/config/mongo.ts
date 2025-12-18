import { MongoClient } from 'mongodb'
import { getEnv } from './env'

let client: MongoClient | null = null

export async function getMongoClient() {
  if (client) return client
  const { MONGODB_URI } = getEnv()
  if (!MONGODB_URI) throw new Error('MONGODB_URI not set')
  client = new MongoClient(MONGODB_URI)
  await client.connect()
  return client
}

export async function getDb(dbName = 'quix') {
  const c = await getMongoClient()
  return c.db(dbName)
}
