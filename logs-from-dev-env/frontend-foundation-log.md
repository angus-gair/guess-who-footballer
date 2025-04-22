# Football Guess Who - Frontend Foundation Log

## Overview

This document outlines the setup process for the "Football Guess Who" game frontend. The frontend is built using React 18 with TypeScript, Vite as the build tool, and follows a feature-based architecture as specified in the project guidelines.

## Project Structure

```
src/
├── components/            # Reusable UI components
│   ├── common/            # Generic UI elements
│   ├── game/              # Game-specific components
│   └── layout/            # Layout components
├── features/              # Feature modules
│   ├── auth/              # Authentication
│   ├── gameBoard/         # Game board UI
│   ├── questions/         # Question interface
│   └── gameOver/          # End game screens
├── hooks/                 # Custom React hooks
├── services/              # API and socket services
├── contexts/              # React Context providers
├── types/                 # TypeScript type definitions
├── utils/                 # Helper functions
└── assets/                # Static assets
```

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **TailwindCSS** for styling
- **React Query** for data fetching and caching
- **React Router** for client-side routing
- **Socket.io Client** for real-time communication with the server
- **Axios** for HTTP requests

## Core Type Definitions

Type definitions have been created to match the backend models:

1. **Game Types** (`src/types/game.ts`):
   - Enums for game modes, states, positions, etc.
   - Interfaces for game entities like `Footballer`, `PlayerSession`, and `GameRoom`
   - Request/response types for API communication

2. **Socket Types** (`src/types/socket.ts`):
   - Socket event types enum
   - Payload interfaces for each socket event

3. **User Types** (`src/types/user.ts`):
   - User entity and authentication types

## State Management

The application uses React Context API for global state management, following a provider pattern:

1. **UserContext** (`src/contexts/UserContext.tsx`):
   - Manages user authentication state
   - Provides login, register, and logout functions
   - Persists authentication tokens in localStorage

2. **SocketContext** (`src/contexts/SocketContext.tsx`):
   - Manages socket.io connections
   - Provides methods for emitting socket events
   - Handles socket authentication and reconnection

3. **GameContext** (`src/contexts/GameContext.tsx`):
   - Manages game state
   - Provides game actions (create, join, ask question, etc.)
   - Syncs with socket events to keep game state updated

## API and Socket Services

1. **API Service** (`src/services/api.ts`):
   - Uses Axios for HTTP requests
   - Includes interceptors for authentication
   - Organized into logical groupings (auth, game, footballer, question)

2. **Socket Service** (`src/services/socket.ts`):
   - Manages Socket.io client connection
   - Provides methods for emitting game events
   - Handles connection lifecycle (connect, disconnect, reconnect)

## Styling

The project uses TailwindCSS with a custom configuration based on the UI/UX design specifications:

1. **Color Palette**:
   - Primary Colors: Green (football field), Blue (team jersey)
   - Secondary Colors: Yellow (referee card), Red (team accent)
   - Semantic Colors for feedback states

2. **Typography**:
   - Inter as the primary font
   - Montserrat for headings
   - Responsive sizing scale

3. **Component Classes**:
   - Pre-defined classes for buttons, cards, inputs
   - Footballer card styling with states (active, eliminated, selected)

## Key Implementation Decisions

1. **Feature-Based Structure**:
   - Components organized by feature rather than type
   - Shared UI components separated for reusability
   - Each feature has its own directory with components, hooks, and utilities

2. **Context-Based State Management**:
   - React Context used over Redux for simpler state management
   - Separate contexts for different concerns (user, socket, game)
   - Custom hooks for accessing context state

3. **Socket Integration**:
   - Socket.io client wrapped in a service and context
   - Real-time game updates handled through socket events
   - Automatic reconnection and authentication handling

4. **Responsive Design**:
   - Mobile-first approach with TailwindCSS
   - Adaptive layouts for different screen sizes
   - Custom component designs for mobile and desktop interfaces

## Next Steps

With the foundation in place, the next phase involves:

1. Implementing the main UI components:
   - Footballer cards grid
   - Question selection interface
   - Game board layout
   - Turn indicators

2. Building the game flow screens:
   - Home/lobby
   - Game setup
   - Main game
   - End game

3. Adding animations and interactions:
   - Card elimination animations
   - Turn transitions
   - Question/answer sequences

4. Implementing responsive designs for mobile and tablet

5. Unit and integration testing for core components and game logic 