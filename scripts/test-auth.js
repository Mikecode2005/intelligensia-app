#!/usr/bin/env node

/**
 * Authentication Test Script
 * 
 * This script helps test the authentication system by:
 * 1. Checking environment variables
 * 2. Testing database connection
 * 3. Verifying Prisma schema
 * 4. Testing user creation and authentication
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Helper functions
function log(message, color = colors.white) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
  log(`✓ ${message}`, colors.green);
}

function warning(message) {
  log(`⚠ ${message}`, colors.yellow);
}

function error(message) {
  log(`✗ ${message}`, colors.red);
}

function info(message) {
  log(`ℹ ${message}`, colors.cyan);
}

function header(message) {
  console.log('\n' + colors.magenta + '='.repeat(50) + colors.reset);
  log(message, colors.magenta);
  console.log(colors.magenta + '='.repeat(50) + colors.reset);
}

function runCommand(command, silent = false) {
  try {
    const output = execSync(command, { encoding: 'utf8' });
    if (!silent) {
      console.log(output);
    }
    return { success: true, output };
  } catch (err) {
    if (!silent) {
      error(`Command failed: ${command}`);
      console.error(err.stdout || err.message);
    }
    return { success: false, error: err };
  }
}

// Main test function
async function runTests() {
  header('AUTHENTICATION SYSTEM TEST');
  
  // Check if running from project root
  if (!fs.existsSync('package.json')) {
    error('Please run this script from the project root directory');
    process.exit(1);
  }
  
  // Step 1: Check environment variables
  header('1. Checking Environment Variables');
  
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    error('.env file not found');
    info('Creating a sample .env file...');
    
    const sampleEnv = `# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/intelligensia"

# Authentication
AUTH_SECRET="${crypto.randomBytes(16).toString('hex')}"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stream Chat
NEXT_PUBLIC_STREAM_KEY="your-stream-key"
STREAM_SECRET="your-stream-secret"
`;
    
    fs.writeFileSync(envPath, sampleEnv);
    warning('Created sample .env file. Please update it with your actual credentials.');
  } else {
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Check required variables
    const requiredVars = [
      'DATABASE_URL',
      'AUTH_SECRET',
    ];
    
    const missingVars = [];
    for (const varName of requiredVars) {
      if (!envContent.includes(`${varName}=`)) {
        missingVars.push(varName);
      }
    }
    
    if (missingVars.length > 0) {
      error(`Missing required environment variables: ${missingVars.join(', ')}`);
    } else {
      success('All required environment variables are present');
    }
    
    // Check optional variables
    const optionalVars = [
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET',
    ];
    
    const missingOptionalVars = [];
    for (const varName of optionalVars) {
      if (!envContent.includes(`${varName}=`)) {
        missingOptionalVars.push(varName);
      }
    }
    
    if (missingOptionalVars.length > 0) {
      warning(`Missing optional environment variables: ${missingOptionalVars.join(', ')}`);
      warning('Google OAuth authentication will not work without these variables');
    } else {
      success('All optional environment variables are present');
    }
  }
  
  // Step 2: Check Prisma schema
  header('2. Checking Prisma Schema');
  
  const prismaSchemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
  if (!fs.existsSync(prismaSchemaPath)) {
    error('Prisma schema not found');
  } else {
    const schemaContent = fs.readFileSync(prismaSchemaPath, 'utf8');
    
    // Check for required models
    const requiredModels = ['User', 'Session'];
    const missingModels = [];
    
    for (const model of requiredModels) {
      if (!schemaContent.includes(`model ${model}`)) {
        missingModels.push(model);
      }
    }
    
    if (missingModels.length > 0) {
      error(`Missing required models in schema: ${missingModels.join(', ')}`);
    } else {
      success('All required models are present in the schema');
    }
    
    // Check for required fields in User model
    const userModelFields = [
      'id', 'username', 'displayName', 'email', 'passwordHash', 'googleId'
    ];
    
    const missingFields = [];
    for (const field of userModelFields) {
      if (!schemaContent.includes(field)) {
        missingFields.push(field);
      }
    }
    
    if (missingFields.length > 0) {
      error(`Missing required fields in User model: ${missingFields.join(', ')}`);
    } else {
      success('All required fields are present in the User model');
    }
  }
  
  // Step 3: Test database connection
  header('3. Testing Database Connection');
  
  info('Running Prisma database connection test...');
  const dbTestResult = runCommand('npx prisma db pull --force', true);
  
  if (dbTestResult.success) {
    success('Database connection successful');
  } else {
    error('Database connection failed');
    info('Please check your DATABASE_URL in .env file');
    info('Make sure your database server is running');
  }
  
  // Step 4: Check auth files
  header('4. Checking Authentication Files');
  
  const authFiles = [
    'src/lib/auth.ts',
    'src/auth.ts',
    'src/middleware.ts',
    'src/app/(auth)/login/actions.ts',
    'src/app/(auth)/signup/actions.ts',
    'src/app/(auth)/actions.ts',
    'src/app/api/auth/google/route.ts',
    'src/app/api/auth/callback/google/route.ts',
  ];
  
  const missingAuthFiles = [];
  for (const file of authFiles) {
    if (!fs.existsSync(path.join(process.cwd(), file))) {
      missingAuthFiles.push(file);
    }
  }
  
  if (missingAuthFiles.length > 0) {
    error(`Missing authentication files: ${missingAuthFiles.join(', ')}`);
  } else {
    success('All authentication files are present');
  }
  
  // Final summary
  header('Authentication System Test Summary');
  
  if (missingAuthFiles.length > 0 || missingVars?.length > 0) {
    error('Authentication system has issues that need to be fixed');
    info('Please refer to the AUTH_GUIDE.md file for more information');
  } else {
    success('Authentication system looks good!');
    info('For more information, see the AUTH_GUIDE.md file');
  }
}

// Run the tests
runTests().catch(err => {
  console.error('Test script error:', err);
  process.exit(1);
});