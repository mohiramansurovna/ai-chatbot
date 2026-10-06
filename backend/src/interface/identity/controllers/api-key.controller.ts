import { Body, Controller, Get, Post } from '@nestjs/common';
import { AddApiKeyDto } from '../dtos';
import { Application } from '@/application';
import { Decorators } from '@/shared/_';

@Controller('api/api-keys')
export class ApiKeysController {
    constructor(
        private readonly addApiKeyUseCase: Application.Identity.AddApiKeyUseCase,
        private readonly listApiKeysUseCase: Application.Identity.ListApiKeysUseCase
    ) {}
    @Post()
    async addApiKey(@Decorators.CurrentUserId() userId: number, @Body() dto: AddApiKeyDto) {
        return await this.addApiKeyUseCase.execute({
            apiKey: dto.apiKey,
            provider: dto.provider,
            userId,
        });
    }
    @Get()
    async list(@Decorators.CurrentUserId() userId: number) {
        return await this.listApiKeysUseCase.execute({userId})
    }
}
