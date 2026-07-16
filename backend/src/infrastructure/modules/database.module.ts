import { Module } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { ConfigModule } from "./config.module";
import { UnitOfWork } from "../database/unit-of-work";
import { Core } from "@/core";

@Module({
    imports: [ConfigModule],
    providers: [DatabaseService,
        {
            provide: Core.Shared.UNIT_OF_WORK,
            useClass: UnitOfWork,
        }
    ],
    exports: [DatabaseService, Core.Shared.UNIT_OF_WORK]
})
export class DatabaseModule { }