import {Module} from "@nestjs/common";
import {AppController} from "./app.controller";
import {PrismaService} from "./prisma.service";
import {BranchModule} from "./common/branches/branch/branch.module";
import {DepartmentModule} from './common/branches/department/department.module';
import {PositionModule} from './common/branches/position/position.module';
import {EmployeeModule} from './api/v2/employee/employee.module';
import {AuthModule} from './api/v2/auth/auth.module';
import {PayrollModule} from './api/v2/payroll/payroll.module';
import {OrgChartModule} from './api/v2/org-chart/org-chart.module';
import {SalaryModule} from './api/v2/salary/salary.module';
import {ConfigModule} from "./core/config/config.module";
import {ContractModule} from './api/v2/contract/contract.module';
import {WorkHistoryModule} from './api/v2/histories/work-history/work-history.module';
import {NationModule} from './common/nations/nation/nation.module';
import {ProvinceModule} from './common/nations/province/province.module';
import {DistrictModule} from './common/nations/district/district.module';
import {WardModule} from './common/nations/ward/ward.module';
import {BankModule} from './api/v2/bank/bank.module';
import {DegreeModule} from './api/v2/degree/degree.module';
import {RelativeModule} from "./api/v2/relative/relative.module";
import {CustomerModule} from './api/v2/customer/customer.module';
import {HistorySalaryModule} from './api/v2/histories/history-salary/history-salary.module';
import { SystemHistoryModule } from './api/v2/histories/system-history/system-history.module';
import { OvertimeTemplateModule } from './api/v2/overtime-template/overtime-template.module';

@Module({
  imports: [
    BranchModule,
    DepartmentModule,
    PositionModule,
    EmployeeModule,
    AuthModule,
    PayrollModule,
    OrgChartModule,
    SalaryModule,
    ConfigModule,
    ContractModule,
    WorkHistoryModule,
    NationModule,
    ProvinceModule,
    DistrictModule,
    WardModule,
    BankModule,
    DegreeModule,
    RelativeModule,
    CustomerModule,
    HistorySalaryModule,
    SystemHistoryModule,
    OvertimeTemplateModule
  ],
  controllers: [AppController],
  providers: [PrismaService],
})

/*
* Các req cố ý sửa đổi, xoá thành công sẽ được ghi lại trong lịch sử db
* */
export class AppModule {
}
