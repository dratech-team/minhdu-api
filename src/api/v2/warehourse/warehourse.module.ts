import { Module } from '@nestjs/common';
import { WarehourseService } from './warehourse.service';
import { WarehourseController } from './warehourse.controller';

@Module({
  controllers: [WarehourseController],
  providers: [WarehourseService]
})
export class WarehourseModule {}
