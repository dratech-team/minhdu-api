import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Document } from "mongoose";

export type BasicSalaryDocument = Document & BasicSalary;

@Schema()
export class BasicSalary {
  @Prop()
  title: string;

  @Prop()
  amount: number;
}

export const BasicSalarySchema = SchemaFactory.createForClass(BasicSalary);
