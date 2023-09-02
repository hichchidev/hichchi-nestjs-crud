import { DynamicModule } from "@nestjs/common";
import { ConnectionOptions } from "./dtos";
import { BaseRepository } from "./base-repository";
import { IBaseEntity } from "./interfaces";
import { Constructor } from "@nestjs/common/utils/merge-with-values.util";
type CustomEntityConstructor<Entity extends IBaseEntity> = new (...args: ConstructorParameters<Constructor<Entity>>) => IBaseEntity;
type CustomRepositoryConstructor<Entity extends IBaseEntity, T extends BaseRepository<Entity>> = new (...args: ConstructorParameters<Constructor<T>>) => T;
export declare class HichchiCrudModule {
    static forRoot(options: ConnectionOptions): DynamicModule;
    static forFeature<Entity extends IBaseEntity>(entities: CustomEntityConstructor<Entity>[]): DynamicModule;
    static forCustomRepository<Entity extends IBaseEntity, T extends BaseRepository<Entity>>(repositories: CustomRepositoryConstructor<Entity, T>[]): DynamicModule;
}
export {};
//# sourceMappingURL=hichchi-crud.module.d.ts.map