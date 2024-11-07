// noinspection JSUnusedGlobalSymbols

import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { parseFilterObject } from "../utils";
import { FilterOptions } from "../types";
import { QuerySafeDeepPartial } from "hichchi-nestjs-common/types";

/**
 * Filter decorator
 *
 * This decorator is used to get only the entity filters from the request without the page, limit, sort, and search.
 *
 * @example
 * ```typescript
 * @Controller("user")
 * export class UserController {
 *     @Get()
 *     async getUsers(@Filters() filters?: QuerySafeDeepPartial<User>): Promise<User[]> {
 *         // Implementation
 *     }
 * }
 *
 * ```
 *
 * @returns {ParameterDecorator} The parameter decorator
 * @constructor
 */
export function Filters(): ParameterDecorator {
    return createParamDecorator((_data: any, ctx: ExecutionContext): FilterOptions | undefined => {
        const req: Request = ctx.switchToHttp().getRequest();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { page, limit, sort, search, ...rest } = req.query as { [filter: string]: string };
        return parseFilterObject(rest as QuerySafeDeepPartial<any>);
    })();
}
