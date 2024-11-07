import { BaseRepository } from "../base-repository";

export type RepositoryDecorator = <T extends { new (...args: any[]): BaseRepository<any> }>(target: T) => T | void;
