// noinspection JSUnusedGlobalSymbols

import { InjectRepository } from "@nestjs/typeorm";
import { IBaseEntity } from "../interfaces";
import { BaseRepository } from "../base-repository";
import { Injectable } from "@nestjs/common";
import { BaseEntityTemplate } from "../base-entity-template";
import { RepositoryDecorator } from "../types";

/**
 * Decorator for creating a new repository
 *
 * This decorator is used to create a new repository for the entity.
 * It takes the entity as an argument.
 *
 * @example
 * ```typescript
 * @HichchiRepository(UserEntity)
 * export class UserRepository extends BaseRepository<UserEntity> {
 *     // custom methods and overrides
 * }
 * ```
 * @param {typeof BaseEntityTemplate} entity - The entity class
 * @returns {RepositoryDecorator} The repository decorator
 */
export function HichchiRepository<Entity extends IBaseEntity>(entity: typeof BaseEntityTemplate): RepositoryDecorator {
    return function <T extends { new (...args: any[]): BaseRepository<Entity> }>(target: T): T | void {
        if (!(target.prototype instanceof BaseRepository)) {
            throw new Error(`Class ${target.name} must extend BaseRepository`);
        }
        Injectable()(target);
        Reflect.defineMetadata("entity", entity, target);
        InjectRepository(entity)(target, null, 0);
    };
}
