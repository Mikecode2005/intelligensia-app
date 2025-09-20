# Intelligensia App

Intelligensia is a comprehensive educational platform designed to connect students, tutors, and educational institutions. The platform enables students to join virtual classrooms, apply for scholarships and internships, form study groups, and collaborate with peers.

## Features

- **Authentication System**: Secure login and signup with email/password and Google OAuth
- **User Profiles**: Personalized profiles with field selection and performance tracking
- **Dashboard**: Performance metrics, recent activity, and recommended content
- **Scholarships**: Browse and apply for scholarships matching your profile
- **Internships**: Discover and apply for internships in your field
- **Classrooms**: Join virtual classrooms with join codes or create your own
- **Study Groups**: Form study groups with peers sharing similar interests
- **Responsive Design**: Modern UI that works across devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **Backend**: Next.js API routes, Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Lucia Auth with Prisma adapter
- **UI Components**: Shadcn UI
- **Styling**: TailwindCSS with custom orange theme

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Mikecode2005/intelligensia-app.git
   cd intelligensia-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/intelligensia"

   # Authentication
   AUTH_SECRET="your-secure-random-string"

   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # Stream Chat (for messaging)
   NEXT_PUBLIC_STREAM_KEY="your-stream-key"
   STREAM_SECRET="your-stream-secret"
   ```

4. Set up the database:
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev --name init
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/src/app` - Next.js app router pages and layouts
- `/src/app/(auth)` - Authentication pages (login, signup)
- `/src/app/(dashboard)` - Dashboard and feature pages
- `/src/components` - Reusable UI components
- `/src/lib` - Utility functions and shared code
- `/prisma` - Database schema and migrations

## Authentication Flow

1. **Email/Password Authentication**:
   - Users can sign up with email, username, and password
   - Password is hashed using Argon2
   - Sessions are managed by Lucia Auth

2. **Google OAuth**:
   - Users can sign in with their Google account
   - OAuth flow is handled by Arctic and Lucia Auth

## Database Schema

The database schema includes models for:
- Users (students, tutors, organizations)
- Sessions
- Fields of study
- Performance metrics
- Classrooms and classroom members
- Study groups
- Scholarships and applications
- Internships and applications

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.