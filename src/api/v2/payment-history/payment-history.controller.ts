import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards
} from "@nestjs/common";
import { Role } from "@prisma/client";
import { Roles } from "src/core/decorators/roles.decorator";
import { ApiKeyGuard } from "src/core/guard/api-key-auth.guard";
import { JwtAuthGuard } from "src/core/guard/jwt-auth.guard";
import { RolesGuard } from "src/core/guard/role.guard";
import { UpdatePaymentHistoryDto } from "./dto/update-payment-history.dto";
import { PaymentHistoryService } from "./payment-history.service";

// @UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller("v2/payment-history")
export class PaymentHistoryController {
  constructor(private readonly paymentHistoryService: PaymentHistoryService) {}

  // @Roles(Role.ADMIN, Role.HUMAN_RESOURCE)
  @Get()
  findAll(
    @Query("customerId") customerId: number,
    @Query("skip") skip: number,
    @Query("take") take: number
  ) {
    return this.paymentHistoryService.findAll(+customerId, +skip, +take);
  }

  // @Roles(Role.ADMIN, Role.HUMAN_RESOURCE)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.paymentHistoryService.findOne(+id);
  }

  // @Roles(Role.ADMIN, Role.HUMAN_RESOURCE)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updatePaymentHistoryDto: UpdatePaymentHistoryDto
  ) {
    return this.paymentHistoryService.update(+id, updatePaymentHistoryDto);
  }

  // @Roles(Role.ADMIN, Role.HUMAN_RESOURCE)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.paymentHistoryService.remove(+id);
  }
}
