import { BaseRepository } from "./base-repository";
import { DeepPartial, EntityManager, FindOneOptions, SaveOptions } from "typeorm";
import { GetAllOptions, GetByIdsOptions, GetManyOptions, GetOneOptions, IBaseEntity } from "./interfaces";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { FindConditions } from "./types";
import { TypeORMErrorHandler } from "./types/error-handler.type";
import { IStatusResponse, IPaginatedResponse } from "hichchi-nestjs-common/interfaces";
export declare class CrudService<Entity extends IBaseEntity> {
    protected readonly repository: BaseRepository<Entity>;
    protected readonly entityName: string;
    protected readonly uniqueFieldName?: string;
    constructor(repository: BaseRepository<Entity>, entityName: string, uniqueFieldName?: string);
    save<T extends DeepPartial<Entity>>(createDto: T, options?: SaveOptions & FindOneOptions<Entity>, manager?: EntityManager, eh?: TypeORMErrorHandler): Promise<Entity>;
    saveMany<T extends DeepPartial<Entity>>(createDto: T[], options?: SaveOptions, manager?: EntityManager, eh?: TypeORMErrorHandler): Promise<Entity[]>;
    update<T extends QueryDeepPartialEntity<Entity>>(id: string, updateDto: T, options?: FindOneOptions<Entity>, manager?: EntityManager, eh?: TypeORMErrorHandler): Promise<Entity>;
    updateOne<T extends QueryDeepPartialEntity<Entity>>(conditions: FindConditions<Entity>, updateDto: T, manager?: EntityManager, eh?: TypeORMErrorHandler): Promise<IStatusResponse>;
    updateMany<T extends QueryDeepPartialEntity<Entity>>(conditions: FindConditions<Entity>, updateDto: T, manager?: EntityManager, eh?: TypeORMErrorHandler): Promise<IStatusResponse>;
    updateByIds<T extends QueryDeepPartialEntity<Entity>>(ids: number[], updateDto: T, manager?: EntityManager, eh?: TypeORMErrorHandler): Promise<IStatusResponse>;
    get(id: string, options?: FindOneOptions<Entity>, manager?: EntityManager, eh?: TypeORMErrorHandler): Promise<Entity>;
    getOne(getOne: GetOneOptions<Entity>, manager?: EntityManager, eh?: TypeORMErrorHandler): Promise<Entity>;
    getByIds(getByIds: GetByIdsOptions<Entity>, manager?: EntityManager, eh?: TypeORMErrorHandler): Promise<Entity[]>;
    getMany(getMany: GetManyOptions<Entity>, manager?: EntityManager, eh?: TypeORMErrorHandler): Promise<IPaginatedResponse<Entity> | Entity[]>;
    getAll(getAll?: GetAllOptions<Entity>, manager?: EntityManager, eh?: TypeORMErrorHandler): Promise<IPaginatedResponse<Entity> | Entity[]>;
    getWithoutPage(getMany?: Omit<GetManyOptions<Entity>, "pagination">, manager?: EntityManager, eh?: TypeORMErrorHandler): Promise<Entity[]>;
    delete(id: string, deletedBy: string, wipe?: boolean, manager?: EntityManager, eh?: TypeORMErrorHandler): Promise<Entity>;
    deleteByIds(ids: number[], deletedBy?: string, wipe?: boolean, manager?: EntityManager, eh?: TypeORMErrorHandler): Promise<IStatusResponse>;
    count(getMany?: GetManyOptions<Entity>, manager?: EntityManager, eh?: TypeORMErrorHandler): Promise<number>;
    transaction<T>(operation: (entityManager: EntityManager) => Promise<T>): Promise<T>;
}
//# sourceMappingURL=crud.service.d.ts.map