import {Controller, Get} from "@nestjs/common";

@Controller()
export class AppController {
  constructor() {
  }

  @Get()
  async find(): Promise<any> {
    return 'Hello world api v2';
  }
}
