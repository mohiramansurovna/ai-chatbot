export class User {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;

    constructor(data: User) {
        Object.assign(this, data);
    }
}