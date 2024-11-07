// noinspection JSUnusedGlobalSymbols

import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { IPagination } from "hichchi-nestjs-common/interfaces";

/**
 * Page decorator
 *
 * This decorator is used to get the page and limit from the request query.
 *
 * @example
 * ```typescript
 * @Controller("user")
 * export class UserController {
 *     @Get()
 *     async getUsers(@Pager() pager?: IPagination): Promise<User[]> {
 *         // Implementation
 *     }
 * }
 * ```
 * @returns {ParameterDecorator} The parameter decorator
 * */
export function Pager(): ParameterDecorator {
    return createParamDecorator((_data: any, ctx: ExecutionContext): IPagination | undefined => {
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
}
