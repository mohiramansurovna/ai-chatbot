/**
 * session-context use-case
 * llmContext used
 * get-context-window-usage(session_id, llmContext) none (tokenizer)
 * compress-messages(session_id, range, llmContext)completion
 * edit-compression-block(block_id, new_summary_text)none
 * decompress-block(block_id)none
 * delete-compression-block(block_id)none
 */
import { Shared } from '@/application/shared';
import { Core } from '@/core';
import { ActiveLlm } from '@/core/llm/active-llm';
import { Inject, Injectable } from '@nestjs/common';

export type CompressMessageArgs = {
    sessionId: number;
    startMessageId: number;
    messageCount: number;
    activeLlm: ActiveLlm;
};
@Injectable()
export class CompressMessageUseCase {
    constructor(
        @Inject(Core.Messages.MESSAGES_REPOSITORY)
        private readonly messagesRepository: Core.Messages.IMessagesRepository,
        @Inject(Core.ContextBlocks.CONTEXT_BLOCKS_REPOSITORY)
        private readonly contextBlocksRepository: Core.ContextBlocks.IContextBlocksRepository,
        @Inject(Core.Shared.UNIT_OF_WORK) private readonly unitOfWork: Core.Shared.IUnitOfWork
    ) {}
    async execute(args: CompressMessageArgs): Promise<void> {
        const messages = await this.messagesRepository.listBySessionId(args.sessionId, {
            status: 'raw',
            startMessageId: args.startMessageId,
            limit: args.messageCount,
        });

        const llmMessages = messages.map(message =>
            Shared.Mappers.LlmMessageMapper.fromMessage(message)
        );
        const systemPrompt = Core.Llm.Prompts.buildCompressionPrompt(JSON.stringify(llmMessages));
        const compression_content = await args.activeLlm.generate({ systemPrompt });

        const contextBlock = Core.ContextBlocks.ContextBlock.create({
            sessionId: args.sessionId,
            startMessageId: args.startMessageId,
            content: compression_content,
            messageCount: args.messageCount,
        });
        await this.unitOfWork.run(async (tx: Core.Shared.ITx) => {
            return await Promise.all([
                this.contextBlocksRepository.create(contextBlock, tx),
                //mark the messages status by butch
            ]);
        });
    }
}
