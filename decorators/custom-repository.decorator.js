"use strict";
// noinspection JSUnusedGlobalSymbols
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomRepository = exports.CUSTOM_REPOSITORY = void 0;
const common_1 = require("@nestjs/common");
exports.CUSTOM_REPOSITORY = "CUSTOM_REPOSITORY";
const CustomRepository = (entity) => {
    return (0, common_1.SetMetadata)(exports.CUSTOM_REPOSITORY, entity);
};
exports.CustomRepository = CustomRepository;
//# sourceMappingURL=custom-repository.decorator.js.map