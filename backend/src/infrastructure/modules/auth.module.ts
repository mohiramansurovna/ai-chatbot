import { Module } from "@nestjs/common";
import { ConfigModule } from "./config.module";
import { DatabaseModule } from "./database.module";
import { UsersModule } from "./users.module";
import { AuthController } from '@/interface/auth/auth.controller'
import { RefreshUseCase, LoginUseCase, RegisterUseCase } from "@/application/auth/use-cases"
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "@/shared/guards/auth-guard";
@Module({
    imports: [
        UsersModule,
        ConfigModule,
        DatabaseModule
    ],
    providers: [RefreshUseCase, LoginUseCase, RegisterUseCase,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
    controllers: [AuthController]
})
export class AuthModule { }