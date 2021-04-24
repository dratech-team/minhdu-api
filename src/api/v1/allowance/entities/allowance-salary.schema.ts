import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { ISalaryEntity } from "../../../../common/entities/isalary.entity";

export type AllowanceSalaryDocument = Document & AllowanceSalaryEntity;

@Schema()
export class AllowanceSalaryEntity extends ISalaryEntity {}

export const AllowanceSalarySchema = SchemaFactory.createForClass(
  AllowanceSalaryEntity
);
