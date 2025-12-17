export type WhereClause<T> = Partial<T> | ((entity: T) => boolean);

export type OrderBy<T> = {
  field: keyof T;
  direction: "asc" | "desc";
};

export type FindManyOptions<T> = {
  where?: WhereClause<T>;
  limit?: number;
  offset?: number;
  orderBy?: OrderBy<T> | OrderBy<T>[];
};

export type FindOneOptions<T> = {
  where?: WhereClause<T>;
};

export interface BaseRepository<T, ID> {
  findOne(options?: FindOneOptions<T>): Promise<T | null>;
  findMany(options?: FindManyOptions<T>): Promise<T[]>;
  count(options?: FindManyOptions<T>): Promise<number>;
  save(entity: T): Promise<T>;
  delete(id: ID): Promise<void>;
}
