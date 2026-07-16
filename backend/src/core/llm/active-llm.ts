import {type LlmProvider } from "./llm.provider";
import { LlmMessage } from "./llm.types";

export class ActiveLlm{
    constructor(
        private readonly provider:LlmProvider, 
        private readonly apiKey
    ){}
    async generate({messages, systemPrompt}:{messages?:LlmMessage[],systemPrompt:string}):Promise<string>{
        return this.provider.generate({
            apiKey:this.apiKey,
            systemPrompt,
            messages
        })
    }
}