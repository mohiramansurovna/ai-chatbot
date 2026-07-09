import { DatabaseService } from "@/infrastructure/database/database.service";
import { Tx } from "@/infrastructure/database/unit-of-work";
import { Injectable } from "@nestjs/common";
import { and, eq, isNull } from "drizzle-orm";
import { User } from "./users.entity";
import { UsersMapper } from "./users.mapper";
import { usersTable } from "./users.model";


type CreateUserArgs = {
    name: User['name'];
    email: User['email'];
    passwordHash: User['passwordHash'];
}

@Injectable()
export class UsersRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findById(id: User['id']): Promise<User | null> {
        const [user] = await this.databaseService.db.select().from(usersTable).where(and(eq(usersTable.id, id), isNull(usersTable.deleted_at)));
        return user ? UsersMapper.toDomain(user) : null;
    }

    async findByEmail(email: User['email']): Promise<User | null> {
        const [user] = await this.databaseService.db.select().from(usersTable).where(and(eq(usersTable.email, email), isNull(usersTable.deleted_at)));
        return user? UsersMapper.toDomain(user):null;
    }

    async create(args: CreateUserArgs, tx?: Tx): Promise<User> {
        const connection = this.databaseService.getExecutor(tx);
        const [user] = await connection.insert(usersTable).values({
            name: args.name,
            email: args.email,
            password_hash: args.passwordHash,
        }).returning();
        return UsersMapper.toDomain(user);
    }

}