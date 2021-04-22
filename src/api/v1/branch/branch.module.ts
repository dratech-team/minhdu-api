import {Module} from '@nestjs/common';
import {BranchService} from './branch.service';
import {BranchController} from './branch.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {ModelName} from "../../../common/constant/database.constant";
import {BranchSchema} from "./entities/branch.entity";
import {ConfigModule} from "../../../core/config/config.module";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{name: ModelName.BRANCH, schema: BranchSchema}])
  ],
  controllers: [BranchController],
  providers: [BranchService]
})
export class BranchModule {
}
