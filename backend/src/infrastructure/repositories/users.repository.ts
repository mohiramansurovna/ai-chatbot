import { Injectable } from "@nestjs/common";
import { and, eq, isNull } from "drizzle-orm";
import { DatabaseService } from "@/infrastructure/database/database.service";
import { Tx } from "@/infrastructure/database/unit-of-work";
import { Schemas } from "../schemas";
import { Mappers } from "../mappers";
import {Core} from '@/core'

@Injectable()
export class UsersRepository implements Core.Users.IUsersRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findById(id: Core.Users.User["id"]): Promise<Core.Users.User | null> {
        const [user] = await this.databaseService.db
            .select()
            .from(Schemas.usersTable)
            .where(and(eq(Schemas.usersTable.id, id), isNull(Schemas.usersTable.deleted_at)));

        return user ? Mappers.UsersMapper.toDomain(user) : null;
    }

    async findByEmail(email: Core.Users.User["email"]): Promise<Core.Users.User | null> {
        const [user] = await this.databaseService.db
            .select()
            .from(Schemas.usersTable)
            .where(and(eq(Schemas.usersTable.email, email), isNull(Schemas.usersTable.deleted_at)));

        return user ? Mappers.UsersMapper.toDomain(user) : null;
    }

    async create(args: Core.Users.UserInsert, tx?: Tx): Promise<Core.Users.User> {
        const connection = this.databaseService.getExecutor(tx as Tx | undefined);
        const [user] = await connection
            .insert(Schemas.usersTable)
            .values({
                name: args.name,
                email: args.email,
                password_hash: args.passwordHash,
            })
            .returning();

        return Mappers.UsersMapper.toDomain(user);
    }
}
