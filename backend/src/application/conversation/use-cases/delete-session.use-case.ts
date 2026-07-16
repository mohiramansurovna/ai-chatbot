import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Core } from "@/core";

@Injectable()
export class DeleteSessionUseCase {
    constructor(
        @Inject(Core.Sessions.SESSIONS_REPOSITORY) private readonly sessionsRepository: Core.Sessions.ISessionsRepository,
        @Inject(Core.Messages.MESSAGES_REPOSITORY) private readonly messagesRepository: Core.Messages.IMessagesRepository
    ) { }
    async execute(id: Core.Sessions.Session['id'], userId: Core.Sessions.Session['userId']) {
        const session = await this.sessionsRepository.findById(id);
        if (!session) {
            throw new NotFoundException()
        }

        session.verifyAccess(userId);
        return await this.sessionsRepository.delete(id)
    }
}