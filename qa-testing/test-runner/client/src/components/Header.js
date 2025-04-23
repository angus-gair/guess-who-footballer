import React from 'react';
import { Box, Flex, Heading, Button, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box 
      as="header" 
      position="sticky" 
      top="0" 
      zIndex="10"
      bg={bg} 
      borderBottom="1px" 
      borderColor={borderColor}
      px={{ base: 4, md: 6 }} 
      py={4}
      shadow="sm"
    >
      <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
        <Heading 
          as="h1" 
          size="lg" 
          fontWeight="bold"
          color="brand.600"
          onClick={() => navigate('/')}
          cursor="pointer"
          _hover={{ color: 'brand.500' }}
        >
          Football Guess Who Test Runner
        </Heading>
        
        {isAuthenticated && (
          <HStack spacing={4}>
            <Text fontSize="sm" color="gray.600">
              Logged in as <Text as="span" fontWeight="bold">{user.username}</Text>
            </Text>
            <Button 
              size="sm" 
              colorScheme="red" 
              variant="outline"
              leftIcon={<FaSignOutAlt />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </HStack>
        )}
      </Flex>
    </Box>
  );
};

export default Header; 