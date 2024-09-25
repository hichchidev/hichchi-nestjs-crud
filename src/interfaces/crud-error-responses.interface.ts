import { IEntityErrorResponse } from "hichchi-nestjs-common/interfaces";

export interface ICrudErrorResponses {
    E_400_NO_DEFAULT: (entityName: string, field: string, description?: string) => IEntityErrorResponse;
    E_400_ID: (entityName: string, description?: string) => IEntityErrorResponse;
    E_400_QUERY: (entityName: string, description?: string) => IEntityErrorResponse;
    E_404_ID: (entityName: string, description?: string) => IEntityErrorResponse;
    E_404_RELATION: (entityName: string, relationName: string, description?: string) => IEntityErrorResponse;
    E_404_CONDITION: (entityName: string, description?: string) => IEntityErrorResponse;
    E_409_EXIST_U: (entityName: string, unique: string, description?: string) => IEntityErrorResponse;
    E_500: (description?: string) => IEntityErrorResponse;
}
