export interface TypeORMError {
    query: string;
    parameters: string[];
    driverError: {
        code: string;
        errno: number;
        sqlState: string;
        sqlMessage: string;
        sql: string;
    };
    code: string;
    errno: number;
    sqlState: string;
    sqlMessage: string;
    message: string;
    sql: string;
}
