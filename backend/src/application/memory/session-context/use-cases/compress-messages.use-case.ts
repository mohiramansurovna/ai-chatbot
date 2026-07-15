/**
 * session-context use-case
 * llmContext used
 * get-context-window-usage(session_id, llmContext) none (tokenizer)
 * compress-messages(session_id, range, llmContext)completion
 * edit-compression-block(block_id, new_summary_text)none
 * decompress-block(block_id)none
 * delete-compression-block(block_id)none
 */
import { Core } from "@/core";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CompressMessageUseCase {
    constructor() { }
    async execute(startMessageId, messageCount,): Promise<Core.ContextBlocks.ContextBlock> { }
}