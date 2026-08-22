import { Application } from "@/application";
import { Infrastructure } from "@/infrastructure";
import { Core } from "@/core";
import { Module } from "@nestjs/common";
import { ConfigModule } from "./config.module";
import { DatabaseModule } from "./database.module";
import { Interface } from "@/interface";

@Module({
    imports: [ConfigModule, DatabaseModule],
    providers: [
        Application.Identity.AddApiKeyUseCase,
        Application.Identity.GetActiveKeyUseCase,
        Application.Identity.ListApiKeysUseCase,
        Application.Identity.RevokeApiKeyUseCase,
        Application.Identity.GetProfileUseCase,
        Application.Identity.UpdateProfileUseCase,
        Application.Identity.DeleteAccountUseCase,
        Application.Identity.RegisterUseCase,
        Application.Identity.LoginUseCase,
        Application.Identity.RefreshUseCase,

        Infrastructure.Mappers.UsersMapper,
        Infrastructure.Mappers.ApiKeysMapper,
        
        {
            provide: Core.Users.USERS_REPOSITORY,
            useClass: Infrastructure.Repositories.UsersRepository,
        },
        {
            provide: Core.ApiKeys.API_KEYS_REPOSITORY,
            useClass: Infrastructure.Repositories.ApiKeysRepository,
        }
    ],
    controllers:[Interface.Identity.AuthController],
    exports: [Application.Identity.GetActiveKeyUseCase]
})
export class IdentityModule { }