import {buildMessage, ValidateBy} from "class-validator";
import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

export async function isUnique(value: string) {
  let req = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
      console.log(data);
    },
  );

  console.log(req);

  const found = await this.constructor.findOne({value});
  if (found) {
    return false;
  }
}

export function IsUnique(validationOptions) {
  return ValidateBy({
    name: 'IS_UNIQUE',
    validator: {
      validate: (value, args) => isUnique(validationOptions),
      defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be empty', validationOptions),
    },
  }, validationOptions);
}
