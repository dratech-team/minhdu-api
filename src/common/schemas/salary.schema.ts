import { Prop, Schema } from "@nestjs/mongoose";
import { BaseDocument } from "../../core/schema/base.schema";

@Schema()
export class ISalary extends BaseDocument {
  @Prop()
  title: string;

  @Prop()
  price: number;

  @Prop()
  note: string;
}
