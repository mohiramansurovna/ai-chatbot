import { IEntity } from './entity.interface';
import { ITx } from './unit-of-work';

export interface IRepository<Entity extends IEntity> {
    create(entity: Entity, tx?:ITx): Promise<Entity>;
    findById(id: number): Promise<Entity | null>;
    list(): Promise<Entity[]>;
    update(entity:Entity, tx?:ITx): Promise<void>;
    delete(id: number, tx?:ITx): Promise<void>;
}
