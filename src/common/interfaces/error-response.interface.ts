export class ErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: null;
  errors: string[] | null;
  timestamp: string;
  path: string;
  method: string;
  stack?: string;
}
