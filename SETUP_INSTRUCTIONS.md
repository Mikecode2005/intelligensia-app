# Intelligensia App - Setup Instructions

This document provides step-by-step instructions to set up and run the Intelligensia app with the fixed authentication system.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Git

## Setup Steps

### 1. Clone the Repository

If you're starting fresh:

```bash
git clone https://github.com/Mikecode2005/intelligensia-app.git
cd intelligensia-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create or update your `.env` file in the project root with the following variables:

```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/intelligensia"

# Authentication
AUTH_SECRET="your-secure-random-string"

# Google OAuth (optional, but required for Google login)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stream Chat (optional, for messaging features)
NEXT_PUBLIC_STREAM_KEY="your-stream-key"
STREAM_SECRET="your-stream-secret"
```

To generate a secure random string for AUTH_SECRET:

```bash
openssl rand -base64 32
```

### 4. Set Up the Database

Run the database setup script:

```bash
chmod +x setup-db.sh
./setup-db.sh
```

Or manually:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

### 5. Test the Authentication System

Run the authentication test script to verify everything is set up correctly:

```bash
node scripts/test-auth.js
```

This script will check:
- Environment variables
- Database connection
- Prisma schema
- Authentication files

### 6. Start the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Authentication Features

The authentication system now includes:

- Email/password authentication
- Google OAuth authentication (if configured)
- Secure session management
- Route protection
- Improved error handling
- Validation for user inputs

## Troubleshooting

### Database Connection Issues

- Verify your PostgreSQL server is running
- Check the DATABASE_URL in your .env file
- Ensure your database user has the necessary permissions

### Authentication Issues

- Check the AUTH_GUIDE.md file for detailed information
- Verify your .env file has all required variables
- For Google OAuth issues, ensure your credentials are correct and the redirect URI matches your configuration in Google Cloud Console

### Prisma Issues

- Run `npx prisma generate` to regenerate the Prisma client
- Run `npx prisma db push` to sync the schema with your database
- Check for any errors in the Prisma schema file

## Additional Resources

- [AUTH_GUIDE.md](./AUTH_GUIDE.md): Detailed guide on the authentication system
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md): Summary of implemented features
- [README.md](./README.md): General project information

## Next Steps

After setting up the application, you can:

1. Create a user account using the signup page
2. Log in with your credentials
3. Complete the onboarding process by selecting fields of interest
4. Explore the dashboard, scholarships, internships, and classrooms features

## Future Development

The following features are planned for future development:

- Study groups and collaboration features
- Tutor and school/company login systems
- Video/audio call functionality for classrooms
- PDF reader and note-taking tools

Refer to the todo.md file for a complete list of planned features.