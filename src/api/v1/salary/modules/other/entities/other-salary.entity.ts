import { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ISalary } from "../../../../../../common/entities/salary.entity";
import { OtherType } from "../other-type.enum";

export type OtherSalaryDocument = Document & OtherSalary;

@Schema()
export class OtherSalary extends ISalary {
  @Prop()
  type: OtherType;
}

export const OtherSalaryEntity = SchemaFactory.createForClass(OtherSalary);
