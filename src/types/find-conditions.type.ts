import { FindOptionsWhere, ObjectId } from "typeorm";

export type FindConditions<Entity> =
    | string
    | string[]
    | number
    | number[]
    | Date
    | Date[]
    | ObjectId
    | ObjectId[]
    | FindOptionsWhere<Entity>;
