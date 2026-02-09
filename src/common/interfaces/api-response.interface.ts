export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors?: any;
  timestamp: string;
  path: string;
  method: string;
  stack?: string;
}
