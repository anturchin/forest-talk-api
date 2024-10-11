import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', this.shutdown.bind(this, app));
    process.on('SIGINT', this.shutdown.bind(this, app));
    process.on('SIGTERM', this.shutdown.bind(this, app));
  }

  private async shutdown(app: INestApplication): Promise<void> {
    await this.$disconnect();
    await app.close();
  }
}
