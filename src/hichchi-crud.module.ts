// noinspection JSUnusedGlobalSymbols

import { DynamicModule, Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IBaseEntity, IConnectionOptions } from "./interfaces";
import { CONNECTION_OPTIONS } from "./tokens";
import { EntityUtils } from "./utils";
import { CustomEntityConstructor } from "./types";
import { exit } from "process";

@Module({})
export class HichchiCrudModule {
    /**
     * Register the HichchiCrudModule
     *
     * This method is used to register the `HichchiCrudModule`.
     * It takes the connection options as an argument and returns a dynamic module.
     * The connection options include the type, host, port, username, password, database, entities, migrations,
     * charset, synchronize, legacySpatialSupport, keepConnectionAlive, and autoLoadEntities.
     *
     * @example
     * ```typescript
     * @Module({
     *     imports: [
     *         HichchiCrudModule.forRoot({
     *             type: "mysql",
     *             host: "localhost",
     *             port: 3306,
     *             username: "root",
     *             password: "",
     *             database: "dbname",
     *             charset: "utf8mb4",
     *             synchronize: false,
     *             entities: ["dist/** /*.entity{.ts,.js}"],
     *             migrations: ["dist/database/migrations/*{.ts,.js}"],
     *             legacySpatialSupport: false,
     *             keepConnectionAlive: true,
     *             autoLoadEntities: true,
     *         }),
     *     ],
     *     controllers: [...],
     *     providers: [...],
     * })
     * export class AppModule {}
     * ```
     *
     * @param {IConnectionOptions} options The connection options
     * @returns {DynamicModule} The dynamic module
     */
    public static forRoot(options: IConnectionOptions): DynamicModule {
        this.validateConnectionOptions(options);

        return {
            module: HichchiCrudModule,
            imports: [
                TypeOrmModule.forRoot({
                    type: (options.type as any) || "mysql",
                    host: options.host || "localhost",
                    port: options.port || 3306,
                    username: options.username || "root",
                    password: options.password || "",
                    database: options.database,
                    entities: options.entities,
                    migrations: options.migrations,
                    charset: options.charset || "utf8mb4",
                    extra: {
                        charset: options.charset || "utf8mb4",
                    },
                    synchronize: Boolean(options.synchronize),
                    legacySpatialSupport: Boolean(options.legacySpatialSupport),
                    keepConnectionAlive: options.keepConnectionAlive === undefined ? true : options.keepConnectionAlive,
                    autoLoadEntities: options.autoLoadEntities === undefined ? true : options.autoLoadEntities,
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

    /**
     * Register entities for the HichchiCrudModule
     *
     * This method is used to register entities for the `HichchiCrudModule`.
     * It takes an array of entities as an argument and returns a dynamic module.
     * The entities should be custom entities that implement the `IBaseEntity` interface provided by the `hichchi-nestjs-crud` package.
     *
     * @example
     * ```typescript
     * @Module({
     *     imports: [
     *         HichchiCrudModule.forFeature([UserEntity]),
     *     ],
     *     controllers: [UserController],
     *     providers: [UserService, UserRepository],
     *     exports: [UserService, UserRepository],
     * })
     * export class UserModule {}
     * ```
     *
     * @template Entity The entity type
     * @param {CustomEntityConstructor<Entity>[]} entities The entities to register
     * @returns {DynamicModule} The dynamic module
     */
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

    private static validateConnectionOptions(options: IConnectionOptions): boolean {
        let option: string = "";

        if (!options.database) {
            option = "database";
        }

        if (!options.entities) {
            option = "entities";
        }

        if (!options.migrations) {
            option = "migrations";
        }

        if (option) {
            const error =
                `Missing connection option\n\n` +
                `    Connection option '${option}' cannot be empty in HichchiCrudModule.forRoot()'.\n\n` +
                `    Please provide a valid value for the '${option}' connection option.`;
            this.logAndExit(error);
        }

        return true;
    }

    static logAndExit(error: string): void {
        Logger.error(error);
        exit(1);
    }
}
