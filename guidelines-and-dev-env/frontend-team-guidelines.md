# Frontend Development Team Guidelines

## Overview

The frontend team is responsible for creating an engaging, responsive, and intuitive user interface for the Football Guess Who game. This includes developing the game board, question interfaces, and real-time interaction elements.

## Tech Stack

- **React 18+** with TypeScript
- **Vite** as build tool
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **React Router** for navigation
- **Socket.io Client** for real-time communication
- **Jest** and **React Testing Library** for testing

## Architecture Overview

Implement a feature-based folder structure:

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

## Key Responsibilities

1. **Game Board Implementation**
   - Create responsive grid of footballer cards
   - Implement card elimination visuals
   - Design intuitive selection mechanics

2. **Question Interface**
   - Build accessible question selection UI
   - Create answering interface for responding to questions
   - Implement turn status indicators

3. **Real-time Communication**
   - Integrate Socket.io client
   - Handle game event updates
   - Manage reconnection logic

4. **Game Flow Screens**
   - Develop home/lobby screen
   - Implement game setup interface
   - Create end-game and statistics screens

5. **State Management**
   - Use React Context API for global state
   - Implement local component state where appropriate
   - Sync frontend state with server updates

## Implementation Guidelines

### Component Organization

1. **Base UI Components**
   - Create a reusable UI component library
   - Implement consistent styling through Tailwind
   - Ensure accessibility compliance

2. **Game Components**
   - `<FootballerCard />` - Individual footballer display
   - `<GameBoard />` - Grid of footballer cards
   - `<QuestionSelector />` - Interface for selecting questions
   - `<TurnIndicator />` - Shows whose turn it is
   - `<GameControls />` - Actions like "Make a Guess"

### State Management

1. **Game Context**
   - Track current game state
   - Store eliminated cards
   - Manage turn status

2. **Socket Context**
   - Handle socket connection
   - Provide event emitters
   - Manage reconnection logic

3. **User Context** (if applicable)
   - Store user information
   - Track game history
   - Manage preferences

### Socket Integration

1. **Event Handling**
   - Listen for game events from server
   - Update UI based on event data
   - Emit user actions to server

2. **Event Types**
   - `GAME_STATE_UPDATE` - Update entire game state
   - `TURN_CHANGE` - Change active player
   - `CARD_ELIMINATION` - Update eliminated cards
   - `GAME_OVER` - Handle game end

3. **Reconnection Logic**
   - Detect disconnections
   - Implement reconnection attempts
   - Restore game state on reconnection

### Game Flow Implementation

1. **Home/Lobby Screen**
   - Options to create/join games
   - Game mode selection (SP/MP)
   - Difficulty selection (for SP)

2. **Game Setup**
   - Room code display/entry
   - Waiting for opponent UI
   - Game start animation

3. **Main Game Screen**
   - Game board with footballer cards
   - Question selection interface
   - Turn status and history display

4. **End Game Screen**
   - Winner announcement
   - Game statistics display
   - Rematch and exit options

### Responsive Design

1. **Desktop Layout**
   - Side-by-side layout with game board and controls
   - Utilize available screen space efficiently

2. **Mobile Layout**
   - Stacked layout with swipeable sections
   - Touch-friendly controls
   - Condensed game board

3. **Adaptive Components**
   - Components should adapt to available space
   - Use relative sizing where appropriate
   - Test on multiple viewport sizes

### Animation & Interactions

1. **Card Animations**
   - Smooth transitions for card elimination
   - Selection animations
   - Win/lose animations

2. **Turn Transitions**
   - Clear indication of turn changes
   - Countdown animations for timed turns

3. **Question Flow**
   - Animated question/answer sequence
   - Visual feedback for responses

### Optimization Techniques

1. **Component Memoization**
   - Use React.memo for expensive components
   - Implement useMemo and useCallback for optimization

2. **Virtualization**
   - Consider virtualized lists for long selections
   - Optimize rendering for large datasets

3. **Asset Optimization**
   - Lazy load images
   - Use appropriate image formats
   - Implement resource preloading

## Testing Requirements

1. **Component Testing**
   - Unit tests for all UI components
   - Test for accessibility compliance
   - Ensure responsive design tests

2. **Integration Testing**
   - Test component interactions
   - Verify socket communication integration
   - Test game flow sequences

3. **End-to-End Testing**
   - Full game flow simulations
   - Test edge cases like disconnections
   - Cross-browser compatibility testing

## Accessibility Guidelines

1. **WCAG 2.1 AA Compliance**
   - Ensure proper contrast ratios
   - Implement keyboard navigation
   - Add appropriate ARIA attributes

2. **Screen Reader Support**
   - Provide text alternatives for game elements
   - Announce turn changes and game events
   - Test with screen readers

3. **Inclusive Design**
   - Support reduced motion preferences
   - Ensure color is not the only differentiator
   - Support text scaling

## Documentation Requirements

1. **Component Documentation**
   - Document props and usage for each component
   - Create Storybook stories (optional)
   - Include accessibility notes

2. **State Management Documentation**
   - Document context providers and consumers
   - Explain state update patterns
   - Detail event handling

3. **Integration Documentation**
   - Document API and socket integration
   - Explain data flow through the application
   - Provide examples of common patterns 