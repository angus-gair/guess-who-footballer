import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const validate = () => {
    const newErrors = {};
    if (!username) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setLoading(true);
    try {
      const success = await login(username, password);
      if (success) {
        toast({
          title: 'Login successful',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/');
      } else {
        toast({
          title: 'Login failed',
          description: 'Invalid username or password',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'An error occurred during login',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box py={10} px={4} maxW="400px" mx="auto" mt={8}>
      <Card shadow="md" borderRadius="lg">
        <CardBody>
          <VStack spacing={6} align="stretch">
            <VStack spacing={2}>
              <Heading size="lg" textAlign="center">Test Runner Login</Heading>
              <Text color="gray.600" fontSize="sm" textAlign="center">
                Please enter your credentials to access the test runner interface
              </Text>
            </VStack>
            
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.username}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                  />
                  <FormErrorMessage>{errors.username}</FormErrorMessage>
                </FormControl>
                
                <FormControl isInvalid={!!errors.password}>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                    <InputRightElement width="3rem">
                      <Button
                        h="1.5rem"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        bg="transparent"
                        _hover={{ bg: 'transparent' }}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>
                
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={loading}
                  loadingText="Logging in"
                  width="full"
                  mt={4}
                >
                  Login
                </Button>
              </VStack>
            </form>
            
            <Text fontSize="xs" color="gray.500" textAlign="center">
              This interface is for authorized testing personnel only. 
              Unauthorized access is prohibited.
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Login; 