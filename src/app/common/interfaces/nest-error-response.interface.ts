export interface ValidationErrorDetail {
  field: string;
  errors: string[];
}

export interface NestErrorResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
  errors?: ValidationErrorDetail[];
}
