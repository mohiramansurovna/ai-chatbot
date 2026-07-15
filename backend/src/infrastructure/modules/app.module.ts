import { Module } from '@nestjs/common';
import { ConfigModule, ConfigModule as NestConfigModule } from '@nestjs/config';
import { validate } from '../../shared/configs/env.config';
import { DatabaseModule } from './database.module';
import { AuthModule } from './identity.module';
import { UsersModule } from './users.module';
import { ApiKeysModule } from './api-keys.module';
import { SessionsModule } from './sessions.module';
import { LlmModule } from './llm.module';
import { EmbeddingsModule } from './embeddings.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from '@/interface/guards/access-token.guard';


@Module({
  imports: [
    NestConfigModule.forRoot({
      validate,
      validationOptions: {
        abortEarly: true
      },
      envFilePath: '.env',
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    ApiKeysModule,
    SessionsModule,
    LlmModule,
    EmbeddingsModule,
    ConfigModule,
  ],
  providers: [
    { provide: APP_GUARD, useExisting: AccessTokenGuard },
  ],
})

export class AppModule { }
