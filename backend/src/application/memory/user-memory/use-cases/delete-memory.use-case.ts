import { Core } from "@/core";
import { Inject, Injectable } from "@nestjs/common";
import { UserMemoryNotFoundException } from "../errors";

@Injectable()
export class DeleteMemoryUseCase {
    constructor(@Inject(Core.UserMemories.USER_MEMORIES_REPOSITORY) private readonly userMemoriesRepository: Core.UserMemories.IUserMemoriesRepository,) { }
    async execute(id: number, userId: number): Promise<void> {
        const userMemory = await this.userMemoriesRepository.findById(id);
        if(!userMemory){
            throw new UserMemoryNotFoundException()
        }

        userMemory.verifyAccess(userId);

        await this.userMemoriesRepository.delete(id);
    }
}