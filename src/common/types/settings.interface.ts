export type IQueryPagination = {
  take: number;
  skip: number;
};

export type IPaginationResponse = {
  maxPages: number;
  currentPage: number;
  hasNextPage: boolean;
};
