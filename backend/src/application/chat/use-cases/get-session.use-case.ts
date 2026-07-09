import { Session } from "@/core/entities";
import { MessagesRepository } from "@/core/messages/messages.repository";
import { SessionsRepository } from "@/core/sessions/sessions.repository";
import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class GetSessionUseCase {
    constructor(private readonly sessionsRepository: SessionsRepository, private readonly messagesRepository:MessagesRepository) { }
    async execute(id: Session['id'], currentUserId: Session['userId']) {
        const session=await this.sessionsRepository.findById(id);
        if(!session){
            throw new NotFoundException()
        }

        if(session.userId!==currentUserId){
            throw new ForbiddenException()
        }

        const messages=await this.messagesRepository.listBySessionId(id)

        return {
            ...session,
            messages
        }
    }
}