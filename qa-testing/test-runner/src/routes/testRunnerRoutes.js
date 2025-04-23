const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Store active test runs in memory (would be a database in production)
const activeTestRuns = new Map();

// Start a new test run
router.post('/start', (req, res) => {
  try {
    const { testIds, config } = req.body;
    
    if (!Array.isArray(testIds) || testIds.length === 0) {
      return res.status(400).json({ error: 'No test IDs provided' });
    }
    
    const testRunId = uuidv4();
    const testRun = {
      id: testRunId,
      status: 'created',
      startTime: new Date(),
      endTime: null,
      userId: req.auth?.user || 'anonymous',
      tests: testIds.map(id => ({
        id,
        status: 'pending',
        results: null
      })),
      config: config || {}
    };
    
    activeTestRuns.set(testRunId, testRun);
    
    // In a real implementation, this would trigger the test execution
    // For now, just return the created test run
    res.json({ testRunId, status: 'created' });
  } catch (error) {
    console.error('Error starting test run:', error);
    res.status(500).json({ error: 'Failed to start test run' });
  }
});

// Get status of a test run
router.get('/status/:testRunId', (req, res) => {
  try {
    const { testRunId } = req.params;
    const testRun = activeTestRuns.get(testRunId);
    
    if (!testRun) {
      return res.status(404).json({ error: 'Test run not found' });
    }
    
    res.json({ testRun });
  } catch (error) {
    console.error(`Error getting status for test run ${req.params.testRunId}:`, error);
    res.status(500).json({ error: 'Failed to get test run status' });
  }
});

// Stop a running test
router.post('/stop/:testRunId', (req, res) => {
  try {
    const { testRunId } = req.params;
    const testRun = activeTestRuns.get(testRunId);
    
    if (!testRun) {
      return res.status(404).json({ error: 'Test run not found' });
    }
    
    if (testRun.status === 'completed') {
      return res.status(400).json({ error: 'Test run already completed' });
    }
    
    testRun.status = 'stopped';
    testRun.endTime = new Date();
    
    // Update pending tests to stopped
    testRun.tests.forEach(test => {
      if (test.status === 'pending' || test.status === 'running') {
        test.status = 'stopped';
      }
    });
    
    activeTestRuns.set(testRunId, testRun);
    
    res.json({ testRunId, status: 'stopped' });
  } catch (error) {
    console.error(`Error stopping test run ${req.params.testRunId}:`, error);
    res.status(500).json({ error: 'Failed to stop test run' });
  }
});

// Get results of a specific test in a test run
router.get('/:testRunId/test/:testId', (req, res) => {
  try {
    const { testRunId, testId } = req.params;
    const testRun = activeTestRuns.get(testRunId);
    
    if (!testRun) {
      return res.status(404).json({ error: 'Test run not found' });
    }
    
    const test = testRun.tests.find(t => t.id === testId);
    
    if (!test) {
      return res.status(404).json({ error: 'Test not found in this test run' });
    }
    
    res.json({ test });
  } catch (error) {
    console.error(`Error getting test result for ${req.params.testId} in run ${req.params.testRunId}:`, error);
    res.status(500).json({ error: 'Failed to get test result' });
  }
});

// Get all test runs (with pagination)
router.get('/runs', (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    
    // Convert Map to Array and sort by start time (descending)
    const allRuns = Array.from(activeTestRuns.values())
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    
    // Paginate
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;
    const paginatedRuns = allRuns.slice(startIndex, endIndex);
    
    // Create response with pagination metadata
    const response = {
      runs: paginatedRuns.map(run => ({
        id: run.id,
        status: run.status,
        startTime: run.startTime,
        endTime: run.endTime,
        testsCount: run.tests.length,
        passedCount: run.tests.filter(t => t.status === 'passed').length,
        failedCount: run.tests.filter(t => t.status === 'failed').length
      })),
      pagination: {
        total: allRuns.length,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(allRuns.length / limitNum)
      }
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('Error fetching test runs:', error);
    res.status(500).json({ error: 'Failed to fetch test runs' });
  }
});

// Simulate test execution with random pass/fail results
function simulateTestExecution(testRunId, testRun) {
  const tests = testRun.tests;
  
  // Process each test sequentially with delays
  tests.forEach((test, index) => {
    setTimeout(() => {
      // Simulate 80% pass rate
      const passed = Math.random() > 0.2;
      
      // Update test status
      test.status = passed ? 'passed' : 'failed';
      test.results = {
        duration: Math.floor(Math.random() * 5000) + 500, // 500-5500ms
        assertions: Math.floor(Math.random() * 15) + 1,
        logs: [
          `Test ${test.id} started`,
          `Running test steps...`,
          passed ? `Test ${test.id} passed successfully` : `Test ${test.id} failed`
        ]
      };
      
      if (!passed) {
        test.error = {
          message: `Test ${test.id} failed with error`,
          stack: `Error: Test assertion failed\n    at TestRunner.execute (test-runner.js:42:12)\n    at async runTest (runner.js:28:7)`
        };
      }
      
      // Check if all tests are complete
      if (tests.every(t => t.status !== 'pending')) {
        testRun.status = 'completed';
        testRun.endTime = new Date();
      }
      
    }, (index + 1) * 2000); // Run each test with a 2-second delay
  });
}

module.exports = router; 