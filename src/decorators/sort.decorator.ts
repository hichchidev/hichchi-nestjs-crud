// noinspection JSUnusedGlobalSymbols

import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { SortOptions } from "../types";
import { Request } from "express";
import { parseSortOptions } from "../utils/http.utils";

export const Sorter = createParamDecorator((_data: any, ctx: ExecutionContext): SortOptions | undefined => {
    const req: Request = ctx.switchToHttp().getRequest();
    return typeof req.query?.sort === "string" ? parseSortOptions(req.query.sort) : undefined;
});
