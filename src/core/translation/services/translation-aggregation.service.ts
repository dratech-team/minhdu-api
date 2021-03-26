import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ITranslation } from "@/translation/interfaces/translation.interface";
import { ModelName } from "@/constants/database.constant";
import { DEFAULT_CONSTANTS } from "@/constants/default.constant";

@Injectable()
export class TranslationAggregationService {
  constructor(
    @InjectModel(ModelName.TRANSLATION)
    public readonly translationModel: Model<ITranslation>
  ) {}

  getTranslationsPageLoadQuery(
    skip: number = 0,
    limit: number = DEFAULT_CONSTANTS.DEFAULT_LIMIT_GET_TRANSLATIONS_IN_ADMIN,
    searchKey?: string,
    isCount: boolean = false
  ): any {
    const searchRegex = new RegExp(`.*${searchKey}.*`, "i");
    return [
      {
        $match: {
          $expr: {
            $and: [
              {
                $eq: ["$deleted", false],
              },
              ...(searchKey
                ? [
                    {
                      $or: [
                        {
                          $regexMatch: {
                            input: "$key",
                            regex: searchRegex,
                          },
                        },
                        {
                          $regexMatch: {
                            input: "$text",
                            regex: searchRegex,
                          },
                        },
                      ],
                    },
                  ]
                : []),
            ],
          },
        },
      },
      {
        $group: {
          _id: "$key",
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },

      ...(isCount
        ? [
            {
              $count: "count",
            },
          ]
        : [
            {
              $sort: {
                key: 1,
              },
            },
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },

            {
              $lookup: {
                from: ModelName.TRANSLATION,
                localField: "_id",
                foreignField: "key",
                as: "translation",
              },
            },
            {
              $unwind: {
                path: "$translation",
                preserveNullAndEmptyArrays: false,
              },
            },
            {
              $replaceRoot: {
                newRoot: "$translation",
              },
            },
          ]),
    ];
  }
}
