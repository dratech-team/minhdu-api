import {SearchBaseDto} from "../../../../common/dtos/search-base.dto";
import {IsDate, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";
import {EggType} from "@prisma/client";

export class SearchEggDto extends SearchBaseDto {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  readonly startedAt: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  readonly endedAt: Date;

  @IsOptional()
  @IsString()
  readonly eggType: string;
}
