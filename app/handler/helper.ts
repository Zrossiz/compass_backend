import { Pagination } from 'app/types/pagination';
import { Request } from 'express';
import { InvalidQueryParams } from 'app/errors/validation';

export const buildPagination = (req: Request): Pagination => {
  const { limit, page } = req.query;

  const numLimit = Number(limit);
  if (!Number.isInteger(numLimit) || numLimit <= 0 || numLimit > 100) {
    throw new InvalidQueryParams();
  }

  const numPage = Number(page);
  if (!Number.isInteger(numPage) || numPage <= 0) {
    throw new InvalidQueryParams();
  }

  return {
    limit: numLimit,
    offset: (numPage - 1) * numLimit,
  };
};
