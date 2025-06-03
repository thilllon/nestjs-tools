import { DrizzleConfig } from 'drizzle-orm';
import { PoolConfig, ClientConfig } from 'pg';

export interface DrizzleModuleOptions {
  drizzleConfig?: DrizzleConfig;
  pgConfig?: { type: 'pool'; config: PoolConfig } | { type: 'client'; config: ClientConfig };
}

export type DrizzleModuleExtras = {
  name?: string;
  isGlobal?: boolean;
};

export const getDbToken = (name = 'default') => `DRIZZLE_DB_${name}`;

export const getConnectionToken = (name = 'default') => `DRIZZLE_CONNECTION_${name}`;
