import { Module } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { ConfigModule } from "./config.module";
import { UnitOfWork } from "../database/unit-of-work";

@Module({
    imports: [ConfigModule],
    providers: [DatabaseService, UnitOfWork],
    exports: [DatabaseService, UnitOfWork]
})
export class DatabaseModule { }