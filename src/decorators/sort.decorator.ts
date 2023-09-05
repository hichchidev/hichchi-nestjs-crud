// noinspection JSUnusedGlobalSymbols

import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ISort } from "../types/sort.type";
import { Request } from "express";

export const Sorter = createParamDecorator((_data: any, ctx: ExecutionContext): ISort<unknown> => {
    const req: Request = ctx.switchToHttp().getRequest();
    const order: ISort<unknown> = {};
    if (req.query?.sort && req.query?.sort !== "undefined") {
        const sortColumns = (req.query.sort as string).split(",");
        sortColumns.forEach((column: string) => {
            const property: string[] = column.split(".");
            const sortColumn: string = property[0];
            const sortOrder: string = property[1].toUpperCase();
            order[sortColumn] = sortOrder === "ASC" ? "ASC" : "DESC";
        });
    }
    return order;
});
