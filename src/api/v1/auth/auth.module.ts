import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {UserModule} from "../user/user.module";
import {ConfigService} from "../../../core/config/config.service";
import {ConfigModule} from "../../../core/config/config.module";
import {MongooseModule} from "@nestjs/mongoose";
import {ModelName} from "../../../common/constant/database.constant";
import {CredentialSchema} from "./entities/credential.entity";

@Module({
  imports: [
    UserModule,
    PassportModule,
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
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {
}
