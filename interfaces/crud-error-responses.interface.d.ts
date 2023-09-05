import { IEntityErrorResponse } from "hichchi-nestjs-common/interfaces";
export interface ICrudErrorResponses {
    E_400_NO_DEFAULT: (entityName: string, field: string) => IEntityErrorResponse;
    E_400_ID: (entityName: string) => IEntityErrorResponse;
    E_404_ID: (entityName: string) => IEntityErrorResponse;
    E_404_RELATION: (entityName: string, relationName: string) => IEntityErrorResponse;
    E_404_CONDITION: (entityName: string) => IEntityErrorResponse;
    E_409_EXIST_U: (entityName: string, unique: string) => IEntityErrorResponse;
    E_500: () => IEntityErrorResponse;
}
//# sourceMappingURL=crud-error-responses.interface.d.ts.map