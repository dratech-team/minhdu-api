import {Document} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {ISalary} from "../../../../../../common/entities/salary.entity";
import {AbsentType} from "../absent-type.enum";

export type DeductionSalaryDocument = Document & DeductionSalaryEntity;

@Schema()
export class DeductionSalaryEntity extends ISalary {
  @Prop()
  type: AbsentType;

  @Prop()
  times: number;
}

export const DeductionSalarySchema = SchemaFactory.createForClass(
  DeductionSalaryEntity
);