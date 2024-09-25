import { InjectRepository } from "@nestjs/typeorm";
import { IBaseEntity } from "../interfaces";
import { BaseRepository } from "../base-repository";
import { Injectable } from "@nestjs/common";
import { BaseEntityTemplate } from "../base-entity-template";

// noinspection JSUnusedGlobalSymbols
export const HichchiRepository = <Entity extends IBaseEntity>(entity: typeof BaseEntityTemplate) => {
    return function <T extends { new (...args: any[]): BaseRepository<Entity> }>(target: T): void {
        if (!(target.prototype instanceof BaseRepository)) {
            throw new Error(`Class ${target.name} must extend BaseRepository`);
        }
        Injectable()(target);
        Reflect.defineMetadata("entity", entity, target);
        InjectRepository(entity)(target, null, 0); // Inject repository using NestJS InjectRepository
    };
};
