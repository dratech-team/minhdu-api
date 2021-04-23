import {Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";
import {ISalary} from "../../../../common/entities/isalary.entity";

export type BasicSalaryDocument = Document & BasicSalaryEntity;

@Schema()
export class BasicSalaryEntity extends ISalary {
}

export const BasicSalarySchema = SchemaFactory.createForClass(BasicSalaryEntity);
