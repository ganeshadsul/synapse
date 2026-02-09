import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { HttpAdapterHost, Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';
import { RESPONSE_MESSAGE } from '../constants/messages/response-messages.constant';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  constructor(
    private readonly reflector: Reflector,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = context.switchToHttp();

    const request = ctx.getRequest<unknown>();
    const response = ctx.getResponse<{ statusCode: number }>();

    // Extract Path and Method
    const path = httpAdapter.getRequestUrl(request) as string;
    const method = httpAdapter.getRequestMethod(request) as string;

    const responseMessage =
      this.reflector.get<string>(RESPONSE_MESSAGE_KEY, context.getHandler()) ||
      RESPONSE_MESSAGE.DEFAULT;

    return next.handle().pipe(
      map((data: T) => {
        return {
          success: true,
          statusCode: response.statusCode,
          message: responseMessage,
          data: data,
          timestamp: new Date().toISOString(),
          path,
          method,
        };
      }),
    );
  }
}
