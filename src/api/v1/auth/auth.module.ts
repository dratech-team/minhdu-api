import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {EmployeeModule} from "../employee/employee.module";
import {ConfigService} from "../../../core/config/config.service";
import {ConfigModule} from "../../../core/config/config.module";
import {MongooseModule} from "@nestjs/mongoose";
import {ModelName} from "../../../common/constant/database.constant";
import {CredentialSchema} from "./entities/credential.entity";
import {JwtStrategy} from "./jwt.strategy";

@Module({
  imports: [
    EmployeeModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        privateKey: configService.privateKey,
        publicKey: configService.publicKey,
        signOptions: configService.signOptions,
        verifyOptions: configService.verifyOptions,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{name: ModelName.ACCOUNT, schema: CredentialSchema}])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {
}
