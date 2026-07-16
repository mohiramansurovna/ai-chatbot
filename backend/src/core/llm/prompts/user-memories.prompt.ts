export function buildUserMemoriesPrompt(memories: { content: string }[]): string {
    if (memories.length === 0) {
        return ''
    }

    return `Known facts about the user, from prior conversations:
${JSON.stringify(memories.map(m => m.content))}

Use these naturally where relevant. Do not mention that you "remember" or "have stored"
these facts unless the user directly asks what you know about them. Do not force them
into unrelated responses.`
}