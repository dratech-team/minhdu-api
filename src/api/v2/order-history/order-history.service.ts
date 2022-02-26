import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateOrderHistoryDto} from './dto/create-order-history.dto';
import {UpdateOrderHistoryDto} from './dto/update-order-history.dto';
import {PrismaService} from "../../../prisma.service";

@Injectable()
export class OrderHistoryService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(createOrderHistoryDto: CreateOrderHistoryDto) {
    return 'This action adds a new orderHistory';
  }

  async findAll() {
    try {
      return await this.prisma.orderHistory.findMany();
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    return `This action returns a #${id} orderHistory`;
  }

  async update(id: number, updateOrderHistoryDto: UpdateOrderHistoryDto) {
    return `This action updates a #${id} orderHistory`;
  }

  async remove(id: number) {
    return `This action removes a #${id} orderHistory`;
  }
}
