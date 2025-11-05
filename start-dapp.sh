#!/bin/bash

# Colors for better output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Buy Me Coffee DApp Setup...${NC}"

# Step 1: Install dependencies if needed
echo -e "${GREEN}[1/5] Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
  echo "Failed to install dependencies"
  exit 1
fi

# Step 2: Compile contracts
echo -e "${GREEN}[2/5] Compiling smart contracts...${NC}"
cd apps/contracts && yarn compile
if [ $? -ne 0 ]; then
  echo "Failed to compile contracts"
  exit 1
fi
cd ../..

# Step 3: Start Thor solo node
echo -e "${GREEN}[3/5] Starting Thor solo node...${NC}"
docker compose -f apps/contracts/docker-compose.yaml up -d --wait thor-solo
if [ $? -ne 0 ]; then
  echo "Failed to start Thor solo node. Make sure Docker is running."
  exit 1
fi

# Wait a moment for the node to initialize completely
echo "Waiting for Thor node to initialize..."
sleep 5

# Step 4: Deploy contract to solo network
echo -e "${GREEN}[4/5] Deploying contract to solo network...${NC}"
cd apps/contracts && npx hardhat run scripts/deploy.ts --network vechain_solo
if [ $? -ne 0 ]; then
  echo "Failed to deploy contracts"
  exit 1
fi
cd ../..

# Step 5: Start the frontend application
echo -e "${GREEN}[5/5] Starting frontend application...${NC}"
cd apps/frontend && npm run dev

# Script will continue running with the frontend app
echo -e "${YELLOW}Setup complete! Frontend is now running.${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the application.${NC}"
