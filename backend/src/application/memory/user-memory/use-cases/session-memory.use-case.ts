import { ApiKeysRepository } from "@/core/api-keys/api-keys.repository";
import { Core } from "@/core";
import { LlmRegistry } from "@/core/llm/llm.registry";
import { EmbeddingsService } from "@/infrastructure/ollama/embeddings.service";
import { Jose } from "@/shared/libs/jose";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";

export type ExtractedFacts = {
    "old_facts": number[],
    "new_facts": string[],
}


@Injectable()
export class SessionMemoryUseCase {
    constructor(
        @Inject(Core.Messages.MESSAGES_REPOSITORY) private readonly messagesRepository: Core.Messages.IMessagesRepository,
        @Inject(Core.Embeddings.EMBEDDINGS_REPOSITORY) private readonly embeddingsRepository: Core.Embeddings.IEmbeddingsRepository,
        private readonly embeddingsService: EmbeddingsService,
        @Inject(Core.Shared.LLM_CONFIG) private readonly llmConfig:Core.Shared.ILLMConfig,
        private readonly apiKeysRepository: ApiKeysRepository,
        private readonly llmRegistry: LlmRegistry,
    ) { }

    async execute(sessionId: Core.Sessions.Session['id'], userId: Core.Users.User['id']) {

        const apiKey = await this.apiKeysRepository.findActiveKey(userId, 'gemini')
        if (!apiKey) throw new NotFoundException('no api keys')

        const llm = this.llmRegistry.resolve(apiKey.provider);

        const decryptedKey = await Jose.decrypt(apiKey.encryptedKey, { secret:this.llmConfig.secret })

        await llm.configure(decryptedKey);


        const messages = await this.messagesRepository.listBySessionId(sessionId);
        const conversationTranscript = messages.map((message) => `${message.role}:${message.content}`).join(';\n')
        const existingEmbeddings = await this.embeddingsRepository.listBySessionId(sessionId);
        const existingFacts = JSON.stringify(existingEmbeddings.map((embedding => {
            return {
                id: embedding.id,
                content: embedding.content
            }
        })))

        const extractedFacts = await llm.extractFacts(conversationTranscript, existingFacts) satisfies ExtractedFacts


        await Promise.all([extractedFacts.new_facts.map(async fact => {
            const embedding = await this.embeddingsService.embed(fact);
            await this.embeddingsRepository.create({
                userId,
                sessionId,
                content: fact,
                embedding,
                embeddingModel: 'gemini', //TODO:update this later
            })
        })])

        await Promise.all([extractedFacts.old_facts.map(async id => {
            await this.embeddingsRepository.delete(id)
        })])
        const embeds = await this.embeddingsRepository.listBySessionId(sessionId)

        return { extractedFacts, oldEmbeds: existingEmbeddings.map(embed => `${embed.id} - ${embed.content}`), newEmbeds: embeds.map(embed => `${embed.id} - ${embed.content}`) }
    }
}