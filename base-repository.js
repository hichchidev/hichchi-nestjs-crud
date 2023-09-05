"use strict";
// noinspection JSUnusedGlobalSymbols
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const typeorm_1 = require("typeorm");
class BaseRepository extends typeorm_1.Repository {
    constructor(repository) {
        super(repository === null || repository === void 0 ? void 0 : repository.target, repository === null || repository === void 0 ? void 0 : repository.manager, repository === null || repository === void 0 ? void 0 : repository.queryRunner);
    }
    save(entity, options, manager) {
        if (manager) {
            return manager.getRepository(this.target).save(entity, options);
        }
        return super.save(entity, options);
    }
    async saveAndGet(entity, options, manager) {
        const newEntity = await this.save(entity, options, manager);
        return this.get(newEntity.id, options, manager);
    }
    saveMany(entities, options, manager) {
        if (manager) {
            return manager.getRepository(this.target).save(entities, options);
        }
        return super.save(entities, options);
    }
    update(id, partialEntity, manager) {
        if (manager) {
            return manager.getRepository(this.target).update(id, partialEntity);
        }
        return super.update(id, partialEntity);
    }
    async updateAndGet(id, partialEntity, options, manager) {
        await this.update(id, partialEntity, manager);
        return this.get(id, options, manager);
    }
    updateOne(conditions, partialEntity, manager) {
        if (manager) {
            return manager.getRepository(this.target).update(conditions, partialEntity);
        }
        return super.update(conditions, partialEntity);
    }
    updateMany(findConditions, partialEntity, manager) {
        if (manager) {
            return manager.getRepository(this.target).update(findConditions, partialEntity);
        }
        return super.update(findConditions, partialEntity);
    }
    updateByIds(ids, partialEntity, manager) {
        return this.updateMany({ id: (0, typeorm_1.In)(ids) }, partialEntity, manager);
    }
    get(id, options, manager) {
        return this.getOne(Object.assign(Object.assign({}, options), { where: { id } }), manager);
    }
    getOne(getOne, manager) {
        const { where, not, search, relations, options } = getOne;
        const opt = options !== null && options !== void 0 ? options : {};
        opt.where = where !== null && where !== void 0 ? where : {};
        if (not) {
            opt.where = this.mapWhere(opt.where, not, typeorm_1.Not);
        }
        if (search) {
            opt.where = this.mapWhere(opt.where, search, typeorm_1.ILike, "%{}%");
        }
        if (relations) {
            opt.relations = relations;
        }
        if (manager) {
            return manager.getRepository(this.target).findOne(opt);
        }
        return super.findOne(opt);
    }
    async getByIds(getByIds, manager) {
        const { ids, relations, pagination, sort, options } = getByIds;
        const opt = options !== null && options !== void 0 ? options : {};
        if (relations) {
            opt.relations = relations;
        }
        if (pagination) {
            opt.take = pagination.take;
            opt.skip = pagination.skip;
        }
        if (sort) {
            opt.order = sort;
        }
        opt.where = { id: (0, typeorm_1.In)(ids) };
        const [entities] = await this.getMany(opt, manager);
        return entities;
    }
    getMany(getMany, manager) {
        const { filters, where, not, search, relations, pagination, sort, options } = getMany !== null && getMany !== void 0 ? getMany : {};
        const opt = options !== null && options !== void 0 ? options : {};
        opt.where = where !== null && where !== void 0 ? where : {};
        if (filters) {
            Object.keys(filters).forEach((key) => {
                if (filters[key]) {
                    opt.where[key] = filters[key];
                }
            });
        }
        if (not) {
            opt.where = this.mapWhere(opt.where, not, typeorm_1.Not);
        }
        if (search) {
            opt.where = this.mapWhere(opt.where, search, typeorm_1.ILike, "%{}%");
        }
        if (relations) {
            opt.relations = relations;
        }
        if (pagination) {
            opt.take = pagination.take;
            opt.skip = pagination.skip;
        }
        if (sort) {
            opt.order = sort;
        }
        if (manager) {
            return manager.getRepository(this.target).findAndCount(opt);
        }
        return super.findAndCount(opt);
    }
    delete(id, manager) {
        if (manager) {
            return manager.getRepository(this.target).softDelete(id);
        }
        return super.softDelete(id);
    }
    deleteByIds(ids, manager) {
        if (manager) {
            return manager.getRepository(this.target).softDelete(ids);
        }
        return super.softDelete(ids);
    }
    hardDelete(id, manager) {
        if (manager) {
            return manager.getRepository(this.target).delete(id);
        }
        return super.delete(id);
    }
    hardDeleteByIds(ids, manager) {
        if (manager) {
            return manager.getRepository(this.target).delete(ids);
        }
        return super.delete(ids);
    }
    count(options, manager) {
        if (manager) {
            return manager.getRepository(this.target).count(options);
        }
        return super.count(options);
    }
    transaction(operation) {
        return this.manager.transaction(operation);
    }
    mapWhere(where, data, operator, wrap) {
        const whr = where !== null && where !== void 0 ? where : {};
        if (typeof data === "object") {
            for (const key in data) {
                if (typeof data[key] === "object") {
                    whr[key] = this.mapWhere(whr[key], data[key], operator, wrap);
                }
                else {
                    whr[key] = wrap ? operator(wrap.replace("{}", data[key])) : operator(data[key]);
                }
            }
            return whr;
        }
        return wrap ? operator(data) : operator(data);
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base-repository.js.map