"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityErrors = void 0;
const hichchi_utils_1 = require("hichchi-utils");
const EntityErrors = {
    E_400_NO_DEFAULT: (entityName, field) => ({
        status: 400,
        code: `${(0, hichchi_utils_1.toUpperCaseBreak)(entityName)}_400_NO_DEFAULT_${(0, hichchi_utils_1.toSnakeCase)(field, true)}`,
        message: `No default value for ${(0, hichchi_utils_1.toLowerCaseBreak)(entityName)} ${(0, hichchi_utils_1.toLowerCaseBreak)(field)}!`,
    }),
    E_400_ID: (entityName) => ({
        status: 404,
        code: `${(0, hichchi_utils_1.toUpperCaseBreak)(entityName)}_400_ID`,
        message: `Invalid ${(0, hichchi_utils_1.toLowerCaseBreak)(entityName)} id!, Id must be a UUID!`,
    }),
    E_404_ID: (entityName) => ({
        status: 404,
        code: `${(0, hichchi_utils_1.toUpperCaseBreak)(entityName)}_404_ID`,
        message: `Cannot find a ${(0, hichchi_utils_1.toLowerCaseBreak)(entityName)} with given id!`,
    }),
    E_404_RELATION: (entityName, relationName) => ({
        status: 404,
        code: `${(0, hichchi_utils_1.toUpperCaseBreak)(entityName)}_404_${relationName.toUpperCase()}_ID`,
        message: `Cannot find a ${relationName.toLowerCase()} with given id!`,
    }),
    E_404_CONDITION: (entityName) => ({
        status: 404,
        code: `${(0, hichchi_utils_1.toUpperCaseBreak)(entityName)}_404_CONDITION`,
        message: `Cannot find a ${(0, hichchi_utils_1.toLowerCaseBreak)(entityName)} with given condition!`,
    }),
    E_409_EXIST_U: (entityName, unique) => ({
        status: 409,
        code: `${(0, hichchi_utils_1.toUpperCaseBreak)(entityName)}_409_EXIST_${(0, hichchi_utils_1.toSnakeCase)(unique, true)}`,
        message: `${(0, hichchi_utils_1.toSentenceCase)(entityName)} with given ${unique.toLowerCase()} already exist!`,
    }),
    E_500: () => ({
        status: 500,
        code: "E_500",
        message: "Unexpected error occurred!",
    }),
};
exports.EntityErrors = EntityErrors;
//# sourceMappingURL=crud.error.responses.js.map