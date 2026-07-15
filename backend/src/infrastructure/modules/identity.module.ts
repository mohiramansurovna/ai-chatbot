import { Module } from "@nestjs/common";
import { ConfigModule } from "./config.module";
import { DatabaseModule } from "./database.module";
import { UsersModule } from "./users.module";
import { ApiKeysModule } from "./api-keys.module";
import { AuthController } from '@/interface/auth/auth.controller'
import {
    RefreshUseCase,
    LoginUseCase,
    RegisterUseCase,
    GetProfileUseCase,
    UpdateProfileUseCase,
    DeleteAccountUseCase,
    AddApiKeyUseCase,
    GetActiveKeyUseCase,
    ListApiKeysUseCase,
    RevokeApiKeyUseCase,
} from "@/application/identity/use-cases"
import { AccessTokenGuard } from "@/interface/guards/access-token.guard";

@Module({
    imports: [
        UsersModule,
        ApiKeysModule,
        ConfigModule,
        DatabaseModule
    ],
    providers: [
        RefreshUseCase,
        LoginUseCase,
        RegisterUseCase,
        GetProfileUseCase,
        UpdateProfileUseCase,
        DeleteAccountUseCase,
        AddApiKeyUseCase,
        GetActiveKeyUseCase,
        ListApiKeysUseCase,
        RevokeApiKeyUseCase,
        AccessTokenGuard,
    ],
    controllers: [AuthController]
})
export class AuthModule { }