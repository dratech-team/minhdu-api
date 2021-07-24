import {Module} from '@nestjs/common';
import {MedicineService} from './medicine.service';
import {MedicineController} from './medicine.controller';
import {MedicineRepository} from "./medicine.repository";
import {PrismaService} from "../../../prisma.service";

@Module({
  controllers: [MedicineController],
  providers: [MedicineService, MedicineRepository, PrismaService]
})
export class MedicineModule {
}
