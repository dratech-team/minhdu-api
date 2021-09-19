import {ArgumentMetadata, Injectable, PipeTransform} from '@nestjs/common';

@Injectable()
export class ParseDatetimePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {

    if (value) {
      // if (!(typeof (value as any).getMonth === 'function')) {
      //   console.log(value);
      //   throw new BadRequestException("Không đúng định dạng datetime");
      // }
      return new Date(value);
    } else {
      return undefined;
    }
  }
}
