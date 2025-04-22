# UI/UX Team Guidelines

## Overview

The UI/UX team is responsible for designing an engaging, intuitive, and accessible user experience for the Football Guess Who game. This includes creating visual designs, interaction patterns, and ensuring the game is enjoyable across different devices.

## Objectives

- Create a visually appealing and intuitive game interface
- Design responsive layouts for various device sizes
- Establish clear interaction patterns for game mechanics
- Ensure accessibility for all users
- Maintain visual consistency throughout the application

## Design System

### Visual Language

1. **Color Palette**
   - Primary colors: Based on football theme (greens, blues)
   - Secondary colors: For accents and highlights
   - Neutrals: For text and backgrounds
   - Ensure all color combinations meet WCAG 2.1 AA contrast requirements

2. **Typography**
   - Primary font: Sans-serif for readability (e.g., Inter, Roboto)
   - Display font: For headings and important game elements
   - Font sizes should scale appropriately across devices
   - Ensure minimum text size of 16px for readability

3. **Iconography**
   - Design consistent icons for game actions
   - Create sport-themed icons for UI elements
   - Provide both filled and outlined versions
   - Include alt text for all icons

4. **Spacing System**
   - Establish a consistent spacing scale
   - Use multiples of a base unit (e.g., 4px or 8px)
   - Define standard spacing for components

### Component Design

1. **Cards**
   - Footballer card design with consistent layout
   - Different visual states (active, eliminated, selected)
   - Responsive sizing for different devices

2. **Buttons & Controls**
   - Primary, secondary, and tertiary button styles
   - Game-specific controls (question selection, guessing)
   - Hover, focus, active, and disabled states
   - Touch-friendly sizing (minimum 44x44px)

3. **Dialog & Modal Patterns**
   - Game setup modals
   - Question/answer dialogs
   - End game screens
   - Consistent close and action patterns

4. **Navigation**
   - Menu structure for game navigation
   - Breadcrumbs for multi-step processes
   - Clear back/forward patterns

5. **Forms & Inputs**
   - Text input styling
   - Dropdown and select components
   - Radio and checkbox designs
   - Error and validation states

## Screen Designs

### Home Screen

1. **Components**
   - Game logo and branding
   - Game mode selection (SP/MP)
   - Create/Join game buttons
   - Optional: user profile/stats

2. **Layout Considerations**
   - Prominent call-to-action
   - Clear visual hierarchy
   - Responsive adaptation

### Game Setup

1. **Components**
   - Mode configuration options
   - Difficulty selection (SP mode)
   - Room code display/entry (MP mode)
   - Ready/Start button

2. **Layout Considerations**
   - Step-by-step flow
   - Waiting state design
   - Error handling visuals

### Main Game Screen

1. **Components**
   - Game board (6x4 footballer grid)
   - Question interface
   - Turn indicator
   - Game controls
   - History/log display

2. **Layout Considerations**
   - Desktop: Side-by-side layout with game board and controls
   - Tablet: Adaptable layout with collapsible panels
   - Mobile: Stacked layout with swipeable/tabbed sections

3. **Key States**
   - Your turn vs. opponent's turn
   - Question asking vs. answering
   - Making a guess
   - Card elimination visualization

### End Game Screen

1. **Components**
   - Winner announcement
   - Game statistics
   - Rematch option
   - Return to menu button

2. **Layout Considerations**
   - Clear result communication
   - Engaging victory/defeat visualization
   - Prominent next action options

## Animation & Interaction

### Animations

1. **Micro-interactions**
   - Button feedback
   - Selection effects
   - Focus states

2. **Game Flow Animations**
   - Turn transitions
   - Card elimination effects
   - Question/answer sequence

3. **Victory/Defeat Animations**
   - Winning celebration
   - Game over visualization
   - Stats reveal

### Interaction Patterns

1. **Card Interaction**
   - Tap/click to select
   - Visual feedback on hover/focus
   - Clear selection indicators

2. **Question Flow**
   - Step-by-step question selection
   - Clear yes/no answering interface
   - History tracking visualization

3. **Guess Mechanics**
   - Confirmation dialog for guesses
   - Clear result communication
   - Win/lose state transitions

## Responsive Design

### Breakpoints

- Mobile: 320px - 480px
- Tablet: 481px - 768px
- Desktop: 769px+

### Layout Adaptations

1. **Mobile Considerations**
   - Stacked layouts for game elements
   - Touch-friendly controls
   - Swipeable card grid
   - Condensed question interface

2. **Tablet Considerations**
   - Hybrid layouts
   - Collapsible panels
   - Optimized question selection

3. **Desktop Considerations**
   - Side-by-side layouts
   - Keyboard shortcuts
   - Enhanced visuals

## Accessibility Guidelines

1. **Visual Accessibility**
   - Sufficient color contrast (WCAG 2.1 AA)
   - Text scaling support
   - Alternative indicators beyond color
   - Support for high contrast mode

2. **Keyboard Navigation**
   - Logical tab order
   - Focus indicators
   - Keyboard shortcuts for common actions
   - Skip navigation links

3. **Screen Reader Support**
   - Proper ARIA labels
   - Semantic HTML
   - Meaningful alt text
   - Dynamic content announcements

4. **Additional Considerations**
   - Reduced motion options
   - Adjustable timing for timed elements
   - Text alternatives for audio cues

## User Testing Guidelines

1. **Usability Testing Methods**
   - Task-based testing scenarios
   - A/B testing for key interactions
   - First-time user testing

2. **Key Test Scenarios**
   - First-time game setup
   - Question selection and answering
   - Making guesses
   - Game completion flow

3. **Metrics to Track**
   - Time to complete actions
   - Error rates
   - Satisfaction scores
   - Engagement duration

## Deliverables

1. **Design Assets**
   - Component library in Figma/Adobe XD
   - Design system documentation
   - UI kit with reusable components
   - Icon set and illustrations

2. **Interaction Specifications**
   - Animation timings and easing
   - Interaction state maps
   - Transition specifications

3. **Responsive Designs**
   - Breakpoint-specific layouts
   - Adaptive component variations
   - Touch-specific interaction guides

4. **Prototypes**
   - Interactive prototypes for key flows
   - Animation concepts
   - User testing prototypes 