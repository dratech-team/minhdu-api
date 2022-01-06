import { Module } from '@nestjs/common';
import { WarehourseTypeService } from './warehourse-type.service';
import { WarehourseTypeController } from './warehourse-type.controller';

@Module({
  controllers: [WarehourseTypeController],
  providers: [WarehourseTypeService]
})
export class WarehourseTypeModule {}
