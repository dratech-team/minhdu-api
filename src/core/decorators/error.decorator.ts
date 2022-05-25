// export function ErrorDecorator(...args: any[]): MethodDecorator & ClassDecorator {
//   return MethodParameterDecoratorFactory.createDecorator<MyParameterMetadata>(
//     'metadata-key-for-my-method-parameter-decorator',
//     spec,
//   )
// }

import { ApiResponseMetadata, ApiResponseOptions } from "@nestjs/swagger";
import { omit, isArray } from "lodash";

// Clone
export const DECORATORS_PREFIX = "swagger";
export const DECORATORS = {
  API_OPERATION: `${DECORATORS_PREFIX}/apiOperation`,
  API_RESPONSE: `${DECORATORS_PREFIX}/apiResponse`,
  API_PRODUCES: `${DECORATORS_PREFIX}/apiProduces`,
  API_CONSUMES: `${DECORATORS_PREFIX}/apiConsumes`,
  API_TAGS: `${DECORATORS_PREFIX}/apiUseTags`,
  API_PARAMETERS: `${DECORATORS_PREFIX}/apiParameters`,
  API_HEADERS: `${DECORATORS_PREFIX}/apiHeaders`,
  API_MODEL_PROPERTIES: `${DECORATORS_PREFIX}/apiModelProperties`,
  API_MODEL_PROPERTIES_ARRAY: `${DECORATORS_PREFIX}/apiModelPropertiesArray`,
  API_SECURITY: `${DECORATORS_PREFIX}/apiSecurity`,
  API_EXCLUDE_ENDPOINT: `${DECORATORS_PREFIX}/apiExcludeEndpoint`,
  API_EXTRA_MODELS: `${DECORATORS_PREFIX}/apiExtraModels`,
  API_EXTENSION: `${DECORATORS_PREFIX}/apiExtension`,
};

// Clone
export function getTypeIsArrayTuple(
  input: Function | [Function] | undefined | string | Record<string, any>,
  isArrayFlag: boolean
): [Function | undefined, boolean] {
  if (!input) {
    return [input as undefined, isArrayFlag];
  }
  if (isArrayFlag) {
    return [input as Function, isArrayFlag];
  }
  const isInputArray = isArray(input);
  const type = isInputArray ? input[0] : input;
  return [type, isInputArray];
}

export function ErrorDecorator(
  optionsList: ApiResponseOptions[] = []
): MethodDecorator & ClassDecorator {
  const groupedMetaDataList = optionsList.map((options) => {
    const [type, isArray] = getTypeIsArrayTuple(
      (options as ApiResponseMetadata).type,
      (options as ApiResponseMetadata).isArray
    );

    (options as ApiResponseMetadata).type = type;
    (options as ApiResponseMetadata).isArray = isArray;
    options.description = options.description ? options.description : "";

    const groupedMetadata = {
      [`${options.status}-${options?.description}`]: omit(options, "status"),
    };

    return groupedMetadata;
  });
  return (
    target: object,
    key?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>
  ): any => {
    if (descriptor) {
      groupedMetaDataList.map((groupedMetadata) => {
        const responses =
          Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value) || {};
        Reflect.defineMetadata(
          DECORATORS.API_RESPONSE,
          {
            ...responses,
            ...groupedMetadata,
          },
          descriptor.value
        );
      });
      return descriptor;
    }
    const responses =
      Reflect.getMetadata(DECORATORS.API_RESPONSE, target) || {};
    groupedMetaDataList.map((groupedMetadata) => {
      Reflect.defineMetadata(
        DECORATORS.API_RESPONSE,
        {
          ...responses,
          ...groupedMetadata,
        },
        target
      );
    });
    return target;
  };
}
