import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from '@prisma/client';

// Singleton instance
const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL must be set to connect to PostgreSQL');
  }

  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Prevent multiple instances in development (hot reload)
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export default prisma;

// Optional: Graceful shutdown
export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};