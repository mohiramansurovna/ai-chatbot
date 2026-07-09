import { Session } from "@/core/entities";
import { SessionsRepository } from "@/core/sessions/sessions.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ListSessionsUseCase {
    constructor(private readonly sessionsRepository: SessionsRepository) { }
    async execute(currentUserId: Session['userId']):Promise<Session[]>{
        return await this.sessionsRepository.listUserSessions(currentUserId);

    }
}