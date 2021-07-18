import { CreatePaymentHistoryDto } from './create-payment-history.dto';
import {PartialType} from "@nestjs/mapped-types";

export class UpdatePaymentHistoryDto extends PartialType(CreatePaymentHistoryDto) {}
