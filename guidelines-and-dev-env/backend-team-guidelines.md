# Backend Development Team Guidelines

## Overview

The backend team is responsible for developing the server-side components of the Football Guess Who game. This includes the API, game logic, database interactions, and real-time communication system.

## Tech Stack

- **Node.js (v18+)** with Express
- **TypeScript** for type safety
- **PostgreSQL** database
- **Prisma** as ORM
- **Socket.io** for real-time functionality
- **Jest** for testing

## Architecture Overview

The backend follows a modular, controller-service-repository pattern:

```
src/
├── controllers/    # Route handlers
├── services/       # Business logic
├── repositories/   # Data access
├── models/         # Data models
├── middleware/     # Express middleware
├── socket/         # WebSocket handlers
├── utils/          # Helper functions
└── config/         # Configuration
```

## Key Responsibilities

1. **Game State Management**
   - Implement server-authoritative game state
   - Ensure atomicity of game state updates
   - Maintain session tracking for user reconnection

2. **Real-time Communication**
   - Implement Socket.io event handlers
   - Design room-based communication channels
   - Handle connection/disconnection gracefully

3. **Database Operations**
   - Implement database schema using Prisma
   - Design efficient queries for game operations
   - Set up data migration strategy

4. **API Development**
   - Create RESTful endpoints for non-real-time operations
   - Implement authentication and authorization
   - Document API using OpenAPI/Swagger

5. **Game Logic Implementation**
   - Develop core game mechanics
   - Implement AI player for single-player mode
   - Create card elimination algorithm

## Implementation Guidelines

### Database Schema

Implement the following tables:

1. **Footballers**
   - Store static information about footballer cards
   - Include all attributes used in questions (position, club, nation, etc.)

2. **Users**
   - Basic user information (if authentication is required)
   - User statistics and preferences

3. **GameRooms**
   - Game session information
   - State tracking (waiting/in-progress/finished)
   - Configuration options

4. **PlayerSessions**
   - Link users to game rooms
   - Track eliminated cards and turn status
   - Store secret footballer assignment

5. **GameStatistics**
   - Record game outcomes and metrics
   - Support future analytics

### API Endpoints

Implement these core REST endpoints:

1. **User Management** (if applicable)
   - `POST /api/users` - Register
   - `POST /api/auth/login` - Login
   - `GET /api/users/me` - Get current user

2. **Game Management**
   - `POST /api/games` - Create new game room
   - `GET /api/games/:id` - Get game information
   - `GET /api/games/join/:id` - Join existing game

3. **Game Data**
   - `GET /api/footballers` - Get footballer data
   - `GET /api/questions` - Get question catalogue

### WebSocket Events

Implement these Socket.io events:

1. **Room Management**
   - `JOIN_ROOM` - Player joins a game room
   - `LEAVE_ROOM` - Player leaves a game room

2. **Game Actions**
   - `ASK_QUESTION` - Player asks a question
   - `ANSWER_QUESTION` - Player answers a question
   - `MAKE_GUESS` - Player makes a guess
   - `REQUEST_REMATCH` - Player requests a rematch

3. **Game State Updates**
   - `GAME_STATE_UPDATE` - Broadcast updated game state
   - `TURN_CHANGE` - Notify turn change
   - `GAME_OVER` - Notify game end

### Optimizations

1. **Pre-compute Question Results**
   - Generate lookup tables for question-to-footballer matching
   - Optimize card elimination operations

2. **Redis Integration** (optional)
   - Use Redis for caching frequently accessed data
   - Implement Redis pub/sub for multi-server deployments

3. **Transaction Safety**
   - Use database transactions for atomic state updates
   - Implement optimistic concurrency control

### AI Implementation

Implement the AI player with three difficulty levels:

1. **Easy**
   - Make random decisions 40% of the time
   - Ask sub-optimal questions occasionally

2. **Medium**
   - Implement optimal algorithm but introduce 20% random mistakes
   - Balance challenge and accessibility

3. **Hard**
   - Always use information entropy optimization for questions
   - Make perfect decisions based on available information

## Testing Requirements

1. **Unit Testing**
   - Test all service functions
   - Test game logic components
   - Test AI decision-making

2. **Integration Testing**
   - Test API endpoints
   - Test WebSocket communication
   - Test database operations

3. **Performance Testing**
   - Test concurrent connections
   - Test game state updates under load
   - Test database query performance

## Error Handling & Logging

1. **Implement Robust Error Handling**
   - Use try/catch blocks with custom error classes
   - Return appropriate HTTP status codes
   - Provide meaningful error messages

2. **Set Up Comprehensive Logging**
   - Use Winston for structured logging
   - Log all game events for debugging
   - Set up different log levels (info, warning, error)

## Security Considerations

1. **Input Validation**
   - Validate all client inputs
   - Sanitize data to prevent injection attacks

2. **Authentication & Authorization**
   - Implement JWT-based authentication
   - Verify permissions for all operations

3. **Rate Limiting**
   - Implement rate limiting for API endpoints
   - Prevent abuse of game actions

## Documentation Requirements

1. **Code Documentation**
   - Use TSDoc comments for all functions and classes
   - Document all public interfaces

2. **API Documentation**
   - Create OpenAPI/Swagger specification
   - Document all endpoints and parameters

3. **Architecture Documentation**
   - Document system design decisions
   - Create sequence diagrams for key flows 