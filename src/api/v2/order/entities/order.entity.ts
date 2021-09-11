import {Commodity, Order} from "@prisma/client";

export interface FullOrder extends Order {
  readonly commodities: Commodity[];
}
