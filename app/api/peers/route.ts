import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import { PeerService } from '@/services/peerService'

// GET /api/peers - Get peer connections and recommendations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'connections' | 'recommendations' | 'search' | 'pending' | 'stats'
    const query = searchParams.get('query')
    const limit = parseInt(searchParams.get('limit') || '20')

    const db = await connectToDatabase()
    const peerService = new PeerService(db)

    switch (type) {
      case 'connections':
        const peerConnections = await peerService.getPeerConnections(
          session.user.id,
          undefined,
          limit
        )
        return NextResponse.json({ connections: peerConnections })

      case 'recommendations':
        const recommendations = await peerService.getRecommendations(
          session.user.id,
          limit
        )
        return NextResponse.json({ recommendations })

      case 'search':
        if (!query) {
          return NextResponse.json(
            { error: 'Search query is required' },
            { status: 400 }
          )
        }

        const searchResults = await peerService.searchPeers(
          session.user.id,
          query,
          {
            level: searchParams.get('level') || undefined,
            school: searchParams.get('school') || undefined,
            course: searchParams.get('course') || undefined,
            onlyAvailable: searchParams.get('onlyAvailable') === 'true'
          },
          limit
        )
        return NextResponse.json({ peers: searchResults })

      case 'pending':
        const pending = await peerService.getPendingRequests(session.user.id)
        return NextResponse.json({ pending })

      case 'stats':
        const stats = await peerService.getPeerStats(session.user.id)
        return NextResponse.json({ stats })

      default:
        // Return connections by default
        const defaultConnections = await peerService.getPeerConnections(
          session.user.id,
          undefined,
          limit
        )
        return NextResponse.json({ connections: defaultConnections })
    }
  } catch (error) {
    console.error('Error fetching peers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch peers' },
      { status: 500 }
    )
  }
}

// POST /api/peers - Send friend request or create connection
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, peerId, message } = body

    if (!action || !peerId) {
      return NextResponse.json(
        { error: 'Action and peerId are required' },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()
    const peerService = new PeerService(db)

    switch (action) {
      case 'send_request':
        if (!message) {
          return NextResponse.json(
            { error: 'Message is required for friend request' },
            { status: 400 }
          )
        }

        const peerConnection = await peerService.sendFriendRequest(
          session.user.id,
          peerId,
          message
        )
        return NextResponse.json({
          success: true,
          connection: peerConnection
        })

      case 'accept_request':
      case 'decline_request':
        const requesterId = body.requesterId
        if (!requesterId) {
          return NextResponse.json(
            { error: 'Requester ID is required' },
            { status: 400 }
          )
        }

        const response = action === 'accept_request' ? 'accepted' : 'declined'
        const updatedConnection = await peerService.respondToFriendRequest(
          session.user.id,
          requesterId,
          response,
          message
        )
        return NextResponse.json({
          success: true,
          connection: updatedConnection
        })

      case 'block_peer':
        await peerService.blockPeer(session.user.id, peerId)
        return NextResponse.json({
          success: true,
          message: 'Peer blocked successfully'
        })

      case 'unblock_peer':
        // This would require additional tracking of blocked users
        return NextResponse.json(
          { error: 'Unblock functionality not yet implemented' },
          { status: 501 }
        )

      case 'remove_connection':
        await peerService.removePeerConnection(session.user.id, peerId)
        return NextResponse.json({
          success: true,
          message: 'Connection removed successfully'
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error managing peer connection:', error)
    return NextResponse.json(
      { error: 'Failed to manage peer connection' },
      { status: 500 }
    )
  }
}

// PATCH /api/peers - Update peer settings or mark recommendations as viewed/actioned
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, recommendationId, settings } = body

    const db = await connectToDatabase()
    const peerService = new PeerService(db)

    switch (action) {
      case 'mark_recommendation_viewed':
        if (!recommendationId) {
          return NextResponse.json(
            { error: 'Recommendation ID is required' },
            { status: 400 }
          )
        }

        await peerService.markRecommendationAsViewed(session.user.id, recommendationId)
        return NextResponse.json({
          success: true,
          message: 'Recommendation marked as viewed'
        })

      case 'mark_recommendation_actioned':
        if (!recommendationId) {
          return NextResponse.json(
            { error: 'Recommendation ID is required' },
            { status: 400 }
          )
        }

        await peerService.markRecommendationAsActioned(session.user.id, recommendationId)
        return NextResponse.json({
          success: true,
          message: 'Recommendation marked as acted upon'
        })

      case 'update_settings':
        if (!settings) {
          return NextResponse.json(
            { error: 'Settings are required' },
            { status: 400 }
          )
        }

        await peerService.updatePeerSettings(session.user.id, settings)
        return NextResponse.json({
          success: true,
          message: 'Peer settings updated successfully'
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error updating peer data:', error)
    return NextResponse.json(
      { error: 'Failed to update peer data' },
      { status: 500 }
    )
  }
}

// DELETE /api/peers - Delete peer connection or recommendation
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const peerId = searchParams.get('peerId')
    const recommendationId = searchParams.get('recommendationId')

    if (!peerId && !recommendationId) {
      return NextResponse.json(
        { error: 'Peer ID or Recommendation ID is required' },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()
    const peerService = new PeerService(db)

    if (peerId) {
      await peerService.removePeerConnection(session.user.id, peerId)
      return NextResponse.json({
        success: true,
        message: 'Peer connection removed successfully'
      })
    }

    if (recommendationId) {
      await peerService.deleteRecommendation(session.user.id, recommendationId)
      return NextResponse.json({
        success: true,
        message: 'Recommendation removed successfully'
      })
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error deleting peer data:', error)
    return NextResponse.json(
      { error: 'Failed to delete peer data' },
      { status: 500 }
    )
  }
}
