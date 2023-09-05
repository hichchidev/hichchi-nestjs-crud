import { FindOptionsOrder } from "typeorm";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type ISort<Entity> = { [P in FindOptionsOrder<Entity>]: "ASC" | "DESC" };
