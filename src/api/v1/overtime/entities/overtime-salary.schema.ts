import {Document} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {OvertimeType} from "../overtime-type.enum";
import {ISalary} from "../../../../common/entities/isalary.entity";

export type OvertimeSalaryDocument = Document & OvertimeSalaryEntity;

@Schema()
export class OvertimeSalaryEntity extends ISalary {
  @Prop()
  type: OvertimeType;

  @Prop()
  times: number;

  @Prop({required: false})
  rate: number;
}

export const OvertimeSalarySchema = SchemaFactory.createForClass(
  OvertimeSalaryEntity
);
