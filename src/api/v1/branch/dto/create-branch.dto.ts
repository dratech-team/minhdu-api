import {IsMongoId, IsNotEmpty, IsString} from "class-validator";
import {ObjectId} from "mongodb";

export class CreateBranchDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsMongoId()
  areaId: ObjectId;
}
