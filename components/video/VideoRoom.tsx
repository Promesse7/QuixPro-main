"use client"
import React, { useEffect, useRef, useState } from 'react';
import { useWebRTC } from '@/hooks/useWebRTC';

// A small component to render the remote peer's video
const RemoteVideo = ({ stream }: { stream?: MediaStream }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return <video ref={videoRef} autoPlay className="w-full h-64 bg-black" />;
};


export default function VideoRoom({ roomId }: { roomId: string }) {
  const localRef = useRef<HTMLVideoElement | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | undefined>(undefined);

  // Effect to get user's media stream
  useEffect(() => {
    let stream: MediaStream;
    const initMedia = async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            if (localRef.current) {
                localRef.current.srcObject = stream;
            }
            setLocalStream(stream);
        } catch (err) {
            console.error('Video access denied. Please allow camera and microphone access.', err);
        }
    };
    initMedia();

    // Cleanup: stop the stream tracks when the component unmounts
    return () => {
        stream?.getTracks().forEach(track => track.stop());
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // Use the custom WebRTC hook to manage peer connections
  const { peers } = useWebRTC(roomId, localStream);

  return (
    <div className="grid grid-cols-2 gap-2">
      {/* Local Video */}
      <video ref={localRef} autoPlay muted className="w-full h-64 bg-black" />

      {/* Remote Videos */}
      {Object.keys(peers).map((peerId) => (
        <RemoteVideo key={peerId} stream={peers[peerId].stream} />
      ))}
    </div>
  )
}
