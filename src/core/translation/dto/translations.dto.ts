import { ITranslation } from "@/translation/interfaces/translation.interface";

export class ImportTranslationMobileRequestDto {
  [key: string]: string;
}

export class ImportTranslationMobileResponseDto {
  results: ITranslation[];
}

export class GetTranslationMobileResponsePageLoad extends ImportTranslationMobileRequestDto {}
