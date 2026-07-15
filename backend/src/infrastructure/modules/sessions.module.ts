import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database.module";
import { SESSIONS_REPOSITORY } from "@/core/sessions/sessions.repository";
import { SessionsController } from "@/interface/sessions/sessions.controller";
import { ChatUseCase } from "@/application/chat/use-cases/chat.use-case";
import { CreateSessionUseCase } from "@/application/chat/use-cases/create-session.use-case";
import { GetSessionUseCase } from "@/application/conversation/use-cases/get-session-context.use-case";
import { ListSessionsUseCase } from "@/application/conversation/use-cases/list-sessions.use-case";
import { SendMessageUseCase } from "@/application/chat/use-cases/send-message.use-case";
import { LlmModule } from "./llm.module";
import { ApiKeysModule } from "./api-keys.module";
import { ConfigModule } from "./config.module";
import { MESSAGES_REPOSITORY } from "@/core/messages/messages.repository";
import { SessionMemoryUseCase } from "@/application/memory/user-memory/use-cases/session-memory.use-case";
import { EmbeddingsModule } from "./embeddings.module";
import { SessionsRepository } from "../repositories/sessions.repository";
import { Repositories } from "../repositories";

@Module({
    imports: [DatabaseModule, LlmModule, ApiKeysModule, ConfigModule, EmbeddingsModule],
    providers: [
        {
            provide: SESSIONS_REPOSITORY,
            useClass: SessionsRepository
        },
        {
            provide: MESSAGES_REPOSITORY,
            useClass: Repositories.MessagesRepository
        },
        ChatUseCase,
        CreateSessionUseCase,
        GetSessionUseCase,
        ListSessionsUseCase,
        SendMessageUseCase,
        SessionMemoryUseCase,
    ],
    controllers: [SessionsController],
    exports: [SESSIONS_REPOSITORY],
})
export class SessionsModule { }