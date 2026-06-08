export interface ApiProblem {
  title: string;
  status: number;
}

export interface PaginationMeta {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends PaginationMeta {
  data: T[];
}
