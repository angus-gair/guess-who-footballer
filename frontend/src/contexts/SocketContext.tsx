import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import socketService from '../services/socket';
import { useUser } from './UserContext';
import { SocketEvent } from '../types/socket';

// Define the context type
interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  emit: <T>(event: string, data?: T) => void;
  on: <T>(event: string, callback: (data: T) => void) => void;
  off: (event: string, callback?: Function) => void;
}

// Create context with default values
const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Props type for provider component
interface SocketProviderProps {
  children: ReactNode;
}

// Provider component
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useUser();

  // Connect to socket server
  const connect = async (): Promise<void> => {
    try {
      setError(null);
      const socketInstance = await socketService.connect(authState.token || undefined);
      setSocket(socketInstance);
      setConnected(true);
    } catch (error: any) {
      console.error('Socket connection error:', error);
      setError(error.message || 'Failed to connect to server');
      setConnected(false);
    }
  };

  // Disconnect from socket server
  const disconnect = (): void => {
    socketService.disconnect();
    setSocket(null);
    setConnected(false);
  };

  // Add event listener
  const on = <T,>(event: string, callback: (data: T) => void): void => {
    socketService.on<T>(event, callback);
  };

  // Remove event listener
  const off = (event: string, callback?: Function): void => {
    socketService.off(event, callback);
  };

  // Emit event
  const emit = <T,>(event: string, data?: T): void => {
    socketService.emit<T>(event, data);
  };

  // Auto-connect when authenticated
  useEffect(() => {
    if (authState.isAuthenticated && authState.token && !connected) {
      connect();
    }
    
    return () => {
      if (connected) {
        disconnect();
      }
    };
  }, [authState.isAuthenticated, authState.token]);

  // Update connected state based on socket events
  useEffect(() => {
    if (socket) {
      const handleConnect = () => {
        setConnected(true);
        setError(null);
      };

      const handleDisconnect = () => {
        setConnected(false);
      };

      const handleError = (err: any) => {
        setError(err?.message || 'Socket error');
      };

      // Add event listeners
      socket.on(SocketEvent.CONNECT, handleConnect);
      socket.on(SocketEvent.DISCONNECT, handleDisconnect);
      socket.on(SocketEvent.ERROR, handleError);

      // Clean up event listeners
      return () => {
        socket.off(SocketEvent.CONNECT, handleConnect);
        socket.off(SocketEvent.DISCONNECT, handleDisconnect);
        socket.off(SocketEvent.ERROR, handleError);
      };
    }
  }, [socket]);

  // Context value
  const value = {
    socket,
    connected,
    error,
    connect,
    disconnect,
    emit,
    on,
    off,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

// Custom hook to use the socket context
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export default SocketContext; 