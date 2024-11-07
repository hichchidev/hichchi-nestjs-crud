import { DatabaseType } from "typeorm";

export interface IConnectionOptions {
    type: DatabaseType;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    entities: string[];
    migrations: string[];
    charset: string;
    synchronize: boolean;
    legacySpatialSupport?: boolean;
    keepConnectionAlive?: boolean;
    autoLoadEntities?: boolean;
}
