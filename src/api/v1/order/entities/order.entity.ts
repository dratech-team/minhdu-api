import {Commodity, Customer, District, Order, Province, Ward} from "@prisma/client";

export interface OrderEntity extends Order {
  readonly commodities: Commodity[];
  readonly customer: Customer;
  readonly province: Province;
  readonly district: District;
  readonly ward: Ward;
}
