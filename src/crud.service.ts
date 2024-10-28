// noinspection JSUnusedGlobalSymbols

import { HttpException, NotFoundException } from "@nestjs/common";
import { BaseRepository } from "./base-repository";
import { DeepPartial, EntityManager, FindOneOptions, FindOptionsWhere, SaveOptions } from "typeorm";
import { GetAllOptions, GetByIdsOptions, GetManyOptions, GetOneOptions, IBaseEntity } from "./interfaces";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { EntityUtils } from "./utils";
import { Operation } from "./enums";
import { EntityErrors } from "./responses";
import { TypeORMErrorHandler } from "./types";
import { CrudServiceMissingParamsException } from "./exceptions/crud-service-missing-params.exception";
import { IStatusResponse, IUserEntity, IPagination } from "hichchi-nestjs-common/interfaces";
import { isUUID } from "class-validator";
import { PaginatedResponse } from "./classes/paginated-response";

export class CrudService<Entity extends IBaseEntity> {
    constructor(
        public readonly repository: BaseRepository<Entity>,
        public readonly entityName: string,
        public readonly uniqueFieldName?: string,
    ) {
        if (!repository || !entityName) {
            throw new CrudServiceMissingParamsException();
        }
    }

    // abstract map(entity: Entity): Entity;

    create<T extends DeepPartial<Entity>>(createDto: T, eh?: TypeORMErrorHandler): Entity {
        try {
            return this.repository.create(createDto);
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (err) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    async save<T extends DeepPartial<Entity>>(
        createDto: T,
        options?: SaveOptions & FindOneOptions<Entity>,
        createdBy?: IUserEntity,
        eh?: TypeORMErrorHandler,
    ): Promise<Entity> {
        try {
            const entity = this.create({ ...createDto, createdBy });
            return await this.repository.saveAndGet(entity, { ...options });
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (err) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    async saveMany<T extends DeepPartial<Entity>>(
        createDtos: T[],
        options?: SaveOptions,
        createdBy?: IUserEntity,
        eh?: TypeORMErrorHandler,
    ): Promise<Entity[]> {
        try {
            if (createdBy) {
                createDtos = createDtos.map((createDto) => ({ ...createDto, createdBy }));
            }
            return await this.repository.saveMany(createDtos, options);
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    async update<T extends QueryDeepPartialEntity<Entity>>(
        id: string,
        updateDto: T,
        options?: FindOneOptions<Entity>,
        updatedBy?: IUserEntity,
        eh?: TypeORMErrorHandler,
    ): Promise<Entity> {
        try {
            if (!isUUID(id, 4)) {
                return Promise.reject(new NotFoundException(EntityErrors.E_400_ID(this.entityName)));
            }
            const { affected } = await this.repository.update(id, { ...updateDto, updatedBy });
            if (affected !== 0) {
                return this.get(id, options);
            }
            return Promise.reject(new NotFoundException(EntityErrors.E_404_ID(this.entityName)));
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    async updateOne<T extends QueryDeepPartialEntity<Entity>>(
        where: FindOptionsWhere<Entity>,
        updateDto: T,
        updatedBy?: IUserEntity,
        eh?: TypeORMErrorHandler,
    ): Promise<Entity> {
        try {
            const { affected } = await this.repository.updateOne(where, { ...updateDto, updatedBy });
            if (affected !== 0) {
                // return EntityUtils.handleSuccess(Operation.UPDATE, this.entityName);
                return this.getOne({ where: where });
            }
            return Promise.reject(new NotFoundException(EntityErrors.E_404_CONDITION(this.entityName)));
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    async updateMany<T extends QueryDeepPartialEntity<Entity>>(
        where: FindOptionsWhere<Entity>,
        updateDto: T,
        updatedBy?: IUserEntity,
        eh?: TypeORMErrorHandler,
    ): Promise<IStatusResponse> {
        try {
            const { affected } = await this.repository.updateMany(where, { ...updateDto, updatedBy });
            if (affected !== 0) {
                return EntityUtils.handleSuccess(Operation.UPDATE, this.entityName);
            }
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    async updateByIds<T extends QueryDeepPartialEntity<Entity>>(
        ids: string[],
        updateDto: T,
        updatedBy?: IUserEntity,
        eh?: TypeORMErrorHandler,
    ): Promise<IStatusResponse> {
        if (ids.some((id) => !isUUID(id, 4))) {
            return Promise.reject(new NotFoundException(EntityErrors.E_400_ID(this.entityName)));
        }
        try {
            const { affected } = await this.repository.updateByIds(ids, { ...updateDto, updatedBy });
            if (affected !== 0) {
                return EntityUtils.handleSuccess(Operation.UPDATE, this.entityName);
            }
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    async get(id: string, options?: FindOneOptions<Entity>, eh?: TypeORMErrorHandler): Promise<Entity> {
        try {
            if (!isUUID(id, 4)) {
                return Promise.reject(new NotFoundException(EntityErrors.E_400_ID(this.entityName)));
            }
            const entity = await this.repository.get(id, options);
            if (entity) {
                return entity;
            }
            return Promise.reject(new NotFoundException(EntityErrors.E_404_ID(this.entityName)));
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    async getOne(getOne: GetOneOptions<Entity>, eh?: TypeORMErrorHandler): Promise<Entity> {
        try {
            if (Array.isArray(getOne.where)) {
                getOne.where.map((where) => (where.deletedAt = null));
            } else {
                getOne.where = { ...(getOne.where ?? {}), deletedAt: null } as FindOptionsWhere<Entity>;
            }
            const entity = await this.repository.getOne(getOne);
            if (entity) {
                return entity;
            }
            return Promise.reject(new NotFoundException(EntityErrors.E_404_CONDITION(this.entityName)));
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    async getByIds(getByIds: GetByIdsOptions<Entity>, eh?: TypeORMErrorHandler): Promise<Entity[]> {
        try {
            if (getByIds.ids.some((id) => !isUUID(id, 4))) {
                return Promise.reject(new NotFoundException(EntityErrors.E_400_ID(this.entityName)));
            }
            return await this.repository.getByIds(getByIds);
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    getMany<Options extends GetManyOptions<Entity>>(
        getMany: Options,
        eh?: TypeORMErrorHandler,
    ): Options extends { pagination: IPagination } ? Promise<PaginatedResponse<Entity>> : Promise<Entity[]>;
    async getMany(
        getMany: GetManyOptions<Entity>,
        eh?: TypeORMErrorHandler,
    ): Promise<PaginatedResponse<Entity> | Entity[]> {
        try {
            const [data, rowCount] = await this.repository.getMany({
                ...getMany,
                where: { ...(getMany.where ?? {}), deletedAt: null },
            });
            return getMany.pagination ? new PaginatedResponse(data, rowCount, getMany.pagination) : data;
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    getAll<Options extends GetAllOptions<Entity>>(
        getAll?: Options,
        eh?: TypeORMErrorHandler,
    ): Options extends { pagination: IPagination } ? Promise<PaginatedResponse<Entity>> : Promise<Entity[]>;
    async getAll<Options extends GetAllOptions<Entity>>(
        getAll?: Options,
        eh?: TypeORMErrorHandler,
    ): Promise<PaginatedResponse<Entity> | Entity[]> {
        try {
            const [data, rowCount] = await this.repository.getMany({ ...(getAll ?? {}), where: { deletedAt: null } });

            return getAll?.pagination ? new PaginatedResponse(data, rowCount, getAll.pagination) : data;
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    async getWithoutPage(
        getMany?: Omit<GetManyOptions<Entity>, "pagination">,
        eh?: TypeORMErrorHandler,
    ): Promise<Entity[]> {
        try {
            if (getMany?.options?.skip) {
                getMany.options.skip = undefined;
            }
            if (getMany?.options?.take) {
                getMany.options.take = undefined;
            }
            const [data] = await this.repository.getMany(getMany);
            return data;
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    async delete(id: string, wipe?: true, eh?: TypeORMErrorHandler): Promise<Entity>;
    async delete(id: string, deletedBy?: IUserEntity, eh?: TypeORMErrorHandler): Promise<Entity>;
    async delete(id: string, deletedByOrWipe?: IUserEntity | boolean, eh?: TypeORMErrorHandler): Promise<Entity> {
        try {
            if (!isUUID(id, 4)) {
                return Promise.reject(new NotFoundException(EntityErrors.E_400_ID(this.entityName)));
            }
            const wipe = typeof deletedByOrWipe === "boolean" ? deletedByOrWipe : false;
            const deletedBy = typeof deletedByOrWipe === "object" ? deletedByOrWipe : undefined;
            let deletedRecord = await this.get(id, undefined);
            const { affected } = wipe ? await this.repository.hardDelete(id) : await this.repository.delete(id);
            if (affected !== 0) {
                if (!wipe && deletedBy) {
                    try {
                        deletedRecord = await this.update(id, {} as any, undefined, deletedBy);
                    } catch (err: any) {}
                }
                return deletedRecord;
            }
            return Promise.reject(new NotFoundException(EntityErrors.E_404_ID(this.entityName)));
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    async deleteOne(where: FindOptionsWhere<Entity>, wipe?: true, eh?: TypeORMErrorHandler): Promise<Entity>;
    async deleteOne(
        where: FindOptionsWhere<Entity>,
        deletedBy?: IUserEntity,
        eh?: TypeORMErrorHandler,
    ): Promise<Entity>;
    async deleteOne(
        where: FindOptionsWhere<Entity>,
        deletedByOrWipe?: IUserEntity | boolean,
        eh?: TypeORMErrorHandler,
    ): Promise<Entity> {
        try {
            const wipe = typeof deletedByOrWipe === "boolean" ? deletedByOrWipe : false;
            const deletedBy = typeof deletedByOrWipe === "object" ? deletedByOrWipe : undefined;
            let entity = await this.repository.getOne({ where });
            const { affected } = wipe
                ? await this.repository.hardDelete(entity.id)
                : await this.repository.delete(entity.id);
            if (affected !== 0) {
                if (!wipe && deletedBy) {
                    try {
                        entity = await this.update(entity.id, {} as any, undefined, deletedBy);
                    } catch (err: any) {}
                }
                return entity;
            }
            return Promise.reject(new NotFoundException(EntityErrors.E_404_ID(this.entityName)));
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    async deleteMany(where: FindOptionsWhere<Entity>, wipe?: true, eh?: TypeORMErrorHandler): Promise<Entity[]>;
    async deleteMany(
        where: FindOptionsWhere<Entity>,
        deletedBy?: IUserEntity,
        eh?: TypeORMErrorHandler,
    ): Promise<Entity[]>;
    async deleteMany(
        where: FindOptionsWhere<Entity>,
        deletedByOrWipe?: IUserEntity | boolean,
        eh?: TypeORMErrorHandler,
    ): Promise<Entity[]> {
        try {
            const wipe = typeof deletedByOrWipe === "boolean" ? deletedByOrWipe : false;
            const deletedBy = typeof deletedByOrWipe === "object" ? deletedByOrWipe : undefined;
            const entities = await this.getMany({ where });
            const ids = entities.map((entity) => entity.id);
            const { affected } = wipe
                ? await this.repository.hardDeleteByIds(ids)
                : await this.repository.deleteByIds(ids);
            if (affected !== 0) {
                if (!wipe && deletedBy) {
                    await this.updateByIds(ids, { deletedBy } as any);
                }
                return entities;
            }
            return Promise.reject(new NotFoundException(EntityErrors.E_404_ID(this.entityName)));
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    async deleteByIds(ids: string[], wipe?: true, eh?: TypeORMErrorHandler): Promise<IStatusResponse>;
    async deleteByIds(ids: string[], deletedBy?: IUserEntity, eh?: TypeORMErrorHandler): Promise<IStatusResponse>;
    async deleteByIds(
        ids: string[],
        deletedByOrWipe?: IUserEntity | boolean,
        eh?: TypeORMErrorHandler,
    ): Promise<IStatusResponse> {
        try {
            const wipe = typeof deletedByOrWipe === "boolean" ? deletedByOrWipe : false;
            const deletedBy = typeof deletedByOrWipe === "object" ? deletedByOrWipe : undefined;
            const { affected } = wipe
                ? await this.repository.hardDeleteByIds(ids)
                : await this.repository.deleteByIds(ids);
            if (affected !== 0) {
                if (!wipe && deletedBy) {
                    await this.updateByIds(ids, { deletedBy } as any);
                }
                return EntityUtils.handleSuccess(Operation.DELETE, this.entityName);
            }
            return Promise.reject(new NotFoundException(EntityErrors.E_404_ID(this.entityName)));
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    async count(getMany?: GetManyOptions<Entity>, eh?: TypeORMErrorHandler): Promise<number> {
        try {
            getMany.where = { ...(getMany.where ?? {}), deletedAt: null };
            return await this.repository.count(getMany);
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    async transaction(operation: (manager: EntityManager) => Promise<Entity>): Promise<Entity> {
        return this.repository.transaction(operation);
    }

    async try<T>(fn: () => Promise<T>): Promise<T> {
        try {
            return await fn();
        } catch (e: any) {
            if (e instanceof HttpException) {
                throw e;
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }
}
