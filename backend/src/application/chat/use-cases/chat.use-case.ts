import { Injectable, NotFoundException } from "@nestjs/common"
import { SendMessageUseCase } from "./send-message.use-case"
import { LlmRegistry } from "@/core/llm/llm.registry"
import { Session, User } from "@/core/entities"
import { ApiKeysRepository } from "@/core/api-keys/api-keys.repository"
import { LlmProviderName } from "@/core/llm/llm.types"
import { ConfigService } from "@nestjs/config"
import { EnvConfig } from "@/shared/configs/env.config"
import { Jose } from "@/shared/libs/jose"
import { MessagesRepository } from "@/core/messages/messages.repository"
import { Message } from "@/core/messages/messages.entity"
import { EmbeddingsRepository } from "@/core/embeddings/embeddings.repository"
import { EmbeddingsService } from "@/infrastructure/ollama/embeddings.service"

type ChatUseCaseArgs = {
    sessionId: Session['id'];
    content: string;
    userId: User['id'];
    provider: LlmProviderName;
}

@Injectable()
export class ChatUseCase {
    constructor(
        private readonly sendMessage: SendMessageUseCase,
        private readonly llmRegistry: LlmRegistry,
        private readonly apiKeysRepository: ApiKeysRepository,
        private readonly messagesRepository: MessagesRepository,
        private readonly configService: ConfigService<EnvConfig, true>,
        private readonly embeddingsService: EmbeddingsService,
        private readonly embeddingsRepository: EmbeddingsRepository,
    ) { }

    async execute(args: ChatUseCaseArgs): Promise<Message> {
        const { sessionId, userId, content, provider } = args

        await this.sendMessage.execute(sessionId, 'user', content)

        const apiKey = await this.apiKeysRepository.findActiveKey(userId, provider)
        if (!apiKey) throw new NotFoundException('no api keys')

        const llm = this.llmRegistry.resolve(apiKey.provider);

        const secret = this.configService.get('LLM_SECRET', { infer: true })
        const decryptedKey = await Jose.decrypt(apiKey.encryptedKey, { secret })

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