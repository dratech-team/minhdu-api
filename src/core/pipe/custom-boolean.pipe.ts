import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from '@nestjs/common';
import {isNumber} from "class-validator";

@Injectable()
export class CustomParseBooleanPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value !== undefined && value) {
      if (!isNumber(+value)) {
        throw new BadRequestException("value Không đúng định dạng 0 | 1");
      }
      if (+value === 1) {
        return true;
      } else if (+value === 0) {
        return false;
      } else {
        return undefined;
      }
    }
    return undefined;
  }
}
