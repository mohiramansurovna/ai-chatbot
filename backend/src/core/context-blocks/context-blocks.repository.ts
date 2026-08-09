import { IRepository } from "../shared/repository.interface";
import { ContextBlock } from "./context-blocks.entity";
export interface IContextBlocksRepository extends IRepository<ContextBlock>{}
export const CONTEXT_BLOCKS_REPOSITORY = Symbol("CONTEXT_BLOCKS_REPOSITORY")