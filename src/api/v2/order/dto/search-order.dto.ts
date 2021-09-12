import {PaidEnum} from "../enums/paid.enum";
import {PaymentType} from "@prisma/client";

export class SearchOrderDto {
  readonly paidType: PaidEnum;
  readonly customer: string;
  readonly name: string;
  readonly payType: PaymentType;
  readonly delivered: number;
}
