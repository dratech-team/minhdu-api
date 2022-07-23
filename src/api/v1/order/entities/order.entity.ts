import {Customer, District, Order, Province, Ward} from "@prisma/client";
import {CommodityEntity} from "../../commodity/entities/commodity.entity";

export interface OrderEntity extends Order {
  readonly commodities: CommodityEntity[];
  readonly commodityTotal: number;
  readonly paymentTotal: number;
  readonly customer: Customer;
  readonly province: Province;
  readonly district: District;
  readonly ward: Ward;
}
