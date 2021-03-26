export const TWILIO_CLIENT = "TWILIO_CLIENT";

export const TWILIO_MODEL = "TWILIO_MODEL";

// Discriminators
export const TWILIO_VALIDATION_SMS_MODEL = "TWILIO_VALIDATION_SMS_MODEL";
export const TWILIO_OTP_SMS_MODEL = "TWILIO_OTP_SMS_MODEL";

export enum TWILIO_SMS_STATUS {
  CREATED = "created",
  VALIDATED = "validated",
  EXPIRED = "expired",
  LIMIT_REACH = "limit-reached",
  RESENT = "resent",
}

export const TWILIO_STATUS_LIST = Object.values(TWILIO_SMS_STATUS);

export enum TWILIO_SMS_TYPE {
  VALIDATE = "ValidationSms",
  OTP = "OTPSms",
}

export const TWILIO_SMS_TYPE_LIST = Object.values(TWILIO_SMS_TYPE);

export const SMS_DISCRIMINATOR_KEY = "smsType";

export type TWILIO_SMS_ERROR_TYPE =
  | "WRONG_CODE"
  | "EXPIRED"
  | "VALIDATED"
  | "NOT_FOUND"
  | "SEND_FAIL"
  | "LIMIT_REACH"
  | "ALREADY_RESENT";
