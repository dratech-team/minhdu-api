import {Document} from "mongoose";
import {Schema, SchemaFactory} from "@nestjs/mongoose";
import {ISalary} from "../../../../../../common/entities/salary.entity";

export type LoanSalaryDocument = Document & LoanSalaryEntity;

@Schema()
export class LoanSalaryEntity extends ISalary {
}

export const LoanSalarySchema = SchemaFactory.createForClass(LoanSalaryEntity);
