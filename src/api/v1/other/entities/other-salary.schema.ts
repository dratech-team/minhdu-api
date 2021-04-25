import {Document} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {ISalaryEntity} from "../../../../common/entities/isalary.entity";
import {OtherType} from "../other-type.enum";

export type OtherSalaryDocument = Document & OtherSalaryEntity;

@Schema()
export class OtherSalaryEntity extends ISalaryEntity {
  @Prop()
  type: OtherType;
}

export const OtherSalarySchema = SchemaFactory.createForClass(OtherSalaryEntity);
