"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityUtils = void 0;
const common_1 = require("@nestjs/common");
const responses_1 = require("../responses");
const enums_1 = require("../enums");
const services_1 = require("hichchi-nestjs-common/services");
class EntityUtils {
    static handleError(e, entityName, uniqueFieldName) {
        switch (e.code) {
            case enums_1.TypeORMErrorType.ER_NO_DEFAULT_FOR_FIELD:
                const field = e.sqlMessage.split("'")[1];
                throw new common_1.BadRequestException(responses_1.EntityErrors.E_400_NO_DEFAULT(entityName, field));
            case enums_1.TypeORMErrorType.ER_DUP_ENTRY:
                throw new common_1.ConflictException(responses_1.EntityErrors.E_409_EXIST_U(entityName, uniqueFieldName));
            case enums_1.TypeORMErrorType.ER_NO_REFERENCED_ROW_2:
                // const constraint = e.sqlMessage.split(/(CONSTRAINT `|` FOREIGN KEY)/)?.[2];
                // if (Object.values(FKConstraint).includes(constraint as FKConstraint)) {
                //     const [, entityName, relationName] = constraint.split("_");
                //     throw new BadRequestException(EntityErrors.E_404_RELATION(entityName, relationName));
                // }
                throw new common_1.InternalServerErrorException(responses_1.EntityErrors.E_500());
            default:
                services_1.LoggerService.error(e);
                throw new common_1.InternalServerErrorException(responses_1.EntityErrors.E_500());
        }
    }
    static handleSuccess(operation, entityName) {
        switch (operation) {
            case enums_1.Operation.CREATE:
                return responses_1.EntityResponses.CREATED(entityName);
            case enums_1.Operation.UPDATE:
                return responses_1.EntityResponses.UPDATE(entityName);
            case enums_1.Operation.SAVE:
                return responses_1.EntityResponses.SAVE(entityName);
            default:
                return responses_1.EntityResponses.SUCCESS;
        }
    }
}
exports.EntityUtils = EntityUtils;
//# sourceMappingURL=crud.utils.js.map