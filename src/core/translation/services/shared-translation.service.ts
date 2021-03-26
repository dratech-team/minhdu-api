import { Injectable } from "@nestjs/common";
import { DefaultLanguageService } from "./default-language.service";
import { MyLoggerService } from "@/services/mylogger.service";
import { InjectModel } from "@nestjs/mongoose";
import { ModelName } from "@/constants/database.constant";
import { Model } from "mongoose";
import { LANGUAGE } from "@/constants/language.constant";
import { ITranslation } from "@/translation/interfaces/translation.interface";

@Injectable()
export class SharedTranslationService {
  protected readonly logger: MyLoggerService = new MyLoggerService(
    this.constructor.name
  );

  constructor(
    private readonly defaultLanguageService: DefaultLanguageService,
    @InjectModel(ModelName.TRANSLATION)
    public readonly translationModel: Model<ITranslation>
  ) {}

  async getTranslation(
    key: string,
    language?: LANGUAGE,
    params = {}
  ): Promise<ITranslation> {
    if (!language) {
      language = await this.defaultLanguageService.getDefaultLanguage();
    }

    let translation = await this.translationModel.findOne({
      key,
      language,
    });
    if (translation) {
      translation.text = this.replaceParams(translation.text, params);
      return translation;
    }

    // Get translation in default language
    const defaultLanguage = await this.defaultLanguageService.getDefaultLanguage();
    translation = await this.translationModel.findOne({
      key,
      language: defaultLanguage,
    });
    if (translation) {
      translation.text = this.replaceParams(translation.text, params);
      return translation;
    }

    this.logger.warn(`Translation ${key} not found`);
    return {
      key,
      text: key,
      language,
    } as ITranslation;
  }

  private replaceParams(text: string, params = {}): string {
    let rs = text;
    Object.keys(params).forEach((key) => {
      rs = rs.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), params[key]);
    });
    return rs;
  }

  async getTranslatedText(
    key: string,
    language?: LANGUAGE,
    params = {}
  ): Promise<string> {
    const translation = await this.getTranslation(key, language, params);
    return translation?.text;
  }
}
