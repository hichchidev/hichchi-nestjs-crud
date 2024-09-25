import { IPagination } from "hichchi-nestjs-common/interfaces";

export class PaginatedResponse<T> {
    data: T[];

    page: number = 0;

    limit: number = 0;

    rowCount: number;

    constructor(data: T[], totalCount: number, pagination?: IPagination) {
        this.data = data;
        this.rowCount = totalCount;
        if (pagination) {
            this.page = pagination.skip ? Math.floor(pagination.skip / pagination.take) + 1 : 1;
            this.limit = pagination.take;
        }
    }
}
