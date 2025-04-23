import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Dashboard from './components/Dashboard';
import TestSuite from './components/TestSuite';
import TestRun from './components/TestRun';
import Header from './components/Header';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Box minH="100vh" display="flex" flexDirection="column">
          <Header />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/test-suite/:category" element={<ProtectedRoute><TestSuite /></ProtectedRoute>} />
            <Route path="/test-run/:id" element={<ProtectedRoute><TestRun /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App; 