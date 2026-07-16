import { Inject, Injectable } from "@nestjs/common";
import { Core } from "@/core";
import { Application } from "@/application";
import { GetActiveKeyUseCase } from "@/application/identity/use-cases";
import { FindRelevantMemoriesUseCase } from "@/application/memory/user-memory/use-cases";
import { LlmRegistry } from "@/core/llm/llm.registry";
import { AppendMessageUseCase } from "@/application/conversation/use-cases";
type ChatUseCaseArgs = {
    sessionId: Core.Sessions.Session['id'];
    userMessage: string;
    userId: Core.Users.User['id'];
    providerName: Core.Llm.LlmProviderName;
}

@Injectable()
export class ChatUseCase {
    constructor(
        @Inject(Core.Sessions.SESSIONS_REPOSITORY) private readonly sessionsRepository: Core.Sessions.ISessionsRepository,
        private readonly getActiveKeyUseCase: GetActiveKeyUseCase,
        private readonly llmRegistry: LlmRegistry,
        private readonly findRelevantMemoriesUseCase: FindRelevantMemoriesUseCase,
        @Inject(Core.Messages.MESSAGES_REPOSITORY) private readonly messagesRepository: Core.Messages.IMessagesRepository,
        private readonly appendMessageUseCase: AppendMessageUseCase
    ) { }

    async execute(args: ChatUseCaseArgs): Promise<Core.Messages.Message> {
        const { sessionId, userId, userMessage, providerName } = args;

        const activeApiKey = await this.getActiveKeyUseCase.execute(userId, providerName);
        const llmProvider = this.llmRegistry.resolve(providerName);
        const activeLlm = new Core.Llm.ActiveLlm(llmProvider, activeApiKey);

        await this.appendMessageUseCase.execute(sessionId, userMessage, {
            role: 'user',
            userId
        })

        const relevantMemories = await this.findRelevantMemoriesUseCase.execute(userId, userMessage);
        const systemPrompt = Core.Llm.Prompts.buildUserMemoriesPrompt(relevantMemories);

        const messages = await this.messagesRepository.listBySessionId(sessionId);
        const llmMessages = messages.map(message =>
            Application.Shared.Mappers.LlmMessageMapper.fromMessage(message)
        )

        const res = await activeLlm.generate({ messages: llmMessages, systemPrompt });

        return await this.appendMessageUseCase.execute(sessionId, res, { role: 'assistant' })
    }
}