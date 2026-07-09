import { User } from "./users.entity";

export type UserInsert = Pick<User, 'name' | 'email' | 'passwordHash'>

export interface IUsersRepository {
    findById(id: User["id"]): Promise<User | null>;
    findByEmail(email: User["email"]): Promise<User | null>;
    create(args: UserInsert): Promise<User>;
}
export const USERS_REPOSITORY = Symbol("USERS_REPOSITORY");