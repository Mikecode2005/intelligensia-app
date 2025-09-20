#!/bin/bash

# Exit on error
set -e

echo "Setting up database for Intelligensia app..."

# Check if .env file exists
if [ ! -f .env ]; then
  echo "Error: .env file not found. Please create it first."
  exit 1
fi

# Install dependencies if needed
echo "Installing dependencies..."
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Create database and run migrations
echo "Running database migrations..."
npx prisma migrate dev --name init

echo "Database setup complete!"