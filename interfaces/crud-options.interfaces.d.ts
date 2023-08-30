import { FindManyOptions, FindOneOptions, FindOptionsOrder } from "typeorm";
export type SortOptions<Entity> = {
    [P in FindOptionsOrder<Entity>]: "ASC" | "DESC";
};
export interface PaginationOptions {
    skip?: number;
    take?: number;
}
export interface GetOptions<Entity> {
    relations?: FindOneOptions<Entity>["relations"];
    options?: FindOneOptions<Entity>;
}
export interface GetOneOptions<Entity> extends GetOptions<Entity> {
    where?: FindOneOptions<Entity>["where"];
    not?: FindOneOptions<Entity>["where"];
    search?: FindOneOptions<Entity>["where"];
}
export interface GetAllOptions<Entity> {
    pagination?: PaginationOptions;
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
    ids: number[];
}
//# sourceMappingURL=crud-options.interfaces.d.ts.map