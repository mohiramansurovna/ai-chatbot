import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from '../../shared/configs/env.config';
import { DatabaseModule } from './database.module';
import { AuthModule } from './auth.module';
import { UsersModule } from './users.module';
import { ApiKeysModule } from './api-keys.module';
import { SessionsModule } from './sessions.module';
import { LlmModule } from './llm.module';
import { EmbeddingsModule } from './embeddings.module';


@Module({
  imports: [
    ConfigModule.forRoot({
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
    EmbeddingsModule
  ]
})
export class AppModule { }
