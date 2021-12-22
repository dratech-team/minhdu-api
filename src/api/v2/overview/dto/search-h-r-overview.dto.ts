import {OverviewFilterEnum} from "../entities/overview-filter.enum";
import {IsBoolean, IsEnum, IsNotEmpty} from "class-validator";
import {Type} from "class-transformer";

export class SearchHROverviewDto {
  @IsNotEmpty()
  @IsEnum(OverviewFilterEnum)
  readonly filter: OverviewFilterEnum;

  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  readonly isLeft: boolean;
}
