/**
 * Mock Data Switch
 * Automatically switches to mock data when MongoDB is not available
 */

export async function withMockFallback<T>(
  mongoOperation: () => Promise<T>,
  mockOperation: () => Promise<T>,
  operationName: string
): Promise<T> {
  try {
    console.log(`🔄 Attempting MongoDB operation: ${operationName}`)
    const result = await mongoOperation()
    console.log(`✅ MongoDB operation successful: ${operationName}`)
    return result
  } catch (error: any) {
    if (error.message?.includes('ECONNREFUSED') || 
        error.message?.includes('MongoNetworkError') ||
        error.message?.includes('MongoServerSelectionError')) {
      console.log(`⚠️ MongoDB not available, switching to mock data for: ${operationName}`)
      return await mockOperation()
    }
    console.error(`❌ MongoDB operation failed for ${operationName}:`, error)
    throw error
  }
}

export const isMongoAvailable = async (): Promise<boolean> => {
  try {
    const { getDatabase } = await import('./mongodb')
    const db = await getDatabase()
    await db.admin().ping()
    return true
  } catch (error) {
    return false
  }
}

export const mockDataEnabled = (): boolean => {
  return process.env.USE_MOCK_DATA === 'true' || process.env.NODE_ENV === 'development'
}
