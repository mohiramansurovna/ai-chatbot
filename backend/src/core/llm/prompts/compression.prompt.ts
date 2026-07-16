export function buildCompressionPrompt(conversationTranscript:string): string {
    return `Summarize the following conversation messages into a concise paragraph.
Preserve any facts, decisions, or commitments made. Omit small talk.`;
}