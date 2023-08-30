// noinspection JSUnusedGlobalSymbols

import { SetMetadata } from "@nestjs/common";
import { EntityTarget } from "typeorm";
import { IBaseEntity } from "../interfaces";

export const CUSTOM_REPOSITORY = "CUSTOM_REPOSITORY";

export const CustomRepository = <T extends IBaseEntity>(entity: EntityTarget<T>): ClassDecorator => {
    return SetMetadata(CUSTOM_REPOSITORY, entity);
};
