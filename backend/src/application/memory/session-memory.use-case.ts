import { ApiKeysRepository } from "@/core/api-keys/api-keys.repository";
import { EmbeddingsRepository } from "@/core/embeddings/embeddings.repository";
import { Session, User } from "@/core/entities";
import { LlmRegistry } from "@/core/llm/llm.registry";
import { MessagesRepository } from "@/core/messages/messages.repository";
import { EmbeddingsService } from "@/infrastructure/ollama/embeddings.service";
import { EnvConfig } from "@/shared/configs/env.config";
import { Jose } from "@/shared/libs/jose";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export type ExtractedFacts = {
    "old_facts": number[],
    "new_facts": string[],
}


@Injectable()
export class SessionMemoryUseCase {
    constructor(
        private readonly messagesRepository: MessagesRepository,
        private readonly embeddingsRepository: EmbeddingsRepository,
        private readonly embeddingsService: EmbeddingsService,
        private readonly configService: ConfigService<EnvConfig, true>,
        private readonly apiKeysRepository: ApiKeysRepository,
        private readonly llmRegistry: LlmRegistry,
    ) { }

    async execute(sessionId: Session['id'], userId: User['id']) {

        const apiKey = await this.apiKeysRepository.findActiveKey(userId, 'gemini')
        if (!apiKey) throw new NotFoundException('no api keys')

        const llm = this.llmRegistry.resolve(apiKey.provider);

        const secret = this.configService.get('LLM_SECRET', { infer: true })
        const decryptedKey = await Jose.decrypt(apiKey.encryptedKey, { secret })

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
                role: 'user'
            })
        })])

        await Promise.all([extractedFacts.old_facts.map(async id => {
            await this.embeddingsRepository.deleteById(id)
        })])
        const embeds = await this.embeddingsRepository.listBySessionId(sessionId)

        return { extractedFacts, oldEmbeds: existingEmbeddings.map(embed => `${embed.id} - ${embed.content}`), newEmbeds: embeds.map(embed => `${embed.id} - ${embed.content}`) }
    }
}