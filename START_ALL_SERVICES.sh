#!/bin/bash
# Quick Start Script for Automotive Maintenance System
# Run all three services: Backend, AI Agents, Frontend

echo "========================================"
echo "Automotive Maintenance System - Quick Start"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}This script will start:${NC}"
echo "  1. Node.js Backend API (Port 5000)"
echo "  2. Python AI Agents Server (Port 8000)"
echo "  3. React Frontend (Port 3000)"
echo ""
echo -e "${YELLOW}Make sure you have:${NC}"
echo "  - Node.js installed"
echo "  - Python 3.8+ installed"
echo "  - Backend and Frontend dependencies installed"
echo ""

# Check if running Windows or Linux/Mac
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    echo -e "${BLUE}Detected: Windows${NC}"
    IS_WINDOWS=true
else
    echo -e "${BLUE}Detected: Linux/Mac${NC}"
    IS_WINDOWS=false
fi

echo ""
echo -e "${YELLOW}Starting services...${NC}"
echo ""

# Terminal 1: Backend
echo -e "${GREEN}[1/3] Starting Backend API on Port 5000...${NC}"
cd "automotive-maintenance-backend"

if [ "$IS_WINDOWS" = true ]; then
    start cmd /k "node src/server.js"
else
    gnome-terminal -- bash -c "cd '$(pwd)'; node src/server.js" &
fi

sleep 2

# Terminal 2: AI Agents
echo -e "${GREEN}[2/3] Starting AI Agents Server on Port 8000...${NC}"
cd "../predictive_maintenance_ai-main"

if [ "$IS_WINDOWS" = true ]; then
    start cmd /k "uvicorn app.api.main:app --port 8000 --reload"
else
    gnome-terminal -- bash -c "cd '$(pwd)'; uvicorn app.api.main:app --port 8000 --reload" &
fi

sleep 2

# Terminal 3: Frontend
echo -e "${GREEN}[3/3] Starting Frontend on Port 3000...${NC}"
cd "../automotive-maintenance-frontend"

if [ "$IS_WINDOWS" = true ]; then
    start cmd /k "npm start"
else
    gnome-terminal -- bash -c "cd '$(pwd)'; npm start" &
fi

echo ""
echo -e "${GREEN}✅ All services started!${NC}"
echo ""
echo -e "${BLUE}Access the system:${NC}"
echo "  Frontend:   http://localhost:3000"
echo "  Backend:    http://localhost:5000"
echo "  Agents API: http://localhost:8000"
echo "  Agents Docs: http://localhost:8000/docs"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Wait for all services to fully start (30-60 seconds)"
echo "  2. Open http://localhost:3000 in your browser"
echo "  3. Test the dashboard"
echo "  4. Check http://localhost:8000/docs for agent API docs"
echo ""
echo -e "${YELLOW}To stop all services:${NC}"
echo "  - Close each terminal window"
echo "  - Or press Ctrl+C in each terminal"
echo ""
