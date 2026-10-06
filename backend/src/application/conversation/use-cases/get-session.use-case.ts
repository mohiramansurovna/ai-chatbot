import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Core } from "@/core";
import { SessionDetails } from "../types";

@Injectable()
export class GetSessionUseCase {
    constructor(
        @Inject(Core.Sessions.SESSIONS_REPOSITORY) private readonly sessionsRepository: Core.Sessions.ISessionsRepository,
        @Inject(Core.Messages.MESSAGES_REPOSITORY) private readonly messagesRepository: Core.Messages.IMessagesRepository
    ) { }
    async execute(id: Core.Sessions.Session['id'], userId: Core.Sessions.Session['userId']):Promise<SessionDetails>{
        const session = await this.sessionsRepository.findById(id);
        if (!session) {
            throw new NotFoundException()
        }

        session.verifyAccess(userId)

        const messages = await this.messagesRepository.listBySessionId(id)
        return {
            session,
            messages
        }
    }
}