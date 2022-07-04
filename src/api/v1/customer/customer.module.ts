import {Module} from "@nestjs/common";
import {CustomerService} from "./customer.service";
import {CustomerController} from "./customer.controller";
import {PrismaService} from "../../../prisma.service";
import {CustomerRepository} from "./customer.repository";
import {ConfigModule} from "../../../core/config";

@Module({
  imports: [ConfigModule],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    CustomerRepository,
    PrismaService,
  ],
  exports: [],
})
export class CustomerModule {
}
