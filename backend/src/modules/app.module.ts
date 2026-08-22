import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import {ConfigModule as NestConfigModule } from '@nestjs/config';
import { Shared } from '@/shared';
import { Interface } from '@/interface';
import { Modules } from '.';

@Module({
  imports: [
    NestConfigModule.forRoot({
      validate:Shared.Configs.validate,
      validationOptions: {
        abortEarly: true
      },
      envFilePath: '.env',
    }),
    Modules.DatabaseModule,
    Modules.ConfigModule,
    Modules.IdentityModule,
    Modules.ConversationModule,
    Modules.MemoryModule,
    Modules.LlmModule,
    Modules.ChatModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: Interface.Guards.AccessTokenGuard
    },
  ],
})

export class AppModule { }
