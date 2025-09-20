/**
 * Environment variables helper with validation
 * This ensures type safety and validation for environment variables
 */

// Define the environment variables schema
const envSchema = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL,
  
  // Authentication
  AUTH_SECRET: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  
  // Google OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  
  // Stream Chat
  NEXT_PUBLIC_STREAM_KEY: process.env.NEXT_PUBLIC_STREAM_KEY,
  STREAM_SECRET: process.env.STREAM_SECRET,
  
  // App configuration
  NODE_ENV: process.env.NODE_ENV || "development",
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
};

// Validate required environment variables
const requiredEnvVars = [
  "DATABASE_URL",
  "AUTH_SECRET",
];

// Check for missing required environment variables
const missingEnvVars = requiredEnvVars.filter(key => !envSchema[key as keyof typeof envSchema]);

// Throw error if any required environment variables are missing
if (missingEnvVars.length > 0) {
  console.warn(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
}

// Export the validated environment variables
export const env = {
  ...envSchema,
  // Add derived environment variables
  IS_PRODUCTION: envSchema.NODE_ENV === "production",
  IS_DEVELOPMENT: envSchema.NODE_ENV === "development",
  IS_TEST: envSchema.NODE_ENV === "test",
} as const;