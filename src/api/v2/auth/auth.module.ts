import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {PrismaService} from "../../../prisma.service";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule} from "../../../core/config/config.module";
import {ConfigService} from "../../../core/config/config.service";

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
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService]
})
export class AuthModule {
}
