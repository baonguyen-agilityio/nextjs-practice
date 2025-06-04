export type APIResponse<T> = {
  id: number;
  attributes: T;
};

export type APIRelatedResponse<T> = { data: T };

export type MetaResponse = {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
};

export interface ErrorResponse {
  data?: null;
  error: {
    status?: number;
    name?: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
