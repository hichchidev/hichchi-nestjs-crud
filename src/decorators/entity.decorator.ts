/* eslint-disable @typescript-eslint/ban-types */
// noinspection JSUnusedGlobalSymbols

import { exit } from "node:process";
import { Entity, getMetadataArgsStorage, Unique } from "typeorm";
import { FK_CONSTRAINT_REGEX, UNIQUE_CONSTRAINT_REGEX } from "../constants";
import { HichchiCrudModule } from "../hichchi-crud.module";
import { BaseEntityTemplateRelations } from "../base-entity-template";
import { RelationMetadataArgs } from "typeorm/metadata-args/RelationMetadataArgs";
import { toCamelCase } from "hichchi-utils";
import { EntityOptionUnique } from "../types";

/**
 * Decorator for creating a new entity
 *
 * This decorator is used to create a new entity in the database.
 * It takes the name of the database table, the unique constraints and the skip foreign key validation flag as arguments.
 *
 * The unique parameter accepts either an array of field names array (`string[][]`) or an object with the constraint name as the key (`EntityOptionUnique`)
 *
 * If `EntityOptionUnique` is provided, the unique constraint names must follow the format `UNIQUE_entityName_fieldName`.
 * Ex: `UNIQUE_user_email`, `UNIQUE_userProfile_phoneNumber`, `UNIQUE_user_emailAndPhoneNumber`.
 *
 * When creating relationships between entities, the `@HichchiJoinColumn` decorator must be used
 * instead of the `@JoinColumn` decorator to ensure consistent foreign key constraint validation.
 *
 * The entity options include the unique constraints.
 *
 * @example
 * ```typescript
 * @HichchiEntity("users", {
 *     UNIQUE_user_email: "email",
 *     UNIQUE_user_phone: "phone",
 * })
 * export class UserEntity extends BaseEntityTemplate {
 *     @Column()
 *     name: string;
 *
 *     @Column()
 *     email: string;
 *
 *     @Column()
 *     phone: string;
 *
 *     @ManyToOne(() => AddressEntity, homeAddress => homeAddress.user)
 *     @HichchiJoinColumn("FK_user_homeAddress")
 *     homeAddress: AddressEntity;
 * }
 * ```
 *
 * @param {string} tableName - The name of the database table
 * @param {EntityOptionUnique} unique - The unique constraints
 * @param {boolean} skipFkValidation - Skip foreign key validation
 */
export function HichchiEntity(tableName: string, unique?: EntityOptionUnique | string[][], skipFkValidation?: boolean) {
    return function (target: Function): void {
        if (!target.name.endsWith("Entity")) {
            const error =
                `Invalid entity class name: '${target.name}'\n\n` +
                `    Invalid entity class name assigned the class decorated with @HichchiEntity("${tableName}").\n\n` +
                `    Entity names must end with 'Entity'.`;
            HichchiCrudModule.logAndExit(error);
            exit(1);
        }

        Reflect.defineMetadata("hichchiTableName", tableName, target);
        Entity(tableName)(target);

        const metadataArgs = getMetadataArgsStorage();
        const entityRelations = metadataArgs.relations.filter((relation) => relation.target === target);

        if (unique) {
            if (Array.isArray(unique)) {
                unique.forEach((unique) => {
                    const entityName = toCamelCase(toCamelCase(target.name.split("Entity")[0]));
                    const fields = unique.map((field) => toCamelCase(field)).join("And");
                    Unique(`UNIQUE_${entityName}_${fields}`, unique)(target);
                });
            } else {
                Object.entries(unique).forEach(([constraintName, columns]) => {
                    if (!constraintName.match(UNIQUE_CONSTRAINT_REGEX)) {
                        const error =
                            `Invalid unique constraint: '${constraintName}'\n\n` +
                            `    Invalid unique constraint format provided to @HichchiEntity("${tableName}").\n\n` +
                            `    Unique constraints must follow the format 'UNIQUE_entityName_fieldName'.`;
                        HichchiCrudModule.logAndExit(error);
                        exit(1);
                    }
                    Unique(constraintName, Array.isArray(columns) ? columns : [columns])(target);
                });
            }
        }

        if (!skipFkValidation) {
            entityRelations.forEach(() => {
                const relevantRelations = metadataArgs.relations.filter(
                    (relation) =>
                        relation.target === target &&
                        (relation.relationType === "many-to-one" || relation.relationType === "one-to-one"),
                );

                relevantRelations.forEach((relation: RelationMetadataArgs) => {
                    const joinColumns = metadataArgs.joinColumns.filter(
                        (joinColumn) =>
                            joinColumn.target === target && joinColumn.propertyName === relation.propertyName,
                    );

                    // Validate ManyToOne and OneToOne relations for HichchiJoinColumn
                    if (
                        !BaseEntityTemplateRelations.includes(relation.propertyName) &&
                        (relation.relationType === "many-to-one" || relation.relationType === "one-to-one") &&
                        joinColumns.length === 0
                    ) {
                        const error =
                            `Missing @HichchiJoinColumn\n\n` +
                            `    Missing @HichchiJoinColumn on @${relation.relationType} relation '${relation.propertyName}' in @HichchiEntity("${tableName}").\n\n` +
                            `    Please use @HichchiJoinColumn to specify a foreign key constraint for this relation.`;
                        HichchiCrudModule.logAndExit(error);
                        exit(1);
                    }

                    // Validate HichchiJoinColumn usage
                    joinColumns.forEach((joinColumn) => {
                        const isHichchiJoinColumn = Reflect.getMetadata(
                            "hichchiForeignKey",
                            target.prototype,
                            joinColumn.propertyName,
                        );

                        if (!isHichchiJoinColumn) {
                            const error =
                                `Missing @HichchiJoinColumn\n\n` +
                                `    @JoinColumn detected on property '${joinColumn.propertyName}' in @HichchiEntity("${tableName}").\n\n` +
                                `    Please use @HichchiJoinColumn instead of @JoinColumn for consistent foreign key constraint validation.`;
                            HichchiCrudModule.logAndExit(error);
                            exit(1); // Stop execution if a direct @JoinColumn is used
                        }

                        // Validate foreignKeyConstraintName
                        const foreignKeyConstraintName = joinColumn.foreignKeyConstraintName;
                        if (foreignKeyConstraintName && !FK_CONSTRAINT_REGEX.test(foreignKeyConstraintName)) {
                            const error =
                                `Invalid foreign key constraint: '${foreignKeyConstraintName}'\n\n` +
                                `    Invalid foreign key constraint format provided to @HichchiJoinColumn()\n` +
                                `    on property ${joinColumn.propertyName} of @HichchiEntity("${tableName}").\n\n` +
                                `    Foreign key constraints must follow the format 'FK_entityName_entityName'.`;
                            HichchiCrudModule.logAndExit(error);
                            exit(1);
                        }
                    });
                });
            });
        }
    };
}
