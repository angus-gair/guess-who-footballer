# Football Guess Who - Core Functionality Test Cases

## Game Initialization

### TC-001: Create Single Player Game - Easy Difficulty
**Priority:** P0 | **Type:** Functional | **Automation:** Yes

**Preconditions:**
- User is on the home page
- Single player mode is available

**Steps:**
1. Click "Create New Game" button
2. Enter display name "TestPlayer"
3. Select "Single Player" mode
4. Select difficulty level "Easy"
5. Click "Create Game" button

**Expected Results:**
- Game is created successfully
- User is redirected to game board
- Game board displays with 24 footballer cards
- User's turn is indicated
- AI opponent is initialized with "Easy" difficulty

### TC-002: Create Single Player Game - Medium Difficulty
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
- Game is created successfully with Medium difficulty AI

### TC-003: Create Single Player Game - Hard Difficulty
**Priority:** P0 | **Type:** Functional | **Automation:** Yes

**Preconditions:**
- User is on the home page
- Single player mode is available

**Steps:**
1. Click "Create New Game" button
2. Enter display name "TestPlayer"
3. Select "Single Player" mode
4. Select difficulty level "Hard"
5. Click "Create Game" button

**Expected Results:**
- Game is created successfully with Hard difficulty AI

### TC-004: Create Multiplayer Game and Join
**Priority:** P0 | **Type:** Functional | **Automation:** Yes

**Preconditions:**
- Two browser instances open on home page

**Steps:**
1. In Browser 1: Click "Create New Game" button
2. Enter display name "Player1"
3. Select "Multiplayer" mode
4. Click "Create Game" button
5. Copy room code
6. In Browser 2: Click "Join Game" button
7. Enter display name "Player2"
8. Enter room code from step 5
9. Click "Join Game" button

**Expected Results:**
- Game room is created successfully in Browser 1
- Player2 joins the game room successfully in Browser 2
- Both players see the game board with 24 footballer cards
- Turn indicator shows which player goes first
- Both players have their own secret footballer assigned

### TC-005: Form Validation for Player Name
**Priority:** P1 | **Type:** Functional | **Automation:** Yes

**Preconditions:**
- User is on the home page

**Steps:**
1. Click "Create New Game" button
2. Leave display name field empty
3. Select "Single Player" mode
4. Click "Create Game" button

**Expected Results:**
- Error message indicates display name is required
- Game creation is blocked

**Data Variations:**
- Test with display name < 2 characters
- Test with display name > 20 characters
- Test with special characters

## Game Play

### TC-006: Ask Question and Receive Answer (Single Player)
**Priority:** P0 | **Type:** Functional | **Automation:** Yes

**Preconditions:**
- User is in an active single player game
- It is the user's turn

**Steps:**
1. Select a question category (e.g., "Position")
2. Select a specific question (e.g., "Is the player a forward?")
3. Submit the question

**Expected Results:**
- Question is sent to AI opponent
- AI responds with Yes/No answer
- Answer is displayed to the user
- Cards are automatically eliminated based on the answer
- Turn switches to AI opponent

### TC-007: AI Asks Question and Player Answers
**Priority:** P0 | **Type:** Functional | **Automation:** Yes

**Preconditions:**
- User is in an active single player game
- It is the AI's turn

**Steps:**
1. AI selects and asks a question
2. Question is displayed to the user
3. User selects "Yes" or "No" answer
4. User submits answer

**Expected Results:**
- AI receives the answer
- AI eliminates cards based on the answer
- Turn switches back to user

### TC-008: Card Elimination Logic
**Priority:** P0 | **Type:** Functional | **Automation:** Yes

**Preconditions:**
- User is in an active game
- It is the user's turn

**Steps:**
1. Select a question with known outcome (e.g., "Does the player have blonde hair?")
2. Submit the question
3. Receive answer (e.g., "Yes")

**Expected Results:**
- All cards that don't match the criteria (non-blonde players) are visually marked as eliminated
- Eliminated cards are visually distinct (grayed out or marked)
- Count of remaining cards is updated
- Only non-eliminated cards can be selected for a guess

### TC-009: Make Correct Final Guess
**Priority:** P0 | **Type:** Functional | **Automation:** Yes

**Preconditions:**
- User is in an active single player game
- User has narrowed down possibilities

**Steps:**
1. Click "Make a Guess" button
2. Select a footballer card that matches AI's secret footballer
3. Confirm the guess

**Expected Results:**
- System validates the guess is correct
- Victory screen is displayed
- Game statistics are shown (turns taken, questions asked, time elapsed)
- Options to play again or return to home are provided

### TC-010: Make Incorrect Final Guess
**Priority:** P0 | **Type:** Functional | **Automation:** Yes

**Preconditions:**
- User is in an active single player game

**Steps:**
1. Click "Make a Guess" button
2. Select a footballer card that does NOT match AI's secret footballer
3. Confirm the guess

**Expected Results:**
- System validates the guess is incorrect
- Defeat screen is displayed
- AI's secret footballer is revealed
- Game statistics are shown
- Options to play again or return to home are provided

### TC-011: Multiplayer Turn-Based Play
**Priority:** P0 | **Type:** Functional | **Automation:** Yes

**Preconditions:**
- Two users are in an active multiplayer game
- It is Player 1's turn

**Steps:**
1. Player 1 selects and submits a question
2. Player 2, receives the question
3. Player 2 answers Yes/No based on their secret footballer
4. Turn passes to Player 2
5. Player 2 selects and submits a question
6. Player 1 answers Yes/No based on their secret footballer

**Expected Results:**
- Questions and answers are correctly transmitted between players
- Turn indicator updates to show current player
- Each player's board shows their own eliminations
- Each player can only act during their turn

## Game Completion

### TC-012: Complete Game and View Statistics
**Priority:** P1 | **Type:** Functional | **Automation:** Yes

**Preconditions:**
- User has completed a game (win or lose)

**Steps:**
1. View end game screen with statistics
2. Check displayed metrics (turns taken, time elapsed, questions asked)

**Expected Results:**
- Statistics accurately reflect the completed game
- All metrics are displayed correctly
- Statistics are persistent if user leaves and returns

### TC-013: Rematch Functionality
**Priority:** P1 | **Type:** Functional | **Automation:** Yes

**Preconditions:**
- Two users have completed a multiplayer game

**Steps:**
1. Player 1 clicks "Rematch" button
2. System indicates Player 1 wants a rematch
3. Player 2 clicks "Rematch" button

**Expected Results:**
- New game is initialized with same players
- New secret footballers are assigned
- Game board is reset with all cards available
- First player is randomly selected
- Turn counter and statistics are reset

### TC-014: Reconnection During Active Game
**Priority:** P1 | **Type:** Functional | **Automation:** Yes

**Preconditions:**
- Two users are in an active multiplayer game
- Player 1 disconnects

**Steps:**
1. Simulate disconnection for Player 1
2. Player 1 rejoins the game with the same room code

**Expected Results:**
- Player 1 rejoins the same game
- Game state is preserved (eliminated cards, turn order)
- Play can continue from where it left off

## Edge Cases

### TC-015: Connection Loss During Turn Transition
**Priority:** P2 | **Type:** Functional | **Automation:** Yes

**Preconditions:**
- Two users are in an active multiplayer game
- It is Player 1's turn

**Steps:**
1. Player 1 submits a question
2. Player 2 answers
3. Immediately after answering, Player 2 disconnects
4. Player 2 reconnects to the game

**Expected Results:**
- Game state is preserved correctly
- Turn has properly transferred to Player 2
- No duplicate turn occurs
- No turn is skipped

### TC-016: All Cards Eliminated but No Winner
**Priority:** P2 | **Type:** Functional | **Automation:** Yes

**Preconditions:**
- User is in active game
- Through questions, all cards have been eliminated

**Steps:**
1. Observe game state when all cards are eliminated

**Expected Results:**
- System detects logical inconsistency
- Error message indicates that questions led to elimination of all possibilities
- Option to restart game is provided

### TC-017: Simultaneous Final Guesses
**Priority:** P3 | **Type:** Functional | **Automation:** Yes

**Preconditions:**
- Two users are in an active multiplayer game
- Both players attempt to make a final guess at the same time

**Steps:**
1. Player 1 clicks "Make a Guess"
2. Before Player 1 confirms, Player 2 clicks "Make a Guess"
3. Both players try to confirm their guesses

**Expected Results:**
- System prioritizes the player whose turn it is
- Only valid player can submit a guess
- Game integrity is maintained with clear turn order

### TC-018: Cancelled Final Guess
**Priority:** P2 | **Type:** Functional | **Automation:** Yes

**Preconditions:**
- User is in an active game
- It is user's turn

**Steps:**
1. Click "Make a Guess" button
2. Select a footballer card
3. Click "Cancel" button instead of confirming

**Expected Results:**
- Guess is cancelled
- User returns to main game board
- Turn remains with the user
- No negative effects on game state 