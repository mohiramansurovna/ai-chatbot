import { Core } from "@/core";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class ListMemoriesUseCase {
    constructor(@Inject(Core.UserMemories.USER_MEMORIES_REPOSITORY) private readonly userMemoriesRepository: Core.UserMemories.IUserMemoriesRepository,) { }
    async execute(userId: number): Promise<Core.UserMemories.UserMemory[]> {
        //later may add pagination, or infinite scrolling
        return await this.userMemoriesRepository.list(userId);
    }
}