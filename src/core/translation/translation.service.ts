import { Injectable } from "@nestjs/common";

import {
  SharedTranslationService,
  TranslationAggregationService,
} from "./services";
import { MyLoggerService } from "@/services/mylogger.service";
import { LANGUAGE } from "@/constants/language.constant";
import { ErrorService } from "@/services/error.service";
import { ITranslation } from "@/translation/interfaces/translation.interface";
import { ModelName } from "@/constants/database.constant";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ILanguage } from "@/interfaces/language.interface";
import { DEFAULT_CONSTANTS } from "@/constants/default.constant";
import { VI_TRANSLATION } from "../../constants/vi.translation";
import { EN_TRANSLATION } from "../../constants/en.translation";

@Injectable()
export class TranslationService {
  protected readonly logger: MyLoggerService = new MyLoggerService(
    this.constructor.name
  );

  private LANGUAGES = [LANGUAGE.EN, LANGUAGE.VI];

  constructor(
    private readonly errorService: ErrorService,
    private readonly sharedTranslationService: SharedTranslationService,
    private readonly translationAggregationService: TranslationAggregationService,
    @InjectModel(ModelName.TRANSLATION)
    public readonly translationModel: Model<ITranslation>,
    @InjectModel(ModelName.LANGUAGE)
    public readonly languageModel: Model<ILanguage>
  ) {}

  async updateTranslation(translation: ITranslation): Promise<ITranslation> {
    const existedTranslation = await this.translationModel.findOne({
      key: translation.key,
      language: translation.language,
    });
    if (existedTranslation) {
      return this.translationModel.findOneAndUpdate(
        {
          _id: existedTranslation._id,
        },
        {
          $set: translation,
        }
      );
    } else {
      return this.translationModel.create(translation);
    }
  }

  async getAllTranslations(): Promise<ITranslation[]> {
    return this.translationModel.find();
  }

  async deleteAllLanguages(): Promise<void> {
    await this.languageModel.deleteMany({});
  }

  async addLanguages(languages: ILanguage[]): Promise<ILanguage[]> {
    return Promise.all(
      languages.map(async (language) => this.languageModel.create(language))
    );
  }

  async deleteAllTranslations(): Promise<void> {
    await this.translationModel.deleteMany({});
  }

  async insertTranslations(
    translations: ITranslation[]
  ): Promise<ITranslation[]> {
    return this.translationModel.insertMany(translations);
  }

  async updateTranslations(translations: ITranslation[]): Promise<void> {
    await Promise.all(
      translations.map(async (translation) => {
        const condition = {
          key: translation.key,
          language: translation.language,
        };
        const _translation = await this.translationModel.findOne(condition);
        if (_translation) {
          await this.translationModel.updateOne(
            {
              key: translation.key,
              language: translation.language,
            },
            {
              $set: {
                text: translation.text,
                description: translation.description,
              } as ITranslation,
            }
          );
        } else {
          await this.translationModel.create({
            key: translation.key,
            language: translation.language,
            text: translation.text,
            description: translation.description,
            isMobile: !!translation.isMobile,
          } as ITranslation);
        }
      })
    );
  }

  async deleteTranslations(key: string): Promise<void> {
    await this.translationModel.deleteMany({ key });
  }

  async checkNotExistTranslation(key: string): Promise<boolean> {
    const count = await this.translationModel.find({ key }).countDocuments();
    if (count > 0) {
      await this.errorService.throwErrorExistedTranslationKey(key);
      return true;
    }
    return false;
  }

  async checkExistTranslation(
    key: string,
    language: LANGUAGE = LANGUAGE.EN
  ): Promise<boolean> {
    const count = await this.translationModel.find({ key }).countDocuments();
    if (count > 0) {
      return true;
    }
    await this.errorService.throwErrorNotExistedTranslationKey(key);
    return false;
  }

  async getTranslation(
    key: string,
    language?: LANGUAGE,
    params = {}
  ): Promise<ITranslation> {
    return this.sharedTranslationService.getTranslation(key, language, params);
  }

  async getTranslatedText(
    key: string,
    language?: LANGUAGE,
    params = {}
  ): Promise<string> {
    return this.sharedTranslationService.getTranslatedText(
      key,
      language,
      params
    );
  }

  async getUniqueTranslationKeys(): Promise<string[]> {
    return this.translationModel.find().distinct("key");
  }

  async getTranslationsByKey(translationKey: string): Promise<ITranslation[]> {
    return this.translationModel.find({
      key: translationKey,
    });
  }

  async setUpTranslations(): Promise<ITranslation[]> {
    await this.deleteAllTranslations();
    const en = await this.insertTranslations(
      this.convertJsonToTranslation(LANGUAGE.EN, EN_TRANSLATION, [])
    );
    const fr = await this.insertTranslations(
      this.convertJsonToTranslation(LANGUAGE.FR, VI_TRANSLATION, [])
    );
    return [...en, ...fr];
  }

  // Recursive
  // Convert JSON format to ITranslation
  public convertJsonToTranslation(
    language: LANGUAGE,
    value: any,
    parents: string[] = []
  ): ITranslation[] {
    if (typeof value === "string") {
      return [
        {
          key: `${parents.join(".")}`,
          text: value,
          language,
        } as ITranslation,
      ];
    }
    return [].concat.apply(
      [],
      Object.keys(value).map((subKey) => {
        return this.convertJsonToTranslation(language, value[subKey], [
          ...parents,
          subKey,
        ]);
      })
    ) as ITranslation[];
  }

  async getTranslationsPageLoad(
    skip: number = 0,
    limit: number = DEFAULT_CONSTANTS.DEFAULT_LIMIT_GET_TRANSLATIONS_IN_ADMIN,
    searchKey?: string
  ): Promise<ITranslation[]> {
    return this.translationModel.aggregate(
      this.translationAggregationService.getTranslationsPageLoadQuery(
        skip,
        limit,
        searchKey,
        false
      )
    );
  }
}
