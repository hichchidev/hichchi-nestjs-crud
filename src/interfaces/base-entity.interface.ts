import { IUserEntity } from "hichchi-nestjs-common/interfaces";

export interface IBaseEntity {
    id: string;
    createdAt: Date;
    createdBy?: IUserEntity;
    updatedAt: Date;
    updatedBy?: IUserEntity;
    deletedAt?: Date;
    deletedBy?: IUserEntity;
}
