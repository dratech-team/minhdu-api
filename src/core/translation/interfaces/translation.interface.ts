import { ICustomDocument } from "@/interfaces/mongodb.interface";

export interface ITranslation extends ICustomDocument {
  key: string;
  text: string;
  language: string;
  description: string;
  isMobile: boolean;
}
