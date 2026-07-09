import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { Core } from '@/core';

export type Tx = Parameters<DatabaseService['db']['transaction']>[0] extends (tx: infer T) => Promise<unknown> ? T : never;
@Injectable()
export class UnitOfWork implements Core.Shared.IUnitOfWork{
    constructor(private readonly databaseService: DatabaseService) { }

    async run<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
        return this.databaseService.db.transaction(async (tx:Tx) => fn(tx));
    }
}