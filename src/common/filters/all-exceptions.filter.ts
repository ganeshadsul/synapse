// filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  NestErrorResponse,
  ValidationErrorDetail,
} from '../interfaces/nest-error-response.interface';
import { ErrorResponse } from '../interfaces/error-response.interface';
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly configService: ConfigService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    // Treat request/response as unknown to avoid 'any'
    const request = ctx.getRequest<unknown>();

    const path = httpAdapter.getRequestUrl(request) as string;
    const method = httpAdapter.getRequestMethod(request) as string;

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    // Strictly typed variable to hold errors
    let errors: string[] | ValidationErrorDetail[] | null = null;

    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      if (typeof response === 'object' && response !== null) {
        // Safe cast to our strict interface
        const responseObj = response as NestErrorResponse;

        // CASE 1: Your Custom Validation Pipe (returns 'errors' array of objects)
        if (responseObj.errors) {
          message =
            typeof responseObj.message === 'string'
              ? responseObj.message
              : 'Validation Error';
          errors = responseObj.errors;
        }
        // CASE 2: Default NestJS Validation (returns 'message' array of strings)
        else if (Array.isArray(responseObj.message)) {
          message = 'Validation Error';
          errors = responseObj.message;
        }
        // CASE 3: Standard Error
        else {
          message =
            typeof responseObj.message === 'string'
              ? responseObj.message
              : 'Unknown error';
        }
      } else if (typeof response === 'string') {
        message = response;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      const stack = exception.stack;
      if (this.configService.get<string>('NODE_ENV') !== 'production') {
        this.logger.error(`[${method}] ${path}`, stack);
      }
    }

    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    // Construct the response using strict types
    const responseBody: ErrorResponse<null> = {
      success: false,
      statusCode: httpStatus,
      message,
      data: null,
      errors, // Types match perfectly now
      timestamp: new Date().toISOString(),
      path,
      method,
      ...(!isProduction && exception instanceof Error
        ? { stack: exception.stack }
        : {}),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
