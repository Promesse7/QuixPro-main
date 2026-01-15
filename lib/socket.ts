let socket: WebSocket | null = null;

export const getSocket = (userId: string): WebSocket => {
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return socket;
  }

  // Create a new WebSocket connection
  const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
  const host = process.env.NEXT_PUBLIC_WS_URL || window.location.host;
  const path = '/api/ws';
  
  socket = new WebSocket(`${protocol}${host}${path}?userId=${userId}`);

  socket.onopen = () => {
    console.log('WebSocket connected');
  };

  socket.onclose = (event) => {
    console.log('WebSocket disconnected:', event);
    // Attempt to reconnect after a delay
    setTimeout(() => {
      getSocket(userId);
    }, 5000);
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return socket;
};

export const closeSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};
