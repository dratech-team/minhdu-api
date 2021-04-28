import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {OvertimeEnum} from "../enum/overtime.enum";

@Schema({autoIndex: true})
export class OvertimeEntity {
  @Prop({unique: true})
  title: string;

  @Prop()
  type: OvertimeEnum;

  @Prop()
  times: number;

  @Prop({default: 1})
  rate: number;

  @Prop()
  note: string;
}

export const OvertimeSchema = SchemaFactory.createForClass(OvertimeEntity);