# NextAuth.js Implementation Guide for Intelligensia App

This guide explains how the NextAuth.js authentication system is implemented in the Intelligensia app, including how it works, how to use it, and how to troubleshoot common issues.

## Overview

The authentication system uses [NextAuth.js](https://next-auth.js.org/) with a Prisma adapter to handle user sessions and authentication. It supports:

1. Username/password authentication
2. Google OAuth authentication
3. Session management
4. Route protection

## Key Components

### 1. Environment Variables

Authentication requires several environment variables to be set in the `.env` file:

```
# NextAuth
AUTH_SECRET="your-secure-random-string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secure-random-string"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

The `AUTH_SECRET` and `NEXTAUTH_SECRET` should be the same secure random string. You can generate one using:

```bash
openssl rand -base64 32
```

### 2. Database Schema

The authentication system relies on these tables in the database:

- `users`: Stores user information
- `accounts`: Stores OAuth account information
- `sessions`: Stores active user sessions
- `verification_tokens`: Stores email verification tokens

### 3. Core Files

- `src/app/api/auth/[...nextauth]/route.ts`: NextAuth.js API route and configuration
- `src/types/next-auth.d.ts`: TypeScript type definitions for NextAuth.js
- `src/components/providers/AuthProvider.tsx`: Client-side session provider
- `src/lib/auth.ts`: Server-side authentication helpers
- `src/hooks/useAuth.ts`: Client-side authentication hooks
- `src/middleware.ts`: Route protection middleware

## Authentication Flows

### 1. Email/Password Authentication

1. User enters username/email and password on the login form
2. Form data is submitted to the NextAuth.js credentials provider
3. Server validates credentials and creates a session
4. User is redirected to the dashboard

### 2. Google OAuth Authentication

1. User clicks "Continue with Google" button
2. NextAuth.js redirects to Google for authentication
3. Google redirects back to NextAuth.js callback URL
4. NextAuth.js creates or authenticates the user
5. User is redirected to the dashboard or onboarding page

### 3. Session Validation

1. Middleware runs on protected routes
2. `getServerSession` function checks for a valid session
3. If no valid session exists, user is redirected to login
4. If a valid session exists, the user object is available in the request

## Using Authentication in Your Code

### Server Components

```tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login");
  }
  
  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      {/* Rest of your component */}
    </div>
  );
}
```

### Client Components

```tsx
"use client";

import { useAuth } from "@/hooks/useAuth";

export default function ProfileComponent() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
```

### Server Actions

```tsx
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function protectedAction() {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return { error: "Unauthorized" };
  }
  
  // Perform action for authenticated user
  return { success: true };
}
```

## Customizing NextAuth.js

### Adding New Providers

To add a new authentication provider, update the `providers` array in `src/app/api/auth/[...nextauth]/route.ts`:

```tsx
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  // ...existing options
  providers: [
    // ...existing providers
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  // ...rest of options
};
```

### Customizing Callbacks

You can customize the behavior of NextAuth.js by modifying the callbacks in `src/app/api/auth/[...nextauth]/route.ts`:

```tsx
callbacks: {
  async jwt({ token, user }) {
    // Add custom properties to the JWT token
    if (user) {
      token.role = user.role;
    }
    return token;
  },
  async session({ session, token }) {
    // Add custom properties to the session
    session.user.role = token.role;
    return session;
  },
}
```

## Troubleshooting

### Common Issues

1. **"No adapter found" error**:
   - Make sure you've installed `@auth/prisma-adapter`
   - Check that the Prisma adapter is properly configured

2. **"Invalid client_id" or OAuth errors**:
   - Verify that your OAuth credentials are correct in `.env`
   - Check that the redirect URI matches what's configured in the OAuth provider

3. **Session not persisting**:
   - Ensure `NEXTAUTH_URL` is set correctly in `.env`
   - Check that `AUTH_SECRET` and `NEXTAUTH_SECRET` are set

4. **Database connection issues**:
   - Verify that the `DATABASE_URL` is correct in `.env`
   - Check that the database is running and accessible
   - Ensure that Prisma migrations have been applied

### Debugging Tips

1. Enable debug mode in NextAuth.js by setting `debug: true` in the options
2. Check browser console for client-side errors
3. Check server logs for server-side errors
4. Use the NextAuth.js debug page at `/api/auth/signin` to test providers

## Security Considerations

1. **CSRF Protection**: NextAuth.js includes built-in CSRF protection
2. **JWT Encryption**: JWTs are encrypted using the `AUTH_SECRET`
3. **Password Storage**: Passwords are hashed using bcrypt
4. **Session Security**: Sessions are stored in the database and validated on each request

## Resources

- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction)
- [NextAuth.js with Prisma Adapter](https://authjs.dev/reference/adapter/prisma)
- [NextAuth.js with Next.js App Router](https://next-auth.js.org/configuration/nextjs#in-app-router)