import {Module} from "@nestjs/common";
import {AppController} from "./app.controller";
import {PrismaService} from "./prisma.service";
import {BranchModule} from "./common/branches/branch/branch.module";
import {PositionModule} from './common/branches/position/position.module';
import {EmployeeModule} from './api/v2/employee/employee.module';
import {AuthModule} from './api/v2/auth/auth.module';
import {PayrollModule} from './api/v2/payroll/payroll.module';
import {OrgChartModule} from './api/v2/org-chart/org-chart.module';
import {SalaryModule} from './api/v2/salary/salary.module';
import {ConfigModule} from "./core/config/config.module";
import {ContractModule} from './api/v2/contract/contract.module';
import {NationModule} from './common/nations/nation/nation.module';
import {ProvinceModule} from './common/nations/province/province.module';
import {DistrictModule} from './common/nations/district/district.module';
import {WardModule} from './common/nations/ward/ward.module';
import {BankModule} from './api/v2/bank/bank.module';
import {DegreeModule} from './api/v2/degree/degree.module';
import {RelativeModule} from "./api/v2/relative/relative.module";
import {CustomerModule} from './api/v2/customer/customer.module';
import {OvertimeTemplateModule} from './api/v2/overtime-template/overtime-template.module';
import {OrderModule} from './api/v2/order/order.module';
import {CommodityModule} from './api/v2/commodity/commodity.module';
import {BillModule} from './api/v2/bill/bill.module';
import {RouteModule} from './api/v2/route/route.module';
import {LocationModule} from './api/v2/location/location.module';
import {StatisticalModule} from './api/v2/statistical/statistical.module';
import {PaymentHistoryModule} from './api/v2/payment-history/payment-history.module';
import {HolidayModule} from './api/v2/holiday/holiday.module';
import {MedicineModule} from './api/v2/medicine/medicine.module';
import { LoggerModule } from './api/v2/logger/logger.module';
import { BasicTemplateModule } from './api/v2/basic-template/basic-template.module';
import { SystemModule } from './api/v2/system/system.module';
import { RoleModule } from './api/v2/role/role.module';
import { ApplicationModule } from './api/v2/application/application.module';

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
    StatisticalModule,
    PaymentHistoryModule,
    HolidayModule,
    MedicineModule,
    LoggerModule,
    BasicTemplateModule,
    SystemModule,
    RoleModule,
    ApplicationModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {
}
