
export class Session {
    id: number;
    title: string;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;

    constructor(data: Session) {
        Object.assign(this, data)
    }
}