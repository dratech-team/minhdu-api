import {CreateWorkHistoryDto} from './create-work-history.dto';
import {PartialType} from "@nestjs/mapped-types";

export class UpdateWorkHistoryDto extends PartialType(CreateWorkHistoryDto) {
}
