import { Core } from "@/core";
import { Inject, Injectable } from "@nestjs/common";



@Injectable()
export class CreateSessionUseCase {
    constructor(@Inject(Core.Sessions.SESSIONS_REPOSITORY) private readonly sessionsRepository: Core.Sessions.ISessionsRepository) { }
    async execute(title: string, userId: Core.Sessions.Session['userId']): Promise<Core.Sessions.Session> {
        const session=Core.Sessions.Session.create({title, userId})
        return await this.sessionsRepository.create(session)
    }
}