import {PartialType} from '@nestjs/swagger';
import {CreateRemoteDto} from './create-remote.dto';

export class UpdateRemoteDto extends PartialType(CreateRemoteDto) {

}
