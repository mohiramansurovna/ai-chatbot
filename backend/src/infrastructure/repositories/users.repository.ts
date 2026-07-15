import { Injectable } from "@nestjs/common";
import { and, eq, isNull } from "drizzle-orm";
import { Schemas } from "../schemas";
import { Mappers } from "../mappers";
import { Core } from '@/core'
import { Database } from "../database";

@Injectable()
export class UsersRepository implements Core.Users.IUsersRepository {
    constructor(private readonly databaseService: Database.DatabaseService) { }

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

    async create(args: Core.Users.UserInsert, tx?: Database.Tx): Promise<Core.Users.User> {
        try {
            const connection = this.databaseService.getExecutor(tx);
            const [user] = await connection
                .insert(Schemas.usersTable)
                .values({
                    name: args.name,
                    email: args.email,
                    password_hash: args.passwordHash,
                })
                .returning();
            return Mappers.UsersMapper.toDomain(user);
        } catch (err: unknown) {
            if (Database.isUniqueViolation(err, Schemas.USERS_EMAIL_UNIQUE_INDEX)) {
                throw new Core.Users.EmailAlreadyExistsException(args.email)
            }
            throw err
        }
    }

    async update(id: Core.Users.User["id"], args: Core.Users.UserUpdate, tx?: Database.Tx): Promise<Core.Users.User> {
        try {
            const connection = this.databaseService.getExecutor(tx);
            const [user] = await connection
                .update(Schemas.usersTable)
                .set({
                    name: args.name,
                    email: args.email,
                    password_hash: args.passwordHash,
                })
                .where(eq(Schemas.usersTable.id, id))
                .returning();

            if (!user) {
                throw new Error(`User with id ${id} was not found`);
            }

            return Mappers.UsersMapper.toDomain(user);
        } catch (err: unknown) {
            if (Database.isUniqueViolation(err, Schemas.USERS_EMAIL_UNIQUE_INDEX)) {
                throw new Core.Users.EmailAlreadyExistsException(args.email ?? '');
            }
            throw err;
        }
    }

    async delete(id: Core.Users.User["id"], tx?: Database.Tx): Promise<void> {
        const connection = this.databaseService.getExecutor(tx);
        await connection
            .update(Schemas.usersTable)
            .set({
                deleted_at: new Date(),
                updated_at: new Date(),
            })
            .where(eq(Schemas.usersTable.id, id));
    }
}
