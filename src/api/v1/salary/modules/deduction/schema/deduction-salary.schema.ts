import { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ISalary } from "../../../../../../common/schemas/salary.schema";
import { AbsentType } from "../absent-type.enum";

export type DeductionSalaryDocument = Document & DeductionSalary;

@Schema()
export class DeductionSalary extends ISalary {
  @Prop()
  type: AbsentType;

  @Prop()
  times: number;
}

export const DeductionSalarySchema = SchemaFactory.createForClass(
  DeductionSalary
);
