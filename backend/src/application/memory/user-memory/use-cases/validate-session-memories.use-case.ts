import { SessionNotFoundException } from "@/application/shared/errors";
import { Mappers } from "@/application/shared/mappers";
import { Core } from "@/core";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class ValidateSessionMemories {
    constructor(
        @Inject(Core.Sessions.SESSIONS_REPOSITORY) private readonly sessionsRepository: Core.Sessions.ISessionsRepository,
        @Inject(Core.Messages.MESSAGES_REPOSITORY) private readonly messagesRepository: Core.Messages.IMessagesRepository,
        @Inject(Core.UserMemories.USER_MEMORIES_REPOSITORY) private readonly userMemoriesRepository: Core.UserMemories.IUserMemoriesRepository,
        @Inject(Core.Llm.EMBEDDINGS_PROVIDER) private readonly embeddingsProvider: Core.Llm.IEmbeddingsProvider,
        @Inject(Core.Shared.UNIT_OF_WORK) private readonly unitOfWork: Core.Shared.IUnitOfWork,
    ) { }
    async execute(sessionId: number, userId: number, activeLlm: Core.Llm.ActiveLlm): Promise<void> {
        const session = await this.sessionsRepository.findById(sessionId);
        if (!session) {
            throw new SessionNotFoundException()
        }
        session.verifyAccess(userId);


        const userMemories = await this.userMemoriesRepository.list(userId);
        const sessionMessages = await this.messagesRepository.listBySessionId(sessionId);

        const messages = sessionMessages.map(message => Mappers.LlmMessageMapper.fromMessage(message)
        );
        const existingMemory = userMemories.map(memory => ({
            id: memory.id,
            content: memory.content
        }))

        const prompt = Core.Llm.Prompts.buildExtractionPrompt(messages, existingMemory);
        const res = await activeLlm.generate({ systemPrompt: prompt });
        const extractedFacts = Core.Llm.Prompts.parseExtractedFacts(res);

        const createManyArgs: Core.UserMemories.InsertUserMemories[] = [];

        await Promise.all(extractedFacts.new_facts.map(async fact => {
            const { embedding, embeddingModel } = await this.embeddingsProvider.embed(fact);
            createManyArgs.push({
                userId,
                content: fact,
                embedding,
                embeddingModel
            })
        }));

        await this.unitOfWork.run(async (tx: unknown) => {
            if (createManyArgs.length) {
                await this.userMemoriesRepository.createMany(createManyArgs, tx);
            }
            if (extractedFacts.old_facts.length) {
                await this.userMemoriesRepository.deleteMany(extractedFacts.old_facts, tx)
            }
        })

    }
}