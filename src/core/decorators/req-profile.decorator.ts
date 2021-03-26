import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const ReqProfile = createParamDecorator(
  (data: "user" | "session" | "role", ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    if (!data) {
      return req.user;
    }

    return req.user && req.user[data];
  }
);

export const ReqUserProfile = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req?.user?.user;
  }
);
