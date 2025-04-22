#!/bin/bash
# deployment-status-check.sh - Check the status of the deployed Football Guess Who application

echo "===== Football Guess Who Deployment Status Check ====="
echo "Date: $(date)"
echo "=================================================="

# Check frontend
echo -n "Checking frontend (https://who.gair.com.au): "
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://who.gair.com.au)
if [ "$FRONTEND_STATUS" = "200" ]; then
  echo "✅ ONLINE (HTTP 200 OK)"
else
  echo "❌ ERROR (HTTP $FRONTEND_STATUS)"
  echo "  - Troubleshooting: Check Nginx configuration and frontend container"
fi

# Check backend API health endpoint
echo -n "Checking backend API (https://who.gair.com.au/api/health): "
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://who.gair.com.au/api/health)
if [ "$API_STATUS" = "200" ]; then
  echo "✅ ONLINE (HTTP 200 OK)"
else
  echo "❌ ERROR (HTTP $API_STATUS)"
  echo "  - Troubleshooting: Check backend container and logs"
fi

# Check WebSocket connection
echo -n "Checking WebSocket connection: "
WS_CHECK=$(curl -s -N -i -H "Connection: Upgrade" -H "Upgrade: websocket" -H "Sec-WebSocket-Version: 13" -H "Sec-WebSocket-Key: $(openssl rand -base64 16)" https://who.gair.com.au/socket.io/ | grep -c "HTTP/1.1 101")
if [ "$WS_CHECK" -gt 0 ]; then
  echo "✅ ONLINE (WebSocket Upgrade Successful)"
else
  echo "❌ ERROR (WebSocket Upgrade Failed)"
  echo "  - Troubleshooting: Check socket.io configuration and backend logs"
fi

# Check container status
echo -e "\nContainer Status:"
echo "----------------"
if command -v docker &> /dev/null; then
  docker compose -f docker-compose.production.yml ps | grep -v "Name" | while read line; do
    SERVICE=$(echo $line | awk '{print $1}')
    STATUS=$(echo $line | awk '{print $4}')
    if [[ "$STATUS" == "Up" ]]; then
      echo "✅ $SERVICE: $STATUS"
    else
      echo "❌ $SERVICE: $STATUS"
    fi
  done
else
  echo "Docker not available or not running with current user permissions"
fi

# Check system resources
echo -e "\nSystem Resources:"
echo "----------------"
echo "CPU Usage: $(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1"%"}')"
echo "Memory Usage: $(free -m | awk '/Mem/{printf "%.1f%%", $3*100/$2 }')"
echo "Disk Usage: $(df -h / | awk 'NR==2 {print $5}')"

echo -e "\nRecommended Actions:"
if [ "$FRONTEND_STATUS" != "200" ] || [ "$API_STATUS" != "200" ] || [ "$WS_CHECK" -eq 0 ]; then
  echo "❗ Some services are not functioning properly. Check the logs for more details:"
  echo "  - Frontend logs: docker compose -f docker-compose.production.yml logs frontend"
  echo "  - Backend logs: docker compose -f docker-compose.production.yml logs backend"
  echo "  - Nginx configuration: docker compose -f docker-compose.production.yml exec frontend cat /etc/nginx/conf.d/default.conf"
else
  echo "✅ All services are running properly!"
  echo "  - Consider running a full game flow test to verify complete functionality"
  echo "  - Monitor error rates in Grafana for any potential issues"
fi

echo -e "\n==================================================" 