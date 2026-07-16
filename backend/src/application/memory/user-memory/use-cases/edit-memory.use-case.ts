import { Core } from "@/core";
import { Inject, Injectable } from "@nestjs/common";
import { UserMemoryNotFoundException } from "../errors";

@Injectable()
export class EditMemoryUseCase {
    constructor(
        @Inject(Core.Llm.EMBEDDINGS_PROVIDER) private readonly embeddingsProvider: Core.Llm.IEmbeddingsProvider,
        @Inject(Core.UserMemories.USER_MEMORIES_REPOSITORY) private readonly userMemoriesRepository: Core.UserMemories.IUserMemoriesRepository,
    ) { }
    async execute(id: number, userId: number, content: string): Promise<void> {
        const userMemory = await this.userMemoriesRepository.findById(id);
        if (!userMemory) {
            throw new UserMemoryNotFoundException()
        }

        userMemory.verifyAccess(userId);

        const { embedding, embeddingModel } = await this.embeddingsProvider.embed(content);
        await this.userMemoriesRepository.update(id, {
            content,
            embedding,
            embeddingModel
        });
    }
}