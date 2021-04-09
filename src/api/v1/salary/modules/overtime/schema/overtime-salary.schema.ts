import { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ISalary } from "../../../../../../common/schemas/salary.schema";
import { OvertimeType } from "../overtime-type.enum";

export type OvertimeSalaryDocument = Document & OvertimeSalary;

@Schema()
export class OvertimeSalary extends ISalary {
  @Prop()
  type: OvertimeType;

  @Prop()
  times: number;

  @Prop({ required: false })
  rate: number;
}

export const OvertimeSalarySchema = SchemaFactory.createForClass(
  OvertimeSalary
);
