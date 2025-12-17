import {
  BaseRepository,
  FindManyOptions,
  FindOneOptions,
} from "@domain/repositories/base.repository";

import {
  Repository,
  FindOptionsWhere,
  FindOptionsOrder,
  ObjectLiteral,
} from "typeorm";

export abstract class BaseRepositoryImpl<T extends ObjectLiteral, ID>
  implements BaseRepository<T, ID> {
  constructor(protected readonly repository: Repository<T>) { }

  async findOne(options?: FindOneOptions<T>): Promise<T | null> {
    if (!options?.where) {
      return null;
    }

    const where =
      typeof options.where === "function"
        ? undefined
        : (options.where as FindOptionsWhere<T>);

    return this.repository.findOne({ where }) as Promise<T | null>;
  }

  async findMany(options?: FindManyOptions<T>): Promise<T[]> {
    const where =
      options?.where && typeof options.where !== "function"
        ? (options.where as FindOptionsWhere<T>)
        : undefined;

    let order: FindOptionsOrder<T> | undefined;

    if (options?.orderBy) {
      const orderByArray = Array.isArray(options.orderBy)
        ? options.orderBy
        : [options.orderBy];

      order = {} as FindOptionsOrder<T>;

      orderByArray.forEach((item) => {
        (order as any)[item.field] = item.direction.toUpperCase();
      });
    }

    return this.repository.find({
      where,
      take: options?.limit,
      skip: options?.offset,
      order,
    });
  }

  async count(options?: FindManyOptions<T>): Promise<number> {
    const where =
      options?.where && typeof options.where !== "function"
        ? (options.where as FindOptionsWhere<T>)
        : undefined;

    return this.repository.count({
      where,
    });
  }

  async save(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  async delete(id: ID): Promise<void> {
    await this.repository.softDelete(
      id as string | number | Date | string[] | number[] | Date[],
    );
  }
}
