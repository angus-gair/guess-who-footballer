// ***********************************************
// Custom commands for Football Guess Who testing
// ***********************************************

// Create a single player game with given difficulty
Cypress.Commands.add('createSinglePlayerGame', (playerName, difficulty = 'Medium') => {
  cy.visit('/');
  cy.get('[data-testid="create-game-btn"]').click();
  cy.get('[data-testid="player-name-input"]').type(playerName);
  cy.get('[data-testid="game-mode-single"]').click();
  cy.get(`[data-testid="difficulty-${difficulty.toLowerCase()}"]`).click();
  cy.get('[data-testid="create-game-submit"]').click();
  
  // Wait for game board to load
  cy.get('[data-testid="game-board"]', { timeout: 10000 }).should('be.visible');
});

// Create a multiplayer game and return the room code
Cypress.Commands.add('createMultiplayerGame', (playerName) => {
  cy.visit('/');
  cy.get('[data-testid="create-game-btn"]').click();
  cy.get('[data-testid="player-name-input"]').type(playerName);
  cy.get('[data-testid="game-mode-multi"]').click();
  cy.get('[data-testid="create-game-submit"]').click();
  
  // Wait for the room code to be displayed and capture it
  return cy.get('[data-testid="room-code"]', { timeout: 10000 })
    .should('be.visible')
    .invoke('text')
    .then(text => {
      // Extract just the code portion if there's additional text
      const roomCode = text.replace('Room Code: ', '').trim();
      return roomCode;
    });
});

// Join a multiplayer game with a room code
Cypress.Commands.add('joinMultiplayerGame', (playerName, roomCode) => {
  cy.visit('/');
  cy.get('[data-testid="join-game-btn"]').click();
  cy.get('[data-testid="player-name-input"]').type(playerName);
  cy.get('[data-testid="room-code-input"]').type(roomCode);
  cy.get('[data-testid="join-game-submit"]').click();
  
  // Wait for game board to load
  cy.get('[data-testid="game-board"]', { timeout: 10000 }).should('be.visible');
});

// Ask a question in the game
Cypress.Commands.add('askQuestion', (category, question) => {
  cy.get(`[data-testid="category-${category}"]`).click();
  cy.get(`[data-testid="question-${question}"]`).click();
  cy.get('[data-testid="submit-question-btn"]').click();
  
  // Wait for the answer to be displayed
  cy.get('[data-testid="question-answer"]', { timeout: 15000 }).should('be.visible');
});

// Answer a question in multiplayer game
Cypress.Commands.add('answerQuestion', (answer) => {
  cy.get(`[data-testid="answer-${answer.toLowerCase()}"]`).click();
  cy.get('[data-testid="submit-answer-btn"]').click();
});

// Make a final guess
Cypress.Commands.add('makeGuess', (footballerName) => {
  cy.get('[data-testid="make-guess-btn"]').click();
  cy.get(`[data-testid="footballer-${footballerName}"]`).click();
  cy.get('[data-testid="confirm-guess-btn"]').click();
  
  // Wait for the result screen
  cy.get('[data-testid="game-result"]', { timeout: 10000 }).should('be.visible');
});

// Check if a card is eliminated
Cypress.Commands.add('checkCardEliminated', (footballerName, shouldBeEliminated = true) => {
  if (shouldBeEliminated) {
    cy.get(`[data-testid="footballer-${footballerName}"]`).should('have.class', 'eliminated');
  } else {
    cy.get(`[data-testid="footballer-${footballerName}"]`).should('not.have.class', 'eliminated');
  }
});

// Get the number of remaining cards
Cypress.Commands.add('getRemainingCardCount', () => {
  return cy.get('[data-testid="remaining-cards"]')
    .invoke('text')
    .then(text => {
      // Extract just the number
      const count = parseInt(text.match(/\d+/)[0], 10);
      return count;
    });
});

// Wait for turn indicator to show it's the player's turn
Cypress.Commands.add('waitForPlayerTurn', (playerName) => {
  cy.get('[data-testid="turn-indicator"]', { timeout: 20000 })
    .should('contain.text', `${playerName}'s turn`);
});

// Request a rematch after game ends
Cypress.Commands.add('requestRematch', () => {
  cy.get('[data-testid="rematch-btn"]').click();
  cy.get('[data-testid="rematch-requested"]').should('be.visible');
});

// Simulate disconnection and reconnection
Cypress.Commands.add('simulateReconnection', () => {
  // Store current URL before disconnection
  cy.url().then(url => {
    // Simulate page reload (disconnection)
    cy.reload();
    
    // Wait for reconnection 
    cy.get('[data-testid="game-board"]', { timeout: 15000 }).should('be.visible');
  });
}); 