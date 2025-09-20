import { PrismaClient } from '@prisma/client';

// Create a new Prisma client instance for the script
const prisma = new PrismaClient();

async function cleanupOrphanedSessions() {
  try {
    console.log('🔍 Checking for orphaned sessions...');
    
    // Method 1: Use raw SQL (most reliable)
    console.log('Using SQL query to find orphaned sessions...');
    
    const result = await prisma.$executeRaw`
      DELETE FROM sessions 
      WHERE user_id NOT IN (SELECT id FROM users)
      OR user_id IS NULL
    `;
    
    console.log(`✅ Successfully deleted ${result} orphaned sessions`);

    // Method 2: Alternative approach with Prisma queries
    if (result === 0) {
      console.log('Trying alternative method...');
      
      // Find all sessions
      const allSessions = await prisma.session.findMany({
        select: {
          id: true,
          userId: true
        }
      });

      // Get all user IDs
      const allUserIds = (await prisma.user.findMany({
        select: { id: true }
      })).map(user => user.id);

      // Find sessions with invalid user IDs
      const orphanedSessions = allSessions.filter(session => 
        !allUserIds.includes(session.userId)
      );

      console.log(`Found ${orphanedSessions.length} potentially orphaned sessions`);

      if (orphanedSessions.length > 0) {
        const deleteResult = await prisma.session.deleteMany({
          where: {
            id: {
              in: orphanedSessions.map(s => s.id)
            }
          }
        });
        console.log(`✅ Deleted ${deleteResult.count} sessions using alternative method`);
      }
    }

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Prisma connection closed');
  }
}

// Run the cleanup
cleanupOrphanedSessions()
  .then(() => console.log('🎉 Cleanup completed!'))
  .catch(error => {
    console.error('💥 Cleanup failed:', error);
    process.exit(1);
  });