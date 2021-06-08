import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  OnModuleDestroy,
  OnModuleInit, UseInterceptors
} from '@nestjs/common';
import {PrismaClient} from '@prisma/client';
import {Observable} from 'rxjs';

export class FilterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return context.switchToHttp().getRequest().user;
  }

}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    await this.createMiddleware();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async createMiddleware() {
    // this.$use(async (param, next) => {
    //   if (param.model === 'Payroll') {
    //     if (param.action === 'findMany') {
    //       console.log(param);
    //       param.args.where = {employee: {NOT: {leftAt: null}}};
    //     }
    //   }
    //   console.log(param);
    //   return next(param);
    // });
  }
}
