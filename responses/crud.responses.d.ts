import { IStatusResponse } from "hichchi-nestjs-common/interfaces";
declare const EntityResponses: {
    CREATED: (entityName: string) => IStatusResponse;
    UPDATE: (entityName: string) => IStatusResponse;
    SAVE: (entityName: string) => IStatusResponse;
    SUCCESS: {
        status: boolean;
        message: string;
    };
};
export { EntityResponses };
//# sourceMappingURL=crud.responses.d.ts.map