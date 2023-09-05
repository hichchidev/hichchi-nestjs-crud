import { FindOptionsOrder } from "typeorm";
export type ISort<Entity> = {
    [P in FindOptionsOrder<Entity>]: "ASC" | "DESC";
};
//# sourceMappingURL=sort.type.d.ts.map