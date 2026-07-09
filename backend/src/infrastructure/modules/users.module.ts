import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database.module";
import { USERS_REPOSITORY } from "@/core/users/users.repository";
import { ApiKeysModule } from "./api-keys.module";
import { UsersController } from "@/interface/user/users.controller";
import { AddApiKeyUseCase } from "@/application/user/add-api-key.use-case";
import { ConfigModule } from "./config.module";
import { UsersRepository } from "@/infrastructure/repositories/users.repository";

@Module({
    imports: [DatabaseModule, ApiKeysModule, ConfigModule],
    providers: [
        AddApiKeyUseCase,
        {
            provide: USERS_REPOSITORY,
            useClass: UsersRepository,
        },
    ],
    controllers: [UsersController],
    exports: [USERS_REPOSITORY]
})
export class UsersModule { }