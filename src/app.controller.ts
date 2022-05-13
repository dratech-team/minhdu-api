import {Controller, Get} from "@nestjs/common";
import {AppService} from "./app.service";

@Controller('migration')
export class AppController {
  constructor(private readonly service: AppService) {
  }

  @Get('salariesv2')
  async salariesv2(): Promise<any> {
    return this.service.salariesv2();
  }
}
