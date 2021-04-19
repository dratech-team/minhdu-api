import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Document } from "mongoose";

export type SalaryDocument = Salary & Document;

@Schema()
export class Salary {
  @Prop()
  basic: string;
}

export const SalaryEntity = SchemaFactory.createForClass(Salary);
