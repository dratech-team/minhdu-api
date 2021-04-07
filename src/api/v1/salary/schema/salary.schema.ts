import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Document } from "mongoose";

export type SalaryDocument = Salary & Document;

@Schema()
export class Salary {
  @Prop()
  basic: string;
}

export const SalarySchema = SchemaFactory.createForClass(Salary);
