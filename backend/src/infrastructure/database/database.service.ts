import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { type Tx } from './unit-of-work';
import { Shared } from '@/shared';
import * as Models from '@/core/models';

@Injectable()
export class DatabaseService {
  public db: NodePgDatabase<typeof Models>;

  constructor(private readonly configService: ConfigService<Shared.Configs.EnvConfig, true>) {
    const host = configService.get('DB_HOST', { infer: true });
    const port = configService.get('DB_PORT', { infer: true });
    const name = configService.get('DB_NAME', { infer: true });
    const user = configService.get('DB_USER', { infer: true });
    const password = configService.get('DB_PASSWORD', { infer: true });

    const connectionString = `postgresql://${user}:${password}@${host}:${port}/${name}?schema=public`;

    const dbClient = drizzle(connectionString, {
      schema:Models
    });

    this.db = dbClient;
  }

  getExecutor(tx?: Tx) {
    return tx ?? this.db;
  }
}