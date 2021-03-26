import { Schema } from "mongoose";
import { tossInitSchema } from "@/schema/base.schema";
import { ModelName } from "@/constants/database.constant";

/**
 * Indices:
 *  key
 *  language
 */
export const TranslationSchema = new Schema({
  key: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
    default: "",
  },
  isMobile: {
    type: Boolean,
    default: false,
  },
});

tossInitSchema(TranslationSchema, ModelName.TRANSLATION);
