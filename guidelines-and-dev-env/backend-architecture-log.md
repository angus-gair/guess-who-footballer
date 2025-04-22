# Football Guess Who - Backend Architecture Log

## Overview

This document outlines the backend architecture for the Football Guess Who game, following the controller-service-repository pattern. The backend is responsible for game state management, real-time communication, database operations, API endpoints, and game logic implementation.

## Project Structure

```
src/
├── controllers/        # Route handlers
│   ├── auth.ts         # Authentication endpoints
│   ├── game.ts         # Game management endpoints
│   ├── footballer.ts   # Footballer data endpoints
│   └── question.ts     # Question catalog endpoints
│
├── services/           # Business logic
│   ├── auth.ts         # Authentication logic
│   ├── game.ts         # Game management logic
│   ├── ai.ts           # AI player logic
│   └── question.ts     # Question handling logic
│
├── repositories/       # Data access layer
│   ├── user.ts         # User data operations
│   ├── game.ts         # Game data operations 
│   ├── footballer.ts   # Footballer data operations
│   └── question.ts     # Question data operations
│
├── models/             # Type definitions
│   ├── user.ts         # User model types
│   ├── game.ts         # Game state types
│   ├── footballer.ts   # Footballer data types
│   └── question.ts     # Question types
│
├── middleware/         # Express middleware
│   ├── auth.ts         # Authentication middleware
│   ├── validation.ts   # Request validation
│   └── error.ts        # Error handling
│
├── socket/             # WebSocket handlers
│   ├── index.ts        # Socket.io setup
│   ├── events.ts       # Event definitions
│   ├── handlers.ts     # Event handlers
│   └── middleware.ts   # Socket middleware
│
├── utils/              # Helper functions
│   ├── logger.ts       # Logging utility
│   ├── error.ts        # Custom error classes
│   └── game-logic.ts   # Game mechanics helpers
│
├── config/             # Configuration
│   ├── index.ts        # Main configuration
│   ├── database.ts     # Database configuration
│   └── socket.ts       # Socket.io configuration
│
├── app.ts              # Express application setup
├── server.ts           # HTTP server setup
└── index.ts            # Application entry point
```

## Database Schema

The database schema is defined using Prisma ORM and includes the following entities:

### User
Stores player account information:
- id (UUID): Primary key
- email (String): Unique email address
- password (String): Hashed password
- displayName (String): Player's display name
- createdAt/updatedAt: Timestamps

### Footballer
Card data for each footballer:
- id (UUID): Primary key
- name (String): Footballer's name
- image (String): Image path or URL
- club (String): Current club
- nation (String): Nationality
- position (Enum): GK, DEF, MID, or FWD
- ageBracket (String): Age category
- hairColor (String): Hair color
- facialHair (Boolean): Has facial hair or not
- bootsColor (String): Color of boots
- createdAt/updatedAt: Timestamps

### GameRoom
Game session data:
- id (UUID): Primary key
- roomCode (String): Unique code for joining
- mode (Enum): SP or MP
- state (Enum): WAITING, IN_PROGRESS, or FINISHED
- subState (Enum): Optional sub-state like WAITING_FOR_ANSWER
- players (Relation): PlayerSessions in this game
- turnHistory (Relation): History of turns
- startedAt/endedAt: Game timing timestamps
- winnerId (String): ID of the winning player (if game finished)
- settings (JSON): Game configuration (turnTimeLimit, maxQuestions, difficulty)
- createdAt/updatedAt: Timestamps

### PlayerSession
Player state in a game:
- id (UUID): Primary key
- displayName (String): Display name for this session
- isHuman (Boolean): Human or AI player
- isTurn (Boolean): Is it this player's turn
- lastActive (DateTime): Last activity timestamp (for reconnection)
- wantsRematch (Boolean): Player requested rematch
- remainingGuesses (Int): Number of guesses remaining
- userId (UUID): Optional link to registered user
- gameRoomId (UUID): Link to game room
- secretId (UUID): Secret footballer assigned to this player
- eliminatedIds (Relation): Footballers eliminated by this player
- askedQuestions (Relation): Questions already asked by this player
- createdAt/updatedAt: Timestamps

### Question
Question catalog:
- id (UUID): Primary key
- text (String): Question text
- trait (String): Footballer property this question checks
- expectedValues (String[]): Values that result in "Yes" answer
- category (String): Question category for UI grouping
- createdAt/updatedAt: Timestamps

### TurnRecord
Record of each turn taken:
- id (UUID): Primary key
- playerSessionId (String): Player who took the turn
- questionId (String): Question asked (if a question turn)
- guessId (String): Footballer guessed (if a guess turn)
- answer (Boolean): Answer to question (if applicable)
- turnType (Enum): QUESTION or GUESS
- timestamp (DateTime): When the turn was taken
- gameRoomId (UUID): Link to game room

### GameStatistic
Game outcome data:
- id (UUID): Primary key
- totalTurns (Int): Number of turns taken
- questionCount (Int): Number of questions asked
- duration (Int): Game duration in seconds
- createdAt (DateTime): When the record was created
- gameRoomId (UUID): Link to game room
- winnerId (UUID): Link to winning user

## API Endpoints

The API follows RESTful conventions with the following endpoint structure:

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login existing user
- GET /api/auth/refresh - Refresh access token

### Game Management
- POST /api/games - Create a new game
  - Required: mode, displayName
  - Optional: settings
- GET /api/games/:id - Get game details by ID
- GET /api/games/join/:code - Join game by room code
  - Required: displayName (in body)

### Game Data
- GET /api/footballers - Get footballer list
  - Optional query params: limit, offset, position
- GET /api/footballers/:id - Get footballer by ID
- GET /api/questions - Get all questions
  - Optional query params: category
- GET /api/questions/:id - Get question by ID

## WebSocket Events

Socket.io is used for real-time communication with these events:

### Client to Server Events
- JOIN_ROOM - Join a game room
  - Payload: roomCode, displayName
- LEAVE_ROOM - Leave a game room
  - Payload: roomCode
- ASK_QUESTION - Ask a question
  - Payload: roomCode, questionId
- ANSWER_QUESTION - Answer a question
  - Payload: roomCode, answer (boolean)
- MAKE_GUESS - Make a final guess
  - Payload: roomCode, footballerId
- REQUEST_REMATCH - Request a rematch
  - Payload: roomCode

### Server to Client Events
- GAME_STATE_UPDATE - Send updated game state
- TURN_CHANGE - Notify turn has changed
- CARD_ELIMINATION - Notify cards have been eliminated
- GAME_OVER - Notify game has ended
- ERROR - Send error message
- RECONNECT_SUCCESS - Confirm successful reconnection

## Socket.io Middleware

- **Authentication Middleware**: Validates JWT tokens for authenticated connections
- **Error Handling**: Properly formats and sends error messages

## Docker Configuration

The development environment uses Docker Compose with the following services:

### API Service
- Node.js 18 Alpine container
- Volumes for hot reloading
- Environment variables for configuration
- Runs in development mode with nodemon

### Database Service
- PostgreSQL 14 Alpine
- Persistent volume for data storage
- Default database, user, and password

### PgAdmin Service (Optional)
- Database administration interface
- Access on port 5050

## Implementation Decisions

### Authentication
- JWT-based authentication for API endpoints
- Token-based authentication for socket connections
- Refresh token mechanism for extended sessions
- Optional authentication for certain endpoints

### Error Handling
- Custom error classes with HTTP status codes
- Centralized error handling middleware
- Detailed error responses with consistent format

### Logging
- Winston-based logging system
- Different log levels (info, warn, error)
- Module-based logger creation for better organization
- File and console transport for logs

### Validation
- Express-validator for request validation
- Validation middleware for consistent error responses
- Strong typing with TypeScript interfaces

### Database Access
- Prisma Client for type-safe database access
- Proper relation modeling between entities
- UUID primary keys for security 