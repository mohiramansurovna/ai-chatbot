import { Application } from "@/application";
import { Core } from "@/core";
import { Infrastructure } from "@/infrastructure";
import { Module } from "@nestjs/common";
import { LlmModule } from "./llm.module";
import { ConversationModule } from "./conversation.module";
import { DatabaseModule } from "./database.module";

@Module({
    imports: [LlmModule, ConversationModule, DatabaseModule],
    providers: [
        Application.Memory.UserMemories.CreateMemoryUseCase,
        Application.Memory.UserMemories.DeleteMemoryUseCase,
        Application.Memory.UserMemories.EditMemoryUseCase,
        Application.Memory.UserMemories.FindRelevantMemoriesUseCase,
        Application.Memory.UserMemories.ListMemoriesUseCase,
        Application.Memory.UserMemories.ValidateSessionMemories,

        Infrastructure.Mappers.UserMemoriesMapper,
        
        {
            provide: Core.UserMemories.USER_MEMORIES_REPOSITORY,
            useClass: Infrastructure.Repositories.UserMemoriesRepository,
        }
    ],
    exports: [
        Application.Memory.UserMemories.FindRelevantMemoriesUseCase,
        Core.UserMemories.USER_MEMORIES_REPOSITORY
    ]
})
export class MemoryModule { }