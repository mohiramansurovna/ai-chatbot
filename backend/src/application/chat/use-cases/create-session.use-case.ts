import { Session } from "@/core/entities";
import { SessionsRepository } from "@/core/sessions/sessions.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateSessionUseCase {
    constructor(private readonly sessionsRepository: SessionsRepository) { }
    async execute(title: Session['title'], userId: Session['userId']):Promise<Session>{
        return await this.sessionsRepository.create({ title, userId })
    }
}