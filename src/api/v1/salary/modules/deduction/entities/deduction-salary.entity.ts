import { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ISalary } from "../../../../../../common/entities/salary.entity";
import { AbsentType } from "../absent-type.enum";

export type DeductionSalaryDocument = Document & DeductionSalary;

@Schema()
export class DeductionSalary extends ISalary {
  @Prop()
  type: AbsentType;

  @Prop()
  times: number;
}

export const DeductionSalaryEntity = SchemaFactory.createForClass(
  DeductionSalary
);
