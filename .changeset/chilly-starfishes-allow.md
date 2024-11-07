---
"hichchi-nestjs-crud": major
---

- Added new entity decorators @HichchiEntity and @HichchiJoinColumn
- Added validation for constraint names
- constraint enum no longer need to be passed when registering module, instead decorators create constraint names if not provided and validates if provided.
