import { EntityTarget } from "typeorm";
import { IBaseEntity } from "../interfaces";
export declare const CUSTOM_REPOSITORY = "CUSTOM_REPOSITORY";
export declare const CustomRepository: <T extends IBaseEntity>(entity: EntityTarget<T>) => ClassDecorator;
//# sourceMappingURL=custom-repository.decorator.d.ts.map