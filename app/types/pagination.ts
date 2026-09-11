export type Pagination = {
  limit: number;
  offset: number;
  page: number;
};

export type PaginatedResult<T> = {
  items: T[];
  totalPages: number;
  curPage: number;
};
