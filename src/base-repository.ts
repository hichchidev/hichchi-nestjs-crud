// noinspection JSUnusedGlobalSymbols

import { IBaseEntity } from "./interfaces";
import {
    DeepPartial,
    DeleteResult,
    EntityManager,
    FindManyOptions,
    FindOneOptions,
    FindOperator,
    FindOptionsWhere,
    ILike,
    In,
    Not,
    Repository,
    SaveOptions,
    UpdateResult,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { FindConditions } from "./types";
import { GetByIdsOptions, GetManyOptions, GetOneOptions } from "./interfaces";

export class BaseRepository<Entity extends IBaseEntity> extends Repository<Entity> {
    private static _transactionalManager?: EntityManager;

    constructor(repository: Repository<Entity>) {
        super(repository?.target, repository?.manager, repository?.queryRunner);
    }

    get entityRepository(): Repository<Entity> {
        return (BaseRepository._transactionalManager ?? this.manager).getRepository(this.target);
    }

    create(): Entity;
    create<T extends DeepPartial<Entity>>(entityLike: T): Entity;
    create<T extends DeepPartial<Entity>>(entityLikeArray: T[]): Entity[];
    create<T extends DeepPartial<Entity>>(entityLike?: T | T[]): Entity | Entity[] {
        return super.create(entityLike as T);
    }

    save<T extends DeepPartial<Entity>>(entityLike: T, options?: SaveOptions): Promise<T & Entity> {
        return this.entityRepository.save(entityLike, options);
    }

    async saveAndGet<T extends DeepPartial<Entity>>(
        entityLike: T,
        options?: SaveOptions & FindOneOptions<Entity>,
    ): Promise<Entity> {
        const newEntity = await this.save(entityLike, options);
        return this.get(newEntity.id, options);
    }

    saveMany<T extends DeepPartial<Entity>>(entities: T[], options?: SaveOptions): Promise<(T & Entity)[]> {
        return this.entityRepository.save(entities, options);
    }

    update(id: string, partialEntity: QueryDeepPartialEntity<Entity>): Promise<UpdateResult> {
        return this.entityRepository.update(id, partialEntity);
    }

    async updateAndGet(
        id: string,
        partialEntity: QueryDeepPartialEntity<Entity>,
        options?: FindOneOptions<Entity>,
    ): Promise<Entity> {
        await this.update(id, partialEntity);
        return this.get(id, options);
    }

    updateOne(where: FindOptionsWhere<Entity>, partialEntity: QueryDeepPartialEntity<Entity>): Promise<UpdateResult> {
        return this.entityRepository.update(where, partialEntity);
    }

    updateMany(where: FindConditions<Entity>, partialEntity: QueryDeepPartialEntity<Entity>): Promise<UpdateResult> {
        return this.entityRepository.update(where, partialEntity);
    }

    updateByIds(ids: string[], partialEntity: QueryDeepPartialEntity<Entity>): Promise<UpdateResult> {
        return this.updateMany({ id: In(ids) as any }, partialEntity);
    }

    get(id: string, options?: FindOneOptions<Entity>): Promise<Entity | undefined> {
        return this.getOne({ ...options, where: { id } } as any);
    }

    getOne(getOne: GetOneOptions<Entity>): Promise<Entity | undefined> {
        const { where, not, search, sort, relations, options } = getOne;
        const opt = options ?? {};
        opt.where = where ?? {};
        if (not) {
            opt.where = this.mapWhere(opt.where, not, Not);
        }
        if (search) {
            opt.where = this.mapWhere(opt.where, search, ILike, "%{}%");
        }
        if (relations) {
            opt.relations = relations;
        }
        if (sort) {
            opt.order = sort;
        }
        return this.entityRepository.findOne(opt);
    }

    async getByIds(getByIds: GetByIdsOptions<Entity>): Promise<Entity[]> {
        const { ids, relations, pagination, sort, options } = getByIds;
        const opt = options ?? {};
        if (relations) {
            opt.relations = relations;
        }
        if (pagination) {
            opt.take = pagination.take;
            opt.skip = pagination.skip;
        }
        if (sort) {
            opt.order = sort;
        }
        opt.where = { id: In(ids) as any };
        const [entities] = await this.getMany(opt);
        return entities;
    }

    getMany(getMany?: GetManyOptions<Entity>): Promise<[Entity[], number]> {
        const { filters, where, not, search, relations, pagination, sort, options } = getMany ?? {};
        const opt = options ?? {};
        opt.where = where ?? {};
        if (filters) {
            Object.keys(filters).forEach((key) => {
                if (filters[key]) {
                    opt.where[key] = filters[key];
                }
            });
        }
        if (not) {
            opt.where = this.mapWhereSearchOrNot(opt.where, not, Not);
        } else if (search) {
            opt.where = this.mapWhereSearchOrNot(opt.where, search, ILike);
        }
        if (relations) {
            opt.relations = relations;
        }
        if (pagination) {
            opt.take = pagination.take;
            opt.skip = pagination.skip;
        }
        if (sort) {
            opt.order = sort;
        }
        return this.entityRepository.findAndCount(opt);
    }

    delete(id: string): Promise<DeleteResult> {
        return this.entityRepository.softDelete(id);
    }

    deleteByIds(ids: string[]): Promise<DeleteResult> {
        return this.entityRepository.softDelete(ids);
    }

    hardDelete(id: string): Promise<DeleteResult> {
        return this.entityRepository.delete(id);
    }

    hardDeleteByIds(ids: string[]): Promise<DeleteResult> {
        return this.entityRepository.delete(ids);
    }

    count(options?: FindManyOptions<Entity>): Promise<number> {
        return this.entityRepository.count(options);
    }

    async transaction<T>(operation: (manager: EntityManager) => Promise<T>): Promise<T> {
        if (BaseRepository._transactionalManager) {
            return operation(BaseRepository._transactionalManager);
        }
        return this.manager.transaction(async (manager: EntityManager): Promise<T> => {
            BaseRepository._transactionalManager = manager;
            return operation(manager).finally(() => {
                BaseRepository._transactionalManager = undefined;
            });
        });
    }

    mapWhereSearchOrNot(
        where: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
        search: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
        operator: <T>(value: FindOperator<T> | T) => FindOperator<T>,
    ): any {
        const searchEntries = Object.entries(search);
        if (searchEntries.length > 1) {
            const whr = [];
            searchEntries.forEach(([key, value]) => {
                whr.push(this.mapWhere(where, { [key]: value }, operator, "%{}%"));
            });
            where = whr;
        } else {
            where = this.mapWhere(where, search, operator, "%{}%");
        }
        return where;
    }

    mapWhere(
        where: FindManyOptions<Entity>["where"],
        data: object,
        operator: <T>(value: FindOperator<T> | T) => FindOperator<T>,
        wrap?: `${string}{}${string}`,
    ): any {
        const whr = where ? { ...where } : {};
        if ((data as FindOperator<Entity>) instanceof FindOperator) {
            return data;
        } else if (typeof data === "object") {
            for (const key in data) {
                if (typeof data[key] === "object") {
                    whr[key] = this.mapWhere(whr[key], data[key], operator, wrap);
                } else {
                    if (data[key] !== undefined) {
                        whr[key] =
                            operator && wrap
                                ? operator(wrap.replace("{}", data[key]))
                                : operator?.(data[key]) ?? data[key];
                    }
                }
            }
            return whr;
        }
        return operator(data);
    }
}
