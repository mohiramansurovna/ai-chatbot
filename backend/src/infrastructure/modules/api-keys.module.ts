import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database.module";
import { ApiKeysRepository } from "@/core/api-keys/api-keys.repository";

@Module({
    imports: [DatabaseModule],
    providers: [ApiKeysRepository],
    exports: [ApiKeysRepository]
})
export class ApiKeysModule { }