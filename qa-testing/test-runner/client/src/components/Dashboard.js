import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Flex,
  Spinner,
  Badge,
  VStack,
  Button,
  HStack,
} from '@chakra-ui/react';
import { FaCheck, FaTimes, FaPlayCircle, FaClipboard, FaHistory } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const testCategories = [
  { 
    id: 'functional', 
    name: 'Functional Tests', 
    description: 'Core gameplay and UI functionality tests',
    icon: FaPlayCircle,
    color: 'blue.500',
    total: 48
  },
  { 
    id: 'integration', 
    name: 'Integration Tests', 
    description: 'Frontend-backend communication tests',
    icon: FaClipboard,
    color: 'purple.500',
    total: 32
  },
  { 
    id: 'performance', 
    name: 'Performance Tests', 
    description: 'Load, stress, and network resilience tests',
    icon: FaPlayCircle,
    color: 'orange.500',
    total: 15
  },
  { 
    id: 'accessibility', 
    name: 'Accessibility Tests', 
    description: 'WCAG 2.1 AA compliance verification',
    icon: FaPlayCircle,
    color: 'green.500',
    total: 20
  },
  { 
    id: 'compatibility', 
    name: 'Compatibility Tests', 
    description: 'Browser and device compatibility tests',
    icon: FaClipboard,
    color: 'cyan.500',
    total: 24
  }
];

const Dashboard = () => {
  const [recentTestRuns, setRecentTestRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // In a real application, we would fetch this data from the API
    // For now, we'll use mock data
    const mockRecentRuns = [
      {
        id: 'run-123',
        category: 'functional',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        passed: 39,
        failed: 9,
        total: 48,
        user: 'admin'
      },
      {
        id: 'run-124',
        category: 'integration',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        passed: 28,
        failed: 4,
        total: 32,
        user: 'admin'
      },
      {
        id: 'run-125',
        category: 'performance',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        passed: 14,
        failed: 1,
        total: 15,
        user: 'admin'
      }
    ];
    
    setRecentTestRuns(mockRecentRuns);
    setLoading(false);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading mb={2}>Test Categories</Heading>
          <Text color="gray.600" mb={4}>Select a test category to run or view test cases</Text>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {testCategories.map((category) => (
              <Card 
                key={category.id}
                direction="column"
                overflow="hidden"
                variant="outline"
                cursor="pointer"
                _hover={{ shadow: 'md', borderColor: category.color }}
                onClick={() => navigate(`/test-suite/${category.id}`)}
              >
                <CardBody>
                  <Flex align="center" mb={3}>
                    <Icon as={category.icon} boxSize={6} color={category.color} mr={3} />
                    <Heading size="md">{category.name}</Heading>
                  </Flex>
                  <Text color="gray.600" fontSize="sm" mb={4}>
                    {category.description}
                  </Text>
                  <Stat>
                    <StatLabel>Total Tests</StatLabel>
                    <StatNumber>{category.total}</StatNumber>
                    <StatHelpText>
                      Click to view and run tests
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
        
        <Box mt={8}>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md">Recent Test Runs</Heading>
            <Button
              size="sm"
              leftIcon={<FaHistory />}
              variant="ghost"
              colorScheme="blue"
              onClick={() => navigate('/test-history')}
            >
              View All
            </Button>
          </Flex>
          
          {loading ? (
            <Flex justify="center" p={8}>
              <Spinner size="lg" />
            </Flex>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {recentTestRuns.map((run) => {
                const category = testCategories.find(c => c.id === run.category);
                const passRate = Math.round((run.passed / run.total) * 100);
                
                return (
                  <Card 
                    key={run.id}
                    variant="outline"
                    cursor="pointer"
                    _hover={{ shadow: 'sm' }}
                    onClick={() => navigate(`/test-run/${run.id}`)}
                  >
                    <CardBody>
                      <Flex justify="space-between" align="flex-start" mb={2}>
                        <Badge colorScheme={category ? category.color.split('.')[0] : 'gray'}>
                          {category ? category.name : run.category}
                        </Badge>
                        <Text fontSize="xs" color="gray.500">
                          {formatDate(run.timestamp)}
                        </Text>
                      </Flex>
                      <HStack spacing={4} mt={3}>
                        <Stat>
                          <StatLabel color="green.500">Passed</StatLabel>
                          <StatNumber color="green.500">{run.passed}</StatNumber>
                        </Stat>
                        <Stat>
                          <StatLabel color="red.500">Failed</StatLabel>
                          <StatNumber color="red.500">{run.failed}</StatNumber>
                        </Stat>
                        <Stat>
                          <StatLabel>Pass Rate</StatLabel>
                          <StatNumber>{passRate}%</StatNumber>
                        </Stat>
                      </HStack>
                    </CardBody>
                  </Card>
                );
              })}
            </SimpleGrid>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default Dashboard; 