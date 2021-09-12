import {CustomerResource, CustomerType} from "@prisma/client";

export interface SearchCustomerDto {
  name: string,
  phone: string,
  nationId: number,
  type: CustomerType,
  resource: CustomerResource,
  isPotential: number
}
