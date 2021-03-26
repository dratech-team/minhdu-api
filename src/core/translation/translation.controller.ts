import {
  Controller,
  Get,
  Param,
  UseGuards,
  Post,
  Body,
  Query,
} from '@nestjs/common'
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger'
import { TranslationService } from './translation.service'
import { ApiKeyGuard } from 'src/common/guards'
import { HelperService } from 'src/common/services'
import { Roles } from 'src/common/decorators'
import { ROLE_TYPE } from 'src/common/role/constants'
import { ITranslation } from './interfaces'
import { USER_TYPE } from '../user/constants'

@ApiTags('v1/translation')
@ApiBearerAuth()
@Controller('v1/translation')
@UseGuards(ApiKeyGuard)
export class TranslationController {

  constructor(
    private readonly translationService: TranslationService,
  ) { }

  @Roles(USER_TYPE.ADMIN)
  @Post('set-up')
  @ApiOperation({
    summary: 'Setup translation - Admin',
  })
  @ApiOkResponse({
    type: Object,
    description: 'Setup translation sucessfully!',
  })
  async setUpTranslations(): Promise<ITranslation[]> {
    return this.translationService.setUpTranslations()
  }

}
