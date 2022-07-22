import {Commodity, Employee, Location, Route} from "@prisma/client";

export interface RouteEntity extends Route {
  readonly employee: Employee;
  readonly locations: Location[];
  readonly commodities: Commodity[];
}
