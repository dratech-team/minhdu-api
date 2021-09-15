import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from '@nestjs/common';
import {isDate} from "moment";

@Injectable()
export class ParseDatetimePipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (value) {
      if (!isDate(value)) {
        throw new BadRequestException("createAt Không đúng định dạng datetime");
      }
      return new Date(value);
    }
    return undefined;
  }
}
