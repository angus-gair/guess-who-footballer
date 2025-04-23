import React, { createContext, useState, useContext, useEffect } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Only connect to socket if user is authenticated
    if (isAuthenticated && !socket) {
      // Connect to the socket server
      const socketInstance = io(process.env.REACT_APP_SOCKET_URL || '', {
        auth: {
          token: user?.credentials
        }
      });

      socketInstance.on('connect', () => {
        console.log('Socket connected');
        setConnected(true);
      });

      socketInstance.on('disconnect', () => {
        console.log('Socket disconnected');
        setConnected(false);
      });

      setSocket(socketInstance);

      // Clean up socket connection on unmount
      return () => {
        if (socketInstance) {
          socketInstance.disconnect();
        }
      };
    }
  }, [isAuthenticated, user, socket]);

  // Functions to interact with socket
  const joinTestRun = (testRunId) => {
    if (socket && connected) {
      socket.emit('joinTestRun', testRunId);
    }
  };

  const startTestRun = (testIds, config = {}) => {
    if (socket && connected) {
      socket.emit('startTestRun', { testIds, config });
    }
  };

  // Add event listeners for specific events
  const onTestResult = (callback) => {
    if (socket) {
      socket.on('testResult', callback);
      return () => socket.off('testResult', callback);
    }
    return () => {};
  };

  const onTestRunCreated = (callback) => {
    if (socket) {
      socket.on('testRunCreated', callback);
      return () => socket.off('testRunCreated', callback);
    }
    return () => {};
  };

  const onTestRunCompleted = (callback) => {
    if (socket) {
      socket.on('testRunCompleted', callback);
      return () => socket.off('testRunCompleted', callback);
    }
    return () => {};
  };

  const value = {
    socket,
    connected,
    joinTestRun,
    startTestRun,
    onTestResult,
    onTestRunCreated,
    onTestRunCompleted
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 