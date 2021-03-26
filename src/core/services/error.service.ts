import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { ConfigService } from "@/config/config.service";
import { MyLoggerService } from "@/services/mylogger.service";
import { LANGUAGE } from "@/constants/language.constant";
import { ERROR_CODE } from "@/constants/error.constant";
import { SharedTranslationService } from "@/translation/services";
import { IError } from "@/interfaces/error.interface";
import { WebSocketException } from "@/exceptions/websocket.exception";
import { USER_TYPE } from "@/constants/role-type.constant";
import { EMAIL_EXISTS } from "@/constants/email-exists.constant";
import { TWILIO_SMS_ERROR_TYPE } from "@/constants/twillio-sms.constant";

@Injectable()
export class ErrorService {
  protected readonly logger: MyLoggerService = new MyLoggerService(
    this.constructor.name
  );

  constructor(
    public readonly sharedTranslationService: SharedTranslationService,
    public readonly configService: ConfigService
  ) {}

  private async getTranslatedText(
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

  public async throwErrorCannotAddServiceWithThisCategorySinceYourStoreNotContainThisCategory(
    language: LANGUAGE
  ) {
    const message = await this.getTranslatedText(
      "ERROR.CANNOT_ADD_SERVICE_WITH_THIS_CATEGORY_SINCE_YOUR_STORE_NOT_CONTAIN_THIS_CATEGORY",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode:
          ERROR_CODE.CANNOT_ADD_SERVICE_WITH_THIS_CATEGORY_SINCE_YOUR_STORE_NOT_CONTAIN_THIS_CATEGORY,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwYourEmailAddressHasNotBeenVerifiedYet(language?: LANGUAGE) {
    const message = await this.getTranslatedText(
      "ERROR.YOUR_EMAIL_ADRESS_HAS_NOT_BEEN_VERIFIED_YET",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.YOUR_EMAIL_ADRESS_HAS_NOT_BEEN_VERIFIED_YET,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorProductNotFoundInCart(
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.PRODUCT_NOT_FOUND_IN_CART",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.PRODUCT_NOT_FOUND_IN_CART,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorCannotAcceptOrder(language?: LANGUAGE): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.CANNOT_ACCEPT_ORDER",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.CANNOT_ACCEPT_ORDER,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorTimeNotAvailable(language?: LANGUAGE): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.TIME_NOT_AVAILABLE",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.TIME_NOT_AVAILABLE,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorOutOfOrder(language?: LANGUAGE): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.OUT_OF_ORDER",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.OUT_OF_ORDER,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorDeliveryNotSupport(
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.DELIVERY_NOT_SUPPORT",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.DELIVERY_NOT_SUPPORT,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorInvalidProductId(language?: LANGUAGE): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.INVALID_PRODUCT_ID",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.INVALID_PRODUCT_ID,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorUnsupportVersion(language?: LANGUAGE): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.UNSUPPORT_VERSION",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.UNSUPPORT_VERSION,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorCannotRefuseOrder(language?: LANGUAGE): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.CANNOT_REFUSE_ORDER",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.CANNOT_REFUSE_ORDER,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorOfferTypeNotFound(language?: LANGUAGE): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.OFFER_TYPE_NOT_FOUND",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.OFFER_TYPE_NOT_FOUND,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorOfferNotFound(language?: LANGUAGE): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.OFFER_NOT_FOUND",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.OFFER_NOT_FOUND,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorOutOfDeliveryZone(language?: LANGUAGE): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.OUT_OF_DELIVERY_ZONE",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.OUT_OF_DELIVERY_ZONE,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorCannotUpdatePreparationDone(
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.CANNOT_UPDATE_PREPARATION_DONE",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.CANNOT_UPDATE_PREPARATION_DONE,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorCannotScanOrder(language?: LANGUAGE): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.CANNOT_SCAN_ORDER",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.CANNOT_SCAN_ORDER,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorCustomMessage(
    message: string,
    statusCode: ERROR_CODE
  ): Promise<void> {
    throw new HttpException(
      {
        message,
        statusCode,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorPleaseAddBankAccount(
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.PLEASE_ADD_BANK_ACCOUNT",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.PLEASE_ADD_BANK_ACCOUNT,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorInvalidCardRegistrationId(
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.INVALID_CARD_REGISTRATION_ID",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.INVALID_CARD_REGISTRATION_ID,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorServiceNotFound(language?: LANGUAGE): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.SERVICE_NOT_FOUND",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.SERVICE_NOT_FOUND,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorMangoProcessFailed(
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.MANGO_PROCESS_FAILED",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.MANGO_PROCESS_FAILED,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorOrderNotFound(language?: LANGUAGE): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.ORDER_NOT_FOUND",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.ORDER_NOT_FOUND,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwEmailTokenExpired(language?: LANGUAGE): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.VERIFICATION_TOKEN_EXPIRED",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.VERIFICATION_TOKEN_EXPIRED,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorSubCategoryIsRequired(
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.SUB_CATEGORY_IS_REQUIRED",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.SUB_CATEGORY_IS_REQUIRED,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorCannotDeleteImageInGallerySinceOnlyOneImageLeft(
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.CANNOT_DELETE_IMAGE_IN_GALLERY_SINCE_ONLY_ONE_IMAGE_LEFT",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode:
          ERROR_CODE.CANNOT_DELETE_IMAGE_IN_GALLERY_SINCE_ONLY_ONE_IMAGE_LEFT,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorInvalidResetPasswordCode(
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.INVALID_RESET_PASSWORD_CODE",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.INVALID_RESET_PASSWORD_CODE,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorCardNotFound(language?: LANGUAGE): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.CARD_NOT_FOUND",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.CARD_NOT_FOUND,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorMangoOperationsFailed(message: string): Promise<void> {
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.MANGO_PROCESS_FAILED,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorTransactionAmountIsHigherThanMaximumPermittedAmount(
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.TRANSACTION_AMOUNT_IS_HIGHER_THAN_MAXIMUM_PERMITTED_AMOUNT",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode:
          ERROR_CODE.TRANSACTION_AMOUNT_IS_HIGHER_THAN_MAXIMUM_PERMITTED_AMOUNT,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorTransactionAmountIsLowerThanMinimumPermittedAmount(
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.TRANSACTION_AMOUNT_IS_LOWER_THAN_MINIMUM_PERMITTED_AMOUNT",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode:
          ERROR_CODE.TRANSACTION_AMOUNT_IS_LOWER_THAN_MINIMUM_PERMITTED_AMOUNT,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorCardNotActive(language?: LANGUAGE): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.CARD_NOT_ACTIVE",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.CARD_NOT_ACTIVE,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorPaymentRequiredAuthentication(
    secureModeRedirectURL: string,
    orderIds: ObjectId[],
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.PAYMENT_REQUIRED_AUTHENTICATION",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.PAYMENT_REQUIRED_AUTHENTICATION,
        data: {
          secureModeRedirectURL,
          orderIds,
        },
      } as IError<any>,
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorMenuNotFound(language?: LANGUAGE): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.MENU_NOT_FOUND",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.MENU_NOT_FOUND,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorFormulaMenuNotFound(
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.FORMULA_MENU_NOT_FOUND",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.FORMULA_MENU_NOT_FOUND,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorFormulaNotFound(language?: LANGUAGE): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.FORMULA_NOT_FOUND",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.FORMULA_NOT_FOUND,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorFormulaComponentNotFound(
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.FORMULA_COMPONENT_NOT_FOUND",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.FORMULA_COMPONENT_NOT_FOUND,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorInvalidCategoryId(language?: LANGUAGE): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.INVALID_CATEGORY_ID",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.INVALID_CATEGORY_ID,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorInvalidPlaceId(language?: LANGUAGE): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.INVALID_PLACE_ID",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.INVALID_PLACE_ID,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorCannotAddProductWithThisCategorySinceYourStoreNotContainThisCategory(
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.CANNOT_ADD_PRODUCT_WITH_THIS_CATEGORY_SINCE_YOUR_STORE_DOES_NOT_CONTAIN_THIS_CATEGORY",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode:
          ERROR_CODE.CANNOT_ADD_PRODUCT_WITH_THIS_CATEGORY_SINCE_YOUR_STORE_DOES_NOT_CONTAIN_THIS_CATEGORY,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorNewPasswordMustBeDifferentFromOldPassword(
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.NEW_PASSWORD_MUST_BE_DIFFERENT_FROM_OLD_PASSWORD",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.NEW_PASSWORD_MUST_BE_DIFFERENT_FROM_OLD_PASSWORD,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorPlaceCategoryNotFound(language?: LANGUAGE) {
    const message = await this.getTranslatedText(
      "ERROR.PLACE_CATEGORY_NOT_FOUND",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.PLACE_CATEGORY_NOT_FOUND,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorPayInProcessFailed(language?: LANGUAGE) {
    const message = await this.getTranslatedText(
      "ERROR.PAY_IN_FAILED",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.PAY_IN_FAILED,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorTransferFailed(language?: LANGUAGE) {
    const message = await this.getTranslatedText(
      "ERROR.TRANSFER_FAILED",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.TRANSFER_FAILED,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorProductSizeNotFound(language?: LANGUAGE) {
    const message = await this.getTranslatedText(
      "ERROR.PRODUCT_SIZE_NOT_FOUND",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.PRODUCT_SIZE_NOT_FOUND,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorProductNotFound(language?: LANGUAGE) {
    const message = await this.getTranslatedText(
      "ERROR.PRODUCT_NOT_FOUND",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.PRODUCT_NOT_FOUND,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorPlaceSpecialityNotFound(language?: LANGUAGE) {
    const message = await this.getTranslatedText(
      "ERROR.PLACE_SPECIALITY_NOT_FOUND",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.PLACE_SPECIALITY_NOT_FOUND,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorEmailNotExist(language?: LANGUAGE): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.EMAIL_NOT_EXIST",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.EMAIL_NOT_EXIST,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorPayOutFailed(
    message: string,
    language?: LANGUAGE
  ): Promise<void> {
    throw new HttpException(
      {
        message: `Payout failed ! ${message}`,
        statusCode: ERROR_CODE.PAY_OUT_FAILED,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorAuthenticationWithGoogleFailed(
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.AUTHENTICATION_WITH_GOOGLE_FAILED",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.AUTHENTICATION_WITH_GOOGLE_FAILED,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorNextTokenNotFoundOrExpired(
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.NEXT_TOKEN_NOT_FOUND_OR_EXPIRED",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.NEXT_TOKEN_NOT_FOUND_OR_EXPIRED,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorTypeOfEstablishmentIsRequired(
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.TYPE_OF_ESTABLISHMENT_IS_REQUIRED_FOR_PUBLIC_ESTABLISHMENT",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode:
          ERROR_CODE.TYPE_OF_ESTABLISHMENT_IS_REQUIRED_FOR_PUBLIC_ESTABLISHMENT,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorWrongPassword(language?: LANGUAGE): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.AUTH_USER_WRONG_PASSWORD",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.AUTH_USER_WRONG_PASSWORD,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorInvalidImageId(
    imageId: ObjectId | string,
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.IMAGE_NOT_FOUND",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.IMAGE_NOT_FOUND,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorImageNotFound(
    imageId: ObjectId | string,
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.IMAGE_NOT_FOUND",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.IMAGE_NOT_FOUND,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorRefreshTokenNotExist(
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.REFRESH_TOKEN_NOT_EXIST",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.REFRESH_TOKEN_NOT_EXIST,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorRefreshTokenExpired(
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.REFRESH_TOKEN_EXPIRED",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.REFRESH_TOKEN_EXPIRED,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorInvalidRefreshToken(
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.INVALID_REFRESH_TOKEN",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.INVALID_REFRESH_TOKEN,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorRestrictedToken(
    language?: LANGUAGE,
    isSocket: boolean = false
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.RESTRICTED_TOKEN",
      language
    );
    if (isSocket) {
      throw new WebSocketException(message, ERROR_CODE.RESTRICTED_TOKEN);
    } else {
      throw new HttpException(
        {
          message,
          statusCode: ERROR_CODE.RESTRICTED_TOKEN,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  public async throwErrorTokenExpired(
    language?: LANGUAGE,
    isSocket: boolean = false
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.TOKEN_EXPIRED",
      language
    );
    if (isSocket) {
      throw new WebSocketException(message, ERROR_CODE.TOKEN_EXPIRED);
    } else {
      throw new HttpException(
        {
          message,
          statusCode: ERROR_CODE.TOKEN_EXPIRED,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  public async throwErrorInvalidToken(
    language?: LANGUAGE,
    isSocket: boolean = false
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.INVALID_TOKEN",
      language
    );
    if (isSocket) {
      throw new WebSocketException(message, ERROR_CODE.INVALID_TOKEN);
    } else {
      throw new HttpException(
        {
          message,
          statusCode: ERROR_CODE.INVALID_TOKEN,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  public async throwErrorInvalidCityId(
    cityId: string | ObjectId,
    language?: LANGUAGE,
    isSocket: boolean = false
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.INVALID_CITY_ID",
      language,
      {
        cityId,
      }
    );
    if (isSocket) {
      throw new WebSocketException(message, ERROR_CODE.INVALID_CITY_ID);
    } else {
      throw new HttpException(
        {
          message,
          statusCode: ERROR_CODE.INVALID_CITY_ID,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  public async throwErrorInvalidFacebookToken(
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.INVALID_FACEBOOK_TOKEN",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.INVALID_FACEBOOK_TOKEN,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorForbiddenResource(language?: LANGUAGE): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.FORBIDDEN_RESOURCE",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.FORBIDDEN_RESOURCE,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorWrongRole(
    userType: USER_TYPE,
    userTypes: USER_TYPE[],
    language?: LANGUAGE
  ): Promise<void> {
    // const message = await this.getTranslatedText(
    //   'ERROR.FORBIDDEN_RESOURCE',
    //   language,
    // )
    const message = `You are ${userType}, but this endpoint is only for ${userTypes.join(
      ","
    )}.`;
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.FORBIDDEN_RESOURCE,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorInvalidNextToken(
    nextToken: string | ObjectId,
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.INVALID_NEXT_TOKEN",
      language,
      {
        nextToken,
      }
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.INVALID_NEXT_TOKEN,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorUserAlreadyDeleted(
    language?: LANGUAGE,
    isSocket: boolean = false
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.YOUR_ACCOUNT_IS_DELETED",
      language
    );
    if (isSocket) {
      throw new WebSocketException(message, ERROR_CODE.YOUR_ACCOUNT_IS_DELETED);
    } else {
      throw new HttpException(
        {
          message,
          statusCode: ERROR_CODE.YOUR_ACCOUNT_IS_DELETED,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  public async throwErrorExistedTranslationKey(
    translationKey: string,
    language?: LANGUAGE
  ): Promise<void> {
    const translatedText = await this.getTranslatedText(
      "ERROR.EXISTED_TRANSLATION_KEY",
      language,
      {
        translationKey,
      }
    );
    throw new HttpException(
      {
        message: translatedText,
        statusCode: ERROR_CODE.EXISTED_TRANSLATION_KEY,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorNotExistedTranslationKey(
    translationKey: string,
    language?: LANGUAGE
  ): Promise<void> {
    const translatedText = await this.getTranslatedText(
      "ERROR.NOT_EXISTED_TRANSLATION_KEY",
      language,
      {
        translationKey,
      }
    );
    throw new HttpException(
      {
        message: translatedText,
        statusCode: ERROR_CODE.NOT_EXISTED_TRANSLATION_KEY,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorUserNotFound(
    userId?: ObjectId | string,
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.USER_NOT_FOUND",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.USER_NOT_FOUND,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorMerchantNotFound(language?: LANGUAGE): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.MERCHANT_NOT_FOUND",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.MERCHANT_NOT_FOUND,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorEmailExists(
    type?: EMAIL_EXISTS,
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      // `ERROR.${type}`,
      "ERROR.EMAIL_EXISTS",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.EMAIL_EXISTS,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorFileNotFound(language?: LANGUAGE): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.FILE_NOT_FOUND",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.FILE_NOT_FOUND,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorHereIdNotFound(language?: LANGUAGE): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.HERE_ID_NOT_FOUND",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.HERE_ID_NOT_FOUND,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorRoleNotExists(language?: LANGUAGE): Promise<void> {
    const message = await this.getTranslatedText(
      `ERROR.ROLE_NOT_EXISTS`,
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.ROLE_NOT_EXISTS,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorRequestPageLoadShouldNotBeEmpty(
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.INTERNAL_SERVER_ERROR.REQUEST_PAGE_LOAD_SHOULD_NOT_BE_EMPTY",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.REQUEST_PAGE_LOAD_SHOULD_NOT_BE_EMPTY,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorLanguageNotFound(language?: LANGUAGE): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.LANGUAGE_NOT_FOUND",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.LANGUAGE_NOT_FOUND,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorUserMangoNotFound(language?: LANGUAGE) {
    const message = await this.getTranslatedText(
      "ERROR.USER_MANGO_NOT_FOUND",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.USER_MANGO_NOT_FOUND,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorInvalidBankAccountId(
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.INVALID_BANK_ACCOUNT_ID",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.INVALID_BANK_ACCOUNT_ID,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorCreateWebCardPayIns(
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.CREATE_WEB_CARD_PAY_INS_FAILED",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.CREATE_WEB_CARD_PAY_INS_FAILED,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorCannotAddHomeServiceWithThisCategorySinceYourStoreNotContainThisCategory(
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.CANNOT_ADD_HOME_SERVICE_WITH_THIS_CATEGORY_SINCE_YOUR_STORE_DOES_NOT_CONTAIN_THIS_CATEGORY",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode:
          ERROR_CODE.CANNOT_ADD_HOME_SERVICE_WITH_THIS_CATEGORY_SINCE_YOUR_STORE_DOES_NOT_CONTAIN_THIS_CATEGORY,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorHomeServiceNotFound(language?: LANGUAGE) {
    const message = await this.getTranslatedText(
      "ERROR.HOME_SERVICE_NOT_FOUND",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.HOME_SERVICE_NOT_FOUND,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorValidationError(message: string): Promise<void> {
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.VALIDATION_FAILED,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorAuthenticationWithAppleFailed(
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.AUTHENTICATION_WITH_APPLE_FAILED",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.AUTHENTICATION_WITH_APPLE_FAILED,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorCardExisted(language?: LANGUAGE): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.CARD_EXISTED",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.CARD_EXISTED,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorTwilio(
    type?: TWILIO_SMS_ERROR_TYPE,
    errorMessage?: string
  ) {
    const errorPrefix = `ERROR.TWILIO_SMS.SMS_`;
    const message = await this.getTranslatedText(
      `${errorPrefix}${type || "WRONG_CODE"}`
    );
    throw new HttpException(
      {
        message: errorMessage ? `${message}: ${errorMessage}` : message,
        statusCode: ERROR_CODE.TWILIO_ERROR,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorPhoneNumberNotFound() {
    // TODO:
  }

  public async throwErrorCancelMollieSubscriptionFailed(
    language?: LANGUAGE
  ): Promise<void> {
    const message = await this.getTranslatedText(
      "ERROR.CANCEL_MOLLIE_SUBSCRIPTION_FAILED",
      language
    );
    throw new HttpException(
      {
        message,
        statusCode: ERROR_CODE.CANCEL_MOLLIE_SUBSCRIPTION_FAILED,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
