import { MongoClient, type Db } from "mongodb"

const uri = process.env.MONGODB_URI || ""
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient> | null = null

if (uri) {
  if (process.env.NODE_ENV === "development") {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
}

export default clientPromise

export async function getDatabase(): Promise<Db> {
  if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
  }
  // clientPromise should be set when MONGODB_URI exists
  if (!clientPromise) {
    // Create a new client if for some reason it wasn't created earlier
    client = new MongoClient(process.env.MONGODB_URI!, options)
    clientPromise = client.connect()
  }
  const clientResolved = await clientPromise
  return clientResolved.db("QuixDB")
}

export async function connectToDatabase(): Promise<Db> {
  return getDatabase()
}
