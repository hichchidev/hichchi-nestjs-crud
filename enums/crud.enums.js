"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operation = exports.TypeORMErrorType = void 0;
var TypeORMErrorType;
(function (TypeORMErrorType) {
    TypeORMErrorType["ER_NO_DEFAULT_FOR_FIELD"] = "ER_NO_DEFAULT_FOR_FIELD";
    TypeORMErrorType["ER_DUP_ENTRY"] = "ER_DUP_ENTRY";
    TypeORMErrorType["ER_NO_REFERENCED_ROW_2"] = "ER_NO_REFERENCED_ROW_2";
})(TypeORMErrorType || (exports.TypeORMErrorType = TypeORMErrorType = {}));
var Operation;
(function (Operation) {
    Operation["CREATE"] = "CREATE";
    Operation["UPDATE"] = "UPDATE";
    Operation["SAVE"] = "SAVE";
    Operation["DELETE"] = "DELETE";
})(Operation || (exports.Operation = Operation = {}));
//# sourceMappingURL=crud.enums.js.map