import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { IUser } from "../../../../common/entities/user.schema";

export type UserDocument = User & Document;

@Schema()
export class User extends IUser {}

export const UserSchema = SchemaFactory.createForClass(User);
