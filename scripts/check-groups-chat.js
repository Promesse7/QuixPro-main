#!/usr/bin/env node

// Check groups and chat functionality in database
const { MongoClient } = require("mongodb")

const uri = "mongodb+srv://promesserukundo:prom123mongodb@hb-cluster.t9u7h.mongodb.net/QuixDB?retryWrites=true&w=majority&appName=hb-cluster"
const client = new MongoClient(uri)

async function checkGroupsAndChat() {
  try {
    await client.connect()
    const db = client.db("QuixDB")
    
    console.log("👥 Checking Groups and Chat System...")
    console.log("=" .repeat(50))
    
    // Check collections
    const collections = await db.listCollections().toArray()
    const groupRelatedCollections = collections.filter(c => 
      c.name.includes('group') || c.name.includes('chat') || c.name.includes('message') || c.name.includes('conversation')
    )
    
    console.log("\n📁 Related Collections:")
    groupRelatedCollections.forEach(col => {
      console.log(`   - ${col.name}`)
    })
    
    // Check groups collection
    const groupsCollection = db.collection("groups")
    const groups = await groupsCollection.find({}).toArray()
    
    console.log(`\n🏠 Groups in database: ${groups.length}`)
    groups.forEach(group => {
      console.log(`   - ${group.name} (${group._id})`)
      console.log(`     Creator: ${group.creatorId || group.createdBy}`)
      console.log(`     Members: ${group.members?.length || 0}`)
      console.log(`     Private: ${group.isPrivate || group.isPublic ? 'No' : 'Yes'}`)
      console.log(`     Created: ${group.createdAt}`)
      console.log("")
    })
    
    // Check messages collection
    const messagesCollection = db.collection("messages")
    const messages = await messagesCollection.find({}).toArray()
    
    console.log(`💬 Messages in database: ${messages.length}`)
    if (messages.length > 0) {
      const messageGroups = [...new Set(messages.map(m => m.groupId))]
      console.log(`   Messages in ${messageGroups.length} different groups`)
      
      // Show recent messages
      console.log("\n   Recent messages:")
      messages.slice(0, 5).forEach(msg => {
        console.log(`   - ${msg.content?.substring(0, 50)}... (Group: ${msg.groupId}, Sender: ${msg.senderId})`)
      })
    }
    
    // Check conversations collection
    const conversationsCollection = db.collection("conversations")
    const conversations = await conversationsCollection.find({}).toArray()
    
    console.log(`\n🗨️  Conversations in database: ${conversations.length}`)
    conversations.forEach(conv => {
      console.log(`   - Group: ${conv.groupId}, Participants: ${conv.participants?.length || 0}`)
      if (conv.lastMessage) {
        console.log(`     Last: ${conv.lastMessage.content?.substring(0, 30)}...`)
      }
    })
    
    // Check user group relationships
    const usersCollection = db.collection("users")
    const users = await usersCollection.find({}).toArray()
    
    console.log(`\n👤 Users with group data:`)
    users.forEach(user => {
      const userGroups = user.social?.groups || []
      if (userGroups.length > 0) {
        console.log(`   - ${user.name}: ${userGroups.length} groups`)
        userGroups.forEach(groupId => {
          console.log(`     * ${groupId}`)
        })
      }
    })
    
    // Check API endpoints structure
    console.log("\n🔗 API Endpoints Structure:")
    console.log("   GET /api/groups - List all groups")
    console.log("   POST /api/groups - Create new group")
    console.log("   GET /api/groups/[id] - Get group details")
    console.log("   PUT /api/groups/[id] - Update group")
    console.log("   DELETE /api/groups/[id] - Delete group")
    console.log("   POST /api/groups/[id]/join - Join group")
    console.log("   POST /api/groups/[id]/leave - Leave group")
    
    console.log("\n   Chat API:")
    console.log("   GET /api/chat/messages/[groupId] - Get group messages")
    console.log("   POST /api/chat/messages - Send message")
    console.log("   GET /api/chat/conversations - Get user conversations")
    
    // Test data consistency
    console.log("\n🔍 Data Consistency Check:")
    
    // Check if group members exist as users
    let consistencyIssues = 0
    for (const group of groups) {
      const memberIds = group.members || []
      for (const memberId of memberIds) {
        const memberExists = users.some(u => u._id.toString() === memberId.toString())
        if (!memberExists) {
          console.log(`⚠️  Group ${group.name} has non-existent member: ${memberId}`)
          consistencyIssues++
        }
      }
    }
    
    // Check if messages reference valid groups
    for (const message of messages) {
      const groupExists = groups.some(g => g._id.toString() === message.groupId)
      if (!groupExists) {
        console.log(`⚠️  Message references non-existent group: ${message.groupId}`)
        consistencyIssues++
      }
    }
    
    if (consistencyIssues === 0) {
      console.log("✅ No data consistency issues found")
    } else {
      console.log(`❌ Found ${consistencyIssues} consistency issues`)
    }
    
  } catch (error) {
    console.error("❌ Error checking groups and chat:", error)
  } finally {
    await client.close()
    console.log("🔌 Database connection closed")
  }
}

checkGroupsAndChat()
