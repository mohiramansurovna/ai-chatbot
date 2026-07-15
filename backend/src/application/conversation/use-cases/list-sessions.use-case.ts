import { Core } from "@/core";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class ListSessionsUseCase {
    constructor(
        @Inject(Core.Sessions.SESSIONS_REPOSITORY) private readonly sessionsRepository: Core.Sessions.ISessionsRepository
    ) { }
    async execute(userId: number):Promise<Core.Sessions.Session[]>{
        return await this.sessionsRepository.listUserSessions(userId);
    }
}