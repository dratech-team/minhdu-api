import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

@Schema()
export class SalaryEntity {
  @Prop({unique: true})
  title?: string;

  @Prop()
  price?: number;

  @Prop()
  note?: string;
}

export const SalarySchema = SchemaFactory.createForClass(SalaryEntity);
