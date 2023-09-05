"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityResponses = void 0;
const hichchi_utils_1 = require("hichchi-utils");
const EntityResponses = {
    CREATED: (entityName) => {
        return {
            status: true,
            message: `${(0, hichchi_utils_1.toSentenceCase)(entityName)} created successfully!`,
        };
    },
    UPDATE: (entityName) => {
        return {
            status: true,
            message: `${(0, hichchi_utils_1.toSentenceCase)(entityName)} updated successfully!`,
        };
    },
    SAVE: (entityName) => {
        return {
            status: true,
            message: `${(0, hichchi_utils_1.toSentenceCase)(entityName)} saved successfully!`,
        };
    },
    SUCCESS: {
        status: true,
        message: "success",
    },
};
exports.EntityResponses = EntityResponses;
//# sourceMappingURL=crud.responses.js.map