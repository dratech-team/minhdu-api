import {Employee, Route, Location } from "@prisma/client";
import {OrderEntity} from "../../order/entities/order.entity";

export interface RouteEntity extends Route {
  readonly employee: Employee;
  readonly locations: Location[];
  readonly orders: OrderEntity[];
}
