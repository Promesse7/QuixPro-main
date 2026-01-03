import { connectToDatabase } from '../lib/mongodb'
import { PeerService } from '../services/peerService'

async function testPeerDiscoverySystem() {
  console.log('🚀 Testing Peer Discovery System...\n')

  try {
    const db = await connectToDatabase()
    const peerService = new PeerService(db)

    // Initialize collections
    console.log('📋 Initializing collections and indexes...')
    await peerService.initializeCollections()
    console.log('✅ Collections initialized successfully\n')

    // Test user IDs (these would come from your actual user database)
    const testUserId1 = 'user1'
    const testUserId2 = 'user2'
    const testUserId3 = 'user3'

    // Test 1: Send Friend Request
    console.log('🤝 Testing friend request...')
    try {
      const friendRequest = await peerService.sendFriendRequest(
        testUserId1,
        testUserId2,
        'Hi! I\'d like to connect with you.'
      )
      console.log('✅ Friend request sent:', friendRequest._id)
    } catch (error) {
      console.log('⚠️ Friend request test:', error instanceof Error ? error.message : 'Unknown error')
    }

    // Test 2: Get Pending Requests
    console.log('\n📬 Testing pending requests...')
    try {
      const pending = await peerService.getPendingRequests(testUserId2)
      console.log('✅ Pending requests retrieved:', {
        sent: pending.sent.length,
        received: pending.received.length
      })
    } catch (error) {
      console.log('⚠️ Pending requests test:', error instanceof Error ? error.message : 'Unknown error')
    }

    // Test 3: Respond to Friend Request
    console.log('\n✅ Testing friend request response...')
    try {
      const response = await peerService.respondToFriendRequest(
        testUserId2,
        testUserId1,
        'accepted',
        'Great to connect with you!'
      )
      console.log('✅ Friend request accepted:', response?._id)
    } catch (error) {
      console.log('⚠️ Friend response test:', error instanceof Error ? error.message : 'Unknown error')
    }

    // Test 4: Get Peer Connections
    console.log('\n👥 Testing peer connections...')
    try {
      const connections = await peerService.getPeerConnections(testUserId1)
      console.log('✅ Peer connections retrieved:', connections.length)
    } catch (error) {
      console.log('⚠️ Connections test:', error instanceof Error ? error.message : 'Unknown error')
    }

    // Test 5: Log Peer Activity
    console.log('\n📝 Testing peer activity logging...')
    try {
      const activity = await peerService.logPeerActivity({
        userId: testUserId1,
        activityType: 'quiz_completed',
        description: 'Completed Math Quiz Chapter 5',
        isPublic: true,
        metadata: {
          quizId: 'math_ch5',
          score: 85,
          timeSpent: 1200
        }
      })
      console.log('✅ Activity logged:', activity._id)
    } catch (error) {
      console.log('⚠️ Activity logging test:', error instanceof Error ? error.message : 'Unknown error')
    }

    // Test 6: Get Activity Feed
    console.log('\n📰 Testing activity feed...')
    try {
      const feed = await peerService.getPeerActivityFeed(testUserId1, 10)
      console.log('✅ Activity feed retrieved:', feed.length, 'activities')
    } catch (error) {
      console.log('⚠️ Activity feed test:', error instanceof Error ? error.message : 'Unknown error')
    }

    // Test 7: Generate Recommendations
    console.log('\n💡 Testing peer recommendations...')
    try {
      const recommendations = await peerService.generatePeerRecommendations(testUserId3, 5)
      console.log('✅ Recommendations generated:', recommendations.length, 'suggestions')
    } catch (error) {
      console.log('⚠️ Recommendations test:', error instanceof Error ? error.message : 'Unknown error')
    }

    // Test 8: Search Peers
    console.log('\n🔍 Testing peer search...')
    try {
      const searchResults = await peerService.searchPeers(testUserId1, 'john', {
        level: 'undergraduate',
        school: 'University'
      })
      console.log('✅ Search completed:', searchResults.length, 'results')
    } catch (error) {
      console.log('⚠️ Search test:', error instanceof Error ? error.message : 'Unknown error')
    }

    // Test 9: Update Peer Settings
    console.log('\n⚙️ Testing peer settings...')
    try {
      await peerService.updatePeerSettings(testUserId1, {
        profileVisibility: 'public',
        allowRecommendations: true,
        showActivityStatus: true
      })
      console.log('✅ Peer settings updated')
    } catch (error) {
      console.log('⚠️ Settings test:', error instanceof Error ? error.message : 'Unknown error')
    }

    // Test 10: Get Peer Stats
    console.log('\n📊 Testing peer statistics...')
    try {
      const stats = await peerService.getPeerStats(testUserId1)
      console.log('✅ Peer stats retrieved:', stats ? 'Stats available' : 'No stats yet')
    } catch (error) {
      console.log('⚠️ Stats test:', error instanceof Error ? error.message : 'Unknown error')
    }

    console.log('\n🎉 Peer Discovery System tests completed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error instanceof Error ? error.message : 'Unknown error')
  }
}

async function testAPIEndpoints() {
  console.log('\n🌐 Testing API Endpoints...\n')

  try {
    // Test GET /api/peers?type=connections
    console.log('📡 Testing GET /api/peers?type=connections...')
    const connectionsResponse = await fetch('http://localhost:3000/api/peers?type=connections', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (connectionsResponse.ok) {
      const data = await connectionsResponse.json()
      console.log('✅ Connections API working:', data.connections?.length || 0, 'connections')
    } else {
      console.log('⚠️ Connections API error:', connectionsResponse.status)
    }

    // Test GET /api/peers?type=recommendations
    console.log('\n💡 Testing GET /api/peers?type=recommendations...')
    const recommendationsResponse = await fetch('http://localhost:3000/api/peers?type=recommendations', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (recommendationsResponse.ok) {
      const data = await recommendationsResponse.json()
      console.log('✅ Recommendations API working:', data.recommendations?.length || 0, 'recommendations')
    } else {
      console.log('⚠️ Recommendations API error:', recommendationsResponse.status)
    }

    console.log('\n🎉 API tests completed!')

  } catch (error) {
    console.error('❌ API test failed:', error instanceof Error ? error.message : 'Unknown error')
  }
}

async function runTests() {
  await testPeerDiscoverySystem()
  await testAPIEndpoints()
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error)
}

export { testPeerDiscoverySystem, testAPIEndpoints, runTests }
