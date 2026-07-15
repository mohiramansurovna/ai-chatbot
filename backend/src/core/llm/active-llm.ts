import { Injectable } from "@nestjs/common";
import {type LlmProvider } from "./llm.provider";
import { LlmMessage } from "./llm.types";

@Injectable()
export class ActiveLlm{
    constructor(
        private readonly provider:LlmProvider, 
        private readonly apiKey
    ){}
    generate(messages:LlmMessage[],systemPrompt:string){
        this.provider.generate({
            apiKey:this.apiKey,
            systemPrompt,
            messages
        })
    }
}