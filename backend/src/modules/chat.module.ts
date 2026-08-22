import { Application } from "@/application";
import { Module } from "@nestjs/common";
import { ConversationModule } from "./conversation.module";
import { IdentityModule } from "./identity.module";
import { LlmModule } from "./llm.module";
import { MemoryModule } from "./memory.module";
import { Interface } from "@/interface";

@Module({
    imports: [
        ConversationModule, 
        IdentityModule, 
        LlmModule, 
        MemoryModule
    ],
    providers: [Application.Chat.ChatUseCase],
})
export class ChatModule { }