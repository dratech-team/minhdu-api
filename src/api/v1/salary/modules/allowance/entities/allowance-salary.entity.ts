import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { ISalary } from "../../../../../../common/entities/salary.entity";

export type AllowanceSalaryDocument = Document & AllowanceSalary;

@Schema()
export class AllowanceSalary extends ISalary {}

export const AllowanceSalaryEntity = SchemaFactory.createForClass(
  AllowanceSalary
);
