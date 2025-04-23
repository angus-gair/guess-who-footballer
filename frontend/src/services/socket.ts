import { io, Socket } from 'socket.io-client';
import { SocketEvent } from '../types/socket';

// Socket.io server URL from environment
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private listeners: Map<string, Function[]> = new Map();

  // Initialize socket connection
  connect = (token?: string): Promise<Socket> => {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(SOCKET_URL, {
          auth: token ? { token } : undefined,
          reconnection: true,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
        });

        this.socket.on(SocketEvent.CONNECT, () => {
          console.log('Socket connected');
          this.reconnectAttempts = 0;
          resolve(this.socket as Socket);
        });

        this.socket.on(SocketEvent.DISCONNECT, (reason) => {
          console.log(`Socket disconnected: ${reason}`);
        });

        this.socket.on(SocketEvent.ERROR, (error) => {
          console.error('Socket error:', error);
          reject(error);
        });

        this.socket.on('reconnect_attempt', (attempt) => {
          this.reconnectAttempts = attempt;
          console.log(`Reconnection attempt: ${attempt}/${this.maxReconnectAttempts}`);
        });

        this.socket.on('reconnect_failed', () => {
          console.error('Socket reconnection failed');
          reject(new Error('Socket reconnection failed'));
        });

      } catch (error) {
        console.error('Socket connection error:', error);
        reject(error);
      }
    });
  };

  // Disconnect socket
  disconnect = (): void => {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  };

  // Check if socket is connected
  isConnected = (): boolean => {
    return this.socket?.connected || false;
  };

  // Add event listener
  on = <T>(event: string, callback: (data: T) => void): void => {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }

    // Store listener in our map for cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);

    // Add listener to socket
    this.socket.on(event, callback);
  };

  // Remove event listener
  off = (event: string, callback?: Function): void => {
    if (!this.socket) {
      return;
    }

    if (callback) {
      // Remove specific callback
      this.socket.off(event, callback as any);
      
      // Update listeners map
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        const index = eventListeners.indexOf(callback);
        if (index !== -1) {
          eventListeners.splice(index, 1);
        }
      }
    } else {
      // Remove all callbacks for this event
      this.socket.off(event);
      this.listeners.delete(event);
    }
  };

  // Emit event with data
  emit = <T>(event: string, data?: T): void => {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    this.socket.emit(event, data);
  };

  // Get socket ID
  getSocketId = (): string | undefined => {
    return this.socket?.id;
  };
}

// Create singleton instance
const socketService = new SocketService();
export default socketService; 