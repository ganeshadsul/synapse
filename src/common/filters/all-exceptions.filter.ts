import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from '../interfaces/error-response.interface';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error!';
    let errors: string[] | null = null;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const errorObj = exceptionResponse as ErrorResponse;

        if (Array.isArray(errorObj.message)) {
          message = errorObj.message.join(', ');
        } else {
          message = errorObj.message;
        }

        errors = errorObj.errors || null;
      } else {
        message = exception.message;
      }
    } else {
      console.log('System Error 🔥🔥.');
    }

    response.status(statusCode).json({
      success: false,
      statusCode,
      message,
      data: null,
      errors,
      timeStamp: new Date().toISOString(),
    });
  }
}
