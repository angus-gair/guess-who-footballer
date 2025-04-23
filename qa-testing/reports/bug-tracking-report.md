# Football Guess Who - Bug Tracking Report

## Bug Summary

This document provides tracking information for all bugs identified during the QA Testing phase for the Football Guess Who game v0.9.0-beta.

**Testing Period:** August 1-15, 2023  
**Total Bugs Identified:** 27

### Bug Severity Breakdown

| Severity | Count | Description |
|----------|-------|-------------|
| Critical | 5 | Game-breaking issues that prevent core functionality from working |
| High | 10 | Significant issues that severely impact user experience |
| Medium | 8 | Moderate issues that impact user experience but have workarounds |
| Low | 4 | Minor issues that have minimal impact on user experience |

### Bug Status

| Status | Count | Description |
|--------|-------|-------------|
| Open | 23 | Not yet resolved |
| In Progress | 3 | Currently being fixed |
| Fixed | 1 | Fixed but not verified |
| Verified | 0 | Fixed and verified by QA |

## Critical Bugs

### BUG-006: Game state recovery failing after reconnection

**Severity:** Critical  
**Priority:** P0  
**Status:** In Progress  
**Assigned To:** Mark Reynolds  
**Affected Components:** Backend - Socket.io, Game Session Management  
**Test ID:** INT-202  

**Description:**  
After a connection interruption lasting 15+ seconds, the game state fails to recover properly in approximately 25% of test scenarios. The affected player's interface becomes unresponsive, showing outdated game state.

**Steps to Reproduce:**
1. Start a multiplayer game between two players
2. Disconnect one player's internet connection for 15+ seconds
3. Reconnect the player's internet connection
4. Observe as the game state fails to update correctly

**Expected Result:**  
Upon reconnection, the player should see the current game state and be able to continue play.

**Actual Result:**  
In ~25% of cases, the reconnected player sees an outdated game state and cannot interact properly with the game. The Socket.io client fails to re-establish the game session correctly.

**Technical Analysis:**  
Debugging reveals the `socket.on('reconnect')` handler attempts to fetch the current game state, but the server-side game session retrieval sometimes fails due to a race condition between session cleanup and reconnection logic.

**Code Location:**
- `backend/src/socket/connectionManager.js` (Lines 75-92)
- `frontend/src/hooks/useSocketConnection.ts` (Lines 45-68)

**Error Logs:**
```
[2023-08-03T14:22:15.456Z] [ERROR] [Socket:a1b2c3d4] Failed to restore game session after reconnection: Game session 'game-5678' not found
[2023-08-03T14:22:15.458Z] [ERROR] [SessionManager] Race condition detected in session restoration for game-5678
[2023-08-03T14:22:15.459Z] [ERROR] [Socket:a1b2c3d4] Client socket reconnected but session sync failed
```

**Fix Recommendation:**  
1. Implement a more robust session tracking mechanism using Redis
2. Increase the session timeout period for inactive games
3. Add a recovery mechanism to recreate game state from database if session is lost
4. Add client-side retry logic with exponential backoff

### BUG-008: Server response times exceed threshold at 40+ concurrent users

**Severity:** Critical  
**Priority:** P0  
**Status:** Open  
**Assigned To:** Unassigned  
**Affected Components:** Backend - Game Logic, Database  
**Test ID:** PERF-102  

**Description:**  
Server response times increase exponentially once the system reaches 40+ concurrent active games. At 75+ concurrent games, response times regularly exceed 1000ms, significantly impacting user experience.

**Steps to Reproduce:**
1. Use k6 to simulate 40+ concurrent game sessions
2. Monitor API response times and server performance
3. Observe degradation as user count increases

**Technical Analysis:**  
Performance profiling reveals several inefficiencies:
1. Question evaluation logic performs redundant database queries
2. Card elimination calculations are not optimized for large datasets
3. Redis cache is not being properly utilized for game state

CPU utilization peaks at 92% during these scenarios, while memory usage grows linearly, indicating a potential memory leak.

**Performance Data:**
- 10 concurrent games: Avg response time 95ms
- 25 concurrent games: Avg response time 180ms
- 40 concurrent games: Avg response time 420ms
- 60 concurrent games: Avg response time 780ms
- 75 concurrent games: Avg response time 1250ms

**Profiling Hotspots:**
1. `backend/src/game/questionEvaluator.js:evaluateQuestion()` - 35% CPU time
2. `backend/src/game/cardEliminator.js:eliminateCards()` - 28% CPU time
3. `backend/src/database/gameRepository.js:saveGameState()` - 15% CPU time

**Fix Recommendation:**  
1. Optimize question evaluation algorithm to reduce complexity
2. Implement Redis caching for game states to reduce database load
3. Refactor card elimination to use set operations instead of iterative filtering
4. Add database query result caching
5. Implement horizontal scaling for game servers

## High Severity Bugs

### BUG-003: Game timer occasionally jumps backward or skips seconds

**Severity:** High  
**Priority:** P1  
**Status:** Open  
**Assigned To:** Unassigned  
**Affected Components:** Frontend - UI Components  
**Test ID:** TC-205  

**Description:**  
The turn timer occasionally jumps backward or skips seconds, especially when the browser tab is inactive then reactivated. This causes confusion for players and can disrupt game flow.

**Steps to Reproduce:**
1. Start a game and observe the turn timer
2. Switch to another browser tab for 5-10 seconds
3. Return to the game tab
4. Observe timer behavior

**Expected Result:**  
Timer should continue counting down accurately regardless of tab focus.

**Actual Result:**  
Upon returning to the tab, the timer sometimes jumps back several seconds or skips ahead.

**Technical Analysis:**  
The issue appears to be related to how React handles `setTimeout` and `setInterval` when the browser tab is not focused. The timer implementation does not account for tab visibility changes.

**Code Location:**
- `frontend/src/components/GameTimer.tsx` (Lines 25-48)

**Fix Recommendation:**  
1. Replace the client-side timer implementation with server time synchronization
2. Update the timer component to use `requestAnimationFrame` instead of `setInterval`
3. Implement time drift correction when the tab regains focus
4. Add visibility change event listeners to adjust timer behavior

### BUG-011: Footballer cards don't have proper alt text for screen readers

**Severity:** High  
**Priority:** P0  
**Status:** In Progress  
**Assigned To:** Jennifer Wu  
**Affected Components:** Frontend - Accessibility  
**Test ID:** A11Y-101  

**Description:**  
Screen readers cannot properly identify footballer cards because they lack appropriate alt text. This makes the game completely unplayable for visually impaired users.

**Steps to Reproduce:**
1. Open the game with a screen reader enabled (NVDA, VoiceOver, etc.)
2. Navigate to the game board with footballer cards
3. Note that the screen reader announces "image" without descriptive information

**Expected Result:**  
Screen reader should announce descriptive information about each footballer card, including name, position, and team.

**Actual Result:**  
Screen reader only announces "image" or "graphic" without any context about the footballer.

**Technical Analysis:**  
In FootballerCard.tsx component, images are rendered without proper alt attributes:

```tsx
<img src={footballer.imageUrl} className="footballer-image" />
```

Should be changed to:

```tsx
<img 
  src={footballer.imageUrl} 
  alt={`Footballer ${footballer.name}, ${footballer.position}, ${footballer.team}`} 
  className="footballer-image"
/>
```

**Other Accessibility Issues:**
1. Game state changes are not announced to screen readers
2. Question buttons lack proper ARIA roles and states
3. Eliminated cards still receive keyboard focus

**Fix Recommendation:**  
1. Add proper alt text to all footballer images
2. Implement ARIA live regions for game state announcements
3. Add proper ARIA roles, states, and properties to all interactive elements
4. Ensure proper keyboard focus management

## Medium Severity Bugs

### BUG-019: Text overflow on small screens with long footballer names

**Severity:** Medium  
**Priority:** P1  
**Status:** Open  
**Assigned To:** Unassigned  
**Affected Components:** Frontend - Responsive Design  
**Test ID:** COMP-201  

**Description:**  
On mobile devices (particularly iPhone SE and other small screens), footballer names with more than 12 characters overflow their containers, causing layout issues and making some text unreadable.

**Steps to Reproduce:**
1. Open the game on a device with screen width less than 375px
2. Start a game with footballers that have long names
3. Observe text overflow in the footballer cards

**Expected Result:**  
Footballer names should either truncate with ellipsis or wrap appropriately within their containers.

**Actual Result:**  
Text overflows the container boundaries, sometimes overlapping with adjacent cards or being cut off.

**Browser/Device Information:**
- iPhone SE (2022)
- Samsung Galaxy S10e
- Any device with screen width < 375px

**Code Location:**
- `frontend/src/components/FootballerCard.tsx` (Lines 30-42)
- `frontend/src/styles/FootballerCard.css` (Lines 15-25)

**Screenshots:**  
[Link to screenshot showing text overflow issue on iPhone SE]

**Fix Recommendation:**  
1. Add text truncation with ellipsis for names longer than container width
2. Implement responsive font sizing based on container width
3. Add tooltip on hover/tap to show full name when truncated
4. Adjust layout for small screens to provide more space for text

## Low Severity Bugs

### BUG-025: Background music continues playing after game is paused

**Severity:** Low  
**Priority:** P3  
**Status:** Open  
**Assigned To:** Unassigned  
**Affected Components:** Frontend - Audio  
**Test ID:** TC-404  

**Description:**  
When a player pauses the game or opens the settings menu, the background music continues to play instead of pausing.

**Steps to Reproduce:**
1. Start a game with sound enabled
2. Open the pause menu or settings dialog
3. Notice that background music continues playing

**Expected Result:**  
Background music should pause when the game is paused or a modal dialog is open.

**Actual Result:**  
Background music continues playing through pause screens and modal dialogs.

**Code Location:**
- `frontend/src/services/AudioManager.ts` (Lines 60-75)
- `frontend/src/components/PauseMenu.tsx` (Lines 20-35)

**Fix Recommendation:**  
1. Update audio manager to listen for game state changes
2. Implement audio pausing when game state is "paused"
3. Add audio pause triggers for modal dialog open/close events

## Bug Trend Analysis

### Bug Discovery Timeline

| Week | New Bugs | Fixed Bugs | Total Open |
|------|----------|------------|------------|
| Week 1 (Aug 1-7) | 12 | 0 | 12 |
| Week 2 (Aug 8-15) | 15 | 1 | 26 |

### Bug Categories By Component

| Component | Critical | High | Medium | Low | Total |
|-----------|----------|------|--------|-----|-------|
| Frontend - UI | 0 | 4 | 2 | 2 | 8 |
| Frontend - Game Logic | 1 | 1 | 2 | 0 | 4 |
| Frontend - Accessibility | 1 | 2 | 1 | 0 | 4 |
| Backend - Game Logic | 1 | 1 | 1 | 1 | 4 |
| Backend - Socket.io | 2 | 1 | 0 | 0 | 3 |
| Backend - Database | 0 | 1 | 2 | 1 | 4 |

## Conclusion and Next Steps

The testing phase has identified 27 bugs across various components of the Football Guess Who game. Of these, 5 critical and 10 high severity issues must be addressed before release.

### Recommendations:

1. **Immediate action required:** Address the 5 critical bugs before proceeding to beta testing
2. **High priority:** Address high-severity accessibility and performance issues before public release
3. **Follow-up testing:** Schedule a focused re-testing session after critical fixes are implemented
4. **Automated testing:** Implement automated tests for the identified bug scenarios to prevent regression

**Next QA milestone:** Re-testing of critical and high-severity fixes - Scheduled for August 20-25, 2023

---

**Report prepared by:**  
Alex Chen, QA Lead  
August 16, 2023 