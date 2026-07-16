import { Application } from "@/application";
import { Core } from "@/core";
import { Module } from "@nestjs/common";
import { Repositories } from "../repositories";
import { DatabaseModule } from "./database.module";

@Module({
    imports: [DatabaseModule],
    providers: [
        Application.Conversation.AppendMessageUseCase,
        Application.Conversation.CreateSessionUseCase,
        Application.Conversation.DeleteSessionUseCase,
        Application.Conversation.GetSessionUseCase,
        Application.Conversation.ListSessionsUseCase,
        Application.Conversation.RenameSessionUseCase,
        {
            provide: Core.Sessions.SESSIONS_REPOSITORY,
            useClass: Repositories.SessionsRepository
        },
        {
            provide: Core.Messages.MESSAGES_REPOSITORY,
            useClass: Repositories.MessagesRepository
        }
    ],
    exports: [
        Application.Conversation.AppendMessageUseCase, 
        Core.Sessions.SESSIONS_REPOSITORY, Core.Messages.MESSAGES_REPOSITORY,
        Application.Conversation.ListSessionsUseCase,
        Application.Conversation.CreateSessionUseCase,
        Application.Conversation.GetSessionUseCase,
        
    ]
})
export class ConversationModule { }