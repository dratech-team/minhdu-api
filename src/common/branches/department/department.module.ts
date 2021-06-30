import {Module} from '@nestjs/common';
import {DepartmentService} from './department.service';
import {DepartmentController} from './department.controller';
import {PrismaService} from "../../../prisma.service";
import {ConfigModule} from "../../../core/config/config.module";
import {DepartmentRepository} from "./department.repository";

@Module({
  imports: [ConfigModule],
  controllers: [DepartmentController],
  providers: [DepartmentService, PrismaService, DepartmentRepository]
})
export class DepartmentModule {
}
