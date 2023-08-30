import { IBaseEntity } from "./interfaces";
import { DeepPartial, DeleteResult, EntityManager, FindManyOptions, FindOneOptions, FindOperator, Repository, SaveOptions, UpdateResult } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { FindConditions } from "./types";
import { GetByIdsOptions, GetManyOptions, GetOneOptions } from "./interfaces";
export declare class BaseRepository<Entity extends IBaseEntity> extends Repository<Entity> {
    constructor(repository: Repository<Entity>);
    save<T extends DeepPartial<Entity>>(entity: T, options?: SaveOptions, manager?: EntityManager): Promise<T & Entity>;
    saveAndGet<T extends DeepPartial<Entity>>(entity: T, options?: SaveOptions & FindOneOptions<Entity>, manager?: EntityManager): Promise<Entity>;
    saveMany<T extends DeepPartial<Entity>>(entities: T[], options?: SaveOptions, manager?: EntityManager): Promise<(T & Entity)[]>;
    update(id: string, partialEntity: QueryDeepPartialEntity<Entity>, manager?: EntityManager): Promise<UpdateResult>;
    updateAndGet(id: string, partialEntity: QueryDeepPartialEntity<Entity>, options?: FindOneOptions<Entity>, manager?: EntityManager): Promise<Entity>;
    updateOne(conditions: FindConditions<Entity>, partialEntity: QueryDeepPartialEntity<Entity>, manager?: EntityManager): Promise<UpdateResult>;
    updateMany(findConditions: FindConditions<Entity>, partialEntity: QueryDeepPartialEntity<Entity>, manager?: EntityManager): Promise<UpdateResult>;
    updateByIds(ids: number[], partialEntity: QueryDeepPartialEntity<Entity>, manager?: EntityManager): Promise<UpdateResult>;
    get(id: string, options: FindOneOptions<Entity>, manager?: EntityManager): Promise<Entity | undefined>;
    getOne(getOne: GetOneOptions<Entity>, manager?: EntityManager): Promise<Entity | undefined>;
    getByIds(getByIds: GetByIdsOptions<Entity>, manager?: EntityManager): Promise<Entity[]>;
    getMany(getMany?: GetManyOptions<Entity>, manager?: EntityManager): Promise<[Entity[], number]>;
    delete(id: string, manager?: EntityManager): Promise<DeleteResult>;
    deleteByIds(ids: number[], manager?: EntityManager): Promise<DeleteResult>;
    hardDelete(id: string, manager?: EntityManager): Promise<DeleteResult>;
    hardDeleteByIds(ids: number[], manager?: EntityManager): Promise<DeleteResult>;
    count(options?: FindManyOptions<Entity>, manager?: EntityManager): Promise<number>;
    transaction<T>(operation: (entityManager: EntityManager) => Promise<T>): Promise<T>;
    mapWhere(where: FindManyOptions<Entity>["where"], data: object, operator: <T>(value: FindOperator<T> | T) => FindOperator<T>, wrap?: `${string}{}${string}`): any;
}
//# sourceMappingURL=base-repository.d.ts.map