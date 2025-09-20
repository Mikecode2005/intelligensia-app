import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createTestUser() {
  const hashedPassword = await bcrypt.hash('testpassword', 12);
  
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      username: 'testuser',
      password: hashedPassword,
      name: 'Test User',
      displayName: 'Test User',
      userType: 'STUDENT',
    },
  });
  
  console.log('Test user created:', user);
}

createTestUser();