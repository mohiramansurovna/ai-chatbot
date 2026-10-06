/**
 * get sessions with pagination
 * get session
 * delete/rename/archive session
 * post sessions/:id/ message
 */

import { Application } from '@/application';
import { Decorators } from '@/shared/_';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RenameSessionDto } from '../dtos/rename-session.dto';
import { ChatDto, CreateSessionDto } from '../dtos';
import { SessionsPresenter } from '../presenters/sessions.presenter';

@Controller('api/sessions')
export class SessionsController {
    constructor(
        private readonly listSessionsUseCase: Application.Conversation.ListSessionsUseCase,
        private readonly getSessionUseCase: Application.Conversation.GetSessionUseCase,
        private readonly renameSessionUseCase: Application.Conversation.RenameSessionUseCase,
        private readonly deleteSesssionUseCase: Application.Conversation.DeleteSessionUseCase,
        private readonly createSessionUseCase: Application.Conversation.CreateSessionUseCase,
        private readonly chatUseCase: Application.Chat.ChatUseCase
    ) {}
    
    @Get()
    async list(@Decorators.CurrentUserId() userId: number) {
        return await this.listSessionsUseCase.execute(userId);
    }
    @Get(':id')
    async get(@Decorators.CurrentUserId() userId: number, @Param('id') id: number) {
        const sessionDetails= await this.getSessionUseCase.execute(id, userId);
        return SessionsPresenter.toDetailsResponse(sessionDetails)
    }
    @Patch(':id/rename')
    async rename(
        @Decorators.CurrentUserId() userId: number,
        @Param('id') id: number,
        @Body() dto: RenameSessionDto
    ) {
        return await this.renameSessionUseCase.execute(id, dto.title, userId);
    }
    // @Patch(':id/archive')
    // async archive(){
        
    // }
    @Delete(':id')
    async delete(@Decorators.CurrentUserId() userId: number, @Param('id') id: number) {
        return await this.deleteSesssionUseCase.execute(id, userId);
    }
    @Post()
    async create(@Decorators.CurrentUserId() userId: number, @Body() dto: CreateSessionDto) {
        return await this.createSessionUseCase.execute(dto.title, userId);
    }
    @Post(':id')
    async chat(
        @Decorators.CurrentUserId() userId: number,
        @Param('id') sessionId: number,
        @Body() dto: ChatDto
    ) {
        return await this.chatUseCase.execute({
            sessionId,
            userId,
            userMessage: dto.message,
            providerName: dto.provider,
        });
    }
}
