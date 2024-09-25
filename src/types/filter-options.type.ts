export type FilterValue = string | number | boolean | Date | null;

export type FilterOptions<T = unknown> = {
    [P in keyof T]?: FilterValue | FilterOptions<T[P]>;
};
