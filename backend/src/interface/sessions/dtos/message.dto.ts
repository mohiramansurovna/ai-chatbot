import { LLM_PROVIDER_NAME, type LlmProviderName } from "@/core/llm/llm.types";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class MessageDto {
    @IsNotEmpty()
    @IsString()
    message: string;

    @IsNotEmpty()
    @IsEnum(LLM_PROVIDER_NAME, { message: "Wrong provider name" })
    provider: LlmProviderName;
}