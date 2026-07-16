import { Core } from "@/core";

export class LlmMessageMapper{
    static fromMessage(message:Core.Messages.Message):Core.Llm.LlmMessage{
        return {
            role:message.role,
            content:message.content
        }
    }
}