import { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ISalary } from "../../../../../../common/schemas/salary.schema";

export type OvertimeSalaryDocument = Document & OvertimeSalary;

@Schema()
export class OvertimeSalary extends ISalary {
  @Prop()
  type: OvertimeType;

  @Prop()
  times: number;
}

export const OvertimeSalarySchema = SchemaFactory.createForClass(
  OvertimeSalary
);
