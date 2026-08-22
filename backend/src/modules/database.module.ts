import { Module } from "@nestjs/common";
import { ConfigModule } from "./config.module";
import { Core } from "@/core";
import { Infrastructure } from "@/infrastructure";

@Module({
    imports: [ConfigModule],
    providers: [Infrastructure.Database.DatabaseService,
        {
            provide: Core.Shared.UNIT_OF_WORK,
            useClass: Infrastructure.Database.UnitOfWork,
        }
    ],
    exports: [Infrastructure.Database.DatabaseService, Core.Shared.UNIT_OF_WORK]
})
export class DatabaseModule { }