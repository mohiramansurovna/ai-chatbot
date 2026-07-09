import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database.module";
import { SessionsRepository } from "@/core/sessions/sessions.repository";
import { SessionsController } from "@/interface/sessions/sessions.controller";
import { ChatUseCase } from "@/application/chat/use-cases/chat.use-case";
import { CreateSessionUseCase } from "@/application/chat/use-cases/create-session.use-case";
import { GetSessionUseCase } from "@/application/chat/use-cases/get-session.use-case";
import { ListSessionsUseCase } from "@/application/chat/use-cases/list-sessions.use-case";
import { SendMessageUseCase } from "@/application/chat/use-cases/send-message.use-case";
import { LlmModule } from "./llm.module";
import { ApiKeysModule } from "./api-keys.module";
import { ConfigModule } from "@nestjs/config";
import { MessagesRepository } from "@/core/messages/messages.repository";
import { SessionMemoryUseCase } from "@/application/memory/session-memory.use-case";
import { EmbeddingsModule } from "./embeddings.module";

@Module({
    imports: [DatabaseModule, LlmModule, ApiKeysModule, ConfigModule, EmbeddingsModule],
    providers: [
        SessionsRepository,
        MessagesRepository,
        ChatUseCase,
        CreateSessionUseCase,
        GetSessionUseCase,
        ListSessionsUseCase,
        SendMessageUseCase,
        SessionMemoryUseCase,
    ],
    controllers: [SessionsController],
    exports: [SessionsRepository],
})
export class SessionsModule { }