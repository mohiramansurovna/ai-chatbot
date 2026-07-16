import { ExtractedFacts, LlmMessage } from "../llm.types"

export function buildExtractionPrompt(messages: LlmMessage[], existingMemory: { id: number, content: string }[]): string {
    return `You are updating a user's memory profile. You extract facts ABOUT THE USER ONLY -
never facts about topics, movies, or things being discussed, and never facts based on
the assistant's phrasing or interpretation - only what the user explicitly said.

Existing facts (id: content):
${JSON.stringify(existingMemory)}

New conversation since last update:
${JSON.stringify(messages)}

Rules:
- Only extract facts that describe the USER: their preferences, identity, background, ongoing projects, or constraints.
- Only extract facts from what the USER said. Never extract facts from the assistant's replies, even if they sound insightful.
- Do not generalize or infer personality traits or abstract preferences from a single reaction. Only record what the user directly and clearly stated. If in doubt, leave it out.
- Do NOT touch a fact if nothing in the new conversation changes or contradicts it. Leave unrelated existing facts alone entirely - do not include their id in old_facts just because the topic came up again.
- old_facts: ids of existing facts that are now outdated, contradicted, or superseded by the new conversation.
- new_facts: any new or corrected fact content, written as a complete standalone statement. If correcting an existing fact, write the corrected version here, and put the original fact's id in old_facts.
- fact_id in old_facts must always be an integer that appears in the existing facts list above. Never invent an id.
- If nothing applies, return empty arrays.

Return ONLY valid JSON in exactly this shape, nothing else:
{
  "old_facts": [id],
  "new_facts": ["..."]
}`
}

export function parseExtractedFacts(raw: string): ExtractedFacts {
    try {
        const cleaned = raw.trim().replace(/^```json\s*|```$/g, '') // strip markdown fences if present
        const parsed = JSON.parse(cleaned)
        return {
            old_facts: Array.isArray(parsed.old_facts) ? parsed.old_facts.map(Number) : [],
            new_facts: Array.isArray(parsed.new_facts) ? parsed.new_facts : [],
        }
    } catch {
        return { old_facts: [], new_facts: [] }
    }
}