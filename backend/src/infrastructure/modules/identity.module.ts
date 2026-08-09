import { Application } from "@/application";
import { Repositories } from "../repositories";
import { Core } from "@/core";
import { Module } from "@nestjs/common";
import { ConfigModule } from "./config.module";
import { DatabaseModule } from "./database.module";

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

        {
            provide: Core.Users.USERS_REPOSITORY,
            useClass: Repositories.UsersRepository,
        },
        {
            provide: Core.ApiKeys.API_KEYS_REPOSITORY,
            useClass: Repositories.ApiKeysRepository,
        }
    ],
    exports: [Application.Identity.GetActiveKeyUseCase]
})
export class IdentityModule { }