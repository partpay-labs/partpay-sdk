import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ACTIONS_CORS_HEADERS } from '@solana/actions';

@Injectable()
export class CorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    
    Object.keys(ACTIONS_CORS_HEADERS).forEach(header => {
      response.header(header, ACTIONS_CORS_HEADERS[header]);
    });

    return next.handle().pipe(
      map(data => {
        // If the response is an object, we can add headers to it
        if (typeof data === 'object' && data !== null) {
          return { ...data, headers: ACTIONS_CORS_HEADERS };
        }
        // If it's not an object (like for OPTIONS requests), just return the data
        return data;
      }),
    );
  }
}