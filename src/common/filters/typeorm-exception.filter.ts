import { ArgumentsHost, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { TYPEORM_ERROR_MESSAGES } from '../constants/messages/typeorm-error.messages';
import { PostgresError } from '../interfaces/postgres-error.interface';

export class TypeOrmException implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database Error';

    const driverError = exception.driverError as unknown as PostgresError;
    // console.log('🛑 DB ERROR STRUCTURE:', {
    //   code: driverError?.code,
    //   exceptionCode: (exception as any).code, // Sometimes it's here
    //   detail: driverError?.detail,
    //   message: driverError?.message,
    // });
    if (driverError.detail) {
      if (driverError?.code === 23505 || (exception as any).code === '23505') {
        statusCode = HttpStatus.CONFLICT;

        const match = driverError.detail.match(/\((.*?)\)/);
        const field = match ? match[1] : null;

        if (field && [field]) {
          message = TYPEORM_ERROR_MESSAGES[field];
        } else {
          message = `Duplicate entry found for ${field || 'record'}.`;
        }
      }
    }

    response.status(statusCode).json({
      success: false,
      statusCode: statusCode,
      message: message,
      data: null,
      errors: null,
      timeStamp: new Date().toISOString(),
    });
  }
}
