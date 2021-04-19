import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Document } from "mongoose";

export type SalaryDocument = SalaryEntity & Document;

@Schema()
export class SalaryEntity {
  @Prop()
  basic: string;
}

export const SalarySchema = SchemaFactory.createForClass(SalaryEntity);
