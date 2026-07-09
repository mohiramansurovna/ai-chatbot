import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database.module";
import { UsersRepository } from "@/core/users/users.repository";
import { ApiKeysModule } from "./api-keys.module";
import { UsersController } from "@/interface/user/users.controller";
import { AddApiKeyUseCase } from "@/application/user/add-api-key.use-case";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [DatabaseModule, ApiKeysModule, ConfigModule],
    providers: [UsersRepository, AddApiKeyUseCase],
    controllers:[UsersController],
    exports: [UsersRepository]
})
export class UsersModule { }