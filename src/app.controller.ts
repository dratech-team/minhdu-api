import { Controller, Get, Render, Response } from "@nestjs/common";
import { AppService } from "./app.service";
import { ConfigService } from "@/config/config.service";
import { Response as ExpressResponse } from "express";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService
  ) {}

  @Get()
  @Render("home")
  async getHome(@Response() response: ExpressResponse): Promise<any> {
    return this.configService.homeConfig;
  }
}
