export interface IAppConfig {
    port: number;
}
export const APP_CONFIG = Symbol('APP_CONFIG');

export interface IDatabaseConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
}
export const DATABASE_CONFIG = Symbol('DATABASE_CONFIG');

export interface IAuthConfig {
    accessTokenSecret: string;
    refreshTokenSecret: string;
    accessTokenExpiresIn: string;
    refreshTokenExpiresIn: string;
}
export const AUTH_CONFIG = Symbol('AUTH_CONFIG');

export interface ILLMConfig {
    secret: string;
}
export const LLM_CONFIG = Symbol('LLM_CONFIG');

export interface IEmbeddingsConfig {
    ollamaUrl: string;
    ollamaEmbedModel: string;
}
export const EMBEDDINGS_CONFIG = Symbol('EMBEDDINGS_CONFIG');