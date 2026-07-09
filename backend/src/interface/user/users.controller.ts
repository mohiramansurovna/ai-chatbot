import { AddApiKeyUseCase } from "@/application/user/add-api-key.use-case";
import { Body, Controller, Get, Post } from "@nestjs/common";
import { AddApiKeyDto } from "./dtos/add-api-key.dto";
import { CurrentUser } from "@/shared/decorators/current-user.decorator";
import { User } from "@/core/entities";
import { UserResponse, UsersPresenter } from "./users.presenter";
import { Public } from "@/shared/decorators/public.decorator";

@Controller('api/user')
export class UsersController {
    constructor(private readonly addApiKeyUseCase:AddApiKeyUseCase) { }

    @Public()
    @Get()
    async hi(){
        return 'server is working'
    }

    @Post('apiKeys')
    async addApiKey(@CurrentUser() currentUser:User, @Body() body:AddApiKeyDto):Promise<string>{
        await this.addApiKeyUseCase.execute(currentUser.id, body.apiKey, body.provider);
        return 'successfully added'
    }

    @Get('me')
    async getMe(@CurrentUser() currentUser:User):Promise<UserResponse>{
        return UsersPresenter.toResponse(currentUser)
    }

}