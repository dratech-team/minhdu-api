import {PaidEnum} from "../enums/paid.enum";
import {Customer, PaymentType} from "@prisma/client";

export class SearchOrderDto {
  readonly paidType: PaidEnum;
  readonly customerId: Customer["id"];
  readonly customer: string;
  readonly name: string;
  readonly payType: PaymentType;
  readonly delivered: number;
}
