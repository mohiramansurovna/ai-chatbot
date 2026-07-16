import { Application } from "@/application";
import { Core } from "@/core";
import { Module } from "@nestjs/common";
import { ConversationModule } from "./conversation.module";
import { IdentityModule } from "./identity.module";
import { LlmModule } from "./llm.module";
import { MemoryModule } from "./memory.module";
import { SessionsController } from "@/interface/sessions/sessions.controller";

@Module({
    imports: [
        ConversationModule, 
        IdentityModule, 
        LlmModule, 
        MemoryModule
    ],
    controllers: [SessionsController],
    providers: [Application.Chat.ChatUseCase],
})
export class ChatModule { }