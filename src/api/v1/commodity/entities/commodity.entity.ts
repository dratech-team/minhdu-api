import {Commodity, Route} from "@prisma/client";

export interface CommodityEntity extends Commodity {
  readonly route: Route;
}
