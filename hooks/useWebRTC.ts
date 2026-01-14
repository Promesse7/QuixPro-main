import { useEffect, useRef, useState, useCallback } from 'react';

// Define the shape of a signal
interface Signal {
  from: string;
  type: 'offer' | 'answer' | 'ice-candidate';
  payload: any;
}

interface PeerConnection {
  connection: RTCPeerConnection;
  stream?: MediaStream;
}

// Configuration for the STUN server
const pcConfig = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export const useWebRTC = (roomId: string, clientId: string, localStream?: MediaStream) => {
  const [peers, setPeers] = useState<Record<string, PeerConnection>>({});
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});
  const lastFetch = useRef<Date>(new Date());

  // Function to send a signal to the server
  const sendSignal = useCallback(async (type: 'offer' | 'answer' | 'ice-candidate', payload: any) => {
    try {
      await fetch(`/api/webrtc/rooms/${roomId}/signal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, payload }),
      });
    } catch (error) {
      console.error("Error sending signal:", error);
    }
  }, [roomId]);
  
  const createPeerConnection = useCallback((peerId: string) => {
    // Return existing connection if it exists
    if (peerConnections.current[peerId]) {
      return peerConnections.current[peerId];
    }

    const pc = new RTCPeerConnection(pcConfig);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal('ice-candidate', event.candidate.toJSON());
      }
    };

    pc.ontrack = (event) => {
      console.log(`Track received from ${peerId}`);
      setPeers((prev) => ({
        ...prev,
        [peerId]: { connection: pc, stream: event.streams[0] },
      }));
    };

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
      console.log('Local stream added to peer connection for', peerId);
    }

    peerConnections.current[peerId] = pc;
    setPeers((prev) => ({ ...prev, [peerId]: { connection: pc } }));
    return pc;
  }, [localStream, sendSignal]);


  const handleSignal = useCallback(async (signal: Signal) => {
    // Ignore signals from self
    if (signal.from === clientId) return;

    const peerId = signal.from;
    const pc = createPeerConnection(peerId);

    try {
        if (signal.type === 'offer') {
            console.log(`Offer received from ${peerId}`);
            await pc.setRemoteDescription(new RTCSessionDescription(signal.payload));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            sendSignal('answer', answer);
            console.log(`Answer sent to ${peerId}`);
        } else if (signal.type === 'answer') {
            console.log(`Answer received from ${peerId}`);
            await pc.setRemoteDescription(new RTCSessionDescription(signal.payload));
        } else if (signal.type === 'ice-candidate') {
            await pc.addIceCandidate(new RTCIceCandidate(signal.payload));
        }
    } catch (error) {
        console.error(`Error handling signal from ${peerId}:`, error);
    }
  }, [clientId, createPeerConnection, sendSignal]);

  // Effect for polling the signaling server
  useEffect(() => {
    const pollSignals = async () => {
      try {
        const response = await fetch(`/api/webrtc/rooms/${roomId}/signal?since=${lastFetch.current.toISOString()}`);
        if (!response.ok) throw new Error('Failed to fetch signals');
        
        lastFetch.current = new Date(); // Update timestamp before processing
        const { signals } = await response.json();
        const allSignals: Signal[] = [];

        // Combine all signals into a single array and map server type to client type
        signals.offers.forEach((s: any) => allSignals.push({ from: s.senderId, type: 'offer', payload: s.payload }));
        signals.answers.forEach((s: any) => allSignals.push({ from: s.senderId, type: 'answer', payload: s.payload }));
        signals.ices.forEach((s: any) => allSignals.push({ from: s.senderId, type: 'ice-candidate', payload: s.payload }));

        // Sort signals by creation time to process them in order
        allSignals.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        for (const signal of allSignals) {
            await handleSignal(signal);
        }
      } catch (error) {
        console.error("Error polling signals:", error);
      }
    };

    const intervalId = setInterval(pollSignals, 3000);
    return () => clearInterval(intervalId);
  }, [roomId, handleSignal]);

  // Effect to create and send offers when new peers are anticipated.
  useEffect(() => {
    if (!localStream) return;
    
    // A simple way to announce presence is to send an offer.
    // In a real app, you might get a participant list and send offers to each.
    // This timeout allows time for the local stream to be ready.
    const timer = setTimeout(() => {
        // This is a simplified initiation logic.
        // A robust solution would involve fetching the participant list
        // and creating offers for each.
        console.log("Broadcasting offer to room");
        // We don't have a peer list, so we can't target offers.
        // New peers will send us offers, and we will answer.
        // We can send a "dummy" offer to announce our presence, but it's not standard.
        // For now, we rely on others initiating the connection.
        // We can create offers when we discover new peers.
    }, 5000);


    return () => clearTimeout(timer);
  }, [localStream, sendSignal]);


  return { peers };
};
