import {Document} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {OvertimeType} from "../overtime-type.enum";
import {ISalaryEntity} from "../../../../common/entities/isalary.entity";

export type OvertimeSalaryDocument = Document & OvertimeSalaryEntity;

@Schema()
export class OvertimeSalaryEntity extends ISalaryEntity {
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
