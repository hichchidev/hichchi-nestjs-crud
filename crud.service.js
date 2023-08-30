"use strict";
// noinspection JSUnusedGlobalSymbols
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrudService = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("./utils");
const enums_1 = require("./enums");
const responses_1 = require("./responses");
const crud_service_missing_params_exception_1 = require("./exceptions/crud-service-missing-params.exception");
class CrudService {
    constructor(repository, entityName, uniqueFieldName) {
        this.repository = repository;
        this.entityName = entityName;
        this.uniqueFieldName = uniqueFieldName;
        if (!repository || !entityName) {
            throw new crud_service_missing_params_exception_1.CrudServiceMissingParamsException();
        }
    }
    // abstract map(entity: Entity): Entity;
    async save(createDto, options, manager, eh) {
        try {
            return await this.repository.saveAndGet(createDto, Object.assign({}, options), manager);
        }
        catch (e) {
            if (eh) {
                const err = eh(e);
                if (err) {
                    throw err;
                }
            }
            utils_1.EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }
    async saveMany(createDto, options, manager, eh) {
        try {
            return await this.repository.saveMany(createDto, options, manager);
        }
        catch (e) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            utils_1.EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }
    async update(id, updateDto, options, manager, eh) {
        try {
            const { affected } = await this.repository.update(id, updateDto, manager);
            if (affected !== 0) {
                return this.get(id, options, manager);
            }
            return Promise.reject(new common_1.NotFoundException(responses_1.EntityErrors.E_404_ID(this.entityName)));
        }
        catch (e) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            utils_1.EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }
    async updateOne(conditions, updateDto, manager, eh) {
        try {
            const { affected } = await this.repository.updateOne(conditions, updateDto, manager);
            if (affected !== 0) {
                return utils_1.EntityUtils.handleSuccess(enums_1.Operation.UPDATE, this.entityName);
            }
            return Promise.reject(new common_1.NotFoundException(responses_1.EntityErrors.E_404_CONDITION(this.entityName)));
        }
        catch (e) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            utils_1.EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }
    async updateMany(conditions, updateDto, manager, eh) {
        try {
            const { affected } = await this.repository.updateMany(conditions, updateDto, manager);
            if (affected !== 0) {
                return utils_1.EntityUtils.handleSuccess(enums_1.Operation.UPDATE, this.entityName);
            }
        }
        catch (e) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            utils_1.EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }
    async updateByIds(ids, updateDto, manager, eh) {
        try {
            const { affected } = await this.repository.updateByIds(ids, updateDto, manager);
            if (affected !== 0) {
                return utils_1.EntityUtils.handleSuccess(enums_1.Operation.UPDATE, this.entityName);
            }
        }
        catch (e) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            utils_1.EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }
    async get(id, options, manager, eh) {
        try {
            const entity = await this.repository.get(id, options, manager);
            if (entity) {
                return entity;
            }
            return Promise.reject(new common_1.NotFoundException(responses_1.EntityErrors.E_404_ID(this.entityName)));
        }
        catch (e) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            utils_1.EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }
    async getOne(getOne, manager, eh) {
        var _a;
        try {
            getOne.where = Object.assign(Object.assign({}, ((_a = getOne.where) !== null && _a !== void 0 ? _a : {})), { deletedAt: null });
            const entity = await this.repository.getOne(getOne, manager);
            if (entity) {
                return entity;
            }
            return Promise.reject(new common_1.NotFoundException(responses_1.EntityErrors.E_404_CONDITION(this.entityName)));
        }
        catch (e) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            utils_1.EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }
    async getByIds(getByIds, manager, eh) {
        try {
            return await this.repository.getByIds(getByIds, manager);
        }
        catch (e) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            utils_1.EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }
    async getMany(getMany, manager, eh) {
        var _a;
        try {
            const [data, rowCount] = await this.repository.getMany(Object.assign(Object.assign({}, getMany), { where: Object.assign(Object.assign({}, ((_a = getMany.where) !== null && _a !== void 0 ? _a : {})), { deletedAt: null }) }), manager);
            return getMany.pagination ? { data, rowCount } : data;
        }
        catch (e) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            utils_1.EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }
    async getAll(getAll, manager, eh) {
        try {
            const [data, rowCount] = await this.repository.getMany(Object.assign(Object.assign({}, (getAll !== null && getAll !== void 0 ? getAll : {})), { where: { deletedAt: null } }), manager);
            return (getAll === null || getAll === void 0 ? void 0 : getAll.pagination) ? { data, rowCount } : data;
        }
        catch (e) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            utils_1.EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }
    async getWithoutPage(getMany, manager, eh) {
        var _a, _b;
        try {
            if ((_a = getMany === null || getMany === void 0 ? void 0 : getMany.options) === null || _a === void 0 ? void 0 : _a.skip) {
                getMany.options.skip = undefined;
            }
            if ((_b = getMany === null || getMany === void 0 ? void 0 : getMany.options) === null || _b === void 0 ? void 0 : _b.take) {
                getMany.options.take = undefined;
            }
            const [data] = await this.repository.getMany(getMany, manager);
            return data;
        }
        catch (e) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            utils_1.EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }
    async delete(id, deletedBy, wipe, manager, eh) {
        try {
            let deletedRecord = await this.get(id, undefined, manager);
            const { affected } = wipe
                ? await this.repository.hardDelete(id, manager)
                : await this.repository.delete(id, manager);
            if (affected !== 0) {
                if (!wipe && deletedBy) {
                    try {
                        deletedRecord = await this.update(id, { deletedBy }, undefined, manager);
                    }
                    catch (err) { }
                }
                return deletedRecord;
            }
            return Promise.reject(new common_1.NotFoundException(responses_1.EntityErrors.E_404_ID(this.entityName)));
        }
        catch (e) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            utils_1.EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }
    async deleteByIds(ids, deletedBy, wipe, manager, eh) {
        try {
            const { affected } = wipe
                ? await this.repository.hardDeleteByIds(ids, manager)
                : await this.repository.deleteByIds(ids, manager);
            if (affected !== 0) {
                if (!wipe && deletedBy) {
                    await this.updateByIds(ids, { deletedBy }, manager);
                }
                return utils_1.EntityUtils.handleSuccess(enums_1.Operation.DELETE, this.entityName);
            }
            return Promise.reject(new common_1.NotFoundException(responses_1.EntityErrors.E_404_ID(this.entityName)));
        }
        catch (e) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            utils_1.EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }
    async count(getMany, manager, eh) {
        var _a;
        try {
            getMany.where = Object.assign(Object.assign({}, ((_a = getMany.where) !== null && _a !== void 0 ? _a : {})), { deletedAt: null });
            return await this.repository.count(getMany, manager);
        }
        catch (e) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            utils_1.EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }
    transaction(operation) {
        return this.repository.transaction(operation);
    }
}
exports.CrudService = CrudService;
//# sourceMappingURL=crud.service.js.map