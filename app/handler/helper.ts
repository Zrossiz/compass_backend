import { Pagination } from 'app/types/pagination';
import { Request } from 'express';
import { InvalidQueryParams } from 'app/errors/validation';
import { IdParamsDTO, PaginationQueryDTO } from 'app/handler/dto/common';

export const buildPagination = (req: Request): Pagination => {
  const parsed = PaginationQueryDTO.safeParse(req.query);
  if (!parsed.success) {
    throw new InvalidQueryParams();
  }

  return {
    page: parsed.data.page,
    limit: parsed.data.limit,
    offset: (parsed.data.page - 1) * parsed.data.limit,
  };
};

export const parseIdParam = (req: Request): number => {
  const parsed = IdParamsDTO.safeParse(req.params);
  if (!parsed.success) {
    throw new InvalidQueryParams();
  }

  return parsed.data.id;
};
