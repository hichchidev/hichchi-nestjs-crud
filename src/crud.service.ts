// noinspection JSUnusedGlobalSymbols

import { NotFoundException } from "@nestjs/common";
import { BaseRepository } from "./base-repository";
import { DeepPartial, EntityManager, FindOneOptions, SaveOptions } from "typeorm";
import {
    GetAllOptions,
    GetByIdsOptions,
    GetManyOptions,
    GetOneOptions,
    IBaseEntity,
    PaginationOptions,
} from "./interfaces";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { FindConditions } from "./types";
import { EntityUtils } from "./utils";
import { Operation } from "./enums";
import { EntityErrors } from "./responses";
import { TypeORMErrorHandler } from "./types";
import { CrudServiceMissingParamsException } from "./exceptions/crud-service-missing-params.exception";
import { IStatusResponse, IPaginatedResponse, IUserEntity } from "hichchi-nestjs-common/interfaces";
import { isUUID } from "class-validator";

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
        createdBy?: IUserEntity,
        manager?: EntityManager,
        eh?: TypeORMErrorHandler,
    ): Promise<Entity> {
        try {
            return await this.repository.saveAndGet({ ...createDto, createdBy }, { ...options }, manager);
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
        manager?: EntityManager,
        eh?: TypeORMErrorHandler,
    ): Promise<Entity[]> {
        try {
            if (createdBy) {
                createDtos = createDtos.map((createDto) => ({ ...createDto, createdBy }));
            }
            return await this.repository.saveMany(createDtos, options, manager);
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
        manager?: EntityManager,
        eh?: TypeORMErrorHandler,
    ): Promise<Entity> {
        try {
            if (!isUUID(id, 4)) {
                return Promise.reject(new NotFoundException(EntityErrors.E_400_ID(this.entityName)));
            }
            const { affected } = await this.repository.update(id, { ...updateDto, updatedBy }, manager);
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
        updatedBy?: IUserEntity,
        manager?: EntityManager,
        eh?: TypeORMErrorHandler,
    ): Promise<IStatusResponse> {
        try {
            const { affected } = await this.repository.updateOne(conditions, { ...updateDto, updatedBy }, manager);
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
        updatedBy?: IUserEntity,
        manager?: EntityManager,
        eh?: TypeORMErrorHandler,
    ): Promise<IStatusResponse> {
        try {
            const { affected } = await this.repository.updateMany(conditions, { ...updateDto, updatedBy }, manager);
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
        updatedBy?: IUserEntity,
        manager?: EntityManager,
        eh?: TypeORMErrorHandler,
    ): Promise<IStatusResponse> {
        if (ids.some((id) => !isUUID(id, 4))) {
            return Promise.reject(new NotFoundException(EntityErrors.E_400_ID(this.entityName)));
        }
        try {
            const { affected } = await this.repository.updateByIds(ids, { ...updateDto, updatedBy }, manager);
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
            if (!isUUID(id, 4)) {
                return Promise.reject(new NotFoundException(EntityErrors.E_400_ID(this.entityName)));
            }
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
            if (getByIds.ids.some((id) => !isUUID(id, 4))) {
                return Promise.reject(new NotFoundException(EntityErrors.E_400_ID(this.entityName)));
            }
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

    getMany<Options extends GetManyOptions<Entity>>(
        getMany?: Options,
        manager?: EntityManager,
        eh?: TypeORMErrorHandler,
    ): Options extends { pagination: PaginationOptions } ? Promise<IPaginatedResponse<Entity>> : Promise<Entity[]>;
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

    getAll<Options extends GetAllOptions<Entity>>(
        getAll?: Options,
        manager?: EntityManager,
        eh?: TypeORMErrorHandler,
    ): Options extends { pagination: PaginationOptions } ? Promise<IPaginatedResponse<Entity>> : Promise<Entity[]>;
    async getAll<Options extends GetAllOptions<Entity>>(
        getAll?: Options,
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
        wipe?: boolean,
        deletedBy?: IUserEntity,
        manager?: EntityManager,
        eh?: TypeORMErrorHandler,
    ): Promise<Entity> {
        try {
            if (!isUUID(id, 4)) {
                return Promise.reject(new NotFoundException(EntityErrors.E_400_ID(this.entityName)));
            }
            let deletedRecord = await this.get(id, undefined, manager);
            const { affected } = wipe
                ? await this.repository.hardDelete(id, manager)
                : await this.repository.delete(id, manager);
            if (affected !== 0) {
                if (!wipe && deletedBy) {
                    try {
                        deletedRecord = await this.update(id, {} as any, undefined, deletedBy, manager);
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
        wipe?: boolean,
        deletedBy?: IUserEntity,
        manager?: EntityManager,
        eh?: TypeORMErrorHandler,
    ): Promise<IStatusResponse> {
        try {
            const { affected } = wipe
                ? await this.repository.hardDeleteByIds(ids, manager)
                : await this.repository.deleteByIds(ids, manager);
            if (affected !== 0) {
                if (!wipe && deletedBy) {
                    await this.updateByIds(ids, {} as any, deletedBy, manager);
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
