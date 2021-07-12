import {Module} from '@nestjs/common';
import {CustomerService} from './customer.service';
import {CustomerController} from './customer.controller';
import {PrismaService} from "../../../prisma.service";
import {CustomerRepository} from "./customer.repository";

@Module({
  controllers: [CustomerController],
  providers: [PrismaService, CustomerService, CustomerRepository]
})
export class CustomerModule {
}
