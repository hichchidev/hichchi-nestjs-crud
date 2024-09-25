import { FindOptionsOrder } from "typeorm";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type SortOptions<Entity = any> = FindOptionsOrder<Entity>;
