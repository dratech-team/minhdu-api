import { Document } from "mongoose";
import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { ISalary } from "../../../../../../common/entities/salary.schema";

export type LoanSalaryDocument = Document & LoanSalary;

@Schema()
export class LoanSalary extends ISalary {}

export const LoanSalarySchema = SchemaFactory.createForClass(LoanSalary);
