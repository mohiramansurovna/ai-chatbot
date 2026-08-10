import { Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
import { Schemas } from '../schemas';
import { Mappers } from '../mappers';
import { Core } from '@/core';
import { Database } from '../database';
import { Repository } from './repository';

@Injectable()
export class UsersRepository
    extends Repository<Core.Users.User, typeof Schemas.usersTable, Mappers.UsersMapper>
    implements Core.Users.IUsersRepository
{
    constructor(databaseService: Database.DatabaseService, mapper: Mappers.UsersMapper) {
        super({ table: Schemas.usersTable, pk: Schemas.usersTable.id, databaseService, mapper });
    }

    async findByEmail(email: Core.Users.User['email']): Promise<Core.Users.User | null> {
        const [user] = await this.databaseService.db
            .select()
            .from(Schemas.usersTable)
            .where(and(eq(Schemas.usersTable.email, email), isNull(Schemas.usersTable.deleted_at)));

        return user ? this.mapper.toDomain(user) : null;
    }
}
