import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { SendMessageUseCase } from "./send-message.use-case"
import { LlmRegistry } from "@/core/llm/llm.registry"
import { ApiKeysRepository } from "@/core/api-keys/api-keys.repository"
import { LlmProviderName } from "@/core/llm/llm.types"
import { Jose } from "@/shared/libs/jose"
import { EmbeddingsService } from "@/infrastructure/ollama/embeddings.service"
import { Core } from "@/core"

type ChatUseCaseArgs = {
    sessionId: Core.Sessions.Session['id'];
    content: string;
    userId: Core.Users.User['id'];
    provider: LlmProviderName;
}

@Injectable()
export class ChatUseCase {
    constructor(
        private readonly sendMessage: SendMessageUseCase,
        private readonly llmRegistry: LlmRegistry,
        private readonly apiKeysRepository: ApiKeysRepository,
        @Inject(Core.Messages.MESSAGES_REPOSITORY) private readonly messagesRepository: Core.Messages.IMessagesRepository,
        @Inject(Core.Shared.LLM_CONFIG) private readonly llmConfig: Core.Shared.ILLMConfig,
        private readonly embeddingsService: EmbeddingsService,
        @Inject(Core.Embeddings.EMBEDDINGS_REPOSITORY) private readonly embeddingsRepository: Core.Embeddings.IEmbeddingsRepository,
    ) { }

    async execute(args: ChatUseCaseArgs): Promise<Core.Messages.Message> {
        const { sessionId, userId, content, provider } = args

        await this.sendMessage.execute(sessionId, 'user', content)

        const apiKey = await this.apiKeysRepository.findActiveKey(userId, provider)
        if (!apiKey) throw new NotFoundException('no api keys')

        const llm = this.llmRegistry.resolve(apiKey.provider);

        const decryptedKey = await Jose.decrypt(apiKey.encryptedKey, { secret: this.llmConfig.secret })

        llm.configure(decryptedKey);

        const messages = await this.messagesRepository.listBySessionId(sessionId)
        const embeddedQuery = await this.embeddingsService.embed(content);

        const nearestEmbeddings = await this.embeddingsRepository.findNearest(userId, embeddedQuery);
        const memoryFacts = JSON.stringify(nearestEmbeddings.map(embedding => {
            return {
                content: embedding.content,
                similarity: embedding.similarity
            }
        }));

        const assistantText = await llm.send(messages, memoryFacts)

        return this.messagesRepository.create({ sessionId, role: 'assistant', content: assistantText })
    }
}