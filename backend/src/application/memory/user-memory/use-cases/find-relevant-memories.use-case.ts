import { Core } from "@/core";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class FindRelevantMemoriesUseCase {
    constructor(
        @Inject(Core.UserMemories.USER_MEMORIES_REPOSITORY) private readonly userMemoriesRepository: Core.UserMemories.IUserMemoriesRepository,
        @Inject(Core.Llm.EMBEDDINGS_PROVIDER) private readonly embeddingsProvider: Core.Llm.IEmbeddingsProvider,
    ) { }
    async execute(userId: number, queryContent: string): Promise<Core.UserMemories.UserMemory[]> {
        const { embedding } = await this.embeddingsProvider.embed(queryContent);
        return await this.userMemoriesRepository.findRelevant(userId, embedding);
    }
}