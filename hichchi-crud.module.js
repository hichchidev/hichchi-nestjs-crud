"use strict";
// noinspection JSUnusedGlobalSymbols
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HichchiCrudModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HichchiCrudModule = void 0;
const common_1 = require("@nestjs/common");
const decorators_1 = require("./decorators");
const typeorm_1 = require("@nestjs/typeorm");
const tokens_1 = require("./tokens");
let HichchiCrudModule = HichchiCrudModule_1 = class HichchiCrudModule {
    static forRoot(options) {
        return {
            module: HichchiCrudModule_1,
            imports: [
                typeorm_1.TypeOrmModule.forRoot({
                    type: options.type,
                    host: options.host,
                    port: options.port,
                    username: options.username,
                    password: options.password,
                    database: options.database,
                    entities: options.entities,
                    charset: options.charset,
                    extra: {
                        charset: options.charset,
                    },
                    synchronize: options.synchronize,
                    legacySpatialSupport: options.legacySpatialSupport,
                    keepConnectionAlive: options.keepConnectionAlive,
                    autoLoadEntities: options.autoLoadEntities,
                }),
            ],
            providers: [
                {
                    provide: tokens_1.CONNECTION_OPTIONS,
                    useValue: options,
                },
            ],
        };
    }
    static forFeature(entities) {
        return {
            module: HichchiCrudModule_1,
            imports: [typeorm_1.TypeOrmModule.forFeature(entities)],
            exports: [typeorm_1.TypeOrmModule],
        };
    }
    static forCustomRepository(repositories) {
        const providers = [];
        for (const repository of repositories) {
            const entity = Reflect.getMetadata(decorators_1.CUSTOM_REPOSITORY, repository);
            if (!entity) {
                continue;
            }
            providers.push({
                inject: [(0, typeorm_1.getDataSourceToken)()],
                provide: repository,
                useFactory: (dataSource) => {
                    const customRepository = dataSource.getRepository(entity);
                    return new repository(customRepository);
                },
            });
        }
        return {
            module: HichchiCrudModule_1,
            providers,
            exports: providers,
        };
    }
};
exports.HichchiCrudModule = HichchiCrudModule;
exports.HichchiCrudModule = HichchiCrudModule = HichchiCrudModule_1 = __decorate([
    (0, common_1.Module)({})
], HichchiCrudModule);
//# sourceMappingURL=hichchi-crud.module.js.map