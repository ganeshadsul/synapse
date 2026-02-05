import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ApiResponse } from '../interfaces/api-response.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { RESPONSE_MESSGE_KEY } from '../decorators/response-message.decorator';
import { Response } from 'express';
import { RESPONSE_MESSAGE } from '../constants/messages/response-messages.constant';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  constructor(private readonly reflactor: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const responseMessage = this.reflactor.get<string>(
      RESPONSE_MESSGE_KEY,
      context.getHandler(),
    );

    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse<Response>();

        return {
          success: true,
          statusCode: response.statusCode,
          message: responseMessage || RESPONSE_MESSAGE.DEFAULT,
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
