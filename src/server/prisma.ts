import { PrismaClient } from '@prisma/client';

// Declare Prisma Client instance
const prisma = new PrismaClient();

// Export the instance for use in other parts of the application
export { prisma };
