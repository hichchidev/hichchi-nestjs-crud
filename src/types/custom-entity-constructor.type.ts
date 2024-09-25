import { IBaseEntity } from "../interfaces";
import { Constructor } from "@nestjs/common/utils/merge-with-values.util";

export type CustomEntityConstructor<Entity extends IBaseEntity> = new (
    ...args: ConstructorParameters<Constructor<Entity>>
) => IBaseEntity;
