import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  birthday: string;

  @Prop()
  position: string;

  ///TODO:

  @Prop()
  createdAt: Date;
}
