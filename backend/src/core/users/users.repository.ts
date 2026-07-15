import { User } from "./users.entity";

export type UserInsert = Pick<User, 'name' | 'email' | 'passwordHash'>
export type UserUpdate = Partial<Pick<User, 'name' | 'email' | 'passwordHash'>>

export interface IUsersRepository {
    findById(id: User["id"]): Promise<User | null>;
    findByEmail(email: User["email"]): Promise<User | null>;
    create(args: UserInsert): Promise<User>;
    update(id: User["id"], args: UserUpdate): Promise<User>;
    delete(id: User["id"]): Promise<void>;
}
export const USERS_REPOSITORY = Symbol("USERS_REPOSITORY");