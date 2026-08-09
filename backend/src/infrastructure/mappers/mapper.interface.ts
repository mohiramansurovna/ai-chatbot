import { IEntity } from '@/core/shared/entity.interface';

export interface IMapper<Entity extends IEntity, ModelSelect, ModelInsert>{
    toDomain(model:ModelSelect): Entity;
    toUpdateModel(entity:Entity):Partial<ModelInsert>;
    toInsertModel(entity:Entity):ModelInsert;
}
