import { Module } from '@nestjs/common';
import { OvertimeService } from './overtime.service';
import { OvertimeController } from './overtime.controller';
import {ConfigModule} from "../../../../core/config/config.module";

@Module({
  imports: [ConfigModule],
  controllers: [OvertimeController],
  providers: [OvertimeService]
})
export class OvertimeModule {}
