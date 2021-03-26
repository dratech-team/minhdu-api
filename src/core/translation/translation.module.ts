import { Module } from '@nestjs/common'
import { TranslationService } from './translation.service'
import { TranslationController } from './translation.controller'
import { CommonModule } from 'src/common/common.module'
import { LanguageModule } from '../language/language.module'
import { ConfigModule } from 'src/config/config.module'
import { TranslationAggregationService } from './services'

@Module({
  imports: [
    CommonModule,
    LanguageModule,
    ConfigModule,
  ],
  providers: [
    TranslationService,
    TranslationAggregationService
  ],
  exports: [
    TranslationService,
  ],
  controllers: [
    TranslationController,
  ],
})
export class TranslationModule { }
