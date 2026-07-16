import { Core } from "@/core";
import { Inject, Injectable } from "@nestjs/common";
import { SessionNotFoundException } from "../../shared/errors";



@Injectable()
export class RenameSessionUseCase {
    constructor(@Inject(Core.Sessions.SESSIONS_REPOSITORY) private readonly sessionsRepository: Core.Sessions.ISessionsRepository) { }
    async execute(id: number, title: string, userId: number): Promise<Core.Sessions.Session> {

        const session = await this.sessionsRepository.findById(id);
        if (!session) {
            throw new SessionNotFoundException()
        }
        session.verifyAccess(userId)

        return await this.sessionsRepository.update(id, { title })
    }
}