import { Body, Controller, Get, Post } from "@nestjs/common";
import { AddApiKeyDto } from "../dtos/add-api-key.dto";
import { CurrentUser } from "@/shared/decorators/current-user.decorator";
import { User } from "@/core/users/users.entity";
import { AddApiKeyUseCase } from "@/application/identity/use-cases";
import { UserResponse, UsersPresenter } from "../presenters/users.presenter";
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
        await this.addApiKeyUseCase.execute({userId:currentUser.id, apiKey:body.apiKey, provider:body.provider});
        return 'successfully added'
    }

    @Get('me')
    async getMe(@CurrentUser() currentUser:User):Promise<UserResponse>{
        return UsersPresenter.toResponse(currentUser)
    }

}