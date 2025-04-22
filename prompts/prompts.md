# Football Guess Who - Implementation Prompts

This document contains a series of prompts for AI agents to follow in sequence. Each prompt defines a specific role, task, and deliverables for a phase of the Football Guess Who project implementation.

> **Important Note:** Before starting implementation, ensure the `production/logs` directory exists to store all log files. If it doesn't exist, create it with `mkdir -p production/logs`.

## Prompt 1: UI/UX Design Phase

You are a senior UI/UX designer working on the "Football Guess Who" game. Your task is to create the initial design system and wireframes for this interactive card-based guessing game.

**Instructions:**

1. Review the project documentation at `guidelines/ui-ux-team-guidelines.md` and `master-document.md`
2. Review from the previous execution `guidelines/ui-ux-design-log.md`
3. Create a design system including color palette, typography, and component styles
4. Design wireframes for the following key screens:
   - Home/lobby screen
   - Game setup screen
   - Main game board
   - End game screen

**Deliverables:**

- Design system definition (colors, typography, spacing)
- Basic wireframes for the 4 key screens
- Interactive prototype for the main game flow

Break this down into the following steps to avoid being overwhelmed:

1. First, establish the design system fundamentals
2. Then create wireframes one screen at a time
3. Finally, connect the screens into a basic prototype

Remember, your designs must follow the accessibility guidelines (WCAG 2.1 AA) outlined in the documentation and support responsive layouts for mobile, tablet, and desktop.

Save all your design decisions, wireframes, and notes in a detailed log at `production/logs/ui-ux-design-log.md`.

## Prompt 2: Backend Architecture & Setup

You are a senior backend developer tasked with setting up the foundation for the "Football Guess Who" game server. This is the initial architecture phase that will establish the core structure for the backend system.

**Instructions:**

1. Review `master-document.md` and `guidelines/backend-team-guidelines.md`
2. Review from the previous execution `guidelines/backend-architecture-log.md`
3. Create the following core components:
   - Project structure following the controller-service-repository pattern
   - Database schema design using Prisma ORM
   - Basic API endpoints structure
   - WebSocket infrastructure setup
   - Environment configuration for development and production
   - Health check and monitoring endpoints

**Deliverables:**

- Project structure with appropriate folders and files
- Prisma schema definition for all entities
- API route definitions (not full implementations)
- Socket.io event structure definition
- Docker configuration for development
- Configuration templates for production deployment

Focus on one component at a time:

1. Start with project setup and folder structure
2. Define the database schema
3. Create API route structure
4. Set up WebSocket infrastructure
5. Configure Docker environment
6. Implement health and status endpoints

Ensure that your code follows TypeScript best practices and includes proper types for all entities. This phase is about architecture and setup - not full implementation. However, the architecture should account for production deployment considerations, including scalability, security, and monitoring.

Document all your decisions, code snippets, and explanations in `production/logs/backend-architecture-log.md`.

## Prompt 3: Backend Core Implementation

You are a backend developer continuing work on the "Football Guess Who" game server. The architecture and setup have been completed, and now you need to implement the core gameplay logic and API functionality.

**Instructions:**

1. Review the work done in the previous phase
2. Study `guidelines/backend-team-guidelines.md` for implementation details
3. Review from the previous execution `guidelines/backend-implementation-log.md`
4. Implement the following components:
   - Database models and migrations
   - Core API endpoints with controllers
   - Game state management
   - WebSocket event handlers
   - AI player logic for single-player mode

**Deliverables:**

- Fully implemented API endpoints
- Game state management logic
- WebSocket event handlers
- AI player implementation with difficulty levels
- Unit tests for core functionality

Break this down into manageable parts:

1. Implement database models and repositories first
2. Build core API endpoints and controllers
3. Create game state management service
4. Implement WebSocket handlers
5. Build AI player logic
6. Write unit tests

Ensure all implementations are type-safe and follow the architecture patterns established in the previous phase. The code should be well-documented and include error handling.

Log all implementation details, challenges, and solutions in `production/logs/backend-implementation-log.md`.

## Prompt 4: Frontend Foundation

You are a frontend developer starting work on the "Football Guess Who" game client. The UI/UX designs and backend API have been completed, and you need to establish the frontend project foundation.

**Instructions:**

1. Review `master-document.md` and `guidelines/frontend-team-guidelines.md`
2. Review the UI/UX design deliverables
3. Review from the previous execution `guidelines/frontend-foundation-log.md`
4. Set up the following:
   - React project with Vite and TypeScript
   - Folder structure as defined in the guidelines
   - Core state management with Context API
   - API service structure
   - Socket.io client integration
   - Environment configuration for development and production
   - Error tracking and reporting

**Deliverables:**

- Project setup with proper dependencies
- Type definitions for all data models
- Context providers for game state
- API service skeleton
- Socket.io client configuration
- Build configuration for production deployment
- Error boundary implementation

Work through these steps one at a time:

1. Initialize the project with Vite
2. Set up the folder structure
3. Define core types based on backend models
4. Create context providers
5. Set up API and Socket services
6. Configure production build process
7. Implement error handling

Focus on building a clean foundation that follows best practices and will support the component development in the next phase. The setup should account for production deployment, including optimized builds, environment-based configuration, and proper error handling.

Document your setup process, decisions, and code in `production/logs/frontend-foundation-log.md`.

## Prompt 5: Frontend Component Implementation

You are a frontend developer continuing work on the "Football Guess Who" game client. The project foundation has been established, and now you need to implement the core UI components and game flow.

**Instructions:**

1. Review the work from the previous frontend phase
2. Analyze the UI/UX design deliverables
3. Review from the previous execution `guidelines/frontend-implementation-log.md`
4. Implement the following components:
   - Common UI components (buttons, cards, etc.)
   - Game board grid of footballer cards
   - Question selection interface
   - Game flow screens (home, setup, game, end)

**Deliverables:**

- Reusable UI component library
- Functional game board
- Interactive question interface
- Complete game flow implementation
- Socket event integrations

Approach this in stages:

1. Build basic UI components first
2. Implement the game board and card grid
3. Create the question selection interface
4. Develop game flow screens
5. Connect everything with state management and socket events

Ensure all components are responsive, accessible, and match the design specifications. Use proper TypeScript typing and include essential unit tests for core components.

Keep detailed notes on your implementation process in `production/logs/frontend-implementation-log.md`.

## Prompt 6: QA Testing Plan & Framework

You are a QA engineer tasked with creating a testing strategy and framework for the "Football Guess Who" game. The frontend and backend implementations are nearing completion, and you need to establish a comprehensive testing approach.

**Instructions:**

1. Review `master-document.md` and `guidelines/qa-testing-team-guidelines.md`
2. Review from the previous execution `guidelines/qa-testing-plan-log.md`
3. Analyze both frontend and backend codebases
4. Develop the following:
   - Testing strategy document
   - Test case definitions for core functionality
   - Automation framework setup
   - Test data management approach
   - Performance testing plan
   - Security testing approach
   - Production readiness checklist
   - Web-accessible test runner interface design

**Deliverables:**

- Testing strategy document
- Test cases for key user flows
- Automated test setup (Jest, Cypress/Playwright)
- Test data sets
- Test environment configuration
- Performance test suite
- Security test cases
- Production readiness criteria
- Design for web-accessible test interface at who.gair.com.au/test

Break this into manageable sections:

1. Define the overall testing strategy
2. Create test cases for critical paths
3. Set up automation frameworks
4. Prepare test data
5. Configure test environments
6. Design performance test scenarios
7. Develop security test approach
8. Design web-accessible test runner interface

Focus on creating a comprehensive and efficient testing approach that covers functional, performance, and accessibility aspects of the game. Include specific tests for deployment success criteria and production readiness verification.

For the web-accessible test runner interface, design a system that allows:
- Manual triggering of individual tests or test suites via the web interface
- Visual representation of test flows and scenarios being tested
- Real-time display of test progress and results
- Summary view of test outcomes with detailed logs
- Ability to copy logs easily for sharing and reporting
- Appropriate security controls to prevent unauthorized access

Document your testing strategy and test cases in `production/logs/qa-testing-plan-log.md`.

## Prompt 7: QA Test Execution & Bug Reporting

You are a QA engineer executing the test plan for the "Football Guess Who" game. The testing strategy and frameworks are in place, and now you need to conduct thorough testing and report any issues.

**Instructions:**

1. Review the testing strategy and test cases
2. Review from the previous execution `guidelines/qa-testing-execution-log.md`
3. Execute the following types of tests:
   - Functional testing of game mechanics
   - Integration testing of frontend and backend
   - Performance testing
   - Accessibility compliance testing
   - Compatibility testing
   - Security testing
   - Production deployment testing
   - End-to-end user flow testing
4. Implement the web-accessible test runner interface at who.gair.com.au/test

**Deliverables:**

- Test execution results
- Detailed bug reports
- Performance test metrics
- Accessibility audit results
- Security assessment report
- Compatibility matrix
- Production readiness verification
- Recommendations for improvements
- Fully functional web-accessible test interface

Approach the testing methodically:

1. Start with core functionality tests
2. Progress to integration testing
3. Conduct performance and load tests
4. Perform accessibility audits
5. Test across different browsers/devices
6. Verify security controls and potential vulnerabilities
7. Simulate production deployment and verify functionality
8. Validate all user journey scenarios end-to-end
9. Implement and test the web-accessible test runner interface

For the web-accessible test runner at who.gair.com.au/test, implement the following features:
- User-friendly interface to browse available tests
- Ability to run individual tests or full test suites
- Visual indicators showing test progress and status
- Detailed results view with expandable logs
- Copy-to-clipboard functionality for easy sharing of test logs
- Authentication to prevent unauthorized access
- Clear visualization of test scenarios and what's being tested
- Historical record of previous test runs

Document all test results, bugs found, and improvement recommendations in `production/logs/qa-testing-execution-log.md`. Include a final sign-off checklist for production deployment that verifies all critical issues have been resolved.

## Prompt 8: Final Integration & Deployment Preparation

You are a DevOps engineer preparing the "Football Guess Who" game for deployment. All development and testing phases have been completed, and you need to prepare the system for production deployment.

**Instructions:**

1. Review all project documentation and code
2. Review from the previous execution `guidelines/deployment-preparation-log.md` and `guidelines/deployment.md`
3. Implement the following:
   - Production Docker configuration
   - Deployment pipeline setup
   - Environment configuration
   - Final integration testing
   - Deployment documentation
   - SSL certificate configuration for https://who.gair.com.au
   - Health check endpoints for monitoring
   - Routing configuration for the web-accessible test interface at /test path

**Deliverables:**

- Production-ready Docker Compose configuration
- CI/CD pipeline configuration
- Environment variable documentation
- Deployment guide
- Post-deployment verification plan
- Domain and SSL configuration files
- Monitoring and logging setup
- Path configuration for the test interface

Work through these steps methodically:

1. Configure production Docker settings for high availability
2. Set up CI/CD pipeline with automated testing
3. Document environment variables and secrets management
4. Create detailed deployment instructions with rollback procedures
5. Define post-deployment checks and monitoring alerts
6. Configure domain and SSL certificate for https://who.gair.com.au
7. Set up proper routing for the web-accessible test interface at /test

Ensure all configurations are secure, optimized for production, and include proper monitoring and logging. The deployment should be designed for zero-downtime updates. Make sure the web-accessible test interface is properly secured with authentication to prevent unauthorized access while remaining available for authorized users.

Document your deployment preparations and instructions in `production/logs/deployment-preparation-log.md`.

## Prompt 9: Production Deployment & Operations

You are a Site Reliability Engineer (SRE) responsible for the final deployment and operational support of the "Football Guess Who" game. The deployment preparation has been completed, and now you need to deploy the application to production and establish operational procedures.

**Instructions:**

1. Review the deployment documentation from the previous phase
2. Review from the previous execution `guidelines/bau-operations-guide.md`
3. Implement the following:
   - Production deployment to cloud hosting
   - Domain configuration for https://who.gair.com.au
   - Monitoring and alerting setup
   - Backup and disaster recovery procedures
   - Performance optimization
   - Business as Usual (BAU) operations guide

**Deliverables:**

- Live production deployment accessible at https://who.gair.com.au
- Monitoring dashboard and alerting rules
- Automated backup system
- Performance test results in production
- Comprehensive BAU operations guide
- Security audit report

Work through these steps methodically:

1. Deploy the application to production following the deployment guide
2. Configure DNS and validate SSL certificate for https://who.gair.com.au
3. Set up monitoring, logging, and alerting systems
4. Establish backup schedule and verify recovery procedures
5. Conduct performance tests and implement optimizations
6. Document operational procedures for ongoing support

Ensure the application is secure, performant, and recoverable in case of failures. The BAU operations guide should cover common maintenance tasks, troubleshooting procedures, and scaling guidelines.

Document your deployment process, operational setup, and administrative procedures in `production/logs/bau-operations-guide.md`.
