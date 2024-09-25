// noinspection JSUnusedGlobalSymbols

import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { parseFilterObject } from "../utils/http.utils";
import { FilterOptions } from "../types/filter-options.type";

export const Filters = createParamDecorator((_data: any, ctx: ExecutionContext): FilterOptions | undefined => {
    const req: Request = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { page, limit, sort, search, ...rest } = req.query as { [filter: string]: string };
    return parseFilterObject(rest);
});
