import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {PrismaService} from "../../../prisma.service";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule} from "../../../core/config/config.module";
import {ConfigService} from "../../../core/config/config.service";
import {JwtStrategy} from "../../v1/auth/jwt.strategy";
import {PassportModule} from "@nestjs/passport";

@Module({
  imports: [
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
    PassportModule,
    ConfigModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService],
  exports: [AuthService]
})
export class AuthModule {
}
