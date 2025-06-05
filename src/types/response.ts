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
