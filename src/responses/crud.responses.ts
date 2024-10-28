import { IStatusResponse } from "hichchi-nestjs-common/interfaces";
import { toSentenceCase } from "hichchi-utils";

const EntityResponses = {
    CREATED: (entityName: string): IStatusResponse => {
        return {
            status: true,
            message: `${toSentenceCase(entityName)} created successfully!`,
        };
    },
    UPDATE: (entityName: string): IStatusResponse => {
        return {
            status: true,
            message: `${toSentenceCase(entityName)} updated successfully!`,
        };
    },
    SAVE: (entityName: string): IStatusResponse => {
        return {
            status: true,
            message: `${toSentenceCase(entityName)} saved successfully!`,
        };
    },
    DELETE: (entityName: string): IStatusResponse => {
        return {
            status: true,
            message: `${toSentenceCase(entityName)} deleted successfully!`,
        };
    },
    SUCCESS: {
        status: true,
        message: "success",
    },
};

export { EntityResponses };
