import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Spinner, Center } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Center h="100vh">
        <Box textAlign="center">
          <Spinner size="xl" color="blue.500" thickness="4px" />
        </Box>
      </Center>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 