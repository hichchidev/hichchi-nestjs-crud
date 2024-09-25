import { toLowerCaseBreak, toSentenceCase, toSnakeCase, toUpperCaseBreak } from "hichchi-utils";
import { ICrudErrorResponses } from "../interfaces";
import { IEntityErrorResponse } from "hichchi-nestjs-common/interfaces";

const EntityErrors: ICrudErrorResponses = {
    E_400_NO_DEFAULT: (entityName: string, field: string, description?: string): IEntityErrorResponse => ({
        status: 400,
        code: `${toUpperCaseBreak(entityName, "_")}_400_NO_DEFAULT_${toSnakeCase(field, true)}`,
        message: `No default value for ${toLowerCaseBreak(entityName)} ${toLowerCaseBreak(field)}!`,
        description,
    }),
    E_400_ID: (entityName: string, description?: string): IEntityErrorResponse => ({
        status: 404,
        code: `${toUpperCaseBreak(entityName, "_")}_400_ID`,
        message: `Invalid ${toLowerCaseBreak(entityName)} id!, Id must be a UUID!`,
        description,
    }),
    E_400_QUERY: (entityName: string, description?: string): IEntityErrorResponse => ({
        status: 400,
        code: `${toUpperCaseBreak(entityName, "_")}_400_QUERY`,
        message: `Invalid filter parameter for ${toLowerCaseBreak(entityName)}!`,
        description,
    }),
    E_404_ID: (entityName: string, description?: string): IEntityErrorResponse => ({
        status: 404,
        code: `${toUpperCaseBreak(entityName, "_")}_404_ID`,
        message: `Cannot find a ${toLowerCaseBreak(entityName)} with given id!`,
        description,
    }),
    E_404_RELATION: (entityName: string, relationName: string, description?: string): IEntityErrorResponse => ({
        status: 404,
        code: `${toUpperCaseBreak(entityName, "_")}_404_${relationName.toUpperCase()}_ID`,
        description,
        message: `Cannot find a ${relationName.toLowerCase()} with given id!`,
    }),
    E_404_CONDITION: (entityName: string, description?: string): IEntityErrorResponse => ({
        status: 404,
        code: `${toUpperCaseBreak(entityName, "_")}_404_CONDITION`,
        message: `Cannot find a ${toLowerCaseBreak(entityName)} with given condition!`,
        description,
    }),
    E_409_EXIST_U: (entityName: string, unique: string, description?: string): IEntityErrorResponse => ({
        status: 409,
        code: `${toUpperCaseBreak(entityName, "_")}_409_EXIST_${toSnakeCase(unique, true)}`,
        message: `${toSentenceCase(entityName)} with given ${unique.toLowerCase()} already exist!`,
        description,
    }),
    E_500: (description?: string): IEntityErrorResponse => ({
        status: 500,
        code: "E_500",
        message: "Unexpected error occurred!",
        description,
    }),
};

export { EntityErrors };
