import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

import * as mongoose from "mongoose";
import {Document} from "mongoose";
import {BaseDocument} from "../../../../core/entities/base.entity";
import {ObjectId} from "mongodb";
import {SalaryEntity} from "../../../../common/entities/salaryEntity";
import {OvertimeEntity, OvertimeSchema} from "./overtime.entity";
import {DeductionEntity, DeductionSchema} from "./deduction.entity";
import * as mongoosePaginate from "mongoose-paginate";

export type PayrollDocument = PayrollEntity & Document;

@Schema({autoIndex: true})
export class PayrollEntity extends BaseDocument {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: "Employee"})
  employeeId: ObjectId;

  @Prop({unique: true})
  basics: SalaryEntity[];

  @Prop({unique: true})
  allowances: SalaryEntity[]

  @Prop({type: OvertimeSchema, unique: true})
  overtimes: OvertimeEntity[]

  @Prop({unique: true})
  loans: SalaryEntity[];

  @Prop({type: DeductionSchema, unique: true})
  deductions: DeductionEntity[];

  @Prop({unique: true})
  others: SalaryEntity[];

  @Prop({type: Boolean, default: true})
  isEdit: boolean;

  @Prop({default: null})
  confirmedAt: Date;

  @Prop({default: null})
  paidAt: Date;
}

export const PayrollSchema = SchemaFactory.createForClass(PayrollEntity).plugin(mongoosePaginate);

export const Payroll = mongoose.model('payrolls', PayrollSchema);