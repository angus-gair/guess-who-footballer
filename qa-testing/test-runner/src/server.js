require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const basicAuth = require('express-basic-auth');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Import routes
const testRoutes = require('./routes/testRoutes');
const testRunnerRoutes = require('./routes/testRunnerRoutes');
const authRoutes = require('./routes/authRoutes');

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.'
});

// Apply rate limiting to API routes
app.use('/api/', apiLimiter);

// Basic authentication for test runner
const users = {};
users[process.env.AUTH_USERNAME || 'admin'] = process.env.AUTH_PASSWORD || 'password';

app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/tests', basicAuth({
  users,
  challenge: true,
  realm: 'Football Guess Who Test Runner'
}), testRoutes);

app.use('/api/run', basicAuth({
  users,
  challenge: true,
  realm: 'Football Guess Who Test Runner'
}), testRunnerRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Test runs storage
const testRuns = new Map();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Join test run room
  socket.on('joinTestRun', (testRunId) => {
    socket.join(testRunId);
    console.log(`Socket ${socket.id} joined test run ${testRunId}`);
  });
  
  // Start test run
  socket.on('startTestRun', ({ testIds, config }) => {
    const testRunId = uuidv4();
    
    // Create new test run
    testRuns.set(testRunId, {
      id: testRunId,
      status: 'running',
      startTime: new Date(),
      endTime: null,
      tests: testIds.map(id => ({
        id,
        status: 'pending',
        results: null,
        error: null
      })),
      config
    });
    
    socket.join(testRunId);
    io.to(testRunId).emit('testRunCreated', { testRunId, status: 'running' });
    
    // Simulate running tests one by one
    testIds.forEach((testId, index) => {
      setTimeout(() => {
        // Update test status
        const testRun = testRuns.get(testRunId);
        if (testRun) {
          const test = testRun.tests.find(t => t.id === testId);
          if (test) {
            // Simulate test execution (in a real scenario, this would call actual test code)
            const success = Math.random() > 0.3; // 70% chance of success
            test.status = success ? 'passed' : 'failed';
            test.results = {
              duration: Math.floor(Math.random() * 1000) + 100,
              assertions: Math.floor(Math.random() * 10) + 1,
              logs: [`Test ${testId} ${success ? 'passed' : 'failed'} execution`]
            };
            
            if (!success) {
              test.error = {
                message: `Test ${testId} failed with random error`,
                stack: 'Simulated stack trace for demonstration'
              };
            }
            
            // Emit test result
            io.to(testRunId).emit('testResult', { 
              testRunId, 
              testId, 
              status: test.status,
              results: test.results,
              error: test.error
            });
            
            // Check if all tests are complete
            if (testRun.tests.every(t => t.status !== 'pending')) {
              testRun.status = 'completed';
              testRun.endTime = new Date();
              io.to(testRunId).emit('testRunCompleted', { 
                testRunId, 
                status: 'completed',
                summary: {
                  total: testRun.tests.length,
                  passed: testRun.tests.filter(t => t.status === 'passed').length,
                  failed: testRun.tests.filter(t => t.status === 'failed').length,
                  duration: testRun.endTime - testRun.startTime
                }
              });
            }
          }
        }
      }, (index + 1) * 2000); // Run each test with a delay
    });
  });
  
  // Disconnect handling
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Test Runner server listening on port ${PORT}`);
});

module.exports = { app, server }; 