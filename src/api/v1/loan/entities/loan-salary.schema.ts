import {Document} from "mongoose";
import {Schema, SchemaFactory} from "@nestjs/mongoose";
import {ISalaryEntity} from "../../../../common/entities/isalary.entity";

export type LoanSalaryDocument = Document & LoanSalaryEntity;

@Schema()
export class LoanSalaryEntity extends ISalaryEntity {
}

export const LoanSalarySchema = SchemaFactory.createForClass(LoanSalaryEntity);
