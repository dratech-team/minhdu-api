import {Commodity, Order} from "@prisma/client";

export interface OrderEntity extends Order {
  readonly commodities: Commodity[];
}
