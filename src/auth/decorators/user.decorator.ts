import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserAuth = createParamDecorator(
  (key: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return key ? user && user[key] : user;
  },
);
