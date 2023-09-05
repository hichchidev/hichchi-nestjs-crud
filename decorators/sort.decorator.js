"use strict";
// noinspection JSUnusedGlobalSymbols
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sorter = void 0;
const common_1 = require("@nestjs/common");
exports.Sorter = (0, common_1.createParamDecorator)((_data, ctx) => {
    var _a, _b;
    const req = ctx.switchToHttp().getRequest();
    const order = {};
    if (((_a = req.query) === null || _a === void 0 ? void 0 : _a.sort) && ((_b = req.query) === null || _b === void 0 ? void 0 : _b.sort) !== "undefined") {
        const sortColumns = req.query.sort.split(",");
        sortColumns.forEach((column) => {
            const property = column.split(".");
            const sortColumn = property[0];
            const sortOrder = property[1].toUpperCase();
            order[sortColumn] = sortOrder === "ASC" ? "ASC" : "DESC";
        });
    }
    return order;
});
//# sourceMappingURL=sort.decorator.js.map