// test-db.js
// Script to test MongoDB connection and data retrieval

const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017/QuixDB";

async function testDatabase() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Successfully connected to MongoDB');
    
    const db = client.db();
    
    // Test quizzes collection
    const quizzesCount = await db.collection('quizzes').countDocuments();
    console.log(`Found ${quizzesCount} quizzes in the database`);
    
    // Test users collection
    const usersCount = await db.collection('users').countDocuments();
    console.log(`Found ${usersCount} users in the database`);
    
    // Test stories collection
    const storiesCount = await db.collection('stories').countDocuments();
    console.log(`Found ${storiesCount} stories in the database`);
    
    console.log('✅ Database test completed successfully');
  } catch (err) {
    console.error('❌ Error testing database:', err);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

testDatabase().catch(console.error);