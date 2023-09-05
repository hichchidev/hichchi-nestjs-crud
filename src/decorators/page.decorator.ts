// noinspection JSUnusedGlobalSymbols

import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { IPagination } from "../interfaces";
import { Request } from "express";

export const Pager = createParamDecorator((data: any, ctx: ExecutionContext): IPagination | undefined => {
    const req: Request = ctx.switchToHttp().getRequest();
    if (req.query?.page && req.query?.limit) {
        const p = Number(req.query.page);
        const t = Number(req.query.limit);
        const page: number = p ? p : 1;
        const take: number = t ? t : 10;
        return { take, skip: (page - 1) * take };
    }
    return undefined;
});
