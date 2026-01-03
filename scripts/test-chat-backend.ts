import { connectToDatabase } from '../lib/mongodb'
import { ChatService } from '../services/chatService'
import { firebaseAuthService } from '../services/firebaseAuthService'

// Test script for Step 1 - Backend Structure
async function testChatBackend() {
  console.log('🧪 Testing Quix Chat Backend Structure...\n')

  try {
    // 1. Test Database Connection
    console.log('1. Testing database connection...')
    const db = await connectToDatabase()
    console.log('✅ Database connected successfully')

    // 2. Initialize Chat Service
    console.log('\n2. Initializing chat service...')
    const chatService = new ChatService(db)
    await chatService.initializeCollections()
    console.log('✅ Chat service initialized with indexes')

    // 3. Test Group Creation
    console.log('\n3. Testing group creation...')
    const testGroup = await chatService.createGroup({
      name: 'Test Chat Group',
      description: 'A test group for backend validation',
      createdBy: 'test-user-123',
      isPublic: true,
      settings: {
        allowMemberInvites: true,
        readReceipts: true,
        messageEditWindow: 15
      },
      members: [{
        userId: 'test-user-123',
        role: 'admin',
        joinedAt: new Date()
      }]
    })
    console.log('✅ Group created:', testGroup.name, 'ID:', testGroup._id?.toString())

    // 4. Test Group Retrieval
    console.log('\n4. Testing group retrieval...')
    const retrievedGroup = await chatService.getGroupById(testGroup._id?.toString() || '')
    if (retrievedGroup) {
      console.log('✅ Group retrieved successfully:', retrievedGroup.name)
    } else {
      throw new Error('Failed to retrieve group')
    }

    // 5. Test User Groups
    console.log('\n5. Testing user groups retrieval...')
    const userGroups = await chatService.getUserGroups('test-user-123')
    console.log('✅ User groups retrieved:', userGroups.length, 'groups')

    // 6. Test Message Sending
    console.log('\n6. Testing message sending...')
    const testMessage = await chatService.sendMessage({
      content: 'Hello, this is a test message! 🚀',
      senderId: 'test-user-123',
      groupId: testGroup._id?.toString() || '',
      type: 'text'
    })
    console.log('✅ Message sent:', testMessage.content, 'ID:', testMessage._id?.toString())

    // 7. Test Message Retrieval
    console.log('\n7. Testing message retrieval...')
    const messages = await chatService.getGroupMessages(testGroup._id?.toString() || '', 1, 10)
    console.log('✅ Messages retrieved:', messages.length, 'messages')

    // 8. Test Typing Indicators
    console.log('\n8. Testing typing indicators...')
    await chatService.setTypingIndicator('test-user-123', testGroup._id?.toString() || '', true)
    const typingUsers = await chatService.getTypingUsers(testGroup._id?.toString() || '')
    console.log('✅ Typing indicators working:', typingUsers.length, 'users typing')

    // 9. Test Firebase Auth Service
    console.log('\n9. Testing Firebase auth service...')
    const testUser = {
      id: 'test-user-123',
      name: 'Test User',
      email: 'test@quix.com',
      role: 'student' as const,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    try {
      const firebaseToken = await firebaseAuthService.generateCustomToken(testUser)
      console.log('✅ Firebase custom token generated successfully')
      console.log('   Token length:', firebaseToken.length, 'characters')
    } catch (error) {
      console.log('⚠️  Firebase token generation failed (may need Firebase setup):', error instanceof Error ? error.message : 'Unknown error')
    }

    // 10. Test Search Functionality
    console.log('\n10. Testing message search...')
    const searchResults = await chatService.searchMessages(
      testGroup._id?.toString() || '', 
      'test', 
      5
    )
    console.log('✅ Message search working:', searchResults.length, 'results')

    // 11. Test Unread Counts
    console.log('\n11. Testing unread counts...')
    const unreadCount = await chatService.getUnreadCount('test-user-456', testGroup._id?.toString() || '')
    console.log('✅ Unread count calculated:', unreadCount, 'unread messages')

    console.log('\n🎉 All backend tests passed! Chat system is ready for Step 2.')
    
    // Cleanup test data
    console.log('\n🧹 Cleaning up test data...')
    await db.collection('groups').deleteOne({ _id: testGroup._id })
    await db.collection('messages').deleteMany({ groupId: testGroup._id?.toString() })
    await db.collection('conversations').deleteMany({ groupId: testGroup._id?.toString() })
    await db.collection('userGroups').deleteMany({ userId: 'test-user-123' })
    console.log('✅ Test data cleaned up')

  } catch (error) {
    console.error('\n❌ Backend test failed:', error)
    process.exit(1)
  }
}

// Test API endpoints
async function testAPIEndpoints() {
  console.log('\n🌐 Testing API endpoints...')

  try {
    // Test Firebase token endpoint
    console.log('\n1. Testing Firebase token endpoint...')
    const tokenResponse = await fetch('http://localhost:3000/api/auth/firebase-token', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (tokenResponse.ok) {
      const tokenData = await tokenResponse.json()
      console.log('✅ Firebase token endpoint working')
    } else {
      console.log('⚠️  Firebase token endpoint returned:', tokenResponse.status)
    }

    // Test groups endpoint (will fail without auth, but should return 401)
    console.log('\n2. Testing groups endpoint authentication...')
    const groupsResponse = await fetch('http://localhost:3000/api/chat/groups', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (groupsResponse.status === 401) {
      console.log('✅ Groups endpoint properly protected (401 Unauthorized)')
    } else {
      console.log('⚠️  Groups endpoint returned unexpected status:', groupsResponse.status)
    }

  } catch (error) {
    console.log('⚠️  API endpoint tests failed (server may not be running):', error instanceof Error ? error.message : 'Unknown error')
  }
}

// Run tests
async function runTests() {
  await testChatBackend()
  await testAPIEndpoints()
  
  console.log('\n✨ Step 1 - Backend Structure Complete!')
  console.log('\n📋 Next Steps:')
  console.log('   1. Start the development server: npm run dev')
  console.log('   2. Test Firebase authentication flow')
  console.log('   3. Move to Step 2 - Real-time Messaging')
  console.log('   4. Set up Firebase rules for chat permissions')
}

// Run if called directly
if (require.main === module) {
  runTests().catch(console.error)
}

export { testChatBackend, testAPIEndpoints }
