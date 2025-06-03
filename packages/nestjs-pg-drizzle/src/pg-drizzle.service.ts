import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Client, Pool } from 'pg';
import { getConnectionToken, getDbToken } from './pg-drizzle.interface';

@Injectable()
export class DrizzleService implements OnModuleDestroy {
  constructor(
    @Inject(getDbToken()) private readonly db: NodePgDatabase<any>,
    @Inject(getConnectionToken()) private readonly connection: Pool | Client
  ) {}

  getDb() {
    return this.db;
  }

  async ping(): Promise<boolean> {
    try {
      const result = await this.connection.query?.('SELECT 1');
      return result?.rowCount === 1;
    } catch {
      return false;
    }
  }

  async onModuleDestroy() {
    if ('end' in this.connection) {
      await this.connection.end();
    }
  }
}
