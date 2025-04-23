# Football Guess Who - Performance Testing Plan

## 1. Overview

This document outlines the performance testing approach for the Football Guess Who game. The goal is to ensure the application can handle the expected load with acceptable response times and resource usage in the production environment at who.gair.com.au.

## 2. Performance Testing Objectives

- Verify the application meets response time requirements under various load conditions
- Identify bottlenecks and performance issues before production deployment
- Establish baseline performance metrics for monitoring in production
- Validate WebSocket communication stability under load
- Ensure database performance with multiple concurrent games
- Verify Docker container resource utilization is within acceptable limits

## 3. Key Performance Indicators (KPIs)

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| API Response Time | < 200ms (avg) | > 500ms |
| WebSocket Event Latency | < 100ms (avg) | > 300ms |
| Page Load Time | < 2s | > 5s |
| Database Query Time | < 50ms (avg) | > 200ms |
| Concurrent Games | 100 | < 50 |
| Concurrent Users | 200 | < 100 |
| CPU Utilization | < 70% | > 90% |
| Memory Usage | < 60% | > 85% |
| Error Rate | < 0.1% | > 1% |
| WebSocket Reconnection Success | > 99% | < 95% |

## 4. Test Types

### 4.1 Load Testing

**Objective:** Verify system performance under expected load conditions

**Tool:** k6

**Scenarios:**
1. **Gradual Ramp-Up**
   - Start with 10 concurrent users
   - Increase by 10 users every 30 seconds
   - Up to 200 concurrent users
   - Duration: 10 minutes

2. **Sustained Load**
   - 100 concurrent users
   - Duration: 30 minutes
   - Monitor response times and error rates

3. **Game Creation Spike**
   - Simulate 50 game creation requests within 60 seconds
   - Verify all games are created successfully
   - Monitor API response times

### 4.2 Stress Testing

**Objective:** Identify breaking points and system behavior under extreme conditions

**Tool:** k6

**Scenarios:**
1. **Maximum Concurrent Games**
   - Create games incrementally until performance degrades
   - Record the maximum number of games before issues occur
   - Identify bottlenecks (CPU, memory, network, database)

2. **Rapid Socket Events**
   - Simulate rapid question/answer exchanges (10 per second)
   - Duration: 5 minutes
   - Monitor event processing and state consistency

3. **Database Stress**
   - Simulate heavy read/write operations
   - Focus on game state updates and queries
   - Measure query execution times

### 4.3 Endurance Testing

**Objective:** Verify system stability over extended periods

**Tool:** k6, Docker stats

**Scenarios:**
1. **24-Hour Run**
   - Maintain 50 concurrent games
   - Random game actions (questions, answers, guesses)
   - Monitor resource usage trends
   - Check for memory leaks

2. **Game Completion Cycle**
   - Create and complete 1000 games in sequence
   - Monitor system performance over time
   - Verify no degradation in later games

### 4.4 Scalability Testing

**Objective:** Verify system scaling capabilities

**Tool:** k6, Docker stats

**Scenarios:**
1. **Resource Scaling**
   - Vary Docker resource limits
   - Measure performance impact
   - Determine optimal resource allocation

2. **Container Scaling**
   - Test with different numbers of backend container instances
   - Measure load distribution and response times

## 5. Test Environment

- **Infrastructure:** Production-like Docker environment
- **Data:** Test dataset with 24 footballers and question sets
- **Monitoring:** Prometheus for metrics collection
- **Isolation:** Tests run in isolated environment to avoid affecting other services

## 6. Test Scripts

### 6.1 API Load Test (k6)

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 50 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 150 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function() {
  const BASE_URL = 'https://who.gair.com.au/api';
  
  // Create game
  const createGameRes = http.post(`${BASE_URL}/games`, {
    playerName: `User_${__VU}_${__ITER}`,
    mode: 'SP',
    difficulty: 'medium'
  });
  
  check(createGameRes, {
    'game created successfully': (r) => r.status === 200,
    'has valid game ID': (r) => r.json('gameId') !== null,
  });
  
  sleep(1);
  
  // Get game state
  const gameId = createGameRes.json('gameId');
  const getGameRes = http.get(`${BASE_URL}/games/${gameId}`);
  
  check(getGameRes, {
    'get game successful': (r) => r.status === 200,
    'game state is valid': (r) => r.json('state') === 'in-progress',
  });
  
  sleep(1);
}
```

### 6.2 WebSocket Test (k6)

```javascript
import { WebSocket } from 'k6/experimental/websockets';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,
  duration: '3m',
};

export default function() {
  const url = 'wss://who.gair.com.au';
  const ws = new WebSocket(url);
  
  ws.onopen = () => {
    ws.send(JSON.stringify({
      type: 'join',
      payload: {
        playerName: `WSUser_${__VU}_${__ITER}`,
        gameId: 'new',
        mode: 'SP'
      }
    }));
  };
  
  let gameId = null;
  let questionCount = 0;
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    if (data.type === 'gameCreated') {
      gameId = data.payload.gameId;
      
      // Ask a question
      ws.send(JSON.stringify({
        type: 'askQuestion',
        payload: {
          gameId: gameId,
          questionId: 'q001'
        }
      }));
      
      questionCount++;
    }
    
    if (data.type === 'questionAnswered' && questionCount < 5) {
      // Ask another question
      ws.send(JSON.stringify({
        type: 'askQuestion',
        payload: {
          gameId: gameId,
          questionId: `q00${questionCount + 1}`
        }
      }));
      
      questionCount++;
    }
  };
  
  // Wait for WebSocket operations to complete
  sleep(30);
  
  // Close the WebSocket connection
  ws.close();
}
```

## 7. Test Data Requirements

- **User Profiles:** 1000 unique test users
- **Game Templates:** Pre-defined game states for various scenarios
- **Question Sets:** Full question catalog
- **Footballer Data:** Complete set of 24 footballers

## 8. Monitoring and Metrics

### 8.1 System Metrics
- CPU usage per container
- Memory usage per container
- Network I/O
- Disk I/O
- Docker health status

### 8.2 Application Metrics
- Request count
- Response time distribution
- Error rate
- WebSocket connection count
- Active game count
- Database connection pool status
- Query execution time

### 8.3 Client Metrics
- Page load time
- Time to interactive
- WebSocket connection stability
- UI responsiveness

## 9. Reporting

Performance test reports will include:

- Test scenario details
- Summary of results vs. KPI targets
- Detailed metrics with graphs
- Bottlenecks identified
- Recommendations for optimization
- Comparison to previous test runs

## 10. Performance Test Execution Schedule

| Phase | Description | Timeline |
|-------|------------|----------|
| Setup | Prepare test environment and scripts | Day 1 |
| Initial Tests | Run baseline tests to establish metrics | Day 2 |
| Load Testing | Execute core load test scenarios | Day 3 |
| Stress Testing | Identify system limits | Day 4 |
| Endurance Testing | Verify long-term stability | Days 5-6 |
| Optimization | Address identified issues | Days 7-8 |
| Verification | Rerun tests to validate improvements | Day 9 |
| Final Report | Document findings and recommendations | Day 10 |

## 11. Performance Optimization Recommendations

Based on preliminary analysis, these areas may need optimization:

1. **WebSocket Connection Management**
   - Implement connection pooling
   - Optimize reconnection strategy
   - Add heartbeat mechanism

2. **Database Query Optimization**
   - Index frequently queried fields
   - Optimize complex joins
   - Consider caching for static data

3. **Frontend Optimizations**
   - Bundle size reduction
   - Image optimization
   - Code splitting

4. **Container Resource Allocation**
   - Optimize CPU/memory limits
   - Consider horizontal scaling
   - Implement auto-scaling based on load

## 12. Conclusion

This performance test plan provides a comprehensive approach to evaluating the Football Guess Who game's performance characteristics. By following this plan, we can identify potential issues before production deployment and ensure a smooth user experience at who.gair.com.au. 