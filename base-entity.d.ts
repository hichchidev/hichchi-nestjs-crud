import { IBaseEntity } from "./interfaces";
export declare class BaseEntity implements IBaseEntity {
    id: string;
    createdAt: Date;
    createdBy?: string;
    updatedAt: Date;
    updatedBy?: string;
    deletedAt?: Date;
    deletedBy?: string;
}
//# sourceMappingURL=base-entity.d.ts.map