import {BaseDocument} from "../../../../core/entities/base.entity";
import {Prop, Schema} from "@nestjs/mongoose";

@Schema()
export class Branch extends BaseDocument {
  @Prop()
  code: string;

  @Prop()
  branch: string;
}
