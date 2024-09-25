import { DatabaseType } from "typeorm";
import { EntityConstraintValue } from "../types";

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
    constraints?: { [key: string]: EntityConstraintValue };
}
