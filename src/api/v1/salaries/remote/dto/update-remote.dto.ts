import { PartialType } from '@nestjs/mapped-types';
import {CreateRemoteDto} from './create-remote.dto';

export class UpdateRemoteDto extends PartialType(CreateRemoteDto) {
}
