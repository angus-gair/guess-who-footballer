# Football Guess Who - QA Testing Strategy

## 1. Overview

This document outlines the comprehensive testing strategy for the "Football Guess Who" game. The goal is to ensure high-quality, reliable gameplay across all platforms and user scenarios, covering functional, performance, security, and accessibility aspects.

## 2. Testing Scope

### In Scope
- Frontend user interface and interactions
- Backend API and database operations
- Real-time socket communication
- Game logic and rules implementation
- Single-player AI functionality
- Multiplayer gameplay
- Cross-browser and cross-device compatibility
- Accessibility compliance
- Performance under various conditions
- Security of user data and game operations

### Out of Scope
- Third-party integrations not directly related to game functionality
- Server infrastructure beyond application-level testing
- Long-term stress testing (beyond defined load testing)

## 3. Testing Types

### 3.1 Functional Testing

#### Core Game Mechanics
- Game initialization in both single-player and multiplayer modes
- Footballer card display and selection
- Question selection, submission, and answer handling
- Card elimination logic
- Turn-based gameplay
- Win/lose conditions
- Rematch functionality

#### User Interface
- Component rendering and responsiveness
- Navigation between screens
- Modal dialogs and pop-ups
- Form validation and submission
- Error handling and messaging

### 3.2 Integration Testing
- Frontend-to-Backend API communication
- Socket.io event handling
- Database operations
- Authentication flow (if implemented)
- Game state synchronization between clients

### 3.3 Performance Testing
- Load testing for concurrent game sessions
- Response time measurement
- WebSocket connection stability
- Resource usage (memory, CPU)
- Mobile device performance
- Connection degradation simulation

### 3.4 Security Testing
- Input validation and sanitization
- WebSocket message validation
- Session management
- Prevention of game state manipulation
- Rate limiting and protection against abuse

### 3.5 Accessibility Testing
- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation
- Color contrast verification
- Focus management

### 3.6 Compatibility Testing
- Browser testing (Chrome, Firefox, Safari, Edge)
- Mobile device testing (iOS, Android)
- Responsive design verification
- Different screen sizes and resolutions

## 4. Test Environments

### Development Environment
- Purpose: Developer testing and unit tests
- Infrastructure: Local development setup
- Data: Mock data sets
- Access: Development team

### Testing Environment
- Purpose: QA testing and automation
- Infrastructure: Dedicated test servers
- Data: Test datasets separated from production
- Access: QA team, developers

### Staging Environment
- Purpose: Pre-production validation
- Infrastructure: Production-like setup
- Data: Anonymized production-like data
- Access: QA team, developers, select stakeholders

## 5. Testing Tools and Frameworks

### Frontend Testing
- **Unit Testing**: Jest, React Testing Library
- **Component Testing**: Storybook
- **End-to-End Testing**: Cypress
- **Visual Regression**: Percy or Chromatic
- **Accessibility Testing**: axe-core, pa11y

### Backend Testing
- **Unit Testing**: Jest
- **API Testing**: Supertest
- **Load Testing**: k6 or Artillery
- **Security Testing**: OWASP ZAP

### Real-time Communication Testing
- **Socket Testing**: Socket.io client for automated tests
- **Network Condition Simulation**: Chrome DevTools, Network Link Conditioner

### Continuous Integration
- GitHub Actions for test automation
- Test report generation

## 6. Test Data Management

### Test Data Sets
- Footballer profiles with varied attributes
- Predefined question sets
- Game session templates
- User profiles for multiplayer testing
- Edge case data for boundary testing

### Test Data Storage
- Version-controlled JSON data files
- Test database with reset capability
- Seeding scripts for environment preparation

### Data Privacy
- No personally identifiable information in test data
- Anonymization of any production data used in testing

## 7. Test Execution Strategy

### Test Case Prioritization
- Critical path testing (P0)
- Core functionality testing (P1)
- Extended functionality testing (P2)
- Edge case and exceptional flow testing (P3)

### Test Cycles
- Developer testing: On every PR
- Regression testing: Weekly
- Full test suite: Before major releases
- Exploratory testing: Bi-weekly

### Defect Management
- Severity classification (Critical, High, Medium, Low)
- Prioritization based on impact and frequency
- Verification process for fixed defects

## 8. Automation Strategy

### Automation Scope
- Unit tests: 90% coverage target
- API tests: All endpoints
- End-to-End tests: Critical user journeys
- Integration tests: Core functionality

### Automation Framework Design
- Page Object Model for UI testing
- API client libraries for backend testing
- Shared utilities for common operations
- Custom assertions for game state validation

### Continuous Integration
- Pre-commit hooks for linting and unit tests
- PR validation with automated test suite
- Nightly runs of full regression suite

## 9. Risk Assessment and Mitigation

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|------------|---------------------|
| WebSocket connection issues | High | Medium | Implement reconnection logic, extensive testing with network interruptions |
| Browser compatibility problems | Medium | Medium | Cross-browser testing, use of modern web standards |
| Performance degradation with many concurrent users | High | Low | Load testing, performance optimization, scalability design |
| Game state desynchronization | High | Medium | Robust state management, verification checks, reconciliation mechanisms |
| Accessibility barriers | Medium | Medium | Regular accessibility audits, inclusion in automated tests |

## 10. Test Deliverables

- Test strategy document (this document)
- Test plans for each testing type
- Test cases in test management system
- Automated test scripts in source control
- Test execution reports
- Defect reports
- Test summary reports for releases

## 11. Test Schedule and Milestones

| Milestone | Description | Timeline |
|-----------|------------|----------|
| Test planning complete | All test plans and initial test cases created | Week 1 |
| Automation framework setup | Basic framework for automated testing established | Week 2 |
| First test cycle | Initial testing of core functionality | Week 3 |
| Automation implementation | Critical test cases automated | Weeks 4-5 |
| Regression test suite | Complete regression test suite ready | Week 6 |
| Performance testing | Load and stress testing completed | Week 7 |
| Release candidate testing | Final testing before release | Week 8 |

## 12. Team Structure and Responsibilities

- QA Lead: Strategy, planning, reporting
- QA Engineers: Test case development, manual testing, automation
- Developers: Unit testing, fixing identified defects
- DevOps: Test environment maintenance
- UX Designers: Accessibility testing support

---

# Test Cases for Key User Flows

## 1. Game Creation and Setup

### TC-101: Create Single Player Game
**Priority:** P0 | **Type:** Functional | **Automation:** Yes

**Preconditions:**
- User is on the home page
- Single player mode is available

**Steps:**
1. Click "Create New Game" button
2. Enter display name "TestPlayer"
3. Select "Single Player" mode
4. Select difficulty level "Medium"
5. Click "Create Game" button

**Expected Results:**
- Game is created successfully
- User is redirected to game page
- Game board displays with 24 footballer cards
- User's turn is indicated
- AI opponent is initialized

**Data Requirements:**
- Valid display name
- Available difficulty levels

### TC-102: Create Multiplayer Game
**Priority:** P0 | **Type:** Functional | **Automation:** Yes

**Preconditions:**
- User is on the home page
- Multiplayer mode is available

**Steps:**
1. Click "Create New Game" button
2. Enter display name "TestPlayer1"
3. Select "Multiplayer" mode
4. Click "Create Game" button

**Expected Results:**
- Game is created successfully
- User is redirected to waiting screen
- Room code is displayed
- "Waiting for opponent" message is shown

**Data Requirements:**
- Valid display name

### TC-103: Join Multiplayer Game
**Priority:** P0 | **Type:** Functional | **Automation:** Yes

**Preconditions:**
- An active multiplayer game exists
- User has a valid room code
- User is on the home page

**Steps:**
1. Click "Join Game" button
2. Enter display name "TestPlayer2"
3. Enter the room code
4. Click "Join Game" button

**Expected Results:**
- User successfully joins the game
- Both players are redirected to game page
- Game board displays with 24 footballer cards
- Turn indicator shows whose turn it is

**Data Requirements:**
- Valid display name
- Valid room code

### TC-104: Invalid Room Code Handling
**Priority:** P1 | **Type:** Error Handling | **Automation:** Yes

**Preconditions:**
- User is on the home page

**Steps:**
1. Click "Join Game" button
2. Enter display name "TestPlayer"
3. Enter an invalid room code "INVALID"
4. Click "Join Game" button

**Expected Results:**
- Error message displayed
- User remains on join game screen
- Form is not reset, allowing correction

**Data Requirements:**
- Invalid room code

## 2. Gameplay Mechanics

### TC-201: Ask a Question
**Priority:** P0 | **Type:** Functional | **Automation:** Yes

**Preconditions:**
- User is in an active game
- It is the user's turn

**Steps:**
1. Select "Position" category from question selection
2. Select question "Is the player a forward?"
3. Click "Ask Question" button

**Expected Results:**
- Question is sent to opponent/AI
- Turn status changes to opponent's turn
- Question appears in history with answer when received

**Data Requirements:**
- Valid game session
- Available question categories

### TC-202: Answer a Question
**Priority:** P0 | **Type:** Functional | **Automation:** Yes

**Preconditions:**
- User is in an active game
- Opponent has asked a question
- It is user's turn to answer

**Steps:**
1. View the question asked by opponent
2. Click "YES" or "NO" button based on secret footballer

**Expected Results:**
- Answer is sent to opponent
- Cards are eliminated appropriately on opponent's board
- Turn changes to user's turn for asking a question

**Data Requirements:**
- Valid game session
- Asked question

### TC-203: Card Elimination
**Priority:** P0 | **Type:** Functional | **Automation:** Yes

**Preconditions:**
- User is in an active game
- User has received an answer to a question

**Steps:**
1. Observe the board after receiving an answer
2. Verify eliminated cards based on the answer

**Expected Results:**
- If answer is "YES", cards not matching the criteria are eliminated
- If answer is "NO", cards matching the criteria are eliminated
- Eliminated cards show visual indication (grayed out with X)
- Card count updates appropriately

**Data Requirements:**
- Game session with asked question and received answer

### TC-204: Make a Guess
**Priority:** P0 | **Type:** Functional | **Automation:** Yes

**Preconditions:**
- User is in an active game
- It is the user's turn
- Some cards have been eliminated

**Steps:**
1. Click "Make a Guess" button
2. Select a footballer card from the board
3. Click "Confirm Guess" button

**Expected Results:**
- If guess is correct, user wins the game
- If guess is incorrect, user loses the game
- Game over screen is displayed with appropriate message
- Option to rematch is provided

**Data Requirements:**
- Valid game session with eliminated cards

### TC-205: Game Timer Functionality
**Priority:** P1 | **Type:** Functional | **Automation:** Yes

**Preconditions:**
- User is in an active game with timer enabled
- It is the user's turn

**Steps:**
1. Observe the timer counting down
2. Do not take any action until timer expires

**Expected Results:**
- Timer visually counts down
- Warning indication when time is running low
- When timer expires, turn automatically changes to opponent
- Appropriate message shown to both players

**Data Requirements:**
- Game session with turn timer enabled

## 3. Game Completion and Post-Game

### TC-301: Win Condition
**Priority:** P0 | **Type:** Functional | **Automation:** Yes

**Preconditions:**
- User is in an active game
- User is about to make a correct guess

**Steps:**
1. Make a correct guess about opponent's footballer
2. Observe game end sequence

**Expected Results:**
- "You Won!" message displayed
- Opponent's secret footballer is revealed
- Game statistics are shown
- Options for rematch and return to home are provided

**Data Requirements:**
- Game session near completion
- Knowledge of opponent's footballer

### TC-302: Lose Condition
**Priority:** P0 | **Type:** Functional | **Automation:** Yes

**Preconditions:**
- User is in an active game
- Opponent is about to make a correct guess

**Steps:**
1. Opponent makes a correct guess about user's footballer
2. Observe game end sequence

**Expected Results:**
- "You Lost!" message displayed
- User's secret footballer is confirmed
- Game statistics are shown
- Options for rematch and return to home are provided

**Data Requirements:**
- Game session near completion

### TC-303: Request Rematch
**Priority:** P1 | **Type:** Functional | **Automation:** Yes

**Preconditions:**
- A game has just completed
- User is on the game over screen

**Steps:**
1. Click "Rematch" button
2. Wait for opponent's response

**Expected Results:**
- Rematch request is sent
- "Waiting for opponent" message shown
- If opponent accepts, new game is initialized with same players
- If opponent declines, appropriate message is shown

**Data Requirements:**
- Completed game session

## 4. Error Handling and Edge Cases

### TC-401: Network Disconnection During Game
**Priority:** P1 | **Type:** Error Handling | **Automation:** Yes

**Preconditions:**
- User is in an active game
- WebSocket connection is established

**Steps:**
1. Simulate network disconnection (disable network)
2. Wait for reconnection attempts
3. Re-enable network

**Expected Results:**
- Disconnection indication shown to user
- Automatic reconnection attempts made
- Upon successful reconnection, game state is restored
- Game continues from where it left off

**Data Requirements:**
- Active game session
- Network manipulation capability

### TC-402: Player Abandons Game
**Priority:** P1 | **Type:** Error Handling | **Automation:** Yes

**Preconditions:**
- Two players are in an active multiplayer game

**Steps:**
1. Second player closes browser/navigates away
2. Observe first player's experience

**Expected Results:**
- First player receives notification about opponent leaving
- Option to return to home screen
- Game resources properly cleaned up

**Data Requirements:**
- Active multiplayer game session

### TC-403: Invalid Question Submission
**Priority:** P2 | **Type:** Security | **Automation:** Yes

**Preconditions:**
- User is in an active game
- It is user's turn to ask a question

**Steps:**
1. Intercept and modify outgoing WebSocket message
2. Submit invalid question data

**Expected Results:**
- Server validates and rejects invalid question
- Error message shown to user
- Game state remains unchanged
- No security bypass possible

**Data Requirements:**
- Active game session
- Network interception capability

## 5. Accessibility Testing

### TC-501: Keyboard Navigation
**Priority:** P1 | **Type:** Accessibility | **Automation:** Yes

**Preconditions:**
- User is on the home page

**Steps:**
1. Navigate through all interactive elements using only tab key
2. Activate buttons and controls using enter/space
3. Complete full game creation flow with keyboard only

**Expected Results:**
- All interactive elements are focusable with tab key
- Focus order is logical and follows visual layout
- Focus indication is clearly visible
- All functions can be accessed without mouse

**Data Requirements:**
- N/A

### TC-502: Screen Reader Compatibility
**Priority:** P1 | **Type:** Accessibility | **Automation:** Partial

**Preconditions:**
- User has screen reader enabled (NVDA, JAWS, VoiceOver)
- User is on various game screens

**Steps:**
1. Navigate home page with screen reader
2. Create a game and navigate game board
3. Interact with question interface and footballer cards

**Expected Results:**
- All UI elements are properly announced
- Dynamic content changes are communicated
- Game state is comprehensible through audio alone
- No information is conveyed solely through visual means

**Data Requirements:**
- Screen reader software

## 6. Performance Testing

### TC-601: Multiple Concurrent Games
**Priority:** P1 | **Type:** Performance | **Automation:** Yes

**Preconditions:**
- Test environment is available
- Test accounts are ready

**Steps:**
1. Simulate 50 concurrent game sessions
2. Monitor server response times
3. Validate game functionality during load

**Expected Results:**
- Server handles concurrent connections without failures
- Response times remain within acceptable limits
- No game-breaking issues occur under load
- Resource utilization remains within planned limits

**Data Requirements:**
- Load testing scripts
- Monitoring tools configuration

### TC-602: Mobile Device Performance
**Priority:** P1 | **Type:** Performance | **Automation:** Partial

**Preconditions:**
- Mobile device or emulator available
- Game is accessible on mobile browser

**Steps:**
1. Load the game on mobile device
2. Complete full game flow
3. Monitor resource usage (memory, CPU)

**Expected Results:**
- Game is responsive and playable on mobile
- No excessive battery drainage
- No memory leaks over extended play
- Frame rate remains smooth throughout

**Data Requirements:**
- Mobile device or emulator
- Performance monitoring tools

---

# Automation Framework Setup

## 1. Frontend Automation Setup

### 1.1 Unit and Component Testing

We'll use Jest and React Testing Library for unit and component tests to validate individual components and their interactions. This setup will provide rapid feedback during development.

#### Setup Instructions

```bash
# Install required dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest

# Update package.json with test scripts
```

```json
// package.json test scripts
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

#### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/serviceWorker.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

#### Example Unit Test

```typescript
// src/components/common/Button.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button component', () => {
  test('renders with primary variant by default', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary-blue');
  });

  test('renders with secondary variant when specified', () => {
    render(<Button variant="secondary">Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toHaveClass('border-primary-blue');
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('shows loading state when isLoading is true', () => {
    render(<Button isLoading>Click me</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
```

### 1.2 End-to-End Testing with Cypress

Cypress will be used for end-to-end testing to validate complete user flows and interactions.

#### Setup Instructions

```bash
# Install Cypress and related dependencies
npm install --save-dev cypress @testing-library/cypress cypress-localstorage-commands
```

```json
// package.json
"scripts": {
  "cypress:open": "cypress open",
  "cypress:run": "cypress run"
}
```

#### Cypress Configuration

```javascript
// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
  },
});
```

#### Example E2E Test

```typescript
// cypress/e2e/create-game.cy.ts
describe('Game Creation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should create a single player game successfully', () => {
    // Open create game modal
    cy.findByText('Create New Game').click();
    
    // Fill form
    cy.findByLabelText('Your Name').type('TestPlayer');
    cy.findByText('Single Player').click();
    cy.findByText('Medium').click();
    
    // Submit form
    cy.findByText('Create Game').click();
    
    // Verify we're on the game page
    cy.url().should('include', '/game/');
    cy.findByText('YOUR TURN').should('be.visible');
    cy.get('[data-testid^="footballer-card-"]').should('have.length', 24);
  });
  
  it('should handle invalid inputs in create game form', () => {
    cy.findByText('Create New Game').click();
    cy.findByText('Create Game').click();
    
    // Should show validation error if name is not provided
    cy.findByText('Name is required').should('be.visible');
  });
});
```

## 2. Backend Automation Setup

### 2.1 API and Integration Testing

We'll use Jest and Supertest to test the backend API endpoints and integration points.

#### Setup Instructions

```bash
# Install required dependencies
npm install --save-dev jest supertest @types/jest @types/supertest
```

```json
// package.json test scripts for backend
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

#### Example API Test

```typescript
// src/controllers/game.test.ts
import request from 'supertest';
import app from '../app';
import { prisma } from '../config/database';

// Mock database operations
jest.mock('../config/database', () => ({
  prisma: {
    gameRoom: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

describe('Game Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/games', () => {
    it('should create a new single player game', async () => {
      const mockGameRoom = {
        id: 'game-id-123',
        roomCode: 'ABC123',
        mode: 'SP',
        state: 'WAITING',
        // ... other fields
      };
      
      (prisma.gameRoom.create as jest.Mock).mockResolvedValue(mockGameRoom);
      
      const response = await request(app)
        .post('/api/games')
        .send({
          mode: 'SP',
          displayName: 'TestPlayer',
          settings: { difficulty: 'medium' }
        });
      
      expect(response.status).toBe(201);
      expect(response.body.gameRoom.id).toBe('game-id-123');
      expect(response.body.gameRoom.mode).toBe('SP');
    });
    
    it('should return 400 for invalid input', async () => {
      const response = await request(app)
        .post('/api/games')
        .send({
          // Missing required fields
        });
      
      expect(response.status).toBe(400);
    });
  });
});
```

### 2.2 WebSocket Testing

To test the WebSocket functionality, we'll use Socket.io-client in our test environment.

#### Setup Instructions

```bash
# Install socket.io-client for testing
npm install --save-dev socket.io-client @types/socket.io-client
```

#### Example WebSocket Test

```typescript
// src/socket/handlers.test.ts
import { io as Client, Socket as ClientSocket } from 'socket.io-client';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setupSocketHandlers } from './handlers';

describe('Socket Handlers', () => {
  let httpServer;
  let ioServer: Server;
  let clientSocket: ClientSocket;
  let serverSocket;

  beforeAll((done) => {
    httpServer = createServer();
    ioServer = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = Client(`http://localhost:${port}`);
      
      ioServer.on('connection', (socket) => {
        serverSocket = socket;
      });
      
      clientSocket.on('connect', done);
    });
    
    // Setup socket handlers
    setupSocketHandlers(ioServer);
  });

  afterAll(() => {
    ioServer.close();
    clientSocket.close();
    httpServer.close();
  });

  test('should handle JOIN_GAME event correctly', (done) => {
    clientSocket.emit('join_game', { roomId: 'test-room', playerName: 'TestPlayer' });
    
    clientSocket.on('player_joined', (data) => {
      expect(data.roomId).toBe('test-room');
      expect(data.playerName).toBe('TestPlayer');
      done();
    });
  });
});
```

## 3. Performance and Load Testing

### 3.1 Load Testing with k6

We'll use k6 for load testing to simulate multiple concurrent users and game sessions.

#### Setup Instructions

```bash
# Install k6 (varies by OS, here's an example for macOS)
brew install k6
```

#### Example k6 Load Test Script

```javascript
// tests/performance/game-load.js
import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter, Rate } from 'k6/metrics';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.1.0/index.js';

// Custom metrics
const createGameErrors = new Counter('create_game_errors');
const joinGameErrors = new Counter('join_game_errors');
const requestsSuccess = new Rate('requests_success');

export const options = {
  stages: [
    { duration: '30s', target: 10 }, // Ramp up to 10 users over 30 seconds
    { duration: '1m', target: 50 },  // Ramp up to 50 users over 1 minute
    { duration: '2m', target: 50 },  // Stay at 50 users for 2 minutes
    { duration: '30s', target: 0 },  // Ramp down to 0 users
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'], // 95% of requests should be below 500ms
    'requests_success': ['rate>0.95'],   // 95% of requests should be successful
  },
};

export default function() {
  const baseUrl = 'http://localhost:3001/api';
  
  // Create a game
  const displayName = `Player_${randomString(6)}`;
  const createGameRes = http.post(`${baseUrl}/games`, JSON.stringify({
    mode: 'MP',
    displayName: displayName,
  }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  // Check if create game succeeded
  const createSuccess = check(createGameRes, {
    'create game status is 201': (r) => r.status === 201,
    'create game has valid roomCode': (r) => r.json('gameRoom.roomCode') !== undefined,
  });
  
  if (!createSuccess) {
    createGameErrors.add(1);
  }
  
  requestsSuccess.add(createSuccess);
  
  // Extract room code from response
  const roomCode = createGameRes.json('gameRoom.roomCode');
  
  sleep(1); // Wait 1 second
  
  // If game was created successfully, simulate another player joining
  if (roomCode) {
    const joinGameRes = http.post(`${baseUrl}/games/join/${roomCode}`, JSON.stringify({
      displayName: `Opponent_${randomString(6)}`,
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Check if join game succeeded
    const joinSuccess = check(joinGameRes, {
      'join game status is 200': (r) => r.status === 200,
    });
    
    if (!joinSuccess) {
      joinGameErrors.add(1);
    }
    
    requestsSuccess.add(joinSuccess);
  }
  
  sleep(3); // Wait 3 seconds between iterations
}
```

## 4. Accessibility Testing

### 4.1 Automated Accessibility Testing with axe

We'll integrate axe-core with our test suite to automatically check for accessibility issues.

#### Setup Instructions

```bash
# Install axe-core for React
npm install --save-dev @axe-core/react
```

#### Integration with React App

```typescript
// src/index.tsx (for development only)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

if (process.env.NODE_ENV !== 'production') {
  import('@axe-core/react').then(axe => {
    axe.default(React, ReactDOM, 1000);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### Integration with Cypress

```bash
# Install cypress-axe
npm install --save-dev cypress-axe
```

```typescript
// cypress/support/e2e.ts
import 'cypress-axe';
```

```typescript
// cypress/e2e/accessibility.cy.ts
describe('Accessibility Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  it('Home page should not have accessibility violations', () => {
    cy.checkA11y();
  });

  it('Game page should not have accessibility violations', () => {
    // Create a game
    cy.findByText('Create New Game').click();
    cy.findByLabelText('Your Name').type('TestPlayer');
    cy.findByText('Single Player').click();
    cy.findByText('Create Game').click();
    
    // Wait for game to load
    cy.findByText('YOUR TURN', { timeout: 10000 }).should('be.visible');
    
    // Check accessibility
    cy.injectAxe();
    cy.checkA11y();
  });
});
```

## 5. Test Data Management

### 5.1 Footballer Test Data

We'll create a standardized set of test footballers with various attributes to enable thorough testing of the question and elimination mechanics.

```json
// testData/footballers.json
[
  {
    "id": "f1",
    "name": "Test Player 1",
    "image": "/images/test-player-1.jpg",
    "club": "Test Club A",
    "nation": "England",
    "position": "FWD",
    "ageBracket": "Under 30",
    "hairColor": "Brown",
    "facialHair": true,
    "bootsColor": "Red"
  },
  {
    "id": "f2",
    "name": "Test Player 2",
    "image": "/images/test-player-2.jpg",
    "club": "Test Club B",
    "nation": "France",
    "position": "MID",
    "ageBracket": "Over 30",
    "hairColor": "Black",
    "facialHair": false,
    "bootsColor": "Black"
  },
  // ... more test footballers
]
```

### 5.2 Question Test Data

```json
// testData/questions.json
[
  {
    "id": "q1",
    "text": "Is the player a forward?",
    "category": "Position",
    "trait": "position",
    "expectedValues": ["FWD"]
  },
  {
    "id": "q2",
    "text": "Does the player have facial hair?",
    "category": "Physical Features",
    "trait": "facialHair",
    "expectedValues": [true]
  },
  // ... more test questions
]
```

### 5.3 Database Seeding for Tests

```typescript
// scripts/seedTestDatabase.ts
import { prisma } from '../src/config/database';
import footballers from './testData/footballers.json';
import questions from './testData/questions.json';

async function seedDatabase() {
  console.log('Seeding test database...');
  
  // Clear existing data
  await prisma.question.deleteMany();
  await prisma.footballer.deleteMany();
  
  // Seed footballers
  for (const footballer of footballers) {
    await prisma.footballer.create({
      data: footballer
    });
  }
  console.log(`Seeded ${footballers.length} footballers`);
  
  // Seed questions
  for (const question of questions) {
    await prisma.question.create({
      data: question
    });
  }
  console.log(`Seeded ${questions.length} questions`);
  
  console.log('Database seeding completed');
}

seedDatabase()
  .catch(e => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## 6. Continuous Integration Setup

### 6.1 GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test-frontend:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: '**/package-lock.json'
    
    - name: Install dependencies
      run: cd frontend && npm ci
      
    - name: Run linting
      run: cd frontend && npm run lint
      
    - name: Run unit tests
      run: cd frontend && npm run test
      
    - name: Build frontend
      run: cd frontend && npm run build
      
    - name: Start frontend for E2E tests
      run: cd frontend && npm run preview &
      
    - name: Run Cypress tests
      run: cd frontend && npm run cypress:run
      
    - name: Upload test artifacts
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: frontend-test-results
        path: |
          frontend/cypress/videos/
          frontend/cypress/screenshots/
          frontend/coverage/
  
  test-backend:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_USER: postgres
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - uses: actions/checkout@v3
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: '**/package-lock.json'
    
    - name: Install dependencies
      run: cd backend && npm ci
      
    - name: Setup test database
      run: cd backend && npx prisma migrate deploy
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
        
    - name: Seed test data
      run: cd backend && node scripts/seedTestDatabase.js
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
      
    - name: Run linting
      run: cd backend && npm run lint
      
    - name: Run unit and integration tests
      run: cd backend && npm run test
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
        JWT_SECRET: test_secret
      
    - name: Upload test artifacts
      uses: actions/upload-artifact@v3
      with:
        name: backend-test-results
        path: backend/coverage/
```

This comprehensive automation framework setup provides:

1. **Unit and component testing** for frontend components
2. **End-to-end testing** for critical user flows
3. **API and integration testing** for backend functionality  
4. **WebSocket testing** for real-time communication
5. **Performance testing** for load and stress scenarios
6. **Accessibility testing** for WCAG compliance
7. **Continuous Integration** via GitHub Actions
8. **Test data management** with standardized datasets and database seeding

This setup enables efficient testing across all aspects of the Football Guess Who game application while ensuring high quality, reliability, and accessibility. 

# Test Environment Configuration

## 1. Development Environment

### 1.1 Local Development Setup

```bash
# Frontend setup
cd frontend
npm install
npm run dev

# Backend setup (in separate terminal)
cd backend
npm install
npm run dev
```

### 1.2 Environment Variables

```env
# .env.test for backend
NODE_ENV=test
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/guess_who_test
CORS_ORIGIN=http://localhost:5173
```

```env
# .env.test for frontend
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
VITE_ENV=test
```

## 2. Testing Environment Infrastructure

### 2.1 Containerized Testing Environment

```yaml
# docker-compose.test.yml
version: '3.8'

services:
  frontend-test:
    build:
      context: ./frontend
      dockerfile: Dockerfile.test
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://backend-test:3001/api
      - VITE_SOCKET_URL=http://backend-test:3001
      - VITE_ENV=test
    depends_on:
      - backend-test

  backend-test:
    build:
      context: ./backend
      dockerfile: Dockerfile.test
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=test
      - PORT=3001
      - DATABASE_URL=postgresql://postgres:postgres@db-test:5432/guess_who_test
      - CORS_ORIGIN=http://frontend-test:5173
    depends_on:
      - db-test

  db-test:
    image: postgres:14
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=guess_who_test
    volumes:
      - pg-test-data:/var/lib/postgresql/data

volumes:
  pg-test-data:
```

### 2.2 Test Database Setup Script

```bash
#!/bin/bash
# setup-test-db.sh

set -e

echo "Setting up test database..."

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h db-test -U postgres; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is up - executing migrations"

# Run migrations
cd backend
npx prisma migrate deploy

# Seed test data
node scripts/seedTestDatabase.js

echo "Test database setup complete"
```

## 3. Continuous Integration Configuration

### 3.1 Pre-commit Hooks Setup

```bash
# Install husky and lint-staged
npm install --save-dev husky lint-staged

# Configure husky
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ],
    "*.{css,scss}": [
      "prettier --write"
    ]
  }
}
```

### 3.2 Test Reporting Configuration

```javascript
// jest.config.js additional configuration for reporting
module.exports = {
  // ... existing configuration
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'reports/junit',
      outputName: 'jest-junit.xml',
    }],
    ['jest-html-reporter', {
      pageTitle: 'Test Report',
      outputPath: 'reports/html/test-report.html',
    }]
  ],
};
```

## 4. Network Condition Simulation

### 4.1 Browser DevTools Configuration

Chrome DevTools network throttling presets for testing:

| Profile | Download | Upload | Latency |
|---------|----------|--------|---------|
| Fast 3G | 1.5 Mbps | 750 Kbps | 300ms |
| Slow 3G | 400 Kbps | 400 Kbps | 600ms |
| Offline | - | - | - |

### 4.2 Network Simulation Script

```javascript
// cypress/e2e/network-conditions.cy.ts
describe('Network Conditions Testing', () => {
  it('should handle slow network gracefully', () => {
    // Set up slow network conditions
    cy.intercept('**', (req) => {
      req.on('response', (res) => {
        // Delay the response by 1 second
        res.setDelay(1000);
      });
    });

    // Visit the site
    cy.visit('/');
    
    // Check that loading indicators appear
    cy.get('[data-testid="loading-spinner"]').should('be.visible');
    
    // Check that the site eventually loads
    cy.findByText('Create New Game', { timeout: 10000 }).should('be.visible');
  });
  
  it('should handle connection loss and reconnection', () => {
    // Start with normal connection
    cy.visit('/');
    cy.findByText('Create New Game').click();
    cy.findByLabelText('Your Name').type('TestPlayer');
    cy.findByText('Single Player').click();
    cy.findByText('Create Game').click();
    
    // Simulate connection loss
    cy.intercept('**/socket.io/**', (req) => {
      req.destroy();
    });
    
    // Check that connection loss is indicated
    cy.findByText('Connection Lost', { timeout: 10000 }).should('be.visible');
    
    // Restore connection
    cy.intercept('**/socket.io/**').as('socketReconnect');
    
    // Check that reconnection happens
    cy.wait('@socketReconnect');
    cy.findByText('Connection Restored', { timeout: 10000 }).should('be.visible');
  });
});
```

## 5. Mobile Device Emulation

### 5.1 Cypress Viewport Configuration

```javascript
// cypress.config.js addition
const viewports = {
  'iphone-x': {
    width: 375,
    height: 812
  },
  'ipad-pro': {
    width: 1024,
    height: 1366
  },
  'samsung-s10': {
    width: 360,
    height: 760
  }
};

module.exports = defineConfig({
  e2e: {
    // ... existing config
    viewportWidth: 1280,
    viewportHeight: 720,
  },
  // Make viewports available to all tests
  env: {
    viewports
  }
});
```

### 5.2 Responsive Testing Example

```typescript
// cypress/e2e/responsive.cy.ts
describe('Responsive Design Tests', () => {
  const devices = [
    { name: 'iphone-x', orientation: 'portrait' },
    { name: 'ipad-pro', orientation: 'landscape' },
    { name: 'samsung-s10', orientation: 'portrait' },
    { name: 'desktop', width: 1280, height: 800 }
  ];

  devices.forEach((device) => {
    context(`Device: ${device.name}`, () => {
      beforeEach(() => {
        if (device.width) {
          cy.viewport(device.width, device.height);
        } else {
          cy.viewport(device.name as any, device.orientation as any);
        }
        cy.visit('/');
      });

      it('should display the home page correctly', () => {
        cy.findByText('Football Guess Who').should('be.visible');
        cy.findByText('Create New Game').should('be.visible');
        
        // Check for hamburger menu on mobile
        if (['iphone-x', 'samsung-s10'].includes(device.name)) {
          cy.get('[data-testid="mobile-menu-button"]').should('be.visible');
          cy.get('[data-testid="desktop-nav"]').should('not.be.visible');
        } else {
          cy.get('[data-testid="desktop-nav"]').should('be.visible');
          cy.get('[data-testid="mobile-menu-button"]').should('not.exist');
        }
      });

      it('should display game board with correct layout', () => {
        // Create game
        cy.findByText('Create New Game').click();
        cy.findByLabelText('Your Name').type('TestPlayer');
        cy.findByText('Single Player').click();
        cy.findByText('Create Game').click();

        // Wait for game to load
        cy.findByText('YOUR TURN', { timeout: 10000 }).should('be.visible');
        
        // Check for grid layout differences
        if (['iphone-x', 'samsung-s10'].includes(device.name)) {
          // Mobile should have fewer columns
          cy.get('[data-testid="game-board"]').should('have.class', 'grid-cols-2');
        } else if (device.name === 'ipad-pro') {
          // Tablet should have medium columns
          cy.get('[data-testid="game-board"]').should('have.class', 'grid-cols-4');
        } else {
          // Desktop should have more columns
          cy.get('[data-testid="game-board"]').should('have.class', 'grid-cols-6');
        }
      });
    });
  });
});
```

This comprehensive test environment configuration ensures consistent testing across different environments, devices, and network conditions, supporting both manual and automated testing processes. 