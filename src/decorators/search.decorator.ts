// noinspection JSUnusedGlobalSymbols

import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { parseSearchString } from "../utils";
import { FilterOptions } from "../types";

/**
 * Search decorator
 *
 * This decorator is used to parse the search query parameter and return the parsed object
 *
 * @example
 * ```typescript
 * @Controller("user")
 * export class UserController {
 *     @Get()
 *     async getUsers(@Search() pager?: IPagination): Promise<User[]> {
 *         // Implementation
 *     }
 * }
 * ```
 *
 * @returns {ParameterDecorator} The parameter decorator
 */
export function Search(): ParameterDecorator {
    return createParamDecorator((_data: any, ctx: ExecutionContext): FilterOptions | undefined => {
        const req: Request = ctx.switchToHttp().getRequest();
        return typeof req.query?.search === "string" ? parseSearchString(req.query.search) : undefined;
    });
}
