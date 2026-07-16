import { Inject, Injectable } from "@nestjs/common";
import { Core } from "@/core";
import { Application } from "@/application";
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
        private readonly getActiveKeyUseCase: Application.Identity.GetActiveKeyUseCase,
        private readonly llmRegistry: Core.Llm.LlmRegistry,
        private readonly findRelevantMemoriesUseCase: Application.Memory.UserMemories.FindRelevantMemoriesUseCase,
        @Inject(Core.Messages.MESSAGES_REPOSITORY) private readonly messagesRepository: Core.Messages.IMessagesRepository
    ) { }

    async execute(args: ChatUseCaseArgs): Promise<Core.Messages.Message> {
        const { sessionId, userId, userMessage, providerName } = args;

        const session = await this.sessionsRepository.findById(sessionId)
        if (!session) {
            throw new Application.Shared.SessionNotFoundException()
        }
        session.verifyAccess(userId);


        const activeApiKey = await this.getActiveKeyUseCase.execute(userId, providerName);
        const llmProvider = this.llmRegistry.resolve(providerName);
        const activeLlm = new Core.Llm.ActiveLlm(llmProvider, activeApiKey);

        const relevantMemories = await this.findRelevantMemoriesUseCase.execute(userId, userMessage);
        const systemPrompt = Core.Llm.Prompts.buildUserMemoriesPrompt(relevantMemories);

        const messages = await this.messagesRepository.listBySessionId(sessionId);
        const llmMessages = messages.map(message =>
            Application.Shared.Mappers.LlmMessageMapper.fromMessage(message)
        )

        const res = await activeLlm.generate({ messages: llmMessages, systemPrompt });

        return await this.messagesRepository.create({
            sessionId,
            role: 'assistant',
            status: 'raw',
            content: res,
        })
    }
}