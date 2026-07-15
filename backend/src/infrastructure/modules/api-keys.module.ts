import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database.module";
import { Core } from "@/core";
import { ApiKeysRepository } from "@/infrastructure/repositories/api-keys.repository";

@Module({
    imports: [DatabaseModule],
    providers: [
        ApiKeysRepository,
        {
            provide: Core.ApiKeys.API_KEYS_REPOSITORY,
            useClass: ApiKeysRepository,
        },
    ],
    exports: [ApiKeysRepository, Core.ApiKeys.API_KEYS_REPOSITORY]
})
export class ApiKeysModule { }