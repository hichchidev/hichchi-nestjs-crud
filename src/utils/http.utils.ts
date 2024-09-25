import { SortOptions } from "../types";
import { FindOptionsOrderValue } from "typeorm/find-options/FindOptionsOrder";
import { FilterOptions, FilterValue } from "../types/filter-options.type";

export const parseSortOptions = <T>(sortString: string): SortOptions<T> | undefined => {
    const sortFields: SortOptions<T> = {};

    if (!sortString) {
        return undefined;
    }

    const sortEntries = sortString.split(",");
    sortEntries.forEach((entry) => {
        const parts = entry.split(".");
        const order = parts.pop() as FindOptionsOrderValue;
        let current: any = sortFields;

        parts.forEach((part, index) => {
            if (!current[part]) {
                current[part] = {};
            }
            if (index === parts.length - 1) {
                current[part] = order;
            } else {
                current = current[part];
            }
        });
    });

    return Object.values(sortFields).length ? sortFields : undefined;
};

export const parseFilterObject = <T>(filterObject: { [key: string]: FilterValue }): FilterOptions<T> | undefined => {
    const filterFields: FilterOptions<T> = {};

    for (const path in filterObject) {
        if (Object.prototype.hasOwnProperty.call(filterObject, path)) {
            const value = filterObject[path];
            const parts = path.split(".");
            let current: any = filterFields;

            parts.forEach((part, index) => {
                if (!current[part]) {
                    current[part] = {};
                }
                if (index === parts.length - 1) {
                    current[part] = value;
                } else {
                    current = current[part];
                }
            });
        }
    }

    return Object.values(filterFields).length ? filterFields : undefined;
};

export const parseSearchString = <T>(searchString?: string): FilterOptions<T> | undefined => {
    const searchFields: FilterOptions<T> = {};

    if (!searchString) {
        return undefined;
    }

    const searchEntries = searchString.split(",");
    searchEntries.forEach((entry) => {
        const parts = entry.split(".");
        const searchValue = parts.pop();

        let current: any = searchFields;
        parts.forEach((part, index) => {
            if (!current[part]) {
                current[part] = {};
            }
            if (index === parts.length - 1) {
                current[part] = searchValue;
            } else {
                current = current[part];
            }
        });
    });

    return Object.values(searchFields).length ? searchFields : undefined;
};
