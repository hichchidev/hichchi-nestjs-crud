import { FindOptionsOrder } from "typeorm";

export type SortOptions<Entity = any> = FindOptionsOrder<Entity>;
