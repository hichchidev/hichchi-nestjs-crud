// noinspection JSUnusedGlobalSymbols

import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { parseSearchString } from "../utils/http.utils";
import { FilterOptions } from "../types/filter-options.type";

export const Search = createParamDecorator((_data: any, ctx: ExecutionContext): FilterOptions | undefined => {
    const req: Request = ctx.switchToHttp().getRequest();
    return typeof req.query?.search === "string" ? parseSearchString(req.query.search) : undefined;
});
