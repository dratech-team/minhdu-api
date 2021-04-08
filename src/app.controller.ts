import { Controller, Get, Render, Response } from "@nestjs/common";
import { AppService } from "./app.service";
import { Response as ExpressResponse } from "express";
import { ConfigService } from "@/core/config/config.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService
  ) {}

  @Get()
  @Render("home")
  async getHome(@Response() response: ExpressResponse): Promise<any> {
    return this.appService.getHello();
  }
}
