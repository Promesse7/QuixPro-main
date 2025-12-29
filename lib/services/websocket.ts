import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { chatService } from './chatService';
import { firebaseAdmin } from './firebase';

export class WebSocketService {
  private static instance: WebSocketService;
  private io: Server | null = null;
  private userSockets = new Map<string, string>(); // userId -> socketId

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public initialize(server: HttpServer) {
    if (this.io) return; // Already initialized

    this.io = new Server(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || '*',
        methods: ['GET', 'POST'],
        credentials: true
      },
      path: '/api/socket/io',
      addTrailingSlash: false
    });

    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication error: No token provided'));
        }

        // Verify Firebase token
        const decodedToken = await firebaseAdmin.verifyIdToken(token);
        (socket as any).userId = decodedToken.uid;
        next();
      } catch (error) {
        console.error('Socket auth error:', error);
        next(new Error('Authentication error: Invalid token'));
      }
    });

    this.io.on('connection', (socket) => {
      const userId = (socket as any).userId;
      console.log(`User connected: ${userId}`);

      // Store user's socket ID
      this.userSockets.set(userId, socket.id);

      // Join user to their personal room
      socket.join(`user_${userId}`);

      // Handle joining group rooms
      socket.on('joinGroups', async (groupIds: string[]) => {
        groupIds.forEach(groupId => {
          socket.join(`group_${groupId}`);
        });
      });

      // Handle new messages
      socket.on('sendMessage', async (data) => {
        try {
          const { groupId, content, type = 'text', metadata } = data;
          
          // Save message to database
          const message = await chatService.createMessage({
            groupId,
            content,
            type,
            metadata,
            senderId: userId,
          });

          // Broadcast to group
          this.io?.to(`group_${groupId}`).emit('newMessage', message);

          // Notify users who have the chat open but are not in the group
          const group = await chatService.getGroup(groupId);
          if (group) {
            const memberIds = group.members.map((m: any) => m.userId);
            memberIds.forEach((memberId: string) => {
              if (memberId !== userId) {
                this.io?.to(`user_${memberId}`).emit('newMessageNotification', {
                  groupId,
                  message: {
                    ...message,
                    groupName: group.name
                  }
                });
              }
            });
          }
        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Handle typing indicators
      socket.on('typing', async (data) => {
        try {
          const { groupId, isTyping } = data;
          await chatService.setTypingIndicator(userId, groupId, isTyping);
          
          // Broadcast to group except sender
          socket.to(`group_${groupId}`).emit('userTyping', {
            userId,
            groupId,
            isTyping
          });
        } catch (error) {
          console.error('Error handling typing indicator:', error);
        }
      });

      // Handle message read receipts
      socket.on('markAsRead', async (data) => {
        try {
          const { messageId } = data;
          await chatService.markMessageAsRead(messageId, userId);
          
          // Broadcast to group that message was read
          const messages = await chatService.getMessages(data.groupId || '', 1);
          const foundMessage = messages[0];
          if (foundMessage) {
            this.io?.to(`group_${foundMessage.groupId}`).emit('messageRead', {
              messageId,
              userId,
              readAt: new Date()
            });
          }
        } catch (error) {
          console.error('Error marking message as read:', error);
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${userId}`);
        this.userSockets.delete(userId);
      });
    });
  }

  // Send a direct message to a specific user
  public sendToUser(userId: string, event: string, data: any) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.io?.to(socketId).emit(event, data);
    }
  }

  // Send to all users in a group
  public sendToGroup(groupId: string, event: string, data: any) {
    this.io?.to(`group_${groupId}`).emit(event, data);
  }

  // Get the socket.io instance
  public getIO(): Server | null {
    return this.io;
  }
}

export const webSocketService = WebSocketService.getInstance();
