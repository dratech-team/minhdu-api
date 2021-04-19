import { Document } from "mongoose";
import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { ISalary } from "../../../../../../common/entities/salary.entity";

export type LoanSalaryDocument = Document & LoanSalary;

@Schema()
export class LoanSalary extends ISalary {}

export const LoanSalaryEntity = SchemaFactory.createForClass(LoanSalary);
