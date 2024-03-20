import { BadRequestException, ConflictException, Inject, InternalServerErrorException } from "@nestjs/common";
import { EntityResponses, EntityErrors } from "../responses";
import { TypeORMErrorType, Operation } from "../enums";
import { TypeORMError } from "../interfaces";
import { LoggerService } from "hichchi-nestjs-common/services";
import { IStatusResponse } from "hichchi-nestjs-common/interfaces";
import { CONNECTION_OPTIONS } from "../tokens";
import { ConnectionOptions } from "../dtos";
import { EntityConstraints } from "../interfaces/entity-constraint.interface";
import { EntityConstraintValue } from "../types/entity-constraint-value.type";

export class EntityUtils {
    public static constraints: EntityConstraints;

    constructor(@Inject(CONNECTION_OPTIONS) readonly connectionOptions: ConnectionOptions) {
        EntityUtils.constraints = connectionOptions.constraints;
    }
    public static handleError(e: TypeORMError, entityName: string, uniqueFieldName?: string): void {
        switch (e.code) {
            case TypeORMErrorType.ER_NO_DEFAULT_FOR_FIELD:
                const field = e.sqlMessage.split("'")[1];
                throw new BadRequestException(EntityErrors.E_400_NO_DEFAULT(entityName, field));
            case TypeORMErrorType.ER_DUP_ENTRY:
                if (EntityUtils.constraints) {
                    const unique = e.sqlMessage
                        .split(/(for key )/)?.[2]
                        ?.replace(/'/g, "")
                        ?.split(".")?.[1];

                    if (unique && Object.values(EntityUtils.constraints).includes(unique as EntityConstraintValue)) {
                        const [, entityName, relationName] = unique.split("_");
                        throw new ConflictException(EntityErrors.E_409_EXIST_U(entityName, relationName));
                    }
                }
                throw new ConflictException(EntityErrors.E_409_EXIST_U(entityName, uniqueFieldName));
            case TypeORMErrorType.ER_NO_REFERENCED_ROW_2:
                if (EntityUtils.constraints) {
                    const fk = e.sqlMessage.split(/(CONSTRAINT `|` FOREIGN KEY)/)?.[2];
                    if (fk && Object.values(EntityUtils.constraints).includes(fk as EntityConstraintValue)) {
                        const [, entityName, relationName] = fk.split("_");
                        throw new BadRequestException(EntityErrors.E_404_RELATION(entityName, relationName));
                    }
                }
                throw new InternalServerErrorException(EntityErrors.E_500());
            default:
                LoggerService.error(e);
                throw new InternalServerErrorException(EntityErrors.E_500());
        }
    }

    public static handleSuccess(operation?: Operation, entityName?: string): IStatusResponse {
        switch (operation) {
            case Operation.CREATE:
                return EntityResponses.CREATED(entityName);
            case Operation.UPDATE:
                return EntityResponses.UPDATE(entityName);
            case Operation.SAVE:
                return EntityResponses.SAVE(entityName);
            default:
                return EntityResponses.SUCCESS;
        }
    }
}
