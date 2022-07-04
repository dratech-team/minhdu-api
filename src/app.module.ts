import {Module} from "@nestjs/common";
import {AdminModule} from "./api/v1/admin/admin.module";
import {ApplicationModule} from "./api/v1/application/application.module";
import {AuthModule} from "./api/v1/auth/auth.module";
import {BankModule} from "./api/v1/bank/bank.module";
import {BasicTemplateModule} from "./api/v1/basic-template/basic-template.module";
import {BillModule} from "./api/v1/bill/bill.module";
import {CommodityModule} from "./api/v1/commodity/commodity.module";
import {ContractModule} from "./api/v1/contract/contract.module";
import {CustomerModule} from "./api/v1/customer/customer.module";
import {DegreeModule} from "./api/v1/degree/degree.module";
import {EmployeeModule} from "./api/v1/employee/employee.module";
import {FinanceModule} from "./api/v1/finance/finance.module";
import {HolidayModule} from "./api/v1/holiday/holiday.module";
import {LocationModule} from "./api/v1/location/location.module";
import {LoggerModule} from "./api/v1/histories/logger/logger.module";
import {OrderModule} from "./api/v1/order/order.module";
import {OrgChartModule} from "./api/v1/org-chart/org-chart.module";
import {OvertimeTemplateModule} from "./api/v1/overtime-template/overtime-template.module";
import {OverviewModule} from "./api/v1/overview/overview.module";
import {PaymentHistoryModule} from "./api/v1/histories/payment-history/payment-history.module";
import {PayrollModule} from "./api/v1/payroll/payroll.module";
import {RelativeModule} from "./api/v1/relative/relative.module";
import {RoleModule} from "./api/v1/role/role.module";
import {RouteModule} from "./api/v1/route/route.module";
import {SalaryModule} from "./api/v1/salaries/salary/salary.module";
import {SystemModule} from "./api/v1/system/system.module";
import {AppController} from "./app.controller";
import {BranchModule} from "./common/branches/branch/branch.module";
import {PositionModule} from "./common/branches/position/position.module";
import {DistrictModule} from "./common/nations/district/district.module";
import {NationModule} from "./common/nations/nation/nation.module";
import {ProvinceModule} from "./common/nations/province/province.module";
import {WardModule} from "./common/nations/ward/ward.module";
import {ConfigModule} from "./core/config";
import {PrismaService} from "./prisma.service";
import {ProductModule} from "./api/v1/product/product.module";
import {CommodityTemplateModule} from "./api/v1/commodity-template/commodity-template.module";
import {EggModule} from './api/v1/egg/egg.module';
import {EggTypeModule} from './api/v1/egg-type/egg-type.module';
import {IncubatorModule} from './api/v1/incubator/incubator.module';
import {OrderHistoryModule} from './api/v1/histories/order-history/order-history.module';
import {CategoryModule} from './api/v1/category/category.module';
import {ExportModule} from './api/v1/export/export.module';
import {SupplierModule} from "./api/v1/supplier/supplier.module";
import {StockModule} from './api/v1/stock/stock.module';
import {SalaryHistoryModule} from "./api/v1/histories/salary/salary-history.module";
import {ConsignmentModule} from './api/v1/consignment/consignment.module';
import {WarehouseModule} from "./api/v1/warehouse/warehouse.module";
import {SalarySettingsModule} from "./api/v1/settings/salary/salary-settings.module";
import {SalaryBlockModule} from './api/v1/settings/salary-block/salary-block.module';
import {SalariesModule} from "./api/v1/salaries/salary.module";
import {AppService} from "./app.service";
import {PayrollModule as PayrollModuleV2} from './api/v2/payroll/payroll.module';
import {RateConditionModule} from './api/v1/settings/rate-condition/rate-condition.module';

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
    SupplierModule,
    WarehouseModule,
    ProductModule,
    CommodityTemplateModule,
    EggModule,
    EggTypeModule,
    IncubatorModule,
    OrderHistoryModule,
    CategoryModule,
    ExportModule,
    StockModule,
    SalaryHistoryModule,
    ConsignmentModule,
    SalarySettingsModule,
    SalaryBlockModule,
    SalariesModule,
    PayrollModuleV2,
    RateConditionModule
  ],
  controllers: [AppController],
  providers: [PrismaService, AppService],
})
export class AppModule {

}
