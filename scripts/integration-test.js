// scripts/integration-test.js
// Integration test script for Quix: runs basic chat + sites verification flow.
// Run: node scripts/integration-test.js

const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/QuixDB';
const FIREBASE_SA = process.env.FIREBASE_SERVICE_ACCOUNT || null;

async function run() {
  const client = new MongoClient(MONGO_URI, { useUnifiedTopology: true });

  try {
    console.log('🔗 Connecting to MongoDB...');
    await client.connect();
    const db = client.db('QuixDB');
    console.log('✅ Connected to MongoDB');

    // 1) Create test user
    const testUser = {
      email: 'integration-test-user@quix.test',
      name: 'Integration Test User',
      role: 'student',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('users').updateOne(
      { email: testUser.email },
      { $set: testUser },
      { upsert: true }
    );
    console.log('✅ Test user upserted');

    // 2) Firebase token (if credentials available)
    let firebaseToken = null;
    if (FIREBASE_SA) {
      try {
        const admin = require('firebase-admin');
        const serviceAccount = JSON.parse(FIREBASE_SA);
        if (!admin.apps.length) {
          admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
        }
        firebaseToken = await admin.auth().createCustomToken(testUser.email);
        console.log('✅ Firebase custom token created');
      } catch (err) {
        console.warn('⚠️ Firebase token creation failed (skipping):', err.message || err);
      }
    } else {
      console.log('ℹ️ FIREBASE_SERVICE_ACCOUNT not set — skipping Firebase token creation');
    }

    // 3) Create conversation
    const conv = {
      participants: [testUser.email, 'bot@quix.test'],
      isGroup: false,
      createdBy: testUser.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const convRes = await db.collection('conversations').insertOne(conv);
    const convId = convRes.insertedId.toString();
    console.log('✅ Conversation created:', convId);

    // 4) Send test message (metadata only)
    const message = {
      conversationId: convId,
      content: 'Hello from integration test',
      senderId: testUser.email,
      type: 'text',
      metadata: {},
      readBy: [testUser.email],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const msgRes = await db.collection('messages').insertOne(message);
    console.log('✅ Message stored:', msgRes.insertedId.toString());

    // 5) Create group via groups collection
    const group = {
      name: 'Integration Test Group',
      description: 'Group created by integration test',
      createdBy: testUser.email,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false,
      members: [{ userId: testUser.email, role: 'admin', joinedAt: new Date() }],
      settings: { allowMemberInvites: true, readReceipts: true, messageEditWindow: 5 }
    };
    const groupRes = await db.collection('groups').insertOne(group);
    console.log('✅ Group created:', groupRes.insertedId.toString());

    // 6) Quix Sites: create solved and unsolved posts
    const solvedPost = {
      title: 'Solved: Sample Problem',
      body: 'This is a solved problem with an accepted answer.',
      author: testUser.email,
      tags: ['algebra'],
      createdAt: new Date(),
      updatedAt: new Date(),
      solved: true,
      answers: [
        { _id: new ObjectId(), author: 'responder@quix.test', body: 'Accepted solution', createdAt: new Date(), accepted: true }
      ]
    };

    const unsolvedPost = {
      title: 'Unsolved: Interesting Problem',
      body: 'No accepted answer yet.',
      author: testUser.email,
      tags: ['geometry'],
      createdAt: new Date(),
      updatedAt: new Date(),
      solved: false,
      answers: []
    };

    const sp = await db.collection('posts').insertOne(solvedPost);
    const up = await db.collection('posts').insertOne(unsolvedPost);
    console.log('✅ Posts created:', sp.insertedId.toString(), up.insertedId.toString());

    // 7) Submit an answer to unsolved post
    const answer = { _id: new ObjectId(), author: 'helper@quix.test', body: 'Proposed answer', createdAt: new Date(), accepted: false };
    await db.collection('posts').updateOne({ _id: up.insertedId }, { $push: { answers: answer } });
    console.log('✅ Answer submitted to unsolved post');

    // 8) Verify persistence
    const [userDoc, convDoc, msgDoc, groupDoc, solvedDoc, unsolvedDoc] = await Promise.all([
      db.collection('users').findOne({ email: testUser.email }),
      db.collection('conversations').findOne({ _id: convRes.insertedId }),
      db.collection('messages').findOne({ _id: msgRes.insertedId }),
      db.collection('groups').findOne({ _id: groupRes.insertedId }),
      db.collection('posts').findOne({ _id: sp.insertedId }),
      db.collection('posts').findOne({ _id: up.insertedId })
    ]);

    if (!userDoc) throw new Error('User persistence check failed');
    if (!convDoc) throw new Error('Conversation persistence check failed');
    if (!msgDoc) throw new Error('Message persistence check failed');
    if (!groupDoc) throw new Error('Group persistence check failed');
    if (!solvedDoc || !unsolvedDoc) throw new Error('Post persistence check failed');

    console.log('✅ All persistence checks passed');

    // Summary
    console.log('--- Integration Test Summary ---');
    console.log('Test user:', userDoc.email);
    console.log('Firebase token created:', !!firebaseToken);
    console.log('Conversation id:', convId);
    console.log('Message id:', msgRes.insertedId.toString());
    console.log('Group id:', groupRes.insertedId.toString());
    console.log('Solved post id:', sp.insertedId.toString());
    console.log('Unsolved post id:', up.insertedId.toString());

    console.log('✅ Integration test completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Integration test failed:', err);
    process.exit(2);
  } finally {
    try { await client.close(); } catch (e) {}
  }
}

run();
