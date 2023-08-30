import { DatabaseType } from "typeorm";

export class ConnectionOptions {
    type: DatabaseType;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    entities: string[];
    charset: string;
    synchronize: boolean;
    legacySpatialSupport: boolean;
    keepConnectionAlive: boolean;
    autoLoadEntities: boolean;
}
