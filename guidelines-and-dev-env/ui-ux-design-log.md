# Football Guess Who - UI/UX Design Log

## Design System

### Color Palette

#### Primary Colors
- Primary Green: #1E6E50 (Football field)
- Primary Blue: #0F4C81 (Team jersey)

#### Secondary Colors
- Accent Yellow: #FFBF00 (Referee card)
- Accent Red: #D62839 (Team accent)

#### Neutrals
- Dark Gray: #333333 (Text)
- Medium Gray: #666666 (Secondary text)
- Light Gray: #EEEEEE (Backgrounds)
- White: #FFFFFF (Card backgrounds)

#### Semantic Colors
- Success: #28A745 (Yes answers)
- Error: #DC3545 (No answers)
- Warning: #FFC107 (Turn indicator)
- Info: #17A2B8 (Help text)

### Typography

#### Font Families
- Primary Font: Inter (UI elements, body text)
- Display Font: Montserrat (Headings, game title)

#### Font Sizes
- xs: 12px (Small labels)
- sm: 14px (Body text)
- base: 16px (Default size)
- lg: 18px (Large text)
- xl: 20px (Subheadings)
- 2xl: 24px (Headings)
- 3xl: 30px (Page titles)
- 4xl: 36px (Game title)

#### Font Weights
- Regular: 400 (Body text)
- Medium: 500 (Emphasis, buttons)
- Bold: 700 (Headings, important elements)

### Spacing System

Using an 8px base unit:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

### Component Designs

#### Footballer Cards
- Size: 120px × 180px (desktop), 90px × 135px (tablet), 70px × 105px (mobile)
- Border radius: 8px
- Shadow: 0 2px 4px rgba(0, 0, 0, 0.1)
- States:
  - Active: Full color, subtle glow
  - Eliminated: Desaturated with overlay
  - Selected: Highlighted border with Primary Blue

#### Buttons
- Primary: Solid fill with Primary Blue, white text
- Secondary: Outlined with Primary Blue, blue text
- Game Actions: Solid fill with Accent Yellow, dark text
- Border radius: 8px
- Padding: 12px 24px (standard), 8px 16px (compact)
- States: Normal, Hover, Focus, Active, Disabled

#### Question Interface
- Question categories: Card style buttons, 2-column grid
- Answer indicators: Large Yes/No buttons with Success/Error colors
- History display: Compact list with icons for yes/no answers

## Wireframes

### Home/Lobby Screen

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                                                            │
│                  ┌────────────────────┐                    │
│                  │   FOOTBALL GUESS   │  <- Game Logo      │
│                  │        WHO         │                    │
│                  └────────────────────┘                    │
│                                                            │
│                                                            │
│              ┌────────────────────────────┐                │
│              │      SINGLEPLAYER MODE     │  <- Primary    │
│              └────────────────────────────┘     Button     │
│                                                            │
│              ┌────────────────────────────┐                │
│              │      MULTIPLAYER MODE      │  <- Primary    │
│              └────────────────────────────┘     Button     │
│                                                            │
│              ┌────────────────────────────┐                │
│              │      HOW TO PLAY           │  <- Secondary  │
│              └────────────────────────────┘     Button     │
│                                                            │
│              ┌────────────────────────────┐                │
│              │      LEADERBOARD           │  <- Secondary  │
│              └────────────────────────────┘     Button     │
│                                                            │
│                                                            │
│                                                            │
│                                                            │
│  ┌────────────┐                            ┌───────────┐   │
│  │  SETTINGS  │                            │  PROFILE  │   │
│  └────────────┘                            └───────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### Responsive Considerations
- **Desktop**: Full layout as shown above
- **Tablet**: Same layout, scaled proportionally
- **Mobile**: Stacked buttons with smaller logo, scrollable if needed

#### Accessibility Features
- High contrast between buttons and background
- Focus indicators for keyboard navigation
- Text size respects system settings

### Game Setup Screen

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  ┌────────┐                                                │
│  │  BACK  │                                                │
│  └────────┘                                                │
│                                                            │
│            ┌───────────────────────────┐                   │
│            │      GAME SETUP           │  <- Page Title    │
│            └───────────────────────────┘                   │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  GAME MODE: [SINGLEPLAYER] or [MULTIPLAYER]         │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  ● DIFFICULTY (Singleplayer only)                  │   │
│  │                                                     │   │
│  │    [EASY]  [MEDIUM]  [HARD]                        │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  ● ROOM CODE (Multiplayer only)                    │   │
│  │                                                     │   │
│  │    CREATE ROOM: [GENERATE CODE]                    │   │
│  │    or                                              │   │
│  │    JOIN ROOM:  [____CODE____] [JOIN]              │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  DISPLAY NAME: [___________________]               │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  ADDITIONAL OPTIONS:                               │   │
│  │    ☑ Turn Time Limit: [30] seconds                │   │
│  │    ☑ Max Questions: [10]                          │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                            │
│                                                            │
│            ┌───────────────────────────┐                   │
│            │         START GAME        │  <- Primary       │
│            └───────────────────────────┘     Button        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### Waiting for Opponent Screen (Multiplayer Mode)

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  ┌────────┐                                                │
│  │  BACK  │                                                │
│  └────────┘                                                │
│                                                            │
│            ┌───────────────────────────┐                   │
│            │    WAITING FOR PLAYER     │  <- Page Title    │
│            └───────────────────────────┘                   │
│                                                            │
│                                                            │
│                                                            │
│                      [Loading Animation]                   │
│                                                            │
│                                                            │
│                                                            │
│              ROOM CODE: ABC123                            │
│                                                            │
│              Share this code with your opponent!          │
│                                                            │
│                                                            │
│                                                            │
│            ┌───────────────────────────┐                   │
│            │          CANCEL           │  <- Secondary     │
│            └───────────────────────────┘     Button        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### Responsive Considerations
- **Desktop**: Full layout as shown above
- **Tablet**: Same layout with slight adjustments to form elements
- **Mobile**: Stacked sections, each option group in its own card

#### Accessibility Features
- Clear section headers with visual separation
- Form labels visually connected to inputs
- Focus states for all interactive elements
- Error states for form validation

### Main Game Board

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                    │
│  ┌─────────────┐ ┌────────────────────────────────────────────────────┐  ┌─────────────────────┐  │
│  │ GAME MENU   │ │               YOUR TURN - 00:25 REMAINING          │  │ OPPONENT: Player2   │  │
│  └─────────────┘ └────────────────────────────────────────────────────┘  └─────────────────────┘  │
│                                                                                                    │
│  ┌─────────────────────────────────────────────────────────┐  ┌──────────────────────────────┐    │
│  │                                                         │  │                              │    │
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐             │  │  QUESTION SELECTION          │    │
│  │  │ F1 │ │ F2 │ │ F3 │ │ F4 │ │ F5 │ │ F6 │             │  │                              │    │
│  │  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘             │  │  ┌──────────────────────┐    │    │
│  │                                                         │  │  │ POSITION             │    │    │
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐             │  │  └──────────────────────┘    │    │
│  │  │ F7 │ │ F8 │ │ F9 │ │F10 │ │F11 │ │F12 │             │  │                              │    │
│  │  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘             │  │  ┌──────────────────────┐    │    │
│  │                                                         │  │  │ TEAM/CLUB            │    │    │
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐             │  │  └──────────────────────┘    │    │
│  │  │F13 │ │F14 │ │F15 │ │F16 │ │F17 │ │F18 │             │  │                              │    │
│  │  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘             │  │  ┌──────────────────────┐    │    │
│  │                                                         │  │  │ NATIONALITY          │    │    │
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐             │  │  └──────────────────────┘    │    │
│  │  │F19 │ │F20 │ │F21 │ │F22 │ │F23 │ │F24 │             │  │                              │    │
│  │  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘             │  │  ┌──────────────────────┐    │    │
│  │                                                         │  │  │ PHYSICAL FEATURES    │    │    │
│  │                                                         │  │  └──────────────────────┘    │    │
│  │                                                         │  │                              │    │
│  │                                                         │  │  ┌──────────────────────┐    │    │
│  │                                                         │  │  │ AGE BRACKET          │    │    │
│  │                                                         │  │  └──────────────────────┘    │    │
│  │                                                         │  │                              │    │
│  │                 GAME BOARD                              │  │  ┌──────────────────────┐    │    │
│  │                                                         │  │  │ MAKE A GUESS         │    │    │
│  │                                                         │  │  └──────────────────────┘    │    │
│  │                                                         │  │                              │    │
│  └─────────────────────────────────────────────────────────┘  └──────────────────────────────┘    │
│                                                                                                    │
│  ┌─────────────────────────────────────────────────────────┐  ┌──────────────────────────────┐    │
│  │                                                         │  │                              │    │
│  │  QUESTION HISTORY                                       │  │  SELECTED QUESTION:         │    │
│  │                                                         │  │                              │    │
│  │  YOU: "Is the player a forward?" - NO                   │  │  Does the player have       │    │
│  │                                                         │  │  brown hair?                │    │
│  │  OPPONENT: "Is the player from Europe?" - YES           │  │                              │    │
│  │                                                         │  │  ┌────────┐    ┌────────┐    │    │
│  │  YOU: "Does the player have a beard?" - YES             │  │  │  YES   │    │   NO   │    │    │
│  │                                                         │  │  └────────┘    └────────┘    │    │
│  │                                                         │  │                              │    │
│  └─────────────────────────────────────────────────────────┘  └──────────────────────────────┘    │
│                                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Footballer Card Detail

```
┌────────┐
│        │
│  ┌──┐  │ <- Footballer Image
│  │  │  │
│  └──┘  │
│        │
│ NAME   │ <- Footballer Name
│        │
└────────┘

States:
- Active: Full color image
- Eliminated: Grayscale with "X" overlay
- Selected: Highlighted border
```

#### Position Specific Question Submenu

```
┌─────────────────────────────────────┐
│                                     │
│  POSITION QUESTIONS                 │
│                                     │
│  ○ Is the player a goalkeeper?      │
│  ○ Is the player a defender?        │
│  ○ Is the player a midfielder?      │
│  ○ Is the player a forward?         │
│                                     │
│  ┌─────────┐       ┌───────────┐    │
│  │  BACK   │       │   SELECT  │    │
│  └─────────┘       └───────────┘    │
│                                     │
└─────────────────────────────────────┘
```

#### Make a Guess Interface

```
┌─────────────────────────────────────┐
│                                     │
│  MAKE YOUR FINAL GUESS              │
│                                     │
│  Select a footballer from the board │
│  to make your final guess.          │
│                                     │
│  Selected: [Footballer Name]        │
│                                     │
│  ┌─────────┐       ┌───────────┐    │
│  │ CANCEL  │       │  CONFIRM  │    │
│  └─────────┘       └───────────┘    │
│                                     │
└─────────────────────────────────────┘
```

#### Responsive Considerations
- **Desktop**: Layout as shown above with side-by-side panels
- **Tablet**: 
  - Game board takes full width
  - Question panel slides in from right when needed
  - History panel collapsible at bottom
- **Mobile**: 
  - Stacked layout with tabs for different sections
  - Swipeable card grid with pinch-to-zoom
  - Question selection in modal overlay

#### Accessibility Features
- Keyboard navigation through card grid (arrow keys)
- Color + icon indicators for card status (not just color alone)
- Screen reader announcements for turn changes and answers
- Sufficient touch targets for mobile use

### End Game Screen

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                                                            │
│            ┌───────────────────────────┐                   │
│            │        GAME OVER!         │  <- Page Title    │
│            └───────────────────────────┘                   │
│                                                            │
│                                                            │
│                                                            │
│                    YOU WON!                               │
│                                                            │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  SECRET FOOTBALLER REVEALED:                       │   │
│  │                                                     │   │
│  │  ┌──────────────────────┐                          │   │
│  │  │                      │                          │   │
│  │  │     [FOOTBALLER]     │                          │   │
│  │  │                      │                          │   │
│  │  │                      │                          │   │
│  │  └──────────────────────┘                          │   │
│  │                                                     │   │
│  │  Name: Lionel Messi                               │   │
│  │  Club: Inter Miami                                │   │
│  │  Position: Forward                                │   │
│  │  Nationality: Argentina                           │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  GAME STATISTICS                                    │   │
│  │                                                     │   │
│  │  Questions Asked: 8                                │   │
│  │  Time Taken: 3:45                                  │   │
│  │  Cards Eliminated: 20                              │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                            │
│            ┌───────────────────────────┐                   │
│            │         PLAY AGAIN        │  <- Primary       │
│            └───────────────────────────┘     Button        │
│                                                            │
│            ┌───────────────────────────┐                   │
│            │       MAIN MENU           │  <- Secondary     │
│            └───────────────────────────┘     Button        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### Game Lost State

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│            ┌───────────────────────────┐                   │
│            │        GAME OVER!         │  <- Page Title    │
│            └───────────────────────────┘                   │
│                                                            │
│                                                            │
│                   YOU LOST!                                │
│                                                            │
│                                                            │
│  [Similar layout to win screen but with different styling] │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### Responsive Considerations
- **Desktop**: Full layout as shown above
- **Tablet**: Same layout, with slightly smaller footballer card
- **Mobile**: Stacked sections, footballer card at top

#### Accessibility Features
- Clear win/lose status with multiple indicators (text, color, icons)
- All game statistics available to screen readers
- Focus management directs to primary actions

## Interactive Prototype

For the interactive prototype, the screens should be connected in the following flow:

1. Home/Lobby Screen
   - Singleplayer Mode → Game Setup (Singleplayer) → Main Game Board
   - Multiplayer Mode → Game Setup (Multiplayer) → Waiting Screen → Main Game Board
   - How to Play → Tutorial (not wireframed)
   - Leaderboard → Leaderboard (not wireframed)

2. Game Setup → Back → Home/Lobby

3. Main Game Board
   - Make a Guess → End Game Screen (Win or Lose)
   - Game Menu → Confirmation Dialog → Home/Lobby

4. End Game Screen
   - Play Again → Game Setup
   - Main Menu → Home/Lobby

The prototype should demonstrate:
- Turn-based gameplay (your turn → opponent's turn)
- Card elimination after questions
- Question selection flow
- Making a guess

## Design Decisions and Notes

### Color Palette Rationale
- **Primary Colors**: Football-themed greens and blues to evoke playing field and team jerseys
- **Secondary Colors**: Yellow and red reflect referee cards and team accent colors
- **Semantic Colors**: Using standard conventions for yes/no and success/error states

### Typography Choices
- **Inter**: Clean, modern sans-serif with excellent readability across device sizes
- **Montserrat**: Bold display font for headings to add personality while maintaining readability

### Layout Strategy
- Prioritizing the game board as the central focus of the interface
- Consistent placement of action buttons (bottom center for primary actions)
- Clear visual hierarchy with section headings and containment

### Responsive Approach
- Mobile-first component design with adaptations for larger screens
- Strategic use of modals and slide-out panels for smaller screens
- Touch-friendly designs with appropriately sized tap targets

### Accessibility Considerations
- Multiple indicators beyond color alone (icons, text)
- Keyboard navigation support throughout the interface
- Screen reader announcements for game events
- Respecting user preferences for motion and text size

### Next Steps
1. Create high-fidelity mockups based on these wireframes
2. Develop component prototypes for key interactions
3. Conduct usability testing with target audience
4. Refine designs based on feedback
5. Create final assets for development handoff 