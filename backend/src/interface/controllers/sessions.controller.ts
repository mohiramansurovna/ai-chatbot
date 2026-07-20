import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { SessionDetailsResponseDto, SessionsResponseDto } from "./dtos/session-response.dto";
import { CurrentUser } from "@/shared/decorators/current-user.decorator";
import { CreateSessionDto } from "./dtos/create-session.dto";
import { SessionsPresenter } from "./sessions.presenter";
import { CreateSessionUseCase } from "@/application/conversation/use-cases/create-session.use-case";
import { ListSessionsUseCase } from "@/application/conversation/use-cases/list-sessions.use-case";
import { GetSessionUseCase } from "@/application/conversation/use-cases/get-session.use-case";
import { MessageDto } from "./dtos/message.dto";
import { ChatUseCase } from "@/application/chat/use-cases/chat.use-case";
import { User } from "@/core/users/users.entity";
@Controller('api/sessions')
export class SessionsController {
    constructor(
        private readonly createSessionUseCase: CreateSessionUseCase,
        private readonly listSessionsUseCase: ListSessionsUseCase,
        private readonly getSessionUseCase: GetSessionUseCase,
        private readonly chatUseCase: ChatUseCase,
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
        return SessionsPresenter.toDetailsResponse(session as any)
    }

    @Post(':id/message')
    async message(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() currentUser: User,
        @Body() body: MessageDto,
    ) {
        return await this.chatUseCase.execute({
            sessionId: id,
            providerName: body.provider,
            userMessage: body.message,
            userId: currentUser.id,
        })
    }

    // @Post(':id/memory')
    // async extract(@Param('id', ParseIntPipe) id: number, @CurrentUser() currentUser: User) {
    //     console.log("Extracting session memory")
    //     return await this.validateSessionMemoriesUseCase.execute(id, currentUser.id)
    // }
}
