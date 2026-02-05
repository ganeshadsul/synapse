export class ErrorResponse {
  message: string | string[];
  error?: string;
  statusCode: number;
  errors: any[];
  timestamp: string;
}
