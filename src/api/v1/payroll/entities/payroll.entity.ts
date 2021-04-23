import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

import {Document} from "mongoose";
import {ObjectId} from "mongodb";
import {BaseDocument} from "../../../../core/entities/base.entity";

export type PayrollDocument = PayrollEntity & Document;

@Schema()
export class PayrollEntity extends BaseDocument {
}

export const PayrollSchema = SchemaFactory.createForClass(PayrollEntity);
