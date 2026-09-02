export type Pagination = {
  limit: number;
  offset: number;
};

export type PaginatedResult<T> = {
  items: T[];
  totalPages: number;
};
