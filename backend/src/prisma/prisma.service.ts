import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // Prisma 7 requires a driver adapter to manage the database connection
    // PrismaPg uses the pg driver to connect to PostgreSQL
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });

    super({ adapter });
  }

  // Connect to the database when the module initializes
  async onModuleInit() {
    await this.$connect();
  }

  // Disconnect cleanly when the app shuts down
  async onModuleDestroy() {
    await this.$disconnect();
  }
}