import { IRepository } from '../shared/repository.interface';
import { User } from './users.entity';

export interface IUsersRepository extends IRepository<User> {
    findByEmail(email: User['email']): Promise<User | null>;
}
export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');
