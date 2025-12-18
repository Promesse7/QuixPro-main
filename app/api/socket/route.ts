// app/api/socket/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { WebSocketServer } from 'ws';
import { Server } from 'socket.io';
import { webSocketService } from '@/lib/services/websocket';

// This route must be dynamic because it accepts WebSocket upgrades and request-specific params
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Use NextRequest.nextUrl to avoid relying on request.url (prevents dynamic-server error)
    const { searchParams } = req.nextUrl;
    const token = searchParams.get('token');
    
    if (!token) {
      return new NextResponse('No token provided', { status: 401 });
    }

    // This is a WebSocket upgrade request
    if (req.headers.get('upgrade') === 'websocket') {
      // The WebSocket upgrade will be handled by the Next.js server
      // We just need to return a 101 Switching Protocols response
      const response = new NextResponse(null, {
        status: 101,
        headers: new Headers({
          'Upgrade': 'websocket',
          'Connection': 'Upgrade',
        }),
      });
      
      return response;
    }

    return new NextResponse('WebSocket connection required', { status: 400 });
  } catch (error) {
    console.error('WebSocket connection error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// This is a workaround for Next.js 13+ server components
// We'll use this to initialize the WebSocket server
export const runtime = 'nodejs';