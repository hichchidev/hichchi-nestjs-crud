// noinspection JSUnusedGlobalSymbols

import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { IPagination } from "hichchi-nestjs-common/interfaces";

export const Pager = createParamDecorator((data: any, ctx: ExecutionContext): IPagination | undefined => {
    const req: Request = ctx.switchToHttp().getRequest();
    if (req.query?.page && req.query?.limit) {
        const p = Number(req.query.page);
        const t = Number(req.query.limit);
        const page: number = p ? p : 1;
        const take: number = t ? t : 10;
        delete req.query.page;
        delete req.query.limit;
        return { take, skip: (page - 1) * take };
    }
    return undefined;
});
