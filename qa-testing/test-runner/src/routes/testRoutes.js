const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Mock test case data - in a real implementation, this would be from a database
const testCategories = {
  functional: {
    name: 'Functional Tests',
    description: 'Core gameplay and UI functionality tests',
    tests: [
      { id: 'TC-101', name: 'Create Single Player Game', priority: 'P0', status: 'passed' },
      { id: 'TC-102', name: 'Create Multiplayer Game', priority: 'P0', status: 'passed' },
      { id: 'TC-103', name: 'Join Multiplayer Game', priority: 'P0', status: 'passed' },
      { id: 'TC-104', name: 'Invalid Room Code Handling', priority: 'P1', status: 'failed' },
      { id: 'TC-201', name: 'Ask a Question', priority: 'P0', status: 'passed' },
      { id: 'TC-202', name: 'Answer a Question', priority: 'P0', status: 'passed' },
      { id: 'TC-203', name: 'Card Elimination', priority: 'P0', status: 'failed' },
      { id: 'TC-204', name: 'Make a Guess', priority: 'P0', status: 'passed' },
    ]
  },
  integration: {
    name: 'Integration Tests',
    description: 'Frontend-backend communication tests',
    tests: [
      { id: 'INT-101', name: 'API Authentication', priority: 'P0', status: 'passed' },
      { id: 'INT-102', name: 'Game State Synchronization', priority: 'P0', status: 'failed' },
      { id: 'INT-103', name: 'Error Handling', priority: 'P1', status: 'passed' },
      { id: 'INT-201', name: 'Real-time Updates', priority: 'P0', status: 'passed' },
      { id: 'INT-202', name: 'Reconnection Handling', priority: 'P0', status: 'failed' },
    ]
  },
  performance: {
    name: 'Performance Tests',
    description: 'Load, stress, and network resilience tests',
    tests: [
      { id: 'PERF-101', name: 'Load Testing - 50 Users', priority: 'P0', status: 'passed' },
      { id: 'PERF-102', name: 'Load Testing - 100 Users', priority: 'P0', status: 'failed' },
      { id: 'PERF-201', name: 'Network Resilience - High Latency', priority: 'P1', status: 'passed' },
    ]
  },
  accessibility: {
    name: 'Accessibility Tests',
    description: 'WCAG 2.1 AA compliance verification',
    tests: [
      { id: 'A11Y-101', name: 'Screen Reader Compatibility', priority: 'P0', status: 'failed' },
      { id: 'A11Y-102', name: 'Keyboard Navigation', priority: 'P0', status: 'passed' },
      { id: 'A11Y-103', name: 'Color Contrast', priority: 'P1', status: 'failed' },
    ]
  },
  compatibility: {
    name: 'Compatibility Tests',
    description: 'Browser and device compatibility tests',
    tests: [
      { id: 'COMP-101', name: 'Chrome Browser Testing', priority: 'P0', status: 'passed' },
      { id: 'COMP-102', name: 'Firefox Browser Testing', priority: 'P0', status: 'passed' },
      { id: 'COMP-103', name: 'Safari Browser Testing', priority: 'P0', status: 'failed' },
      { id: 'COMP-201', name: 'Mobile View - iPhone', priority: 'P1', status: 'failed' },
    ]
  }
};

// Get all test categories
router.get('/', (req, res) => {
  const categories = Object.keys(testCategories).map(key => ({
    id: key,
    name: testCategories[key].name,
    description: testCategories[key].description,
    total: testCategories[key].tests.length
  }));
  
  res.json({ categories });
});

// Get tests for a specific category
router.get('/category/:categoryId', (req, res) => {
  const { categoryId } = req.params;
  
  if (!testCategories[categoryId]) {
    return res.status(404).json({ error: 'Category not found' });
  }
  
  res.json({ 
    category: {
      id: categoryId,
      name: testCategories[categoryId].name,
      description: testCategories[categoryId].description
    }, 
    tests: testCategories[categoryId].tests 
  });
});

// Get a specific test
router.get('/test/:testId', (req, res) => {
  const { testId } = req.params;
  
  // Search for the test in all categories
  for (const categoryId in testCategories) {
    const test = testCategories[categoryId].tests.find(t => t.id === testId);
    if (test) {
      return res.json({ test, categoryId });
    }
  }
  
  res.status(404).json({ error: 'Test not found' });
});

// Get recent test runs
router.get('/runs', (req, res) => {
  // In a real application, this would be fetched from a database
  // Mock data for now
  const recentRuns = [
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
  
  res.json({ runs: recentRuns });
});

// Get a specific test run
router.get('/runs/:runId', (req, res) => {
  const { runId } = req.params;
  
  // In a real application, this would be fetched from a database
  // Mock data for now
  if (runId === 'run-123') {
    res.json({
      id: runId,
      category: 'functional',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'completed',
      startTime: new Date(Date.now() - 4000000).toISOString(),
      endTime: new Date(Date.now() - 3600000).toISOString(),
      tests: [
        {
          id: 'TC-101',
          name: 'Create Single Player Game',
          status: 'passed',
          results: {
            duration: 1250,
            assertions: 8,
            logs: ['Test TC-101 passed execution']
          }
        },
        {
          id: 'TC-102',
          name: 'Create Multiplayer Game',
          status: 'passed',
          results: {
            duration: 980,
            assertions: 6,
            logs: ['Test TC-102 passed execution']
          }
        },
        {
          id: 'TC-103',
          name: 'Join Multiplayer Game',
          status: 'failed',
          results: {
            duration: 870,
            assertions: 5,
            logs: ['Test TC-103 failed execution']
          },
          error: {
            message: 'Expected room to be joined, but got error response',
            stack: 'Error: Expected room to be joined, but got error response\n    at joinRoom (test.js:45)\n    at runTest (runner.js:78)'
          }
        }
      ],
      summary: {
        total: 48,
        passed: 39,
        failed: 9,
        duration: 400000
      }
    });
  } else {
    res.status(404).json({ error: 'Test run not found' });
  }
});

module.exports = router; 