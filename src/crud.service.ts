// noinspection JSUnusedGlobalSymbols

import { NotFoundException } from "@nestjs/common";
// import { ConnectionOptions } from "./dtos";
import { BaseRepository } from "./base-repository";
import { DeepPartial, EntityManager, FindOneOptions, SaveOptions } from "typeorm";
import { GetAllOptions, GetByIdsOptions, GetManyOptions, GetOneOptions, IBaseEntity } from "./interfaces";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { FindConditions } from "./types";
import { EntityUtils } from "./utils";
import { Operation } from "./enums";
import { EntityErrors } from "./responses";
import { TypeORMErrorHandler } from "./types/error-handler.type";
import { CrudServiceMissingParamsException } from "./exceptions/crud-service-missing-params.exception";
import { IStatusResponse, IPaginatedResponse } from "hichchi-nestjs-common/interfaces";

export class CrudService<Entity extends IBaseEntity> {
    constructor(
        protected readonly repository: BaseRepository<Entity>,
        protected readonly entityName: string,
        protected readonly uniqueFieldName?: string,
    ) {
        if (!repository || !entityName) {
            throw new CrudServiceMissingParamsException();
        }
    }

    // abstract map(entity: Entity): Entity;

    async save<T extends DeepPartial<Entity>>(
        createDto: T,
        options?: SaveOptions & FindOneOptions<Entity>,
        manager?: EntityManager,
        eh?: TypeORMErrorHandler,
    ): Promise<Entity> {
        try {
            return await this.repository.saveAndGet(createDto, { ...options }, manager);
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
        createDto: T[],
        options?: SaveOptions,
        manager?: EntityManager,
        eh?: TypeORMErrorHandler,
    ): Promise<Entity[]> {
        try {
            return await this.repository.saveMany(createDto, options, manager);
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
        manager?: EntityManager,
        eh?: TypeORMErrorHandler,
    ): Promise<Entity> {
        try {
            const { affected } = await this.repository.update(id, updateDto, manager);
            if (affected !== 0) {
                return this.get(id, options, manager);
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
        conditions: FindConditions<Entity>,
        updateDto: T,
        manager?: EntityManager,
        eh?: TypeORMErrorHandler,
    ): Promise<IStatusResponse> {
        try {
            const { affected } = await this.repository.updateOne(conditions, updateDto, manager);
            if (affected !== 0) {
                return EntityUtils.handleSuccess(Operation.UPDATE, this.entityName);
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
        conditions: FindConditions<Entity>,
        updateDto: T,
        manager?: EntityManager,
        eh?: TypeORMErrorHandler,
    ): Promise<IStatusResponse> {
        try {
            const { affected } = await this.repository.updateMany(conditions, updateDto, manager);
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
        ids: number[],
        updateDto: T,
        manager?: EntityManager,
        eh?: TypeORMErrorHandler,
    ): Promise<IStatusResponse> {
        try {
            const { affected } = await this.repository.updateByIds(ids, updateDto, manager);
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

    async get(
        id: string,
        options?: FindOneOptions<Entity>,
        manager?: EntityManager,
        eh?: TypeORMErrorHandler,
    ): Promise<Entity> {
        try {
            const entity = await this.repository.get(id, options, manager);
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

    async getOne(getOne: GetOneOptions<Entity>, manager?: EntityManager, eh?: TypeORMErrorHandler): Promise<Entity> {
        try {
            getOne.where = { ...(getOne.where ?? {}), deletedAt: null };
            const entity = await this.repository.getOne(getOne, manager);
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

    async getByIds(
        getByIds: GetByIdsOptions<Entity>,
        manager?: EntityManager,
        eh?: TypeORMErrorHandler,
    ): Promise<Entity[]> {
        try {
            return await this.repository.getByIds(getByIds, manager);
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

    async getMany(
        getMany: GetManyOptions<Entity>,
        manager?: EntityManager,
        eh?: TypeORMErrorHandler,
    ): Promise<IPaginatedResponse<Entity> | Entity[]> {
        try {
            const [data, rowCount] = await this.repository.getMany(
                {
                    ...getMany,
                    where: { ...(getMany.where ?? {}), deletedAt: null },
                },
                manager,
            );
            return getMany.pagination ? { data, rowCount } : data;
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

    async getAll(
        getAll?: GetAllOptions<Entity>,
        manager?: EntityManager,
        eh?: TypeORMErrorHandler,
    ): Promise<IPaginatedResponse<Entity> | Entity[]> {
        try {
            const [data, rowCount] = await this.repository.getMany(
                { ...(getAll ?? {}), where: { deletedAt: null } },
                manager,
            );
            return getAll?.pagination ? { data, rowCount } : data;
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
        manager?: EntityManager,
        eh?: TypeORMErrorHandler,
    ): Promise<Entity[]> {
        try {
            if (getMany?.options?.skip) {
                getMany.options.skip = undefined;
            }
            if (getMany?.options?.take) {
                getMany.options.take = undefined;
            }
            const [data] = await this.repository.getMany(getMany, manager);
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

    async delete(
        id: string,
        deletedBy: string,
        wipe?: boolean,
        manager?: EntityManager,
        eh?: TypeORMErrorHandler,
    ): Promise<Entity> {
        try {
            let deletedRecord = await this.get(id, undefined, manager);
            const { affected } = wipe
                ? await this.repository.hardDelete(id, manager)
                : await this.repository.delete(id, manager);
            if (affected !== 0) {
                if (!wipe && deletedBy) {
                    try {
                        deletedRecord = await this.update(id, { deletedBy } as any, undefined, manager);
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

    async deleteByIds(
        ids: number[],
        deletedBy?: string,
        wipe?: boolean,
        manager?: EntityManager,
        eh?: TypeORMErrorHandler,
    ): Promise<IStatusResponse> {
        try {
            const { affected } = wipe
                ? await this.repository.hardDeleteByIds(ids, manager)
                : await this.repository.deleteByIds(ids, manager);
            if (affected !== 0) {
                if (!wipe && deletedBy) {
                    await this.updateByIds(ids, { deletedBy } as any, manager);
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

    async count(getMany?: GetManyOptions<Entity>, manager?: EntityManager, eh?: TypeORMErrorHandler): Promise<number> {
        try {
            getMany.where = { ...(getMany.where ?? {}), deletedAt: null };
            return await this.repository.count(getMany, manager);
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

    transaction<T>(operation: (entityManager: EntityManager) => Promise<T>): Promise<T> {
        return this.repository.transaction(operation);
    }
}
