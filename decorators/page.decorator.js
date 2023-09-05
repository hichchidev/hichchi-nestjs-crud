"use strict";
// noinspection JSUnusedGlobalSymbols
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pager = void 0;
const common_1 = require("@nestjs/common");
exports.Pager = (0, common_1.createParamDecorator)((data, ctx) => {
    var _a, _b;
    const req = ctx.switchToHttp().getRequest();
    if (((_a = req.query) === null || _a === void 0 ? void 0 : _a.page) && ((_b = req.query) === null || _b === void 0 ? void 0 : _b.limit)) {
        const p = Number(req.query.page);
        const t = Number(req.query.limit);
        const page = p ? p : 1;
        const take = t ? t : 10;
        return { take, skip: (page - 1) * take };
    }
    return undefined;
});
//# sourceMappingURL=page.decorator.js.map