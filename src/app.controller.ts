import {Controller, Get} from "@nestjs/common";
import {AppService} from "./app.service";

@Controller('migration')
export class AppController {
  constructor(private readonly service: AppService) {
  }

  @Get('salariesv2')
  async salariesv2() {
    return this.service.salariesv2();
  }

  @Get('allowance')
  async allowance() {
    return this.service.allowance();
  }

  @Get('overtime-settings')
  async overtimeSetting() {
    return this.service.overtimeSetting();
  }

  @Get('overtime')
  async overtime() {
    return this.service.overtime();
  }

  @Get('overtime-template')
  async overtimeTemplate() {
    return this.service.overtimeTemplate();
  }

  @Get('absent')
  async absent() {
    return this.service.absent();
  }

  @Get('dayoff')
  async dayoff() {
    return this.service.dayoff();
  }

  @Get('dayoff')
  async duduction() {
    return this.service.duduction();
  }

  @Get('remote')
  async remote() {
    return this.service.remote();
  }
}
