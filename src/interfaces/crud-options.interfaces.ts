import { FindManyOptions, FindOneOptions } from "typeorm";
import { IPagination } from "hichchi-nestjs-common/interfaces";
import { SortOptions } from "../types";

export interface GetOptions<Entity> {
    relations?: FindOneOptions<Entity>["relations"];
    options?: FindOneOptions<Entity>;
}

export interface GetOneOptions<Entity> extends GetOptions<Entity> {
    where?: FindOneOptions<Entity>["where"];
    not?: FindOneOptions<Entity>["where"];
    search?: FindOneOptions<Entity>["where"];
    sort?: SortOptions<Entity>;
}

export interface GetAllOptions<Entity> {
    pagination?: IPagination;
    sort?: SortOptions<Entity>;
    relations?: FindManyOptions<Entity>["relations"];
    options?: FindManyOptions<Entity>;
}

export interface GetManyOptions<Entity> extends GetAllOptions<Entity> {
    filters?: FindManyOptions<Entity>["where"];
    where?: FindOneOptions<Entity>["where"];
    not?: FindOneOptions<Entity>["where"];
    search?: FindOneOptions<Entity>["where"];
}

export interface GetByIdsOptions<Entity> extends GetAllOptions<Entity> {
    ids: string[];
}
