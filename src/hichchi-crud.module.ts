// noinspection JSUnusedGlobalSymbols

import { Module, DynamicModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConnectionOptions } from "./dtos";
import { IBaseEntity } from "./interfaces";
import { CONNECTION_OPTIONS } from "./tokens";
import { EntityConstraints } from "./interfaces";
import { EntityUtils } from "./utils";
import { CustomEntityConstructor } from "./types";

@Module({})
export class HichchiCrudModule {
    static forRoot(options: ConnectionOptions): DynamicModule {
        HichchiCrudModule.isValidConstraints(options.constraints);

        return {
            module: HichchiCrudModule,
            imports: [
                TypeOrmModule.forRoot({
                    type: options.type as any,
                    host: options.host,
                    port: options.port,
                    username: options.username,
                    password: options.password,
                    database: options.database,
                    entities: options.entities,
                    migrations: options.migrations,
                    charset: options.charset,
                    extra: {
                        charset: options.charset,
                    },
                    synchronize: options.synchronize,
                    legacySpatialSupport: options.legacySpatialSupport,
                    keepConnectionAlive: options.keepConnectionAlive,
                    autoLoadEntities: options.autoLoadEntities,
                }),
            ],
            providers: [
                {
                    provide: CONNECTION_OPTIONS,
                    useValue: options,
                },
                EntityUtils,
            ],
        };
    }

    public static forFeature<Entity extends IBaseEntity>(entities: CustomEntityConstructor<Entity>[]): DynamicModule {
        return {
            module: HichchiCrudModule,
            imports: [TypeOrmModule.forFeature(entities)],
            exports: [TypeOrmModule],
        };
    }

    // public static forCustomRepository<Entity extends IBaseEntity, T extends BaseRepository<Entity>>(
    //     repositories: CustomRepositoryConstructor<Entity, T>[],
    // ): DynamicModule {
    //     const providers: Provider[] = [];
    //
    //     for (const repository of repositories) {
    //         const entity = Reflect.getMetadata(CUSTOM_REPOSITORY, repository);
    //
    //         if (!entity) {
    //             continue;
    //         }
    //
    //         providers.push({
    //             inject: [getDataSourceToken()],
    //             provide: repository,
    //             useFactory: (dataSource: DataSource): BaseRepository<Entity> => {
    //                 const customRepository: Repository<Entity> = dataSource.getRepository<Entity>(entity);
    //                 return new repository(customRepository);
    //             },
    //         });
    //     }
    //
    //     return {
    //         module: HichchiCrudModule,
    //         providers,
    //         exports: providers,
    //     };
    // }

    public static isValidConstraints(constraints: EntityConstraints): boolean {
        const regExp = /^(UNIQUE|FK)_[a-zA-Z]\w+_[a-zA-Z]\w+$/;

        for (const constraint of Object.values(constraints)) {
            if (!constraint.match(regExp)) {
                throw new Error(
                    `Invalid constraint format provided to HichchiCrudModule.forRoot(): '${constraint}'. ` +
                        `Constraints must follow the format 'UNIQUE_entityName_fieldName' or 'FK_entityName_entityName'.`,
                );
            }
        }

        return Object.values(constraints).every((constraint) => regExp.test(constraint));
    }
}
