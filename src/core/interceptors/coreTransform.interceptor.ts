import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response, Request } from 'express';

@Injectable()
export class CoreTransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const response = context.switchToHttp().getResponse<Response>();
        const request = context.switchToHttp().getRequest<Request>();
        console.log('request', request.query);
        const {skip = 0, limit = 0} = request.query;
        return next.handle().pipe(
            map((result: any) => {
                let res : any = {};
                if(skip) res.skip = skip;
                if(limit) res.limit = limit;
                if(result && result.length) {
                    res.items = result;
                } else {
                    res = result
                }
                return res;
            })
        );
    }
}
