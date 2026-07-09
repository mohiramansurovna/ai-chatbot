import { User } from "@/core/entities";

export type UserResponse = {
    id: number;
    name: string;
    email: string;
}

export class UsersPresenter {
    static toResponse(entity: User): UserResponse {
        return {
            id: entity.id,
            name: entity.name,
            email: entity.email,
        }
    }
}