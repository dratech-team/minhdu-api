import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";
import {ISalaryEntity} from "../../../../common/entities/isalary.entity";

export type BasicSalaryDocument = Document & BasicSalaryEntity;

@Schema()
export class BasicSalaryEntity extends ISalaryEntity {
  @Prop({type: String, default: "Lương cơ bản"})
  title: string;

  @Prop({type: Number, default: 3300000})
  price: number;
}

export const BasicSalarySchema = SchemaFactory.createForClass(BasicSalaryEntity);