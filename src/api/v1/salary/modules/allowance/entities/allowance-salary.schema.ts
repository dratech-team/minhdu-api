import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { ISalary } from "../../../../../../common/entities/salary.schema";

export type AllowanceSalaryDocument = Document & AllowanceSalary;

@Schema()
export class AllowanceSalary extends ISalary {}

export const AllowanceSalarySchema = SchemaFactory.createForClass(
  AllowanceSalary
);
