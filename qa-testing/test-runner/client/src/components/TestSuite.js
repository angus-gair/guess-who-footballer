import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Checkbox,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Flex,
  Spacer,
  Icon,
  useToast,
  Spinner,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon
} from '@chakra-ui/react';
import { FaPlay, FaArrowLeft, FaCheck, FaTimes, FaPlayCircle, FaClipboard } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';

// Mock test case data - in a real application, this would be fetched from the API
const mockTestCases = {
  functional: [
    { id: 'TC-101', name: 'Create Single Player Game', priority: 'P0', status: 'passed', lastRun: '2023-08-14T10:30:00Z' },
    { id: 'TC-102', name: 'Create Multiplayer Game', priority: 'P0', status: 'passed', lastRun: '2023-08-14T10:35:00Z' },
    { id: 'TC-103', name: 'Join Multiplayer Game', priority: 'P0', status: 'passed', lastRun: '2023-08-14T10:40:00Z' },
    { id: 'TC-104', name: 'Invalid Room Code Handling', priority: 'P1', status: 'failed', lastRun: '2023-08-14T10:45:00Z' },
    { id: 'TC-201', name: 'Ask a Question', priority: 'P0', status: 'passed', lastRun: '2023-08-14T11:00:00Z' },
    { id: 'TC-202', name: 'Answer a Question', priority: 'P0', status: 'passed', lastRun: '2023-08-14T11:05:00Z' },
    { id: 'TC-203', name: 'Card Elimination', priority: 'P0', status: 'failed', lastRun: '2023-08-14T11:10:00Z' },
    { id: 'TC-204', name: 'Make a Guess', priority: 'P0', status: 'passed', lastRun: '2023-08-14T11:15:00Z' },
  ],
  integration: [
    { id: 'INT-101', name: 'API Authentication', priority: 'P0', status: 'passed', lastRun: '2023-08-14T12:00:00Z' },
    { id: 'INT-102', name: 'Game State Synchronization', priority: 'P0', status: 'failed', lastRun: '2023-08-14T12:05:00Z' },
    { id: 'INT-103', name: 'Error Handling', priority: 'P1', status: 'passed', lastRun: '2023-08-14T12:10:00Z' },
    { id: 'INT-201', name: 'Real-time Updates', priority: 'P0', status: 'passed', lastRun: '2023-08-14T12:15:00Z' },
    { id: 'INT-202', name: 'Reconnection Handling', priority: 'P0', status: 'failed', lastRun: '2023-08-14T12:20:00Z' },
  ],
  performance: [
    { id: 'PERF-101', name: 'Load Testing - 50 Users', priority: 'P0', status: 'passed', lastRun: '2023-08-14T13:00:00Z' },
    { id: 'PERF-102', name: 'Load Testing - 100 Users', priority: 'P0', status: 'failed', lastRun: '2023-08-14T13:05:00Z' },
    { id: 'PERF-201', name: 'Network Resilience - High Latency', priority: 'P1', status: 'passed', lastRun: '2023-08-14T13:10:00Z' },
  ],
  accessibility: [
    { id: 'A11Y-101', name: 'Screen Reader Compatibility', priority: 'P0', status: 'failed', lastRun: '2023-08-14T14:00:00Z' },
    { id: 'A11Y-102', name: 'Keyboard Navigation', priority: 'P0', status: 'passed', lastRun: '2023-08-14T14:05:00Z' },
    { id: 'A11Y-103', name: 'Color Contrast', priority: 'P1', status: 'failed', lastRun: '2023-08-14T14:10:00Z' },
  ],
  compatibility: [
    { id: 'COMP-101', name: 'Chrome Browser Testing', priority: 'P0', status: 'passed', lastRun: '2023-08-14T15:00:00Z' },
    { id: 'COMP-102', name: 'Firefox Browser Testing', priority: 'P0', status: 'passed', lastRun: '2023-08-14T15:05:00Z' },
    { id: 'COMP-103', name: 'Safari Browser Testing', priority: 'P0', status: 'failed', lastRun: '2023-08-14T15:10:00Z' },
    { id: 'COMP-201', name: 'Mobile View - iPhone', priority: 'P1', status: 'failed', lastRun: '2023-08-14T15:15:00Z' },
  ]
};

const categoryInfo = {
  functional: { 
    name: 'Functional Tests', 
    description: 'Core gameplay and UI functionality tests',
    icon: FaPlayCircle,
    color: 'blue'
  },
  integration: { 
    name: 'Integration Tests', 
    description: 'Frontend-backend communication tests',
    icon: FaClipboard,
    color: 'purple'
  },
  performance: { 
    name: 'Performance Tests', 
    description: 'Load, stress, and network resilience tests',
    icon: FaPlayCircle,
    color: 'orange'
  },
  accessibility: { 
    name: 'Accessibility Tests', 
    description: 'WCAG 2.1 AA compliance verification',
    icon: FaPlayCircle,
    color: 'green'
  },
  compatibility: { 
    name: 'Compatibility Tests', 
    description: 'Browser and device compatibility tests',
    icon: FaClipboard,
    color: 'cyan'
  }
};

const TestSuite = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const { startTestRun, onTestRunCreated } = useSocket();
  
  const [selectedTests, setSelectedTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testCases, setTestCases] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  
  useEffect(() => {
    // In a real application, we would fetch the test cases from the API
    // For now, we'll use mock data
    const tests = mockTestCases[category] || [];
    setTestCases(tests);
    setLoading(false);
    
    // Set up socket event listener
    const cleanupTestRunCreated = onTestRunCreated(({ testRunId }) => {
      if (testRunId) {
        navigate(`/test-run/${testRunId}`);
      }
    });
    
    return () => {
      cleanupTestRunCreated();
    };
  }, [category, onTestRunCreated, navigate]);
  
  // Get the category information
  const info = categoryInfo[category] || {
    name: `${category.charAt(0).toUpperCase() + category.slice(1)} Tests`,
    description: 'Test suite',
    icon: FaPlayCircle,
    color: 'gray'
  };
  
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTests(testCases.map(test => test.id));
    } else {
      setSelectedTests([]);
    }
  };
  
  const handleSelectTest = (testId) => {
    if (selectedTests.includes(testId)) {
      setSelectedTests(selectedTests.filter(id => id !== testId));
    } else {
      setSelectedTests([...selectedTests, testId]);
    }
  };
  
  const handleRunTests = () => {
    if (selectedTests.length === 0) {
      toast({
        title: 'No tests selected',
        description: 'Please select at least one test to run',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsRunning(true);
    
    // In a real application, we would call the API to start the tests
    // For now, we'll use the socket connection
    startTestRun(selectedTests, { category });
    
    toast({
      title: 'Starting test run',
      description: `Running ${selectedTests.length} tests...`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'P0': return 'red';
      case 'P1': return 'orange';
      case 'P2': return 'yellow';
      case 'P3': return 'green';
      default: return 'gray';
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'passed': return 'green';
      case 'failed': return 'red';
      case 'running': return 'blue';
      case 'pending': return 'gray';
      default: return 'gray';
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed': return FaCheck;
      case 'failed': return FaTimes;
      case 'running': return FaPlay;
      default: return null;
    }
  };

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <VStack spacing={6} align="stretch">
        <Flex align="center">
          <Button 
            leftIcon={<FaArrowLeft />} 
            variant="ghost" 
            onClick={() => navigate('/')}
            mr={4}
          >
            Back
          </Button>
          <VStack align="flex-start" spacing={0}>
            <Heading size="lg" display="flex" alignItems="center">
              <Icon as={info.icon} color={`${info.color}.500`} mr={2} />
              {info.name}
            </Heading>
            <Text color="gray.600">{info.description}</Text>
          </VStack>
          <Spacer />
          <Button 
            colorScheme="blue" 
            leftIcon={<FaPlay />}
            isLoading={isRunning}
            loadingText="Starting"
            onClick={handleRunTests}
            isDisabled={selectedTests.length === 0}
          >
            Run Selected Tests
          </Button>
        </Flex>
        
        {loading ? (
          <Flex justify="center" p={8}>
            <Spinner size="lg" />
          </Flex>
        ) : (
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
            <Table variant="simple">
              <Thead>
                <Tr bg="gray.50">
                  <Th width="50px">
                    <Checkbox 
                      isChecked={selectedTests.length === testCases.length && testCases.length > 0}
                      isIndeterminate={selectedTests.length > 0 && selectedTests.length < testCases.length}
                      onChange={handleSelectAll}
                    />
                  </Th>
                  <Th>Test ID</Th>
                  <Th>Name</Th>
                  <Th>Priority</Th>
                  <Th>Last Result</Th>
                  <Th>Last Run</Th>
                </Tr>
              </Thead>
              <Tbody>
                {testCases.map((test) => {
                  const StatusIcon = getStatusIcon(test.status);
                  
                  return (
                    <Tr key={test.id} _hover={{ bg: 'gray.50' }}>
                      <Td>
                        <Checkbox 
                          isChecked={selectedTests.includes(test.id)}
                          onChange={() => handleSelectTest(test.id)}
                        />
                      </Td>
                      <Td fontFamily="mono">{test.id}</Td>
                      <Td>{test.name}</Td>
                      <Td>
                        <Badge colorScheme={getPriorityColor(test.priority)}>
                          {test.priority}
                        </Badge>
                      </Td>
                      <Td>
                        <HStack>
                          {StatusIcon && <Icon as={StatusIcon} color={`${getStatusColor(test.status)}.500`} />}
                          <Badge colorScheme={getStatusColor(test.status)}>
                            {test.status}
                          </Badge>
                        </HStack>
                      </Td>
                      <Td>{formatDate(test.lastRun)}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
        )}
        
        <Box>
          <Heading size="md" mb={4}>Test Suite Information</Heading>
          <Accordion allowToggle>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Test Environment
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text>
                  These tests are executed in the production-like test environment with the following configuration:
                </Text>
                <VStack align="stretch" mt={2} spacing={1}>
                  <Text><strong>Frontend:</strong> React v18.2.0 with Vite</Text>
                  <Text><strong>Backend:</strong> Node.js v18 with Express</Text>
                  <Text><strong>Database:</strong> PostgreSQL v14</Text>
                  <Text><strong>Infrastructure:</strong> Docker containers</Text>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
            
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Execution Notes
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text>
                  When running tests:
                </Text>
                <VStack align="stretch" mt={2} spacing={1}>
                  <Text>• Tests will be executed in the order they appear in the table</Text>
                  <Text>• Each test is independent and will not affect other tests</Text>
                  <Text>• Results will be available in real-time during execution</Text>
                  <Text>• Logs can be viewed for each test after completion</Text>
                  <Text>• Test data will be reset after each test run</Text>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      </VStack>
    </Box>
  );
};

export default TestSuite; 