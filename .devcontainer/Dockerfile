FROM node:20.18.0-alpine AS base

# Install bash and curl
RUN apk add --no-cache bash curl

# Enable corepack and prepare yarn 4.9.1
RUN corepack enable && corepack prepare yarn@4.9.1 --activate

WORKDIR /workspace

# Install root dependencies
COPY package.json yarn.lock* ./
RUN yarn install

# Copy the entire monorepo (apps/*, packages/*, etc.)
COPY . .

# Preinstall dependencies for sub-packages (optional but useful)
RUN yarn workspaces foreach -v --all --topological-dev --exclude private --no-private run install || true

EXPOSE 3000

# Start frontend dev server by default
CMD yarn install; cd apps/frontend; yarn dev
