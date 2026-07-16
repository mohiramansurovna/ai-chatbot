import { Module } from "@nestjs/common";
import { EmbeddingsService } from "../llm/local/embeddings.provider";
import { EmbeddingsRepository } from "@/core/embeddings/embeddings.repository";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database.module";

@Module({
    imports: [ConfigModule, DatabaseModule],
    providers: [EmbeddingsRepository, EmbeddingsService],
    exports: [EmbeddingsService, EmbeddingsRepository],
})
export class EmbeddingsModule { }