import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as userSchema from './schemas/user.schema';
import { env, integerEnv } from '../config/env';

export type DatabaseConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl: boolean;
};

// Helper function to create db instance with proper typing
const buildDrizzle = (pool: Pool) => drizzle({
  schema: { ...userSchema },
  client: pool,
});

export interface IDatabase {
  close(): Promise<void>;
  getInstance(): ReturnType<typeof buildDrizzle>;
}

export class Database implements IDatabase {
  private instance: ReturnType<typeof buildDrizzle>;
  private pool: Pool;

  constructor() {
    const pool = new Pool({
      host: env('DB_HOST', 'localhost'),
      port: integerEnv('DB_PORT', 5432),
      user: env('DB_USER', 'postgres'),
      password: env('DB_PASSWORD', 'password'),
      database: env('DB_NAME', 'yqn_mrm'),
      ssl: env('NODE_ENV', 'development') === 'production'
    });
    this.pool = pool;
    this.instance = buildDrizzle(pool);
  }

  getInstance() {
    return this.instance;
  }

  async close() {
    await this.pool.end();
  }
}