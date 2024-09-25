// noinspection JSUnusedGlobalSymbols

import { Column, DeleteDateColumn, PrimaryGeneratedColumn } from "typeorm";
import { IBaseEntity } from "./interfaces";
import { IUserEntity } from "hichchi-nestjs-common/interfaces";

export class BaseEntityTemplate implements IBaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false, default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    // @Column({ nullable: true })
    createdBy?: IUserEntity;

    @Column({ nullable: false, default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    // @Column({ nullable: true })
    updatedBy?: IUserEntity;

    @DeleteDateColumn({ type: "timestamp" })
    deletedAt?: Date;

    // @Column({ nullable: true })
    deletedBy?: IUserEntity;
}
