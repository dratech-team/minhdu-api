import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { IUser } from "../../../../common/entities/user.entity";

export type UserDocument = UserEntity & Document;

@Schema()
export class UserEntity extends IUser {}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
