import { Module } from "@nestjs/common";
import { AdminModule } from "./api/v2/admin/admin.module";
import { ApplicationModule } from "./api/v2/application/application.module";
import { AuthModule } from "./api/v2/auth/auth.module";
import { BankModule } from "./api/v2/bank/bank.module";
import { BasicTemplateModule } from "./api/v2/basic-template/basic-template.module";
import { BillModule } from "./api/v2/bill/bill.module";
import { CommodityModule } from "./api/v2/commodity/commodity.module";
import { ContractModule } from "./api/v2/contract/contract.module";
import { CustomerModule } from "./api/v2/customer/customer.module";
import { DegreeModule } from "./api/v2/degree/degree.module";
import { EmployeeModule } from "./api/v2/employee/employee.module";
import { FinanceModule } from "./api/v2/finance/finance.module";
import { HolidayModule } from "./api/v2/holiday/holiday.module";
import { LocationModule } from "./api/v2/location/location.module";
import { LoggerModule } from "./api/v2/logger/logger.module";
import { OrderModule } from "./api/v2/order/order.module";
import { OrgChartModule } from "./api/v2/org-chart/org-chart.module";
import { OvertimeTemplateModule } from "./api/v2/overtime-template/overtime-template.module";
import { OverviewModule } from "./api/v2/overview/overview.module";
import { PaymentHistoryModule } from "./api/v2/payment-history/payment-history.module";
import { PayrollModule } from "./api/v2/payroll/payroll.module";
import { RelativeModule } from "./api/v2/relative/relative.module";
import { RoleModule } from "./api/v2/role/role.module";
import { RouteModule } from "./api/v2/route/route.module";
import { SalaryModule } from "./api/v2/salary/salary.module";
import { SystemModule } from "./api/v2/system/system.module";
import { AppController } from "./app.controller";
import { BranchModule } from "./common/branches/branch/branch.module";
import { PositionModule } from "./common/branches/position/position.module";
import { DistrictModule } from "./common/nations/district/district.module";
import { NationModule } from "./common/nations/nation/nation.module";
import { ProvinceModule } from "./common/nations/province/province.module";
import { WardModule } from "./common/nations/ward/ward.module";
import { ConfigModule } from "./core/config/config.module";
import { PrismaService } from "./prisma.service";
import { ProviderModule } from "./api/v2/provider/provider.module";
import { WarehouseModule } from "./api/v2/warehouse/warehouse.module";
import { ProductModule } from "./api/v2/product/product.module";
import { CommodityTemplateModule } from "./api/v2/commodity-template/commodity-template.module";
import { WarehouseHistoryModule } from "./api/v2/warehouse-history/warehouse-history.module";

@Module({
  imports: [
    BranchModule,
    PositionModule,
    EmployeeModule,
    AuthModule,
    PayrollModule,
    OrgChartModule,
    SalaryModule,
    ConfigModule,
    ContractModule,
    NationModule,
    ProvinceModule,
    DistrictModule,
    WardModule,
    BankModule,
    DegreeModule,
    RelativeModule,
    CustomerModule,
    OvertimeTemplateModule,
    OrderModule,
    CommodityModule,
    BillModule,
    RouteModule,
    LocationModule,
    PaymentHistoryModule,
    HolidayModule,
    LoggerModule,
    BasicTemplateModule,
    SystemModule,
    RoleModule,
    ApplicationModule,
    FinanceModule,
    AdminModule,
    OverviewModule,
    ProviderModule,
    WarehouseModule,
    ProductModule,
    CommodityTemplateModule,
    WarehouseHistoryModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
