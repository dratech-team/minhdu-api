import { Prop, Schema } from "@nestjs/mongoose";
import { BaseSchema } from "@/schema/base.schema";

@Schema()
export class ISalary extends BaseSchema {
  @Prop()
  title: string;

  @Prop()
  amount: number;
}
