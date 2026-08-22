import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';
import { Shared } from '@/shared';
import {
    APP_CONFIG,
    IAppConfig,
    DATABASE_CONFIG,
    IDatabaseConfig,
    AUTH_CONFIG,
    IAuthConfig,
    LLM_CONFIG,
    ILLMConfig,
    EMBEDDINGS_CONFIG,
    IEmbeddingsConfig,
} from '@/core/shared/env-config';

@Global()
@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: false, // block raw ConfigService injection elsewhere; force use of typed ports
            validate: Shared.Configs.validate,
        }),
    ],
    providers: [
        {
            provide: APP_CONFIG,
            useFactory: (config: ConfigService<Shared.Configs.EnvConfig, true>): IAppConfig => ({
                port: config.get('PORT', { infer: true }),
            }),
            inject: [ConfigService],
        },
        {
            provide: DATABASE_CONFIG,
            useFactory: (
                config: ConfigService<Shared.Configs.EnvConfig, true>
            ): IDatabaseConfig => ({
                host: config.get('DB_HOST', { infer: true }),
                port: config.get('DB_PORT', { infer: true }),
                user: config.get('DB_USER', { infer: true }),
                password: config.get('DB_PASSWORD', { infer: true }),
                name: config.get('DB_NAME', { infer: true }),
            }),
            inject: [ConfigService],
        },
        {
            provide: AUTH_CONFIG,
            useFactory: (config: ConfigService<Shared.Configs.EnvConfig, true>): IAuthConfig => ({
                accessTokenSecret: config.get('JWT_ACCESS_SECRET', { infer: true }),
                refreshTokenSecret: config.get('JWT_REFRESH_SECRET', { infer: true }),
                accessTokenExpiresIn: config.get('JWT_ACCESS_TOKEN_EXPIRES_IN', { infer: true }),
                refreshTokenExpiresIn: config.get('JWT_REFRESH_SESSION_EXPIRES_IN', {
                    infer: true,
                }),
            }),
            inject: [ConfigService],
        },
        {
            provide: LLM_CONFIG,
            useFactory: (config: ConfigService<Shared.Configs.EnvConfig, true>): ILLMConfig => ({
                secret: config.get('LLM_SECRET', { infer: true }),
            }),
            inject: [ConfigService],
        },
        {
            provide: EMBEDDINGS_CONFIG,
            useFactory: (
                config: ConfigService<Shared.Configs.EnvConfig, true>
            ): IEmbeddingsConfig => ({
                ollamaUrl: config.get('OLLAMA_URL', { infer: true }),
                ollamaEmbedModel: config.get('OLLAMA_EMBED_MODEL', { infer: true }),
            }),
            inject: [ConfigService],
        },
    ],
    exports: [APP_CONFIG, DATABASE_CONFIG, AUTH_CONFIG, LLM_CONFIG, EMBEDDINGS_CONFIG],
})
export class ConfigModule {}