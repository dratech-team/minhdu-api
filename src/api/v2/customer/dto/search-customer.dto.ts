import {CustomerResource, CustomerType} from "@prisma/client";

export class SearchCustomerDto {
  readonly name: string;
  readonly phone: string;
  readonly nationId: number;
  readonly type: CustomerType;
  readonly resource: CustomerResource;
  readonly isPotential: number;
}
