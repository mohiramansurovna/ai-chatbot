import { Inject, Injectable } from "@nestjs/common";
import { Core } from "@/core";
import { SessionNotFoundException } from "../errors";
import { Shared } from "@/shared";

type AppendMessageOptions = {
    role: 'user',
    userId: number
} | {
    role: Exclude<Shared.MessageRole, 'user'>,
}
@Injectable()
export class AppendMessageUseCase {
    constructor(
        @Inject(Core.Sessions.SESSIONS_REPOSITORY) private readonly sessionsRepository: Core.Sessions.ISessionsRepository,
        @Inject(Core.Messages.MESSAGES_REPOSITORY) private readonly messagesRepository: Core.Messages.IMessagesRepository,
    ) { }
    async execute(
        sessionId: number,
        content: string,
        options: AppendMessageOptions
    ): Promise<Core.Messages.Message> {

        const session = await this.sessionsRepository.findById(sessionId);

        if (!session) {
            throw new SessionNotFoundException()
        }
        if (options.role === 'user') {
            session.verifyAccess(options.userId)
        }

        return await this.messagesRepository.create({
            sessionId,
            role:options.role,
            content
        })
    }
}