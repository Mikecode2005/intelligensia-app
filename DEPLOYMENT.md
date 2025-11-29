# Intelligensia Platform - Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Cloudinary account (for image uploads)
- Stream Chat account (for messaging)
- NextAuth.js configuration

### Environment Variables

Create `.env.local` file:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/intelligensia"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Stream Chat
NEXT_PUBLIC_STREAM_KEY="your-stream-key"
STREAM_SECRET="your-stream-secret"

# Admin Password
ADMIN_PASSWORD="Damintelligensia2025"
```

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Run database migrations
npx prisma migrate dev

# 3. Generate Prisma client
npx prisma generate

# 4. Start development server
npm run dev
```

## 🏗️ Architecture Overview

### New Features Added
1. **User Profile System**
   - Profile picture upload
   - Bio, location, education, skills
   - Privacy settings
   - User verification

2. **Admin Dashboard**
   - Secure login with password: `Damintelligensia2025`
   - Real-time statistics
   - User management
   - Content moderation
   - Carousel management

3. **Settings Page**
   - Privacy controls
   - Notification preferences
   - Account settings

4. **Social Features**
   - Block users
   - Report users
   - Profile views tracking

## 📁 Project Structure

```
intelligensia-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── admin/          # Admin API endpoints
│   │   │   ├── users/          # User management
│   │   │   ├── upload/         # File upload handling
│   │   │   └── settings/       # User settings
│   │   ├── profile/            # User profile pages
│   │   ├── admin/              # Admin dashboard
│   │   └── settings/           # Settings page
│   └── components/
│       ├── MainNav.tsx         # Updated navigation
│       └── ...
├── prisma/
│   └── schema.prisma          # Updated database schema
└── DEPLOYMENT.md             # This file
```

## 🔧 Database Schema Changes

### New Models
- `UserSettings` - User preferences and privacy
- `ProfileView` - Track profile visits
- `Report` - User reporting system
- `Carousel` - Admin-managed carousel items

### Updated Models
- `User` - Added username, bio, skills, verification status
- Enhanced relationships for social features

## 🛡️ Security Features

1. **Admin Authentication**
   - Password: `Damintelligensia2025`
   - Secure API endpoints
   - Role-based access control

2. **User Security**
   - Privacy settings
   - Block/report functionality
   - Data validation and sanitization

## 📱 Mobile Responsive

All new features are fully mobile-responsive:
- Profile pages
- Admin dashboard
- Settings page
- Navigation updates

## 🚀 Production Deployment

### Vercel Deployment
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel --prod
```

### Docker Deployment
```bash
# 1. Build image
docker build -t intelligensia .

# 2. Run container
docker run -p 3000:3000 intelligensia
```

## 📊 Analytics & Monitoring

### Built-in Analytics
- User statistics
- Post engagement
- Profile views
- System health monitoring

### External Tools
- Vercel Analytics
- Prisma Studio for database management
- Stream Chat analytics

## 🔍 Testing Checklist

- [ ] User registration/login
- [ ] Profile creation/editing
- [ ] Image upload functionality
- [ ] Admin dashboard access
- [ ] Settings page functionality
- [ ] Mobile responsiveness
- [ ] Security features
- [ ] API endpoints

## 📞 Support

For deployment issues or questions:
1. Check the logs for detailed error messages
2. Verify all environment variables are set
3. Ensure database is accessible
4. Check Cloudinary and Stream Chat configurations

## 🎯 Next Steps

1. Set up production database
2. Configure CDN for images
3. Set up monitoring and alerts
4. Implement additional security measures
5. Add more admin features as needed