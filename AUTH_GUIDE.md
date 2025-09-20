# Authentication System Guide for Intelligensia App

This guide explains the authentication system implemented in the Intelligensia app, including how it works, how to use it, and how to troubleshoot common issues.

## Overview

The authentication system uses [Lucia Auth](https://lucia-auth.com/) with a Prisma adapter to handle user sessions and authentication. It supports:

1. Username/password authentication
2. Google OAuth authentication
3. Session management
4. Route protection

## Key Components

### 1. Environment Variables

Authentication requires several environment variables to be set in the `.env` file:

```
# Authentication
AUTH_SECRET="your-secure-random-string"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

The `AUTH_SECRET` should be a secure random string. You can generate one using:

```bash
openssl rand -base64 32
```

### 2. Database Schema

The authentication system relies on two main tables in the database:

- `User`: Stores user information including credentials
- `Session`: Stores active user sessions

### 3. Core Files

- `src/lib/auth.ts`: Core authentication logic and Lucia setup
- `src/auth.ts`: Google OAuth configuration and re-exports
- `src/lib/env.ts`: Environment variable validation
- `src/middleware.ts`: Route protection middleware
- `src/app/(auth)/login/actions.ts`: Login server actions
- `src/app/(auth)/signup/actions.ts`: Signup server actions
- `src/app/(auth)/actions.ts`: Logout server action
- `src/app/api/auth/google/route.ts`: Google OAuth initialization endpoint
- `src/app/api/auth/callback/google/route.ts`: Google OAuth callback handler

## Authentication Flows

### 1. Email/Password Authentication

1. User enters username/email and password on the login form
2. Form data is submitted to the `login` server action
3. Server validates credentials and creates a session
4. User is redirected to the dashboard

### 2. Google OAuth Authentication

1. User clicks "Continue with Google" button
2. Frontend makes a request to `/api/auth/google`
3. Backend generates state and code verifier, then returns Google OAuth URL
4. User is redirected to Google for authentication
5. Google redirects back to `/api/auth/callback/google` with authorization code
6. Backend validates the code and creates or authenticates the user
7. User is redirected to the dashboard or onboarding page

### 3. Session Validation

1. Middleware runs on protected routes
2. `validateRequest` function checks for a valid session cookie
3. If no valid session exists, user is redirected to login
4. If a valid session exists, the user object is available in the request

## Using Authentication in Your Code

### Server Components

```tsx
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  // Check if user is authenticated
  const { user } = await validateRequest();
  
  if (!user) {
    redirect("/login");
  }
  
  return (
    <div>
      <h1>Welcome, {user.displayName}!</h1>
      {/* Rest of your component */}
    </div>
  );
}
```

### Server Actions

```tsx
"use server";

import { validateRequest } from "@/lib/auth";

export async function protectedAction() {
  // Check if user is authenticated
  const { user } = await validateRequest();
  
  if (!user) {
    return { error: "Unauthorized" };
  }
  
  // Perform action for authenticated user
  return { success: true };
}
```

### Client Components

```tsx
"use client";

import { logout } from "@/app/(auth)/actions";

export default function LogoutButton() {
  return (
    <button onClick={() => logout()}>
      Logout
    </button>
  );
}
```

## Troubleshooting

### Common Issues

1. **"Unauthorized" errors**:
   - Check if the user is logged in
   - Verify that the session cookie is being set correctly
   - Check if the session has expired

2. **Google OAuth errors**:
   - Verify that Google OAuth credentials are correct in `.env`
   - Check that the redirect URI matches what's configured in Google Cloud Console
   - Ensure cookies are being set correctly (especially in production with HTTPS)

3. **Database connection issues**:
   - Verify that the `DATABASE_URL` is correct in `.env`
   - Check that the database is running and accessible
   - Ensure that Prisma migrations have been applied

### Debugging Tips

1. Check session cookies in browser developer tools
2. Look for authentication-related errors in server logs
3. Use `console.log` in authentication functions to trace the flow
4. Verify that environment variables are loaded correctly

## Security Considerations

1. **Password Storage**: Passwords are hashed using Argon2, a secure hashing algorithm
2. **Session Management**: Sessions are stored in the database and validated on each request
3. **CSRF Protection**: Lucia Auth includes built-in CSRF protection
4. **OAuth Security**: State parameter and PKCE are used to prevent CSRF attacks in OAuth flow

## Extending the Authentication System

### Adding New OAuth Providers

1. Install the appropriate Arctic provider
2. Configure the provider in `src/auth.ts`
3. Create routes for initialization and callback
4. Update the login UI to include the new provider

### Adding Password Reset

1. Create a password reset token model in the database
2. Implement server actions for requesting and processing password resets
3. Create UI components for the password reset flow

### Adding Email Verification

1. Add an `emailVerified` field to the User model
2. Create an email verification token model
3. Implement server actions for sending and processing verification emails
4. Update the signup flow to include email verification

## Best Practices

1. Always validate user authentication in server components and actions
2. Use the middleware for route protection
3. Keep sensitive authentication logic in server-side code
4. Regularly rotate the `AUTH_SECRET` in production
5. Monitor failed login attempts for potential security issues