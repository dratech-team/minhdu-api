import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {BaseDocument} from "../../core/entities/base.entity";
import {ObjectId} from "mongodb";

@Schema()
export class ISalaryEntity {
  @Prop()
  title?: string;

  @Prop()
  price?: number;

  @Prop()
  note?: string;
}

export const ISalarySchema = SchemaFactory.createForClass(ISalaryEntity);
