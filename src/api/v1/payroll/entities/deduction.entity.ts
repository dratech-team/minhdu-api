import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {DeductionEnum} from "../enum/deduction.enum";

@Schema({autoIndex: true})
export class DeductionEntity {
  @Prop({unique: true})
  title: string;

  @Prop()
  type: DeductionEnum;

  @Prop()
  times: number;

  @Prop()
  note: string;
}

export const DeductionSchema = SchemaFactory.createForClass(DeductionEntity);