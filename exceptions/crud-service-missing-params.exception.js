"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrudServiceMissingParamsException = void 0;
class CrudServiceMissingParamsException extends Error {
    constructor() {
        super(`Missing required constructor parameters in CrudService.\n\nThe 'repository' and 'entityName' parameters are mandatory when extending
             the CrudService class. Ensure that you provide these parameters in the constructor when creating a new instance of the extended class.
             \n\nExample:\n  constructor(\n    @InjectRepository(UserRepository) private readonly userRepository: UserRepository,\n  ) {\n    super(userRepository, 'user'); // Ensure
             that 'userRepository' and 'user' are provided as constructor parameters.\n  }`);
        this.name = "CrudServiceError";
    }
}
exports.CrudServiceMissingParamsException = CrudServiceMissingParamsException;
//# sourceMappingURL=crud-service-missing-params.exception.js.map