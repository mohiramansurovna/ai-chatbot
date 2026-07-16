import { Shared } from "../shared";
import { ContextBlock } from "./context-blocks.entity";

export type InsertContextBlock = Omit<ContextBlock, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateContextBlock = Pick<ContextBlock, 'content'>;

export interface IContextBlocksRepository {
    create(args: InsertContextBlock, tx:Shared.Tx): Promise<void>;
    update(id:ContextBlock['id'], args: UpdateContextBlock): Promise<void>;
    delete(id: ContextBlock['id']): Promise<void>;
    findById(id: ContextBlock['id']): Promise<ContextBlock|null>;
}
export const CONTEXT_BLOCKS_REPOSITORY = Symbol("CONTEXT_BLOCKS_REPOSITORY")