import { ValidationErrorDetail } from './nest-error-response.interface';

export interface ErrorResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  // Union type: Can be a list of strings OR your structured validation errors
  errors?: string[] | ValidationErrorDetail[] | null;
  timestamp: string;
  path: string;
  method: string;
  stack?: string;
}
