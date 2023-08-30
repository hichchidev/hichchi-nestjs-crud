// noinspection JSUnusedGlobalSymbols

import { Column, DeleteDateColumn, PrimaryGeneratedColumn } from "typeorm";
import { IBaseEntity } from "./interfaces";

export class BaseEntity implements IBaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false, default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({ nullable: true })
    createdBy?: string;

    @Column({ nullable: false, default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    @Column({ nullable: true })
    updatedBy?: string;

    @DeleteDateColumn({ type: "timestamp" })
    deletedAt?: Date;

    @Column({ nullable: true })
    deletedBy?: string;
}
