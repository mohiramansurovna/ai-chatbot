import { Core } from "@/core";

export type UserResponse = {
    id: number;
    name: string;
    email: string;
}

export class UsersPresenter {
    static toResponse(entity: Core.Users.User): UserResponse {
        return {
            id: entity.id,
            name: entity.name,
            email: entity.email,
        }
    }
}