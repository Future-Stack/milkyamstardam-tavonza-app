import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

let mongod: MongoMemoryReplSet;
let prisma: PrismaClient;

export const setupTestDb = async (): Promise<PrismaClient> => {
  // Create a replica set so we have transaction support
  mongod = await MongoMemoryReplSet.create({ 
    replSet: { count: 1 },
    binary: { version: '6.0.4' }
  });
  const uri = mongod.getUri('milky-test');
  
  process.env.DATABASE_URL = uri;
  


  prisma = new PrismaClient({
    datasources: {
      db: {
        url: uri,
      },
    },
  });
  
  await prisma.$connect();
  return prisma;
};

export const teardownTestDb = async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
  if (mongod) {
    await mongod.stop();
  }
};

export const clearTestDb = async () => {
  if (!prisma) return;
  // MongoDB clean all collections
  const collections = await prisma.$runCommandRaw({
    listCollections: 1,
  }) as any;

  if (collections?.cursor?.firstBatch) {
    for (const collection of collections.cursor.firstBatch) {
      if (collection.name !== 'system.views' && collection.name !== 'system.profile') {
        await prisma.$runCommandRaw({
          delete: collection.name,
          deletes: [{ q: {}, limit: 0 }]
        });
      }
    }
  }
};
