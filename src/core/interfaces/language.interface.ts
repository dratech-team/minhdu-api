import { ICustomDocument } from "@/interfaces/mongodb.interface";

export interface ILanguage extends ICustomDocument {
  name: string;
  code: string;
  flagUrl: string;
  isDefault: boolean;
  isActive: boolean;
}
