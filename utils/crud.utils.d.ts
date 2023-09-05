import { Operation } from "../enums";
import { TypeORMError } from "../interfaces";
import { IStatusResponse } from "hichchi-nestjs-common/interfaces";
export declare class EntityUtils {
    static handleError(e: TypeORMError, entityName: string, uniqueFieldName?: string): void;
    static handleSuccess(operation?: Operation, entityName?: string): IStatusResponse;
}
//# sourceMappingURL=crud.utils.d.ts.map