import {
  Injectable,
} from '@nestjs/common'
import { DEFAULT_LANGUAGE, LANGUAGE } from 'src/api/language/constants'

import { ModelService } from 'src/common/mongodb/model.service'
import { MyLoggerService } from 'src/common/services/mylogger.service'

@Injectable()
export class DefaultLanguageService {

  protected readonly logger: MyLoggerService = new MyLoggerService(
    this.constructor.name,
  )

  public currentDefaultLanguageCode: LANGUAGE = DEFAULT_LANGUAGE
  private languageModel = this.modelService.languageModel

  constructor(
    public readonly modelService: ModelService,
  ) {
    this.getDefaultLanguage()
  }

  async getDefaultLanguage(): Promise<LANGUAGE> {
    if (this.currentDefaultLanguageCode) return this.currentDefaultLanguageCode

    let defaultLanguage = await this.languageModel.findOne({ isDefault: true })
    if (!defaultLanguage) {
      defaultLanguage = await this.languageModel.findOneAndUpdate(
        { code: DEFAULT_LANGUAGE },
        {
          $set: { isDefault: true }
        },
        { new: true }
      )
    }
    this.currentDefaultLanguageCode = defaultLanguage?.code as LANGUAGE || DEFAULT_LANGUAGE
    return this.currentDefaultLanguageCode
  }

}
