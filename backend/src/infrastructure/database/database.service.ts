import { Inject, Injectable } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { type Tx } from './unit-of-work';
import { Core } from '@/core';
import { Schemas } from '../schemas';

@Injectable()
export class DatabaseService {
  public db: NodePgDatabase<typeof Schemas>;

  constructor(
    @Inject(Core.Shared.DATABASE_CONFIG) private readonly databaseConfig: Core.Shared.IDatabaseConfig
  ) {
    const { user, password, port, host, name } = this.databaseConfig;
    const connectionString = `postgresql://${user}:${password}@${host}:${port}/${name}?schema=public`;

    const dbClient = drizzle(connectionString, {
      schema: Schemas
    });

    this.db = dbClient;
  }

  getExecutor(tx?: Tx) {
    return tx ?? this.db;
  }
}