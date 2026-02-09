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
import { ErrorResponse } from '../interfaces/error-response.interface';
import { NestErrorResponse } from '../interfaces/nest-error-response.interface';

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
    const request = ctx.getRequest<unknown>();

    const path = httpAdapter.getRequestUrl(request) as string;
    const method = httpAdapter.getRequestMethod(request) as string;

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    let errors: string[] | null = null;

    // Extract message & validation errors
    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      if (typeof response === 'object' && response !== null) {
        const responseObj = response as NestErrorResponse;

        if (Array.isArray(responseObj.message)) {
          message = 'Validation Error';
          errors = responseObj.message;
        } else {
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
    }

    // 3. Determine if we should show the stack trace
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    // Safe extraction of stack
    const stack = exception instanceof Error ? exception.stack : undefined;

    if (!isProduction && httpStatus === 500) {
      // Optional: Log it to console in dev for visibility
      this.logger.error(`[${method}] ${path}`, stack);
    }

    const responseBody: ErrorResponse = {
      success: false,
      statusCode: httpStatus,
      message,
      data: null,
      errors,
      timestamp: new Date().toISOString(),
      path,
      method,
      ...(!isProduction && { stack }),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
