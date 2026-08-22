import { Core } from "@/core";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CreateMemoryUseCase {
    constructor(
        @Inject(Core.Llm.EMBEDDINGS_PROVIDER) private readonly embeddingsProvider: Core.Llm.IEmbeddingsProvider,
        @Inject(Core.UserMemories.USER_MEMORIES_REPOSITORY) private readonly userMemoriesRepository: Core.UserMemories.IUserMemoriesRepository,
    ) { }
    async execute(userId: number, content: string): Promise<void> {
        const { embedding, embeddingModel } = await this.embeddingsProvider.embed(content);
        const userMemory = Core.UserMemories.UserMemory.create({
            userId,
            content,
            embedding,
            embeddingModel,
        });
        await this.userMemoriesRepository.create(userMemory);
    }
}