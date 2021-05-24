import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export const ReqProfile = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req?.user?.branchId;
  }
);
