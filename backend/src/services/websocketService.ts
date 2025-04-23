import * as WebSocket from 'ws';
import { Server } from 'http';
import { v4 as uuidv4 } from 'uuid';

type WebSocketMessage = {
  type: string;
  data: any;
};

export class WebSocketService {
  private wss: WebSocket.Server;
  private clients: Map<string, WebSocket> = new Map();
  private userSockets: Map<string, string[]> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocket.Server({ server });
    this.setupWebSocketServer();
  }

  private setupWebSocketServer(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      const clientId = uuidv4();
      this.clients.set(clientId, ws);

      ws.on('message', (message: string) => {
        try {
          const parsedMessage = JSON.parse(message);
          this.handleMessage(clientId, parsedMessage);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      ws.on('close', () => {
        this.handleDisconnect(clientId);
      });

      // Send a confirmation message to the client
      this.sendToClient(clientId, {
        type: 'CONNECTION_ESTABLISHED',
        data: { clientId }
      });
    });
  }

  private handleMessage(clientId: string, message: WebSocketMessage): void {
    const { type, data } = message;

    switch (type) {
      case 'REGISTER_USER':
        this.registerUser(clientId, data.userId);
        break;
      
      case 'JOIN_GAME_ROOM':
        // Additional logic for game rooms can be added here
        break;
      
      default:
        console.warn(`Unhandled WebSocket message type: ${type}`);
    }
  }

  private registerUser(clientId: string, userId: string): void {
    // Associate this client connection with a user ID
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, []);
    }
    
    this.userSockets.get(userId)?.push(clientId);
    
    // Confirm registration
    this.sendToClient(clientId, {
      type: 'USER_REGISTERED',
      data: { userId }
    });
  }

  private handleDisconnect(clientId: string): void {
    // Remove client from clients map
    this.clients.delete(clientId);
    
    // Remove client from userSockets map
    for (const [userId, sockets] of this.userSockets.entries()) {
      const updatedSockets = sockets.filter(id => id !== clientId);
      
      if (updatedSockets.length === 0) {
        this.userSockets.delete(userId);
      } else {
        this.userSockets.set(userId, updatedSockets);
      }
    }
  }

  /**
   * Send a message to a specific client by their client ID
   */
  public sendToClient(clientId: string, message: WebSocketMessage): void {
    const client = this.clients.get(clientId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }

  /**
   * Send a message to all clients associated with a user ID
   */
  public sendToUser(userId: string, message: WebSocketMessage): void {
    const clientIds = this.userSockets.get(userId) || [];
    clientIds.forEach(clientId => {
      this.sendToClient(clientId, message);
    });
  }

  /**
   * Broadcast a message to all connected clients
   */
  public broadcast(message: WebSocketMessage): void {
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
} 