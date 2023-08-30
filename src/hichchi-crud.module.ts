// noinspection JSUnusedGlobalSymbols

import { Module, DynamicModule, Provider } from "@nestjs/common";
import { CUSTOM_REPOSITORY } from "./decorators";
import { getDataSourceToken, TypeOrmModule } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { ConnectionOptions } from "./dtos";
import { BaseRepository } from "./base-repository";
import { IBaseEntity } from "./interfaces";
import { Constructor } from "@nestjs/common/utils/merge-with-values.util";
import { CONNECTION_OPTIONS } from "./tokens";

type CustomEntityConstructor<Entity extends IBaseEntity> = new (
    ...args: ConstructorParameters<Constructor<Entity>>
) => IBaseEntity;

type CustomRepositoryConstructor<Entity extends IBaseEntity, T extends BaseRepository<Entity>> = new (
    ...args: ConstructorParameters<Constructor<T>>
) => T;

@Module({})
export class HichchiCrudModule {
    static forRoot(options: ConnectionOptions): DynamicModule {
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

    public static forCustomRepository<Entity extends IBaseEntity, T extends BaseRepository<Entity>>(
        repositories: CustomRepositoryConstructor<Entity, T>[],
    ): DynamicModule {
        const providers: Provider[] = [];

        for (const repository of repositories) {
            const entity = Reflect.getMetadata(CUSTOM_REPOSITORY, repository);

            if (!entity) {
                continue;
            }

            providers.push({
                inject: [getDataSourceToken()],
                provide: repository,
                useFactory: (dataSource: DataSource): BaseRepository<Entity> => {
                    const customRepository: Repository<Entity> = dataSource.getRepository<Entity>(entity);
                    return new repository(customRepository);
                },
            });
        }

        return {
            module: HichchiCrudModule,
            providers,
            exports: providers,
        };
    }
}
