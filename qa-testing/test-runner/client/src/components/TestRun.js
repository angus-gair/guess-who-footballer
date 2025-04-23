import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  List,
  ListItem,
  Progress,
  Badge,
  Flex,
  Spacer,
  Icon,
  Spinner,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Code,
  useToast,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useClipboard
} from '@chakra-ui/react';
import { 
  FaArrowLeft, 
  FaCheck, 
  FaTimes, 
  FaPlay, 
  FaClock, 
  FaClipboard, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaHistory
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';

const TestRun = () => {
  const { id: testRunId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const { joinTestRun, onTestResult, onTestRunCompleted } = useSocket();
  
  const [testRun, setTestRun] = useState({
    id: testRunId,
    status: 'running',
    startTime: new Date(),
    endTime: null,
    tests: [],
    summary: null
  });
  
  const [activeTestId, setActiveTestId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // For copying logs to clipboard
  const allLogsRef = useRef('');
  const { hasCopied, onCopy } = useClipboard('');
  
  useEffect(() => {
    // Join the test run room
    joinTestRun(testRunId);
    
    // Initialize with some mock data
    setTestRun({
      id: testRunId,
      status: 'running',
      startTime: new Date(),
      endTime: null,
      tests: [
        {
          id: 'TC-101',
          name: 'Create Single Player Game',
          status: 'running',
          results: null
        },
        {
          id: 'TC-102',
          name: 'Create Multiplayer Game',
          status: 'pending',
          results: null
        },
        {
          id: 'INT-101',
          name: 'API Authentication',
          status: 'pending',
          results: null
        }
      ]
    });
    
    setActiveTestId('TC-101');
    setLoading(false);
    
    // Set up event listeners
    const cleanupTestResult = onTestResult(({ testId, status, results, error }) => {
      setTestRun(prev => {
        const updatedTests = prev.tests.map(test => {
          if (test.id === testId) {
            return {
              ...test,
              status,
              results,
              error
            };
          }
          return test;
        });
        
        return {
          ...prev,
          tests: updatedTests
        };
      });
      
      // Update all logs
      updateAllLogs();
    });
    
    const cleanupTestRunCompleted = onTestRunCompleted(({ status, summary }) => {
      setTestRun(prev => ({
        ...prev,
        status,
        endTime: new Date(),
        summary
      }));
      
      toast({
        title: 'Test Run Completed',
        description: `Passed: ${summary.passed}, Failed: ${summary.failed}`,
        status: summary.failed > 0 ? 'warning' : 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Update all logs
      updateAllLogs();
    });
    
    return () => {
      cleanupTestResult();
      cleanupTestRunCompleted();
    };
  }, [testRunId, joinTestRun, onTestResult, onTestRunCompleted, toast]);
  
  // Update combined logs for clipboard
  const updateAllLogs = () => {
    let logs = `Test Run ${testRunId} - ${new Date().toLocaleString()}\n\n`;
    
    testRun.tests.forEach(test => {
      logs += `Test: ${test.id} - ${test.name}\n`;
      logs += `Status: ${test.status}\n`;
      
      if (test.results && test.results.logs) {
        logs += 'Logs:\n';
        test.results.logs.forEach(log => {
          logs += `  ${log}\n`;
        });
      }
      
      if (test.error) {
        logs += 'Error:\n';
        logs += `  ${test.error.message}\n`;
        if (test.error.stack) {
          logs += `  ${test.error.stack}\n`;
        }
      }
      
      logs += '\n';
    });
    
    if (testRun.summary) {
      logs += `Summary:\n`;
      logs += `  Total: ${testRun.summary.total}\n`;
      logs += `  Passed: ${testRun.summary.passed}\n`;
      logs += `  Failed: ${testRun.summary.failed}\n`;
      logs += `  Duration: ${testRun.summary.duration}ms\n`;
    }
    
    allLogsRef.current = logs;
  };
  
  const handleCopyLogs = () => {
    navigator.clipboard.writeText(allLogsRef.current);
    toast({
      title: 'Logs Copied',
      description: 'Test logs have been copied to clipboard',
      status: 'success',
      duration: 3000,
    });
  };
  
  // Get the active test
  const activeTest = testRun.tests.find(test => test.id === activeTestId) || null;
  
  // Calculate test run statistics
  const totalTests = testRun.tests.length;
  const passedTests = testRun.tests.filter(test => test.status === 'passed').length;
  const failedTests = testRun.tests.filter(test => test.status === 'failed').length;
  const pendingTests = testRun.tests.filter(test => test.status === 'pending' || test.status === 'running').length;
  const progress = totalTests > 0 ? Math.round(((passedTests + failedTests) / totalTests) * 100) : 0;
  
  // Format time
  const formatTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleTimeString();
  };
  
  // Calculate duration
  const calculateDuration = () => {
    const start = new Date(testRun.startTime);
    const end = testRun.endTime ? new Date(testRun.endTime) : new Date();
    const durationMs = end - start;
    
    if (durationMs < 1000) {
      return `${durationMs}ms`;
    } else if (durationMs < 60000) {
      return `${Math.round(durationMs / 1000)}s`;
    } else {
      const minutes = Math.floor(durationMs / 60000);
      const seconds = Math.round((durationMs % 60000) / 1000);
      return `${minutes}m ${seconds}s`;
    }
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'passed': return 'green';
      case 'failed': return 'red';
      case 'running': return 'blue';
      case 'pending': return 'gray';
      default: return 'gray';
    }
  };
  
  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed': return FaCheck;
      case 'failed': return FaTimes;
      case 'running': return FaPlay;
      case 'pending': return FaClock;
      default: return FaClock;
    }
  };
  
  return (
    <Box p={6} maxW="1200px" mx="auto">
      <VStack spacing={6} align="stretch">
        <Flex align="center">
          <Button 
            leftIcon={<FaArrowLeft />} 
            variant="ghost" 
            onClick={() => navigate(-1)}
            mr={4}
          >
            Back
          </Button>
          <VStack align="flex-start" spacing={0}>
            <Heading size="lg">Test Run Details</Heading>
            <Text color="gray.600">ID: {testRunId}</Text>
          </VStack>
          <Spacer />
          <Button 
            colorScheme="blue" 
            variant="outline"
            leftIcon={<FaClipboard />}
            onClick={handleCopyLogs}
          >
            Copy Logs
          </Button>
        </Flex>
        
        {loading ? (
          <Flex justify="center" p={8}>
            <Spinner size="lg" />
          </Flex>
        ) : (
          <>
            {/* Test run status card */}
            <Card variant="filled" bg={testRun.status === 'completed' ? 'green.50' : 'blue.50'}>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                  <Stat>
                    <StatLabel>Status</StatLabel>
                    <StatNumber>
                      <HStack>
                        {testRun.status === 'completed' ? (
                          <Icon as={FaCheckCircle} color="green.500" />
                        ) : (
                          <Spinner size="sm" color="blue.500" />
                        )}
                        <Text>{testRun.status === 'completed' ? 'Completed' : 'Running'}</Text>
                      </HStack>
                    </StatNumber>
                    <StatHelpText>
                      {testRun.status === 'completed' 
                        ? `Finished at ${formatTime(testRun.endTime)}` 
                        : `Started at ${formatTime(testRun.startTime)}`}
                    </StatHelpText>
                  </Stat>
                  
                  <Stat>
                    <StatLabel>Progress</StatLabel>
                    <StatNumber>{progress}%</StatNumber>
                    <Progress 
                      value={progress} 
                      size="sm" 
                      colorScheme={testRun.status === 'completed' ? 'green' : 'blue'} 
                      borderRadius="md"
                      mt={2}
                    />
                  </Stat>
                  
                  <Stat>
                    <StatLabel>Results</StatLabel>
                    <HStack spacing={4}>
                      <Stat>
                        <HStack>
                          <Icon as={FaCheck} color="green.500" />
                          <StatNumber color="green.500">{passedTests}</StatNumber>
                        </HStack>
                      </Stat>
                      <Stat>
                        <HStack>
                          <Icon as={FaTimes} color="red.500" />
                          <StatNumber color="red.500">{failedTests}</StatNumber>
                        </HStack>
                      </Stat>
                    </HStack>
                    <StatHelpText>{totalTests} total tests</StatHelpText>
                  </Stat>
                  
                  <Stat>
                    <StatLabel>Duration</StatLabel>
                    <StatNumber>{calculateDuration()}</StatNumber>
                    <StatHelpText>
                      <Icon as={FaHistory} mr={1} />
                      {testRun.status === 'completed' ? 'Total time' : 'Running time'}
                    </StatHelpText>
                  </Stat>
                </SimpleGrid>
              </CardBody>
            </Card>
            
            {/* Test cases and details */}
            <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
              {/* Test list */}
              <Box 
                w={{ base: '100%', md: '350px' }} 
                borderWidth="1px" 
                borderRadius="lg" 
                overflow="hidden"
              >
                <Box p={4} bg="gray.50" borderBottomWidth="1px">
                  <Heading size="sm">Test Cases</Heading>
                </Box>
                
                <List spacing={0} maxH="500px" overflowY="auto">
                  {testRun.tests.map((test) => {
                    const StatusIcon = getStatusIcon(test.status);
                    const isActive = test.id === activeTestId;
                    
                    return (
                      <ListItem 
                        key={test.id} 
                        p={3}
                        bg={isActive ? 'gray.100' : 'white'}
                        cursor="pointer"
                        onClick={() => setActiveTestId(test.id)}
                        _hover={{ bg: isActive ? 'gray.100' : 'gray.50' }}
                        borderBottomWidth="1px"
                      >
                        <Flex align="center">
                          <Icon 
                            as={StatusIcon} 
                            color={`${getStatusColor(test.status)}.500`}
                            boxSize={4}
                            mr={3}
                          />
                          <Box>
                            <Text fontWeight="medium">{test.name}</Text>
                            <Text fontSize="sm" color="gray.600" fontFamily="mono">
                              {test.id}
                            </Text>
                          </Box>
                          <Spacer />
                          <Badge colorScheme={getStatusColor(test.status)}>
                            {test.status}
                          </Badge>
                        </Flex>
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
              
              {/* Test details */}
              <Box flex="1" borderWidth="1px" borderRadius="lg" overflow="hidden">
                <Box p={4} bg="gray.50" borderBottomWidth="1px">
                  <Heading size="sm">Test Details</Heading>
                </Box>
                
                {activeTest ? (
                  <Box p={4}>
                    <VStack align="stretch" spacing={4}>
                      <Flex align="center" justify="space-between">
                        <Heading size="md">{activeTest.name}</Heading>
                        <Badge 
                          size="lg" 
                          colorScheme={getStatusColor(activeTest.status)}
                          px={2}
                          py={1}
                          borderRadius="md"
                        >
                          {activeTest.status}
                        </Badge>
                      </Flex>
                      
                      <Text fontFamily="mono" color="gray.600">ID: {activeTest.id}</Text>
                      
                      <Divider />
                      
                      <Tabs variant="enclosed" isLazy>
                        <TabList>
                          <Tab>Results</Tab>
                          <Tab>Logs</Tab>
                          {activeTest.error && <Tab>Errors</Tab>}
                        </TabList>
                        
                        <TabPanels>
                          <TabPanel>
                            {activeTest.status === 'pending' ? (
                              <Text color="gray.600">Test has not started yet.</Text>
                            ) : activeTest.status === 'running' ? (
                              <Flex align="center" justify="center" p={8}>
                                <Spinner mr={4} />
                                <Text>Test is currently running...</Text>
                              </Flex>
                            ) : activeTest.results ? (
                              <VStack align="stretch" spacing={3}>
                                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                                  <Stat>
                                    <StatLabel>Duration</StatLabel>
                                    <StatNumber>{activeTest.results.duration}ms</StatNumber>
                                  </Stat>
                                  <Stat>
                                    <StatLabel>Assertions</StatLabel>
                                    <StatNumber>{activeTest.results.assertions}</StatNumber>
                                  </Stat>
                                  <Stat>
                                    <StatLabel>Result</StatLabel>
                                    <HStack>
                                      <Icon 
                                        as={activeTest.status === 'passed' ? FaCheck : FaTimes} 
                                        color={activeTest.status === 'passed' ? 'green.500' : 'red.500'} 
                                      />
                                      <StatNumber color={activeTest.status === 'passed' ? 'green.500' : 'red.500'}>
                                        {activeTest.status === 'passed' ? 'PASSED' : 'FAILED'}
                                      </StatNumber>
                                    </HStack>
                                  </Stat>
                                </SimpleGrid>
                                
                                {activeTest.status === 'failed' && activeTest.error && (
                                  <Box 
                                    mt={2} 
                                    p={3} 
                                    bg="red.50" 
                                    borderWidth="1px" 
                                    borderColor="red.200"
                                    borderRadius="md"
                                  >
                                    <Flex align="flex-start">
                                      <Icon as={FaExclamationTriangle} color="red.500" mt={1} mr={2} />
                                      <Box>
                                        <Text fontWeight="medium" color="red.700">Error: {activeTest.error.message}</Text>
                                        {activeTest.error.stack && (
                                          <Code 
                                            mt={2} 
                                            p={2} 
                                            fontSize="sm" 
                                            backgroundColor="blackAlpha.50"
                                            whiteSpace="pre-wrap"
                                            display="block"
                                          >
                                            {activeTest.error.stack}
                                          </Code>
                                        )}
                                      </Box>
                                    </Flex>
                                  </Box>
                                )}
                              </VStack>
                            ) : (
                              <Text color="gray.600">No results available yet.</Text>
                            )}
                          </TabPanel>
                          
                          <TabPanel>
                            {activeTest.results && activeTest.results.logs ? (
                              <Box 
                                bg="blackAlpha.50" 
                                p={3} 
                                borderRadius="md" 
                                fontFamily="mono"
                                fontSize="sm"
                                maxH="300px"
                                overflowY="auto"
                              >
                                {activeTest.results.logs.map((log, index) => (
                                  <Text key={index}>{log}</Text>
                                ))}
                              </Box>
                            ) : (
                              <Text color="gray.600">No logs available yet.</Text>
                            )}
                          </TabPanel>
                          
                          {activeTest.error && (
                            <TabPanel>
                              <Box 
                                bg="red.50" 
                                p={3} 
                                borderWidth="1px" 
                                borderColor="red.200"
                                borderRadius="md"
                              >
                                <Heading size="sm" color="red.700" mb={2}>Error Details</Heading>
                                <Text fontWeight="medium" color="red.700" mb={2}>
                                  {activeTest.error.message}
                                </Text>
                                
                                {activeTest.error.stack && (
                                  <Code 
                                    p={2} 
                                    fontSize="sm" 
                                    backgroundColor="blackAlpha.50"
                                    whiteSpace="pre-wrap"
                                    display="block"
                                  >
                                    {activeTest.error.stack}
                                  </Code>
                                )}
                              </Box>
                            </TabPanel>
                          )}
                        </TabPanels>
                      </Tabs>
                    </VStack>
                  </Box>
                ) : (
                  <Flex align="center" justify="center" p={8}>
                    <Text color="gray.600">Select a test to view details</Text>
                  </Flex>
                )}
              </Box>
            </Flex>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default TestRun; 