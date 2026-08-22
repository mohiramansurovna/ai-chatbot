import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import {
    SessionDetailsResponseDto,
    SessionsResponseDto,
    CreateSessionDto,
    MessageDto,
} from './dtos';
import { SessionsPresenter } from './sessions.presenter';
import { Application } from '@/application';
import { User } from '@/core/users/users.entity';
import { Decorators } from '../shared';

@Controller('api/conversation')
export class ConversationController {
    constructor(
        private readonly createSessionUseCase: Application.Conversation.CreateSessionUseCase,
        private readonly listSessionsUseCase: Application.Conversation.ListSessionsUseCase,
        private readonly getSessionUseCase: Application.Conversation.GetSessionUseCase,
        private readonly chatUseCase: Application.Chat.ChatUseCase
    ) {}

    @Post()
    async create(
        @Decorators.CurrentUser() currentUser: User,
        @Body() body: CreateSessionDto
    ): Promise<SessionsResponseDto> {
        const session = await this.createSessionUseCase.execute(body.title, currentUser.id);
        return SessionsPresenter.toResponse(session);
    }

    @Get()
    async list(@Decorators.CurrentUser() currentUser: User): Promise<SessionsResponseDto[]> {
        const sessions = await this.listSessionsUseCase.execute(currentUser.id);
        return sessions.map(session => SessionsPresenter.toResponse(session));
    }

    @Get(':id')
    async get(
        @Param('id', ParseIntPipe) id: number,
        @Decorators.CurrentUser() currentUser: User
    ): Promise<SessionDetailsResponseDto> {
        const session = await this.getSessionUseCase.execute(id, currentUser.id);
        return SessionsPresenter.toDetailsResponse(session as any);
    }

    @Post(':id/message')
    async message(
        @Param('id', ParseIntPipe) id: number,
        @Decorators.CurrentUser() currentUser: User,
        @Body() body: MessageDto
    ) {
        return await this.chatUseCase.execute({
            sessionId: id,
            providerName: body.provider,
            userMessage: body.message,
            userId: currentUser.id,
        });
    }

    // @Post(':id/memory')
    // async extract(@Param('id', ParseIntPipe) id: number, @CurrentUser() currentUser: User) {
    //     console.log("Extracting session memory")
    //     return await this.validateSessionMemoriesUseCase.execute(id, currentUser.id)
    // }
}
