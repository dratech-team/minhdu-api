import {IsMongoId, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";
import {ObjectId} from "mongodb";

export class UpdatePositionDto {
  @IsString()
  @IsOptional()
  readonly position: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  readonly wordDay: number;

  @Type(() => ObjectId)
  @IsOptional()
  @IsMongoId()
  readonly departmentId: ObjectId;
}
