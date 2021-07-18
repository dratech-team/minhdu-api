import {Injectable} from '@nestjs/common';
import {PaymentHistory} from '@prisma/client';
import {CreatePaymentHistoryDto} from './dto/create-payment-history.dto';
import {UpdatePaymentHistoryDto} from './dto/update-payment-history.dto';
import {PaymentHistoryRepository} from "./payment-history.repository";

@Injectable()
export class PaymentHistoryService {
  constructor(private readonly repository: PaymentHistoryRepository) {
  }

  async create(customerId: number, body: CreatePaymentHistoryDto) {
    return await this.repository.create(customerId ,body);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findOne(id: number) {
    return await this.repository.findOne(id);
  }

  async update(id: number, updates: UpdatePaymentHistoryDto) {
    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    await this.repository.remove(id);
  }

  totalPayment(payments: PaymentHistory[]) {
    return payments?.map(pay => pay.total)?.reduce((a, b) => {
      return a + b;
    }, 0);
  }
}
