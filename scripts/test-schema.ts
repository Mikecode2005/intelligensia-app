import { PrismaClient, UserType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing Prisma schema...');

  // Test creating users with different user types
  try {
    // Create a student user
    const student = await prisma.user.create({
      data: {
        name: 'Test Student',
        username: 'teststudent',
        displayName: 'Test Student',
        email: 'student@test.com',
        password: 'password123',
        userType: 'STUDENT',
        academicLevel: 'UNDERGRADUATE',
        institution: 'Test University',
        graduationYear: 2026,
      },
    });
    console.log('Created student user:', student.id);

    // Create a lecturer user
    const lecturer = await prisma.user.create({
      data: {
        name: 'Test Lecturer',
        username: 'testlecturer',
        displayName: 'Dr. Test Lecturer',
        email: 'lecturer@test.com',
        password: 'password123',
        userType: 'LECTURER',
        expertise: 'Computer Science',
        qualifications: 'PhD in Computer Science',
        institution: 'Test University',
      },
    });
    console.log('Created lecturer user:', lecturer.id);

    // Create a company user
    const company = await prisma.user.create({
      data: {
        name: 'Test Company',
        username: 'testcompany',
        displayName: 'Test Company Inc.',
        email: 'company@test.com',
        password: 'password123',
        userType: 'COMPANY',
        industry: 'Technology',
        companySize: '51-200',
        website: 'https://testcompany.com',
        location: 'New York, NY',
        organizationType: 'COMPANY',
      },
    });
    console.log('Created company user:', company.id);

    // Create a worker user
    const worker = await prisma.user.create({
      data: {
        name: 'Test Worker',
        username: 'testworker',
        displayName: 'Test Worker',
        email: 'worker@test.com',
        password: 'password123',
        userType: 'WORKER',
        currentPosition: 'Software Engineer',
        employmentStatus: 'FULL_TIME',
        skills: ['JavaScript', 'React', 'Node.js'],
        workExperience: {
          create: {
            company: 'Previous Company',
            position: 'Junior Developer',
            startDate: new Date('2022-01-01'),
            endDate: new Date('2024-01-01'),
            description: 'Worked on web applications',
          },
        },
      },
    });
    console.log('Created worker user:', worker.id);

    // Create a Stream Chat token for a user
    const updatedUser = await prisma.user.update({
      where: { id: student.id },
      data: {
        streamToken: 'sample-stream-token',
      },
    });
    console.log('Updated user with Stream token:', updatedUser.id);

    // Query users by type
    const students = await prisma.user.findMany({
      where: { userType: 'STUDENT' },
      select: { id: true, name: true, userType: true },
    });
    console.log('Students:', students);

    // Clean up test data
    await prisma.workExperience.deleteMany({
      where: { userId: worker.id },
    });
    await prisma.user.deleteMany({
      where: {
        id: {
          in: [student.id, lecturer.id, company.id, worker.id],
        },
      },
    });
    console.log('Cleaned up test data');

    console.log('Schema test completed successfully!');
  } catch (error) {
    console.error('Error testing schema:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });