import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { ISalary } from "../../../../../../common/entities/salary.entity";

export type AllowanceSalaryDocument = Document & AllowanceSalaryEntity;

@Schema()
export class AllowanceSalaryEntity extends ISalary {}

export const AllowanceSalarySchema = SchemaFactory.createForClass(
  AllowanceSalaryEntity
);
