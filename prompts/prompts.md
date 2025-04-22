# Football Guess Who - Implementation Prompts

This document contains a series of prompts for AI agents to follow in sequence. Each prompt defines a specific role, task, and deliverables for recreating the "Football Guess Who" application in a production environment.

> **Important Production Implementation Note:** 
> 
> You are tasked with recreating the complete "Football Guess Who" web application in this production environment. The application was previously built in a development environment, and you must now implement a production-ready version on this server. Each prompt must:
> 
> - Create actual working code and configuration files in the current server at `/root/guess-who-footballer`
> - Use `/root/guess-who-footballer/master-document.md` for overall application architecture and requirements
> - Reference previous implementation logs from `/root/guess-who-footballer/logs-from-dev-env/` for implementation guidance
> - Follow team guidelines from `/root/guess-who-footballer/guidelines/` for domain-specific requirements
> - Create Docker containers for all application components (frontend, backend, database)
> - Configure production-ready Docker Compose setup with proper networking
> - Check for and avoid port conflicts with any existing services (especially ports 80, 443)
> - Stop any existing "Football Guess Who" services or applications on who.gair.com.au
> - Use real values in all .env files (not placeholders)
> - Create a fully functional, production-quality web application that can be accessed at who.gair.com.au
> - Install all necessary packages and dependencies with proper versions
> - Each prompt builds on the work of previous prompts to create a complete application

## Prompt 1: UI/UX Design Phase

You are a senior UI/UX designer working on the "Football Guess Who" game. Your task is to create the initial design system and wireframes for this interactive card-based guessing game in the production environment.

**Instructions:**

1. Review the project documentation at `/root/guess-who-footballer/master-document.md` and `/root/guess-who-footballer/guidelines/ui-ux-team-guidelines.md`
2. Review the previous implementation from `/root/guess-who-footballer/logs-from-dev-env/ui-ux-design-log.md`
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

Save all your design decisions, wireframes, and notes in a detailed log at `/root/guess-who-footballer/production/logs/ui-ux-design-log.md`.

## Prompt 2: Backend Architecture & Setup

You are a senior backend developer tasked with setting up the foundation for the "Football Guess Who" game server in the production environment. This is the initial architecture phase that will establish the core structure for the backend system that will be deployed to who.gair.com.au.

**Instructions:**

1. Review `/root/guess-who-footballer/master-document.md` and `/root/guess-who-footballer/guidelines/backend-team-guidelines.md`
2. Review the previous implementation from `/root/guess-who-footballer/logs-from-dev-env/backend-architecture-log.md`
3. Run system checks to identify existing services and port usage to avoid conflicts (especially ports 80, 443)
4. Create the following core components in the `/root/guess-who-footballer` directory:
   - Project structure following the controller-service-repository pattern
   - Database schema design using Prisma ORM
   - Basic API endpoints structure
   - WebSocket infrastructure setup
   - Environment configuration for production
   - Health check and monitoring endpoints
   - Required package dependencies with exact versions

**Deliverables:**

- Complete backend project structure with all necessary files
- Prisma schema definition for all entities
- API route definitions with controllers
- Socket.io event structure definition
- Docker configuration for production with appropriate resource limits
- Nginx or similar reverse proxy configuration if needed
- Production .env file with real values (database credentials, API keys, etc.)
- Database initialization scripts
- Package.json with all required dependencies

Focus on one component at a time:

1. Start with project setup and folder structure
2. Define the database schema and migrations
3. Create API route structure
4. Set up WebSocket infrastructure
5. Configure Docker environment with production optimizations
6. Implement health and status endpoints
7. Set up proper logging for production

Ensure that your code follows TypeScript best practices and includes proper types for all entities. The architecture should account for production deployment considerations, including scalability, security, monitoring, and potential zero-downtime updates.

Document all your decisions, code snippets, and explanations in `/root/guess-who-footballer/production/logs/backend-architecture-log.md`.

## Prompt 3: Backend Core Implementation

You are a backend developer continuing work on the "Football Guess Who" game server for the production deployment. The architecture and setup have been completed, and now you need to implement the core gameplay logic and API functionality that will run in production.

**Instructions:**

1. Review the work done in the previous phase at `/root/guess-who-footballer`
2. Study `/root/guess-who-footballer/guidelines/backend-team-guidelines.md` for implementation details
3. Review the previous implementation from `/root/guess-who-footballer/logs-from-dev-env/backend-implementation-log.md`
4. Implement the following components in the codebase at `/root/guess-who-footballer`:
   - Database models and migrations
   - Core API endpoints with controllers
   - Game state management
   - WebSocket event handlers
   - AI player logic for single-player mode
   - Error handling and logging for production
   - Security measures (rate limiting, input validation, etc.)

**Deliverables:**

- Fully implemented and production-ready API endpoints
- Game state management logic with persistence
- WebSocket event handlers with proper error recovery
- AI player implementation with difficulty levels
- Unit tests for core functionality
- Security configurations for production
- Dockerized backend service ready for production

Break this down into manageable parts:

1. Implement database models and repositories first
2. Build core API endpoints and controllers
3. Create game state management service
4. Implement WebSocket handlers
5. Build AI player logic
6. Write unit tests
7. Add proper error handling and logging
8. Implement security measures

Ensure all implementations are type-safe and follow the architecture patterns established in the previous phase. The code should be well-documented and include production-grade error handling, logging, and monitoring.

Log all implementation details, challenges, and solutions in `/root/guess-who-footballer/production/logs/backend-implementation-log.md`.

## Prompt 4: Frontend Foundation

You are a frontend developer starting work on the "Football Guess Who" game client for production deployment to who.gair.com.au. The UI/UX designs and backend API have been completed, and you need to establish the frontend project foundation.

**Instructions:**

1. Review `/root/guess-who-footballer/master-document.md` and `/root/guess-who-footballer/guidelines/frontend-team-guidelines.md`
2. Review the UI/UX design deliverables
3. Review the previous implementation from `/root/guess-who-footballer/logs-from-dev-env/frontend-foundation-log.md`
4. Set up the following in the `/root/guess-who-footballer` directory:
   - React project with Vite and TypeScript
   - Folder structure as defined in the guidelines
   - Core state management with Context API
   - API service structure
   - Socket.io client integration
   - Environment configuration for production
   - Error tracking and reporting
   - Dockerfile and build configuration for production

**Deliverables:**

- Project setup with proper dependencies and package.json
- Type definitions for all data models
- Context providers for game state
- API service with proper endpoint integration
- Socket.io client configuration for production
- Build configuration optimized for production
- Error boundary implementation
- Production .env file with real API endpoints and configuration
- Dockerized frontend service ready for deployment

Work through these steps one at a time:

1. Initialize the project with Vite
2. Set up the folder structure
3. Define core types based on backend models
4. Create context providers
5. Set up API and Socket services
6. Configure production build process
7. Implement error handling
8. Create Docker configuration 

Focus on building a clean foundation that follows best practices and will support the component development in the next phase. The setup should account for production deployment, including optimized builds, environment-based configuration, and proper error handling.

Document your setup process, decisions, and code in `/root/guess-who-footballer/production/logs/frontend-foundation-log.md`.

## Prompt 5: Frontend Component Implementation

You are a frontend developer continuing work on the "Football Guess Who" game client for the production deployment. The project foundation has been established, and now you need to implement the core UI components and game flow.

**Instructions:**

1. Review the work from the previous frontend phase in `/root/guess-who-footballer`
2. Analyze the UI/UX design deliverables
3. Review the previous implementation from `/root/guess-who-footballer/logs-from-dev-env/frontend-implementation-log.md`
4. Implement the following components in the codebase:
   - Common UI components (buttons, cards, etc.)
   - Game board grid of footballer cards
   - Question selection interface
   - Game flow screens (home, setup, game, end)
   - Optimizations for production performance
   - Loading states and error handling

**Deliverables:**

- Reusable UI component library
- Functional game board
- Interactive question interface
- Complete game flow implementation
- Socket event integrations
- Production-optimized bundle
- Fully responsive design for mobile, tablet, and desktop
- Complete frontend application ready for production

Approach this in stages:

1. Build basic UI components first
2. Implement the game board and card grid
3. Create the question selection interface
4. Develop game flow screens
5. Connect everything with state management and socket events
6. Optimize for production performance
7. Add comprehensive error handling

Ensure all components are responsive, accessible, and match the design specifications. Use proper TypeScript typing and include essential unit tests for core components. The final output should be a production-ready frontend that connects properly to the backend services.

Keep detailed notes on your implementation process in `/root/guess-who-footballer/production/logs/frontend-implementation-log.md`.

## Prompt 6: QA Testing Plan & Framework

You are a QA engineer tasked with creating a testing strategy and framework for the "Football Guess Who" game in production. The frontend and backend implementations are nearing completion, and you need to establish a comprehensive testing approach for the site that will be deployed to who.gair.com.au.

**Instructions:**

1. Review `/root/guess-who-footballer/master-document.md` and `/root/guess-who-footballer/guidelines/qa-testing-team-guidelines.md`
2. Review the previous implementation from `/root/guess-who-footballer/logs-from-dev-env/qa-testing-plan-log.md`
3. Analyze both frontend and backend codebases in `/root/guess-who-footballer`
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
- Implementation of web-accessible test interface at who.gair.com.au/test

Break this into manageable sections:

1. Define the overall testing strategy
2. Create test cases for critical paths
3. Set up automation frameworks
4. Prepare test data
5. Configure test environments
6. Design performance test scenarios
7. Develop security test approach
8. Design and implement web-accessible test runner interface

Focus on creating a comprehensive and efficient testing approach that covers functional, performance, and accessibility aspects of the game. Include specific tests for deployment success criteria and production readiness verification.

For the web-accessible test runner interface, implement a system that allows:
- Manual triggering of individual tests or test suites via the web interface
- Visual representation of test flows and scenarios being tested
- Real-time display of test progress and results
- Summary view of test outcomes with detailed logs
- Copy-to-clipboard functionality for easy sharing of test logs
- Authentication to prevent unauthorized access
- Clear visualization of test scenarios and what's being tested
- Historical record of previous test runs

Document your testing strategy and test cases in `/root/guess-who-footballer/production/logs/qa-testing-plan-log.md`.

## Prompt 7: QA Test Execution & Bug Reporting

You are a QA engineer executing the test plan for the "Football Guess Who" game in the production environment. The testing strategy and frameworks are in place, and now you need to conduct thorough testing and report any issues to ensure the application is ready for deployment to who.gair.com.au.

**Instructions:**

1. Review the testing strategy and test cases from the previous phase
2. Review the previous implementation from `/root/guess-who-footballer/logs-from-dev-env/qa-testing-execution-log.md`
3. Execute the following types of tests on the application in `/root/guess-who-footballer`:
   - Functional testing of game mechanics
   - Integration testing of frontend and backend
   - Performance testing in production-like conditions
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
- Fixed critical bugs before deployment

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

Document all test results, bugs found, and improvement recommendations in `/root/guess-who-footballer/production/logs/qa-testing-execution-log.md`. Include a final sign-off checklist for production deployment that verifies all critical issues have been resolved.

## Prompt 8: Final Integration & Deployment Preparation

You are a DevOps engineer preparing the "Football Guess Who" game for deployment to who.gair.com.au. All development and testing phases have been completed, and you need to prepare the system for production deployment.

**Instructions:**

1. Review all project documentation and code in `/root/guess-who-footballer`
2. Review the previous implementation from `/root/guess-who-footballer/logs-from-dev-env/deployment-preparation-log.md` and `/root/guess-who-footballer/guidelines/deployment.md`
3. Run system checks to identify existing services and port usage to avoid conflicts
4. Stop any existing services running on who.gair.com.au
5. Implement the following:
   - Production Docker Compose configuration with all services
   - Deployment pipeline setup
   - Environment configuration
   - Final integration testing
   - Deployment documentation
   - SSL certificate configuration for https://who.gair.com.au
   - Health check endpoints for monitoring
   - Routing configuration for the web-accessible test interface at /test path
   - Database backup strategy

**Deliverables:**

- Production-ready Docker Compose configuration
- CI/CD pipeline configuration
- Environment variable documentation
- Deployment guide
- Post-deployment verification plan
- Domain and SSL configuration files
- Monitoring and logging setup
- Path configuration for the test interface
- Production .env files with real values for all components
- Database backup and restore procedures
- Load balancing configuration (if applicable)

Work through these steps methodically:

1. Configure production Docker settings for high availability
2. Set up CI/CD pipeline with automated testing
3. Document environment variables and secrets management
4. Create detailed deployment instructions with rollback procedures
5. Define post-deployment checks and monitoring alerts
6. Configure domain and SSL certificate for https://who.gair.com.au
7. Set up proper routing for the web-accessible test interface at /test
8. Implement database backup strategy

Ensure all configurations are secure, optimized for production, and include proper monitoring and logging. The deployment should be designed for zero-downtime updates. Make sure the web-accessible test interface is properly secured with authentication to prevent unauthorized access while remaining available for authorized users.

Document your deployment preparations and instructions in `/root/guess-who-footballer/production/logs/deployment-preparation-log.md`.

## Prompt 9: Production Deployment & Operations

You are a Site Reliability Engineer (SRE) responsible for the final deployment and operational support of the "Football Guess Who" game. The deployment preparation has been completed, and now you need to deploy the application to production at who.gair.com.au and establish operational procedures.

**Instructions:**

1. Review the deployment documentation from the previous phase in `/root/guess-who-footballer`
2. Review the previous implementation from `/root/guess-who-footballer/logs-from-dev-env/bau-operations-guide.md`
3. Run system checks to identify existing services and port usage to avoid conflicts
4. Stop any existing services running on who.gair.com.au
5. Implement the following:
   - Production deployment using Docker Compose
   - Domain configuration for https://who.gair.com.au
   - Monitoring and alerting setup
   - Backup and disaster recovery procedures
   - Performance optimization
   - Business as Usual (BAU) operations guide
   - Security hardening for production

**Deliverables:**

- Live production deployment accessible at https://who.gair.com.au
- Monitoring dashboard and alerting rules
- Automated backup system
- Performance test results in production
- Comprehensive BAU operations guide
- Security audit report
- Production .env files with real values
- Server resource optimization
- Incident response playbooks

Work through these steps methodically:

1. Deploy the application to production following the deployment guide
2. Configure DNS and validate SSL certificate for https://who.gair.com.au
3. Set up monitoring, logging, and alerting systems
4. Establish backup schedule and verify recovery procedures
5. Conduct performance tests and implement optimizations
6. Document operational procedures for ongoing support
7. Create incident response procedures
8. Verify the application is fully functional at who.gair.com.au

Ensure the application is secure, performant, and recoverable in case of failures. The BAU operations guide should cover common maintenance tasks, troubleshooting procedures, and scaling guidelines. Verify that all components are properly containerized and the system is accessible at who.gair.com.au with proper SSL configuration.

Document your deployment process, operational setup, and administrative procedures in `/root/guess-who-footballer/production/logs/bau-operations-guide.md`.
