import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { SessionDetailsResponseDto, SessionsResponseDto } from "./dtos/session-response.dto";
import { CurrentUser } from "@/shared/decorators/current-user.decorator";
import { User } from "@/core/entities";
import { CreateSessionDto } from "./dtos/create-session.dto";
import { CreateSessionUseCase } from "@/application/chat/use-cases/create-session.use-case";
import { SessionsPresenter } from "./sessions.presenter";
import { ListSessionsUseCase } from "@/application/chat/use-cases/list-sessions.use-case";
import { GetSessionUseCase } from "@/application/chat/use-cases/get-session.use-case";
import { MessageDto } from "./dtos/message.dto";
import { ChatUseCase } from "@/application/chat/use-cases/chat.use-case";
import { SessionDeleteParams } from "@anthropic-ai/sdk/resources/beta.js";
import { SessionMemoryUseCase } from "@/application/memory/session-memory.use-case";

@Controller('api/sessions')
export class SessionsController {
    constructor(
        private readonly createSessionUseCase: CreateSessionUseCase,
        private readonly listSessionsUseCase: ListSessionsUseCase,
        private readonly getSessionUseCase: GetSessionUseCase,
        private readonly chatUseCase: ChatUseCase,
        private readonly sessionMemoryUseCase: SessionMemoryUseCase
    ) { }

    @Post()
    async create(@CurrentUser() currentUser: User, @Body() body: CreateSessionDto): Promise<SessionsResponseDto> {
        const session = await this.createSessionUseCase.execute(body.title, currentUser.id);
        return SessionsPresenter.toResponse(session)
    }

    @Get()
    async list(@CurrentUser() currentUser: User): Promise<SessionsResponseDto[]> {
        const sessions = await this.listSessionsUseCase.execute(currentUser.id);
        return sessions.map(session => SessionsPresenter.toResponse(session))
    }

    @Get(':id')
    async get(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() currentUser: User,
    ): Promise<SessionDetailsResponseDto> {
        const session = await this.getSessionUseCase.execute(id, currentUser.id);
        return SessionsPresenter.toDetailsResponse(session)
    }

    @Post(':id/message')
    async message(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() currentUser: User,
        @Body() body: MessageDto,
    ) {
        return await this.chatUseCase.execute({
            sessionId: id,
            provider: body.provider,
            content: body.message,
            userId: currentUser.id,
        })
    }

    @Post(':id/memory')
    async extract(@Param('id', ParseIntPipe) id: number, @CurrentUser() currentUser: User) {
        console.log("Extracting session memory")
        return await this.sessionMemoryUseCase.execute(id, currentUser.id)
    }
}
